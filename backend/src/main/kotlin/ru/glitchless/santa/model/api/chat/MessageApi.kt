package ru.glitchless.santa.model.api.chat

import com.google.gson.annotations.SerializedName

data class MessageApi(
    @SerializedName("text")
    var text: String? = null,
    @SerializedName("id")
    var id: Long = 0,
    @SerializedName("timestamp")
    var timestamp: Long = 0,
    @SerializedName("from")
    var from: MessageFromType? = null
)
