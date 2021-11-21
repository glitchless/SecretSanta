package ru.glitchless.santa.model.api.chat

import com.google.gson.annotations.SerializedName

data class ChatApi(
    @SerializedName("message_count_total")
    var countTotal: Long = 0,
    @SerializedName("message_count")
    var count: Long = 0,
    @SerializedName("messages")
    var messages: List<MessageApi> = emptyList()
)
