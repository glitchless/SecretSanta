package ru.glitchless.santa.model.api

import com.google.gson.annotations.SerializedName

data class Stats(
    @SerializedName("users")
    var users: UsersStats = UsersStats(),
    @SerializedName("shuffle_date")
    var shuffleDate: Long = 0L,
    @SerializedName("start_date")
    var startDate: Long = 0L,
    @SerializedName("end_date")
    var endDate: Long = 0L,
    @SerializedName("is_expired")
    var isExpired: Boolean = false
)

data class UsersStats(
    @SerializedName("active")
    var activeUser: Long = 0,
    @SerializedName("sent")
    var sentUser: Long = 0,
    @SerializedName("received")
    var receivedUser: Long = 0
)
