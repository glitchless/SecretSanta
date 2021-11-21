package ru.glitchless.santa.model.api.auth.simple

import com.google.gson.annotations.SerializedName

data class SimpleRegister(
    @SerializedName("fullname")
    var fullname: String = "",
    @SerializedName("email")
    var email: String = "",
    @SerializedName("password")
    var password: String = "",
    @SerializedName("repeat_password")
    var repeatPassword: String = ""
)
