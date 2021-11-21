package ru.glitchless.santa.model.api.auth.tp

import com.google.gson.annotations.SerializedName

data class TechoparkUser(
    @SerializedName("first_name")
    var firstName: String = "",
    @SerializedName("last_name")
    var lastName: String = "",
    @SerializedName("id")
    var id: Int = 0
)

data class TechnoparkExtraUser(
    @SerializedName("photo")
    val photoUrl: String = "",
    @SerializedName("profile_link")
    val profileLink: String = ""
)

data class TechnoparkContacts(
    @SerializedName("email")
    val email: String? = ""
)
