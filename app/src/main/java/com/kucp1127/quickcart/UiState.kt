package com.kucp1127.quickcart

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

// Sealed class to represent the different states of the UI.
sealed class UiState {
    object Idle : UiState()
    object Loading : UiState()
    data class Success(val data: Any? = null) : UiState()
    data class Error(val message: String) : UiState()
}

class AuthViewModel(application: Application) : AndroidViewModel(application) {

    private val tokenManager = TokenManager(application)

    // StateFlow for the overall UI state (login, data fetching).
    private val _uiState = MutableStateFlow<UiState>(UiState.Idle)
    val uiState: StateFlow<UiState> = _uiState

    // StateFlow specifically for user data.
    private val _userData = MutableStateFlow<UserData?>(null)
    val userData: StateFlow<UserData?> = _userData

    // Check if the user is already logged in when the ViewModel is created.
    val isLoggedIn: Boolean
        get() = tokenManager.getToken() != null

    fun login(email: String, password: String) {
        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                val response = RetrofitInstance.api.login(email, password)
                if (response.isSuccessful && response.body() != null) {
                    val token = response.body()!!.string()
                    tokenManager.saveData(token, email)
                    _uiState.value = UiState.Success("Login successful")
                } else {
                    _uiState.value = UiState.Error("Login failed: Invalid credentials.")
                }
            } catch (e: Exception) {
                _uiState.value = UiState.Error("Login failed: ${e.message}")
            }
        }
    }

    fun fetchUserData() {
        val token = tokenManager.getToken()
        val email = tokenManager.getEmail()

        if (token == null || email == null) {
            _uiState.value = UiState.Error("User not logged in.")
            return
        }

        viewModelScope.launch {
            _uiState.value = UiState.Loading
            try {
                // The "Bearer " prefix is a standard for sending JWTs.
                val authHeader = "Bearer $token"
                val response = RetrofitInstance.api.getUserData(authHeader, email)
                if (response.isSuccessful && response.body() != null) {
                    _userData.value = response.body()
                    _uiState.value = UiState.Success()
                } else {
                    _uiState.value = UiState.Error("Failed to fetch user data.")
                    // If fetching data fails, the token might be expired. Log the user out.
                    logout()
                }
            } catch (e: Exception) {
                _uiState.value = UiState.Error("Error fetching data: ${e.message}")
                logout()
            }
        }
    }

    fun logout() {
        tokenManager.clearData()
        _userData.value = null
        _uiState.value = UiState.Idle // Reset state
    }

    fun resetUiState() {
        _uiState.value = UiState.Idle
    }
}
