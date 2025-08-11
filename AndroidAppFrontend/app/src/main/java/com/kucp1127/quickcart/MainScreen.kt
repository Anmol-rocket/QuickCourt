package com.kucp1127.quickcart

import androidx.compose.animation.*
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.google.gson.Gson
import com.google.gson.JsonSyntaxException
import kotlinx.coroutines.delay

// ------------------ Model & parser ------------------
data class BookingInfo(
    val bookingId: String? = null,
    val venue: String? = null,
    val court: String? = null,
    val date: String? = null,
    val timeSlot: String? = null,
    val userName: String? = null,
    val amount: Long? = null,
    val status: String? = null
)

fun tryParseBooking(raw: String?): BookingInfo? {
    if (raw.isNullOrBlank()) return null
    var candidate = raw.trim()

    // Unwrap quoted / escaped JSON from scanners
    if (candidate.startsWith("\"") && candidate.endsWith("\"") && candidate.length > 1) {
        candidate = candidate.substring(1, candidate.length - 1)
            .replace("\\\"", "\"")
            .replace("\\n", "")
    }

    return try {
        val parsed = Gson().fromJson(candidate, BookingInfo::class.java)
        // minimal validation: require bookingId, date and userName (adjust if needed)
        if (parsed?.bookingId.isNullOrBlank() ||
            parsed?.date.isNullOrBlank() ||
            parsed?.userName.isNullOrBlank()
        ) {
            null
        } else parsed
    } catch (e: JsonSyntaxException) {
        null
    } catch (e: Exception) {
        null
    }
}

// ------------------ UI helpers ------------------
@Composable
private fun InfoRow(label: String, value: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, fontSize = 14.sp, color = Color.Black)
        Text(text = value, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.Black)
    }
}

// ------------------ Scan Result Card with tick animation ------------------
@Composable
fun ScanResultCard(qrCodeResult: String?) {
    val booking = remember(qrCodeResult) { tryParseBooking(qrCodeResult) }

    // Trigger tick animation when booking becomes non-null
    var showTick by remember { mutableStateOf(false) }
    LaunchedEffect(booking) {
        if (booking != null) {
            showTick = true
            // keep tick visible for 1.5 seconds
            delay(1500)
            showTick = false
        } else {
            showTick = false
        }
    }

    // Root box so we can overlay the tick on top of the card
    Box(modifier = Modifier.fillMaxWidth(), contentAlignment = Alignment.TopCenter) {
        if (booking != null) {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                shape = RoundedCornerShape(16.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.98f))
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Booking Details",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    Spacer(modifier = Modifier.height(12.dp))

                    InfoRow(label = "Booking ID", value = booking.bookingId ?: "-")
                    InfoRow(label = "Venue", value = booking.venue ?: "-")
                    InfoRow(label = "Court", value = booking.court ?: "-")
                    InfoRow(label = "Date", value = booking.date ?: "-")
                    InfoRow(label = "Time", value = booking.timeSlot ?: "-")
                    InfoRow(label = "User", value = booking.userName ?: "-")
                    InfoRow(label = "Amount", value = booking.amount?.let { "₹$it" } ?: "-")

                    Spacer(modifier = Modifier.height(8.dp))

                    val status = booking.status?.uppercase() ?: "UNKNOWN"
                    val statusColor = when {
                        status.contains("CONFIRM") -> Color(0xFF2E7D32) // green
                        status.contains("PEN") -> Color(0xFFF9A825) // amber
                        status.contains("CANC") -> Color(0xFFD32F2F) // red
                        else -> Color(0xFF616161) // gray
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = statusColor.copy(alpha = 0.12f)
                        ) {
                            Text(
                                text = status,
                                color = statusColor,
                                modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                                fontWeight = FontWeight.SemiBold,
                                fontSize = 13.sp
                            )
                        }
                    }
                }
            }
        } else {
            // Invalid card (pointwise, with black text)
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                shape = RoundedCornerShape(14.dp),
                elevation = CardDefaults.cardElevation(defaultElevation = 6.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF3E0))
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Text(
                        text = "Invalid QR/Image",
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("• The scanned image does not match the expected booking schema.", fontSize = 14.sp, color = Color.Black)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("• Make sure the QR code contains JSON with keys:", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color.Black)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text("  - bookingId", fontSize = 13.sp, color = Color.Black)
                    Text("  - venue", fontSize = 13.sp, color = Color.Black)
                    Text("  - court", fontSize = 13.sp, color = Color.Black)
                    Text("  - date (YYYY-MM-DD)", fontSize = 13.sp, color = Color.Black)
                    Text("  - timeSlot (eg. 5:00 PM - 10:00 PM)", fontSize = 13.sp, color = Color.Black)
                    Text("  - userName", fontSize = 13.sp, color = Color.Black)
                    Text("  - amount (numeric)", fontSize = 13.sp, color = Color.Black)
                    Text("  - status (eg. CONFIRMED)", fontSize = 13.sp, color = Color.Green)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text("Try rescanning or ensure the QR encodes the booking JSON.", fontSize = 13.sp, color = Color(0xFF616161))
                }
            }
        }

        // Tick overlay (centered above card)
        AnimatedVisibility(
            visible = showTick,
            enter = scaleIn(
                animationSpec = tween(durationMillis = 450, easing = FastOutSlowInEasing),
                initialScale = 0.2f
            ) + fadeIn(animationSpec = tween(durationMillis = 300)),
            exit = scaleOut(animationSpec = tween(durationMillis = 300)) + fadeOut()
        ) {
            // scaling Pulse for tick
            var pulse by remember { mutableStateOf(false) }
            val scale by animateFloatAsState(targetValue = if (pulse) 1.12f else 1f, animationSpec = infiniteRepeatable(
                animation = tween(durationMillis = 400, easing = LinearOutSlowInEasing),
                repeatMode = RepeatMode.Reverse
            ))
            LaunchedEffect(showTick) {
                if (showTick) {
                    pulse = true
                    // stop pulsing after shown for 1.2s
                    delay(1200)
                    pulse = false
                }
            }

            Icon(
                imageVector = Icons.Default.CheckCircle,
                contentDescription = "success",
                tint = Color(0xFF2E7D32),
                modifier = Modifier
                    .size(72.dp)
                    .scale(scale)
                    .offset(y = (-20).dp) // slight lift so it hovers over the card
            )
        }
    }
}

// ------------------ Complete page (MainScreen) ------------------
@OptIn(ExperimentalMaterial3Api::class, ExperimentalAnimationApi::class)
@Composable
fun MainScreen(
    viewModel: AuthViewModel,
    onLogout: () -> Unit,
    onScanQrClicked: () -> Unit,
    qrCodeResult: String?
) {
    val userData by viewModel.userData.collectAsState()

    // Colors
    val creamBase = Color(0xFFF2EFE7)
    val lightTeal = Color(0xFF9ACBD0)
    val mediumTeal = Color(0xFF48A6A7)
    val deepBlue = Color(0xFF2973B2)

    // Load user once
    LaunchedEffect(Unit) { viewModel.fetchUserData() }

    // Entire page layout
    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(
                brush = Brush.verticalGradient(
                    colors = listOf(mediumTeal, lightTeal, lightTeal.copy(alpha = 0.9f), mediumTeal.copy(alpha = 0.8f))
                )
            )
            .padding(20.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Spacer(modifier = Modifier.height(8.dp))

        // Welcome card (simple)
        Card(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp),
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = creamBase),
            elevation = CardDefaults.cardElevation(defaultElevation = 10.dp)
        ) {
            Column(modifier = Modifier.padding(20.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("Welcome Back!", fontSize = 24.sp, fontWeight = FontWeight.Bold, color = deepBlue)
                Spacer(Modifier.height(6.dp))
                Text(userData?.fullName ?: "User", fontSize = 20.sp, fontWeight = FontWeight.SemiBold, color = mediumTeal)
                Spacer(Modifier.height(6.dp))
                Text("Ready to make moves?", fontSize = 14.sp, color = mediumTeal.copy(alpha = 0.8f))
            }
        }

        Spacer(modifier = Modifier.height(24.dp))

        // Facility management and scan button (only for owners)
        if (userData?.role == "ROLE_FACILITY_OWNER") {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = creamBase.copy(alpha = 0.95f)),
                elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                    Text("Facility Management", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = deepBlue)
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = { onScanQrClicked() },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(10.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = mediumTeal, contentColor = creamBase)
                    ) {
                        Text("Scan QR Code")
                    }
                }
            }

            Spacer(modifier = Modifier.height(20.dp))
        }

        // Show the ScanResultCard (full width)
        ScanResultCard(qrCodeResult = qrCodeResult)

        Spacer(modifier = Modifier.weight(1f))

        // Logout at bottom
        OutlinedButton(
            onClick = {
                viewModel.logout()
                onLogout()
            },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp),
            shape = RoundedCornerShape(12.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = creamBase)
        ) {
            Text("Logout", color = creamBase)
        }

        Spacer(modifier = Modifier.height(12.dp))
    }
}
