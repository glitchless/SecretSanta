package ru.glitchless.santa.model.api.auth.vas3k

import com.google.gson.annotations.SerializedName

class Vas3kAuthCode {
    @SerializedName("jwt")
    var jwt: String = ""
}
