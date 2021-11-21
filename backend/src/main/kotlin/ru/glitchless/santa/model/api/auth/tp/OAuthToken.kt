package ru.glitchless.santa.model.api.auth.tp

import com.google.gson.annotations.SerializedName

data class OAuthToken(
    @SerializedName("access_token")
    var accessToken: String = "",
    @SerializedName("token_type")
    var tokenType: String = "",
    @SerializedName("expires_in")
    var expiresIn: Long = 0,
    @SerializedName("refresh_token")
    var refreshToken: String = "",
    @SerializedName("scope")
    var scope: String = ""
)
