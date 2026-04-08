package com.akuminabridge

import android.content.SharedPreferences
import android.os.Bundle
import android.view.KeyEvent
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import org.json.JSONObject
import java.security.SecureRandom
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener

class MainActivity : AppCompatActivity() {

    private lateinit var hostInput: EditText
    private lateinit var portInput: EditText
    private lateinit var tokenInput: EditText
    private lateinit var commandInput: EditText
    private lateinit var outputText: TextView
    private lateinit var connectButton: Button
    private lateinit var sendButton: Button
    private lateinit var settingsToggleButton: Button
    private lateinit var settingsPanel: LinearLayout

    private val random = SecureRandom()
    private var webSocket: WebSocket? = null
    private var connected = false
    private val client = OkHttpClient()
    private lateinit var prefs: SharedPreferences
    private var lastRequestId: String? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        prefs = getSharedPreferences("akumina_bridge", MODE_PRIVATE)

        hostInput = findViewById(R.id.hostInput)
        portInput = findViewById(R.id.portInput)
        tokenInput = findViewById(R.id.tokenInput)
        commandInput = findViewById(R.id.commandInput)
        outputText = findViewById(R.id.outputText)
        connectButton = findViewById(R.id.connectButton)
        sendButton = findViewById(R.id.sendButton)
        settingsToggleButton = findViewById(R.id.settingsToggleButton)
        settingsPanel = findViewById(R.id.settingsPanel)

        hostInput.setText(prefs.getString("host", ""))
        portInput.setText(prefs.getString("port", "8787"))
        tokenInput.setText(prefs.getString("token", ""))

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

        appendOutput("Type Connect, then enter plain text and Send.")
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
        val host = hostInput.text.toString().trim()
        val port = portInput.text.toString().trim().ifEmpty { "8787" }
        val token = tokenInput.text.toString().trim()

        if (host.isEmpty() || token.isEmpty()) {
            appendOutput("Host and token are required")
            return
        }

        prefs.edit()
            .putString("host", host)
            .putString("port", port)
            .putString("token", token)
            .apply()

        val request = Request.Builder()
            .url("ws://$host:$port/ws")
            .addHeader("x-bridge-token", token)
            .build()

        webSocket = client.newWebSocket(request, object : WebSocketListener() {
            override fun onOpen(webSocket: WebSocket, response: Response) {
                runOnUiThread {
                    connected = true
                    connectButton.text = "Disconnect"
                    appendOutput("Connected")
                }
            }

            override fun onMessage(webSocket: WebSocket, text: String) {
                runOnUiThread {
                    handleServerMessage(text)
                }
            }

            override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                runOnUiThread {
                    appendOutput("WebSocket error: ${t.message}")
                    connected = false
                    connectButton.text = "Connect"
                }
            }

            override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                runOnUiThread {
                    appendOutput("Disconnected ($code): $reason")
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
        appendOutput("> $inputText")

        if (inputText.equals("clear", ignoreCase = true)) {
            outputText.text = ""
            return
        }

        if (inputText.equals("cancel", ignoreCase = true)) {
            sendCancelForLastRequest()
            return
        }

        if (!connected || webSocket == null) {
            appendOutput("Not connected")
            return
        }

        val payload = buildPromptDispatchPayload(inputText)
        lastRequestId = payload.optString("requestId")
        webSocket?.send(payload.toString())
    }

    private fun buildPromptDispatchPayload(inputText: String): JSONObject {
        val (target, promptText) = parseAgentTargetAndText(inputText)
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

    private fun parseAgentTargetAndText(inputText: String): Pair<String, String> {
        if (!inputText.startsWith("@")) {
            return Pair("ren", inputText)
        }

        val parts = inputText.split(" ", limit = 2)
        val rawTarget = parts[0].removePrefix("@").lowercase()
        val promptText = if (parts.size > 1) parts[1].trim() else ""
        if (rawTarget.isBlank() || promptText.isBlank()) {
            return Pair("ren", inputText)
        }

        return Pair(rawTarget, promptText)
    }

    private fun sendCancelForLastRequest() {
        if (!connected || webSocket == null) {
            appendOutput("Not connected")
            return
        }

        if (lastRequestId.isNullOrBlank()) {
            appendOutput("No request to cancel")
            return
        }

        val payload = JSONObject()
            .put("type", "cancel")
            .put("requestId", lastRequestId)

        webSocket?.send(payload.toString())
        appendOutput("< cancel sent for $lastRequestId")
    }

    private fun handleServerMessage(text: String) {
        try {
            val json = JSONObject(text)
            val type = json.optString("type")

            when (type) {
                "ready" -> appendOutput("< ready")
                "started" -> appendOutput("< started ${json.optString("requestId")} ${json.optString("action")}")
                "stream" -> {
                    val req = json.optString("requestId")
                    val stream = json.optString("stream")
                    val chunk = json.optString("chunk")
                    appendOutput("< [$req] $stream: $chunk")
                }
                "complete" -> appendOutput("< complete ${json.optString("requestId")} exitCode=${json.optInt("exitCode")}")
                "error" -> appendOutput("< error ${json.optString("code")}: ${json.optString("message")}")
                "cancelled" -> appendOutput("< cancelled ${json.optString("requestId")}")
                else -> appendOutput("< $text")
            }
        } catch (_: Exception) {
            appendOutput("< $text")
        }
    }

    private fun appendOutput(line: String) {
        val current = outputText.text.toString()
        val next = if (current.isEmpty()) line else "$current\n$line"
        outputText.text = next
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
