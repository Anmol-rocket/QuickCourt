package com.kucp1127.quickcart


import okhttp3.ResponseBody
import retrofit2.Response
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Path
import retrofit2.http.Query

// Retrofit interface defining the API endpoints.
interface ApiService {

    @GET("login")
    suspend fun login(
        @Query("email") email: String,
        @Query("password") password: String
    ): Response<ResponseBody> // The token is returned as plain text in the body

    @GET("data/{emailId}")
    suspend fun getUserData(
        @Header("Authorization") token: String,
        @Path("emailId") email: String
    ): Response<UserData>
}