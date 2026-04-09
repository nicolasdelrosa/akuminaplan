package com.akuminabridge

import android.graphics.Color
import android.graphics.drawable.GradientDrawable
import android.view.Gravity
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.util.TypedValue
import android.widget.FrameLayout
import android.widget.LinearLayout
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView

class ChatMessageAdapter(
    private val messages: MutableList<ChatMessage>
) : RecyclerView.Adapter<ChatMessageAdapter.ChatMessageViewHolder>() {

    private var compactMode = false

    override fun onAttachedToRecyclerView(recyclerView: RecyclerView) {
        super.onAttachedToRecyclerView(recyclerView)
        compactMode = recyclerView.resources.configuration.screenWidthDp in 1..359
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): ChatMessageViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_chat_message, parent, false)
        return ChatMessageViewHolder(view)
    }

    override fun onBindViewHolder(holder: ChatMessageViewHolder, position: Int) {
        holder.bind(messages[position], compactMode)
    }

    override fun getItemCount(): Int = messages.size

    class ChatMessageViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        private val container: LinearLayout = itemView.findViewById(R.id.messageContainer)
        private val bubbleText: TextView = itemView.findViewById(R.id.bubbleText)

        fun bind(message: ChatMessage, compactMode: Boolean) {
            bubbleText.text = message.text

            if (compactMode) {
                container.setPadding(10, 6, 10, 6)
                bubbleText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 14f)
            } else {
                container.setPadding(12, 8, 12, 8)
                bubbleText.setTextSize(TypedValue.COMPLEX_UNIT_SP, 15f)
            }

            val params = container.layoutParams as FrameLayout.LayoutParams
            val bubble = GradientDrawable().apply {
                cornerRadius = 26f
            }

            when (message.role) {
                "user" -> {
                    params.gravity = Gravity.END
                    bubble.setColor(Color.parseColor("#2a4d75"))
                    bubbleText.setTextColor(Color.parseColor("#f0f7ff"))
                }
                "assistant" -> {
                    params.gravity = Gravity.START
                    bubble.setColor(Color.parseColor("#202a33"))
                    bubbleText.setTextColor(Color.parseColor("#e7edf5"))
                }
                else -> {
                    params.gravity = Gravity.CENTER_HORIZONTAL
                    bubble.setColor(Color.parseColor("#25303a"))
                    bubbleText.setTextColor(Color.parseColor("#b8c5d3"))
                }
            }

            container.layoutParams = params
            container.background = bubble
        }
    }
}
