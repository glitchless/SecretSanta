package ru.glitchless.santa.model.api.chat

import com.google.gson.annotations.SerializedName

enum class MessageFromType {
    @SerializedName("current")
    CURRENT,

    @SerializedName("companion")
    COMPANION
}
