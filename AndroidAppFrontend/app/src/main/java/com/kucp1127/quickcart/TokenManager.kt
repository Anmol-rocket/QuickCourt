package com.kucp1127.quickcart

import android.content.Context
import android.content.SharedPreferences

// Manages storing and retrieving the JWT token and user email using SharedPreferences.
class TokenManager(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("auth_prefs", Context.MODE_PRIVATE)

    companion object {
        private const val JWT_TOKEN = "jwt_token"
        private const val USER_EMAIL = "user_email"
    }

    fun saveData(token: String, email: String) {
        prefs.edit().apply {
            putString(JWT_TOKEN, token)
            putString(USER_EMAIL, email)
            apply()
        }
    }

    fun getToken(): String? {
        return prefs.getString(JWT_TOKEN, null)
    }

    fun getEmail(): String? {
        return prefs.getString(USER_EMAIL, null)
    }

    fun clearData() {
        prefs.edit().clear().apply()
    }
}