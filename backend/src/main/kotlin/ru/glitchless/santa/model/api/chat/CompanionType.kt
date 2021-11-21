package ru.glitchless.santa.model.api.chat

import com.google.gson.annotations.SerializedName

enum class CompanionType {
    /**
     * Тот кому отправляешь подарок
     */
    @SerializedName("receiver")
    RECEIVER,

    /**
     * Тот от кого получаешь подарок
     */
    @SerializedName("sender")
    SENDER
}

fun CompanionType.reverse(): CompanionType {
    return if (this == CompanionType.RECEIVER) {
        return CompanionType.SENDER
    } else CompanionType.RECEIVER
}
