package ru.glitchless.santa.model.api.auth.tp

import com.google.gson.annotations.SerializedName
import ru.glitchless.santa.repository.auth.tp.TPAuthSource

data class TPOauthCode(
    @SerializedName("code")
    var code: String = "",
    @SerializedName("auth_source")
    var authSource: TPAuthSource? = null,
    @SerializedName("redirect_uri")
    var redirectUrl: String = ""
)
