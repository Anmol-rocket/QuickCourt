package com.kucp1127.quickcart

import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory

// Singleton object to provide a single instance of Retrofit.
object RetrofitInstance {
    // The base URL for your API.
    private const val BASE_URL = "http://10.57.111.123:8080/"

    // Lazy-initialized Retrofit instance.
    val api: ApiService by lazy {
        // Add a logger to see request and response details in Logcat
        val logging = HttpLoggingInterceptor()
        logging.setLevel(HttpLoggingInterceptor.Level.BODY)
        val client = OkHttpClient.Builder()
            .addInterceptor(logging)
            .build()

        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(client)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
            .create(ApiService::class.java)
    }
}