package com.akuminabridge

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.speech.RecognizerIntent
import android.text.SpannableString
import android.text.style.AbsoluteSizeSpan
import android.view.KeyEvent
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import androidx.appcompat.widget.SwitchCompat
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.tabs.TabLayout
import org.json.JSONArray
import org.json.JSONObject
import java.security.SecureRandom
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener

class MainActivity : AppCompatActivity() {

    private val hardcodedHost = "192.168.0.11"
    private val hardcodedPort = "8787"
    private val availableAgents = listOf("ren", "scott", "andrew", "jason", "udai", "theri", "luke")
    private var selectedAgent = "ren"

    private lateinit var hostInput: EditText
    private lateinit var portInput: EditText
    private lateinit var tokenInput: EditText
    private lateinit var secureModeSwitch: SwitchCompat
    private lateinit var agentTabLayout: TabLayout
    private lateinit var commandInput: EditText
    private lateinit var chatRecyclerView: RecyclerView
    private lateinit var connectButton: Button
    private lateinit var sendButton: Button
    private lateinit var stopButtonBottom: Button
    private lateinit var regenerateButtonBottom: Button
    private lateinit var micButton: Button
    private lateinit var settingsToggleButton: Button
    private lateinit var settingsPanel: LinearLayout

    private val random = SecureRandom()
    private var webSocket: WebSocket? = null
    private var connected = false
    private val client = OkHttpClient()
    private lateinit var prefs: SharedPreferences
    private val lastRequestIdByAgent = mutableMapOf<String, String>()
    private val lastPromptByAgent = mutableMapOf<String, String>()
    private val requestAgentById = mutableMapOf<String, String>()
    private val chatMessages = mutableListOf<ChatMessage>()
    private val assistantMessageIndexByRequest = mutableMapOf<String, Int>()
    private val chatHistoryByAgent = mutableMapOf<String, MutableList<ChatMessage>>()
    private lateinit var chatAdapter: ChatMessageAdapter

    companion object {
        private const val VOICE_REQUEST_CODE = 1001
        private const val MAX_CHAT_HISTORY = 120
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("akumina_bridge", MODE_PRIVATE)

        hostInput = findViewById(R.id.hostInput)
        portInput = findViewById(R.id.portInput)
        tokenInput = findViewById(R.id.tokenInput)
        secureModeSwitch = findViewById(R.id.secureModeSwitch)
        agentTabLayout = findViewById(R.id.agentTabLayout)
        commandInput = findViewById(R.id.commandInput)
        chatRecyclerView = findViewById(R.id.chatRecyclerView)
        connectButton = findViewById(R.id.connectButton)
        sendButton = findViewById(R.id.sendButton)
        stopButtonBottom = findViewById(R.id.stopButtonBottom)
        regenerateButtonBottom = findViewById(R.id.regenerateButtonBottom)
        micButton = findViewById(R.id.micButton)
        settingsToggleButton = findViewById(R.id.settingsToggleButton)
        settingsPanel = findViewById(R.id.settingsPanel)

        chatAdapter = ChatMessageAdapter(chatMessages)
        chatRecyclerView.layoutManager = LinearLayoutManager(this)
        chatRecyclerView.adapter = chatAdapter
        loadChatHistoryByAgent()

        hostInput.setText(hardcodedHost)
        portInput.setText(hardcodedPort)
        tokenInput.setText(prefs.getString("token", ""))
        secureModeSwitch.isChecked = prefs.getBoolean("secure_mode_enabled", false)
        tokenInput.isEnabled = secureModeSwitch.isChecked

        val savedAgent = prefs.getString("selected_agent", "ren") ?: "ren"
        selectedAgent = if (availableAgents.contains(savedAgent)) savedAgent else "ren"
        setupAgentTabs(selectedAgent)
        refreshVisibleChatForSelectedAgent()

        val settingsVisible = prefs.getBoolean("settings_visible", false)
        applySettingsPanelState(settingsVisible)

        connectButton.setOnClickListener {
            if (connected) {
                disconnect()
            } else {
                connect()
            }
        }

        sendButton.setOnClickListener {
            sendCommandFromInput()
        }

        stopButtonBottom.setOnClickListener { sendCancelForActiveAgent() }
        regenerateButtonBottom.setOnClickListener { regenerateLastPromptForActiveAgent() }

        micButton.setOnClickListener {
            startVoiceInput()
        }

        secureModeSwitch.setOnCheckedChangeListener { _, isChecked ->
            tokenInput.isEnabled = isChecked
            prefs.edit().putBoolean("secure_mode_enabled", isChecked).apply()
        }

        settingsToggleButton.setOnClickListener {
            val newVisible = settingsPanel.visibility != android.view.View.VISIBLE
            applySettingsPanelState(newVisible)
            prefs.edit().putBoolean("settings_visible", newVisible).apply()
        }

        commandInput.setOnKeyListener { _, keyCode, event ->
            if (event.action == KeyEvent.ACTION_DOWN && keyCode == KeyEvent.KEYCODE_ENTER) {
                sendCommandFromInput()
                true
            } else {
                false
            }
        }

        if (chatMessages.isEmpty()) {
            addChatMessage(role = "system", text = "Tap Connect, choose an agent, then send a message.")
        }
    }

    private fun setupAgentTabs(initialAgent: String) {
        val compactTabs = resources.configuration.screenWidthDp in 1..359
        agentTabLayout.removeAllTabs()
        availableAgents.forEach { key ->
            val label = key.uppercase()
            val text = if (compactTabs) {
                SpannableString(label).apply {
                    setSpan(AbsoluteSizeSpan(11, true), 0, label.length, 0)
                }
            } else {
                label
            }

            val tab = agentTabLayout.newTab().setText(text)
            agentTabLayout.addTab(tab)
        }

        val initialIndex = availableAgents.indexOf(initialAgent).coerceAtLeast(0)
        agentTabLayout.getTabAt(initialIndex)?.select()

        agentTabLayout.addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
            override fun onTabSelected(tab: TabLayout.Tab) {
                val key = availableAgents.getOrNull(tab.position) ?: return
                selectedAgent = key
                prefs.edit().putString("selected_agent", selectedAgent).apply()
                refreshVisibleChatForSelectedAgent()
            }

            override fun onTabUnselected(tab: TabLayout.Tab) {
                // no-op
            }

            override fun onTabReselected(tab: TabLayout.Tab) {
                scrollChatToBottom()
            }
        })
    }

    private fun refreshVisibleChatForSelectedAgent() {
        val source = chatHistoryByAgent.getOrPut(selectedAgent) { mutableListOf() }
        chatMessages.clear()
        chatMessages.addAll(source)
        chatAdapter.notifyDataSetChanged()
        rebuildAssistantIndexForVisibleAgent()
        scrollChatToBottom()
    }

    private fun applySettingsPanelState(visible: Boolean) {
        settingsPanel.visibility = if (visible) android.view.View.VISIBLE else android.view.View.GONE
        settingsToggleButton.text = if (visible) "Hide Settings" else "Settings"
    }

    override fun onDestroy() {
        super.onDestroy()
        disconnect()
        client.dispatcher.executorService.shutdown()
    }

    private fun connect() {
        val host = hardcodedHost
        val port = hardcodedPort
        val secureModeEnabled = secureModeSwitch.isChecked
        val token = tokenInput.text.toString().trim()

        if (secureModeEnabled && token.isBlank()) {
            addChatMessage(role = "system", text = "Token is required in secure mode")
            return
        }

        prefs.edit()
            .putString("host", host)
            .putString("port", port)
            .putString("token", token)
            .putBoolean("secure_mode_enabled", secureModeEnabled)
            .apply()

        val requestBuilder = Request.Builder().url("ws://$host:$port/ws")
        if (secureModeEnabled) {
            requestBuilder.addHeader("x-bridge-token", token)
        }

        val request = requestBuilder.build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                runOnUiThread {
                    connected = true
                    connectButton.text = "Disconnect"
                    addChatMessage(role = "system", text = "Connected")
                }
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                runOnUiThread {
                    handleServerMessage(text)
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                runOnUiThread {
                    addChatMessage(role = "system", text = "WebSocket error: ${t.message}")
                    connected = false
                    connectButton.text = "Connect"
                }
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                runOnUiThread {
                    addChatMessage(role = "system", text = "Disconnected ($code): $reason")
                    connected = false
                    connectButton.text = "Connect"
                }
            }
        })
    }

    private fun disconnect() {
        webSocket?.close(1000, "client_disconnect")
        webSocket = null
        connected = false
        connectButton.text = "Connect"
    }

    private fun sendCommandFromInput() {
        val inputText = commandInput.text.toString().trim()
        if (inputText.isEmpty()) {
            return
        }

        commandInput.setText("")
        addChatMessage(role = "user", text = inputText)

        if (inputText.equals("clear", ignoreCase = true)) {
            clearChatHistory()
            return
        }

        if (inputText.equals("cancel", ignoreCase = true)) {
            sendCancelForLastRequest()
            return
        }

        if (!connected || webSocket == null) {
            addChatMessage(role = "system", text = "Not connected")
            return
        }

        val payload = buildPromptDispatchPayload(inputText, selectedAgent)
        val requestId = payload.optString("requestId")
        requestAgentById[requestId] = selectedAgent
        lastRequestIdByAgent[selectedAgent] = requestId
        lastPromptByAgent[selectedAgent] = inputText
        webSocket?.send(payload.toString())
    }

    private fun buildPromptDispatchPayload(inputText: String, defaultTarget: String): JSONObject {
        val (target, promptText) = parseAgentTargetAndText(inputText, defaultTarget)
        val payload = JSONObject()
            .put("type", "execute")
            .put("requestId", generateRequestId())
            .put("action", "prompt.dispatch")
            .put("target", target)
            .put("timestamp", System.currentTimeMillis())
            .put("nonce", generateNonce())
            .put("promptText", promptText)

        return payload
    }

    private fun parseAgentTargetAndText(inputText: String, defaultTarget: String): Pair<String, String> {
        if (!inputText.startsWith("@")) {
            return Pair(defaultTarget, inputText)
        }

        val parts = inputText.split(" ", limit = 2)
        val rawTarget = parts[0].removePrefix("@").lowercase()
        val promptText = if (parts.size > 1) parts[1].trim() else ""
        if (rawTarget.isBlank() || promptText.isBlank()) {
            return Pair(defaultTarget, inputText)
        }

        return Pair(rawTarget, promptText)
    }

    private fun startVoiceInput() {
        val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
            putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
            putExtra(RecognizerIntent.EXTRA_PROMPT, "Speak your message")
        }

        try {
            startActivityForResult(intent, VOICE_REQUEST_CODE)
        } catch (_: ActivityNotFoundException) {
            addChatMessage(role = "system", text = "Voice input is not available on this device")
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == VOICE_REQUEST_CODE && resultCode == Activity.RESULT_OK) {
            val results = data?.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS)
            val spokenText = results?.firstOrNull()?.trim().orEmpty()
            if (spokenText.isNotEmpty()) {
                commandInput.setText(spokenText)
                commandInput.setSelection(spokenText.length)
            }
        }
    }

    private fun sendCancelForLastRequest() {
        if (!connected || webSocket == null) {
            addChatMessage(role = "system", text = "Not connected")
            return
        }

        val requestId = lastRequestIdByAgent[selectedAgent]
        if (requestId.isNullOrBlank()) {
            addChatMessage(role = "system", text = "No request to cancel")
            return
        }

        val payload = JSONObject()
            .put("type", "cancel")
            .put("requestId", requestId)

        webSocket?.send(payload.toString())
        addChatMessage(role = "system", text = "Cancel sent for $requestId")
    }

    private fun sendCancelForActiveAgent() {
        sendCancelForLastRequest()
    }

    private fun regenerateLastPromptForActiveAgent() {
        val lastPrompt = lastPromptByAgent[selectedAgent]
        if (lastPrompt.isNullOrBlank()) {
            addChatMessage(role = "system", text = "No previous prompt for ${selectedAgent.uppercase()}")
            return
        }

        commandInput.setText(lastPrompt)
        commandInput.setSelection(lastPrompt.length)
        sendCommandFromInput()
    }

    private fun handleServerMessage(text: String) {
        try {
            val json = JSONObject(text)
            val type = json.optString("type")
            val requestId = json.optString("requestId")
            val eventAgent = requestAgentById[requestId] ?: selectedAgent

            when (type) {
                "ready" -> addChatMessage(role = "system", text = "Bridge ready")
                "started" -> addChatMessage(role = "system", text = "Started ${json.optString("action")}")
                "stream" -> {
                    val req = json.optString("requestId")
                    val stream = json.optString("stream")
                    val chunk = json.optString("chunk")
                    addChatMessage(role = "system", text = "[$req] $stream: $chunk")
                }
                "complete" -> addChatMessage(role = "system", text = "Complete ${json.optString("requestId")} exitCode=${json.optInt("exitCode")}")
                "assistant_reply_waiting" -> {
                    addOrUpdateAssistantMessage(requestId, "...", eventAgent)
                }
                "assistant_reply_chunk" -> {
                    val chunk = json.optString("chunk")
                    appendAssistantChunk(requestId, chunk, eventAgent)
                }
                "assistant_reply" -> {
                    val fullText = json.optString("text")
                    addOrUpdateAssistantMessage(requestId, fullText, eventAgent)
                }
                "assistant_reply_done" -> {
                    // finalization event for streaming path
                }
                "assistant_reply_timeout" -> addChatMessage(role = "system", text = "Assistant reply timeout")
                "error" -> addChatMessage(role = "system", text = "Error ${json.optString("code")}: ${json.optString("message")}")
                "cancelled" -> addChatMessage(role = "system", text = "Cancelled ${json.optString("requestId")}")
                else -> addChatMessage(role = "system", text = text)
            }
        } catch (_: Exception) {
            addChatMessage(role = "system", text = text)
        }
    }

    private fun addOrUpdateAssistantMessage(requestId: String, text: String, agent: String) {
        if (agent != selectedAgent) {
            val targetList = chatHistoryByAgent.getOrPut(agent) { mutableListOf() }
            val existing = targetList.indexOfLast { it.role == "assistant" && it.requestId == requestId }
            if (existing >= 0) {
                targetList[existing].text = text
            } else {
                targetList.add(ChatMessage(role = "assistant", text = text, requestId = requestId))
            }
            trimAgentHistory(targetList)
            persistChatHistoryByAgent()
            return
        }

        val existingIndex = assistantMessageIndexByRequest[requestId]
        if (existingIndex != null && existingIndex in chatMessages.indices) {
            chatMessages[existingIndex].text = text
            chatAdapter.notifyItemChanged(existingIndex)
            scrollChatToBottom()
            syncVisibleMessagesToSelectedAgentStore()
            persistChatHistoryByAgent()
            return
        }

        val index = addChatMessage(role = "assistant", text = text, requestId = requestId)
        assistantMessageIndexByRequest[requestId] = index
    }

    private fun appendAssistantChunk(requestId: String, chunk: String, agent: String) {
        if (agent != selectedAgent) {
            val targetList = chatHistoryByAgent.getOrPut(agent) { mutableListOf() }
            val existing = targetList.indexOfLast { it.role == "assistant" && it.requestId == requestId }
            if (existing >= 0) {
                val base = if (targetList[existing].text == "...") "" else targetList[existing].text
                targetList[existing].text = base + chunk
            } else {
                targetList.add(ChatMessage(role = "assistant", text = chunk, requestId = requestId))
            }
            trimAgentHistory(targetList)
            persistChatHistoryByAgent()
            return
        }

        val existingIndex = assistantMessageIndexByRequest[requestId]
        if (existingIndex != null && existingIndex in chatMessages.indices) {
            val existing = chatMessages[existingIndex]
            val base = if (existing.text == "...") "" else existing.text
            existing.text = base + chunk
            chatAdapter.notifyItemChanged(existingIndex)
            scrollChatToBottom()
            syncVisibleMessagesToSelectedAgentStore()
            persistChatHistoryByAgent()
            return
        }

        val index = addChatMessage(role = "assistant", text = chunk, requestId = requestId)
        assistantMessageIndexByRequest[requestId] = index
    }

    private fun addChatMessage(role: String, text: String, requestId: String? = null): Int {
        if (text.isBlank()) {
            return chatMessages.lastIndex
        }

        val message = ChatMessage(role = role, text = text, requestId = requestId)
        chatMessages.add(message)
        trimAgentHistory(chatMessages)
        chatAdapter.notifyDataSetChanged()
        rebuildAssistantIndexForVisibleAgent()

        scrollChatToBottom()
        syncVisibleMessagesToSelectedAgentStore()
        persistChatHistoryByAgent()
        return chatMessages.lastIndex
    }

    private fun clearChatHistory() {
        chatMessages.clear()
        assistantMessageIndexByRequest.clear()
        chatHistoryByAgent[selectedAgent] = mutableListOf()
        chatAdapter.notifyDataSetChanged()
        persistChatHistoryByAgent()
        addChatMessage(role = "system", text = "Chat cleared")
    }

    private fun scrollChatToBottom() {
        if (chatMessages.isNotEmpty()) {
            chatRecyclerView.scrollToPosition(chatMessages.lastIndex)
        }
    }

    private fun persistChatHistoryByAgent() {
        val root = JSONObject()
        for (agent in availableAgents) {
            val arr = JSONArray()
            val list = chatHistoryByAgent[agent] ?: mutableListOf()
            for (msg in list) {
                arr.put(
                    JSONObject()
                        .put("role", msg.role)
                        .put("text", msg.text)
                        .put("requestId", msg.requestId)
                        .put("timestamp", msg.timestamp)
                )
            }
            root.put(agent, arr)
        }

        prefs.edit().putString("chat_history_by_agent_json", root.toString()).apply()
    }

    private fun loadChatHistoryByAgent() {
        chatMessages.clear()
        assistantMessageIndexByRequest.clear()

        availableAgents.forEach { key -> chatHistoryByAgent[key] = mutableListOf() }

        val raw = prefs.getString("chat_history_by_agent_json", null) ?: return
        try {
            val root = JSONObject(raw)
            for (agent in availableAgents) {
                val arr = root.optJSONArray(agent) ?: continue
                val list = chatHistoryByAgent.getOrPut(agent) { mutableListOf() }
                for (i in 0 until arr.length()) {
                    val obj = arr.optJSONObject(i) ?: continue
                    val msg = ChatMessage(
                        role = obj.optString("role", "system"),
                        text = obj.optString("text", ""),
                        requestId = obj.optString("requestId", "").ifBlank { null },
                        timestamp = obj.optLong("timestamp", System.currentTimeMillis())
                    )

                    if (msg.text.isNotBlank()) {
                        list.add(msg)
                    }
                }

                trimAgentHistory(list)
            }
        } catch (_: Exception) {
            availableAgents.forEach { key -> chatHistoryByAgent[key] = mutableListOf() }
        }
    }

    private fun rebuildAssistantIndexForVisibleAgent() {
        assistantMessageIndexByRequest.clear()
        for (index in chatMessages.indices) {
            val msg = chatMessages[index]
            if (msg.role == "assistant" && !msg.requestId.isNullOrBlank()) {
                assistantMessageIndexByRequest[msg.requestId!!] = index
            }
        }
    }

    private fun syncVisibleMessagesToSelectedAgentStore() {
        val list = chatHistoryByAgent.getOrPut(selectedAgent) { mutableListOf() }
        list.clear()
        list.addAll(chatMessages)
    }

    private fun trimAgentHistory(list: MutableList<ChatMessage>) {
        if (list.size <= MAX_CHAT_HISTORY) {
            return
        }

        val removeCount = list.size - MAX_CHAT_HISTORY
        repeat(removeCount) {
            list.removeAt(0)
        }
    }

    private fun generateRequestId(): String {
        return "req-${System.currentTimeMillis()}-${randomHex(6)}"
    }

    private fun generateNonce(): String {
        return "nonce-${randomHex(16)}"
    }

    private fun randomHex(length: Int): String {
        val bytes = ByteArray((length + 1) / 2)
        random.nextBytes(bytes)
        return bytes.joinToString("") { "%02x".format(it) }.take(length)
    }
}
