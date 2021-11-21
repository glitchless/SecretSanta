package ru.glitchless.santa.model.api.auth

import com.google.gson.annotations.SerializedName
import ru.glitchless.santa.model.api.DeliveryInformation

data class UserApi(
    @SerializedName("id")
    var id: Int = 0,
    @SerializedName("full_name")
    var fullName: String = "",
    @SerializedName("email")
    var email: String = "",
    @SerializedName("is_active")
    var isActive: Boolean = false,
    @SerializedName("is_sent")
    var isSent: Boolean = false,
    @SerializedName("is_received")
    var isReceived: Boolean = false,
    @SerializedName("delivery_information")
    var deliveryInformation: DeliveryInformation = DeliveryInformation(),
    @SerializedName("photo_url")
    var photoUrl: String? = null,
    @SerializedName("profile_url")
    var profileUrl: String? = null,
    @SerializedName("pair_sent")
    var pairUserSent: Boolean? = null,
    @SerializedName("pair_user")
    var pairUser: UserApi? = null
)
