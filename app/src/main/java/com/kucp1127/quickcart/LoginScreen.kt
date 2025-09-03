package com.kucp1127.quickcart

import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LoginScreen(
    viewModel: AuthViewModel,
    onLoginSuccess: () -> Unit
) {
    // Your authentication state management remains exactly as you designed it
    // This clean separation between UI styling and business logic demonstrates professional architecture
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    val uiState by viewModel.uiState.collectAsState()
    val context = LocalContext.current

    // Your original state handling logic preserved completely
    // This reactive pattern properly manages the authentication flow
    LaunchedEffect(key1 = uiState) {
        when (val state = uiState) {
            is UiState.Success -> {
                Toast.makeText(context, "Login Successful!", Toast.LENGTH_SHORT).show()
                onLoginSuccess()
                viewModel.resetUiState() // Reset state after navigation
            }
            is UiState.Error -> {
                Toast.makeText(context, state.message, Toast.LENGTH_LONG).show()
                viewModel.resetUiState()
            }
            else -> Unit
        }
    }

    // Defining your color palette as semantic variables
    // This approach makes color management systematic and easier to maintain across your app
    val creamBase = Color(0xFFF2EFE7)      // Warm foundation color for readability
    val lightTeal = Color(0xFF9ACBD0)      // Primary background and accent color
    val mediumTeal = Color(0xFF48A6A7)     // Interactive elements and emphasis
    val deepBlue = Color(0xFF2973B2)       // Primary action color and text
    val inputTextColor = Color(0xFF1A1A1A) // Dark color for maximum text visibility

    // Creating full-screen teal background without container components
    // This Column approach efficiently handles both layout and background styling
    Column(
        modifier = Modifier
            .fillMaxSize()
            // Implementing your requested teal background using a sophisticated gradient
            // The gradient creates visual interest while maintaining your teal theme throughout
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        mediumTeal,                    // Starting with your medium teal at the top
                        lightTeal,                     // Transitioning to lighter teal in the middle
                        lightTeal.copy(alpha = 0.8f),  // Subtle variation for depth
                        mediumTeal.copy(alpha = 0.9f)  // Returning to medium teal at bottom
                    )
                )
            )
            .padding(20.dp),
        verticalArrangement = Arrangement.Center,
        horizontalAlignment = Alignment.CenterHorizontally
    ) {

        // Header section with enhanced contrast for teal background
        // Using cream base color ensures excellent readability against your teal theme
        Text(
            text = "QuickCart",
            fontSize = 44.sp,
            fontWeight = FontWeight.ExtraBold,
            color = creamBase, // Light color stands out beautifully against teal background
            style = MaterialTheme.typography.headlineLarge,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Subtitle designed for optimal contrast against teal background
        Text(
            text = "Your Sports Journey Starts Here",
            fontSize = 18.sp,
            fontWeight = FontWeight.Medium,
            color = creamBase.copy(alpha = 0.9f), // Slightly transparent for visual hierarchy
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(bottom = 40.dp)
        )

        // Login form card with careful color balance for your teal theme
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 4.dp),
            shape = RoundedCornerShape(24.dp),
            // Using cream base for the card creates perfect contrast against teal background
            colors = CardDefaults.cardColors(
                containerColor = creamBase
            ),
            elevation = CardDefaults.cardElevation(defaultElevation = 16.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(28.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {

                // Form header using your deep blue for strong contrast against cream background
                Text(
                    text = "Sign In",
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Bold,
                    color = deepBlue,
                    modifier = Modifier.padding(bottom = 28.dp)
                )

                // Email input field with explicitly defined text colors for perfect visibility
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = {
                        Text(
                            "Email Address",
                            color = mediumTeal // Label uses your medium teal for brand consistency
                        )
                    },
                    placeholder = {
                        Text(
                            "Enter your email",
                            color = mediumTeal.copy(alpha = 0.7f) // Placeholder slightly muted but visible
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        // Solving your text visibility issue with explicit dark text color
                        unfocusedTextColor = inputTextColor,    // Dark text for clear visibility
                        focusedTextColor = inputTextColor,      // Consistent text color when focused

                        // Border colors using your palette for visual consistency
                        unfocusedBorderColor = lightTeal,       // Subtle border when not active
                        focusedBorderColor = deepBlue,          // Strong focus indication

                        // Label colors that work with your theme
                        focusedLabelColor = deepBlue,           // Label color when field is active
                        unfocusedLabelColor = mediumTeal,       // Label color when field is inactive

                        // Background and cursor colors for complete control
                        cursorColor = deepBlue,                 // Cursor matches your primary color
                        unfocusedContainerColor = Color.White,  // Pure white background for maximum text contrast
                        focusedContainerColor = Color.White     // Consistent background when focused
                    )
                )

                Spacer(modifier = Modifier.height(20.dp))

                // Password field with identical color treatment for consistency
                OutlinedTextField(
                    value = password,
                    onValueChange = { password = it },
                    label = {
                        Text(
                            "Password",
                            color = mediumTeal
                        )
                    },
                    placeholder = {
                        Text(
                            "Enter your password",
                            color = mediumTeal.copy(alpha = 0.7f)
                        )
                    },
                    modifier = Modifier.fillMaxWidth(),
                    visualTransformation = PasswordVisualTransformation(),
                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password),
                    singleLine = true,
                    shape = RoundedCornerShape(16.dp),
                    colors = OutlinedTextFieldDefaults.colors(
                        // Applying the same text visibility solution to password field
                        unfocusedTextColor = inputTextColor,    // Dark text ensures password dots are visible
                        focusedTextColor = inputTextColor,      // Consistent text color treatment

                        unfocusedBorderColor = lightTeal,
                        focusedBorderColor = deepBlue,
                        focusedLabelColor = deepBlue,
                        unfocusedLabelColor = mediumTeal,
                        cursorColor = deepBlue,
                        unfocusedContainerColor = Color.White,
                        focusedContainerColor = Color.White
                    )
                )

                Spacer(modifier = Modifier.height(32.dp))

                // Your original conditional rendering logic for login button vs loading state
                if (uiState is UiState.Loading) {
                    // Loading state using your medium teal for brand consistency
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(58.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        CircularProgressIndicator(
                            color = mediumTeal,
                            strokeWidth = 4.dp,
                            modifier = Modifier.size(32.dp)
                        )
                    }
                } else {
                    // Primary login button using your deep blue for maximum impact
                    Button(
                        onClick = {
                            // Your original validation logic - this clean approach is exactly right
                            if (email.isNotBlank() && password.isNotBlank()) {
                                viewModel.login(email, password)
                            } else {
                                Toast.makeText(context, "Please fill all fields", Toast.LENGTH_SHORT).show()
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(58.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = deepBlue,
                            contentColor = creamBase // Light text on dark button for perfect contrast
                        ),
                        elevation = ButtonDefaults.buttonElevation(
                            defaultElevation = 8.dp,
                            pressedElevation = 4.dp
                        )
                    ) {
                        Text(
                            "Sign In",
                            fontSize = 20.sp,
                            fontWeight = FontWeight.Bold,
                            color = creamBase
                        )
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                // Footer text optimized for cream card background
                Text(
                    "Secure • Fast • Reliable",
                    fontSize = 14.sp,
                    color = mediumTeal,
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.Medium
                )
            }
        }

        Spacer(modifier = Modifier.height(28.dp))

        // Additional brand element that works against teal background
        Text(
            "Ready to elevate your game?",
            fontSize = 16.sp,
            color = creamBase.copy(alpha = 0.8f),
            textAlign = TextAlign.Center,
            fontWeight = FontWeight.Medium
        )
    }
}