package ru.glitchless.santa.model.api.chat

import com.google.gson.annotations.SerializedName


data class MessageSendObject(
    @SerializedName("text")
    var text: String,
    @SerializedName("to")
    var to: CompanionType
)
