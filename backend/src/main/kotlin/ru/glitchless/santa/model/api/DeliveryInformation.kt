package ru.glitchless.santa.model.api

import com.google.gson.annotations.SerializedName

data class DeliveryInformation(
    @SerializedName("name")
    var name: String = "",
    @SerializedName("comment")
    var comment: String = "",
    @SerializedName("address")
    var address: String = "",
    @SerializedName("index")
    var index: String = ""
)
