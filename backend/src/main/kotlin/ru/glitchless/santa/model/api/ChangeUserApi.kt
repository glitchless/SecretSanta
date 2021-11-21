package ru.glitchless.santa.model.api

import com.google.gson.annotations.SerializedName

data class ChangeUserApi(
    @SerializedName("is_active")
    var isActive: Boolean? = null,
    @SerializedName("is_sent")
    var isSent: Boolean? = null,
    @SerializedName("is_received")
    var isReceived: Boolean? = null,
    @SerializedName("email")
    var email: String? = null,
    @SerializedName("delivery_information")
    var deliveryInformation: DeliveryInformation? = null,
)
