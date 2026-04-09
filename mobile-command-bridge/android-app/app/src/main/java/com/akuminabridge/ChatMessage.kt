package com.akuminabridge

data class ChatMessage(
    val role: String,
    var text: String,
    val requestId: String? = null,
    val timestamp: Long = System.currentTimeMillis()
)
