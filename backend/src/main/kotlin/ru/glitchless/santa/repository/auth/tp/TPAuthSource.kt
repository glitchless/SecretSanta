package ru.glitchless.santa.repository.auth.tp

import com.google.gson.annotations.SerializedName

enum class TPAuthSource(host: String) {
    @SerializedName("technopark")
    TECHNOPARK("park.vk.company"),

    @SerializedName("mailcourses")
    MAILCOURSES("education.vk.company"),

    @SerializedName("data")
    DATA("data.vk.company"),

    @SerializedName("polis")
    POLIS("polis.vk.company"),

    @SerializedName("track")
    TRACK("track.vk.company"),

    @SerializedName("sphere")
    SPHERE("sphere.vk.company"),

    @SerializedName("gamesphere")
    GAMESPHERE("gamesphere.ru");

    val baseUrl = "https://$host/oauth"
}
