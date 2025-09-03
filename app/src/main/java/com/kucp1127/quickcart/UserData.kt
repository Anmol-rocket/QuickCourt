package com.kucp1127.quickcart

import com.google.gson.annotations.SerializedName

// Data class to model the user data from the API response.
data class UserData(
    @SerializedName("email")
    val email: String = "",

    @SerializedName("password")
    val passwordHash: String = "", // It's a hash, not the plain password

    @SerializedName("fullName")
    val fullName: String = "",

    @SerializedName("avatarUrl")
    val avatarUrl: String = "",

    @SerializedName("role")
    val role: String = "",

    @SerializedName("verified")
    val verified: Boolean? = null
)