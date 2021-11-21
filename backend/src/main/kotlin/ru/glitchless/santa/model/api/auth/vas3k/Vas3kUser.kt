package ru.glitchless.santa.model.api.auth.vas3k

import com.google.gson.annotations.SerializedName

data class Vas3kUser(
    @SerializedName("user_slug")
    var slug: String = "",
    @SerializedName("user_name")
    var name: String? = null,
    @SerializedName("user_email")
    var email: String? = null,
    @SerializedName("exp")
    var exp: Long? = null
)
