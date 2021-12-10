package ru.glitchless.santa.repository.auth.tp

import com.google.gson.annotations.SerializedName

enum class TPAuthSource(host: String) {
    @SerializedName("technopark")
    TECHNOPARK("park.vk.company"),

    @SerializedName("sphere")
    SPHERE("sphere.vk.company"),

    @SerializedName("track")
    TRACK("track.vk.company"),

    @SerializedName("technoatom")
    ATOM("technoatom.vk.company"),

    @SerializedName("polis")
    POLIS("polis.vk.company"),

    @SerializedName("data")
    DATA("data.vk.company"),

    @SerializedName("education")
    EDUCATION("education.vk.company"),

    @SerializedName("gamesphere")
    GAMESPHERE("gamesphere.ru");

    val baseUrl = "https://$host/oauth"
}
