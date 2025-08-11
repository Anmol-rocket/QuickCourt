package com.kucp1127.quickcart

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.journeyapps.barcodescanner.ScanContract
import com.journeyapps.barcodescanner.ScanOptions
import com.kucp1127.quickcart.ui.theme.QuickCartTheme

class MainActivity : ComponentActivity() {

    private val authViewModel: AuthViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            // **FIX**: Use the correct theme name
            QuickCartTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()

                    // State to hold the result from the QR scanner
                    var qrCodeResult by remember { mutableStateOf<String?>(null) }

                    // Activity Result Launcher for the QR Scanner
                    val qrScannerLauncher = rememberLauncherForActivityResult(ScanContract()) { result ->
                        if (result.contents != null) {
                            qrCodeResult = result.contents
                        }
                    }

                    // Determine the starting screen based on login status
                    val startDestination = if (authViewModel.isLoggedIn) "main" else "login"

                    NavHost(navController = navController, startDestination = startDestination) {
                        composable("login") {
                            LoginScreen(
                                viewModel = authViewModel,
                                onLoginSuccess = {
                                    navController.navigate("main") {
                                        // Clear back stack to prevent going back to login screen
                                        popUpTo("login") { inclusive = true }
                                    }
                                }
                            )
                        }
                        composable("main") {
                            MainScreen(
                                viewModel = authViewModel,
                                onLogout = {
                                    navController.navigate("login") {
                                        popUpTo("main") { inclusive = true }
                                    }
                                },
                                onScanQrClicked = {
                                    // Configure and launch the scanner
                                    val options = ScanOptions()
                                    options.setPrompt("Scan a QR code")
                                    options.setBeepEnabled(true)
                                    options.setOrientationLocked(false)
                                    qrScannerLauncher.launch(options)
                                },
                                qrCodeResult = qrCodeResult
                            )
                        }
                    }
                }
            }
        }
    }
}
