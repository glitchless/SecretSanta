package ru.glitchless.santa.repository.auth.tp

import com.google.gson.annotations.SerializedName

enum class TPAuthSource(host: String) {
    @SerializedName("technopark")
    TECHNOPARK("park.mail.ru"),

    @SerializedName("mailcourses")
    MAILCOURSES("mailcourses.ru"),

    @SerializedName("linux")
    LINUX("linux.tech-mail.ru"),

    @SerializedName("data")
    DATA("data.mail.ru"),

    @SerializedName("polis")
    POLIS("polis.mail.ru"),

    @SerializedName("technoatom")
    TECHNOATOM("technoatom.mail.ru"),

    @SerializedName("track")
    TRACK("track.mail.ru"),

    @SerializedName("sphere")
    SPHERE("sphere.mail.ru");

    val baseUrl = "https://$host/oauth"
}
