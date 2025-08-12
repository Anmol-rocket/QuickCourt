# 🏆 QuickCourt – Local Sports Booking Platform

## 📜 Problem Statement
Booking local sports facilities often involves **manual calls, in-person visits, and lack of real-time availability tracking**.  
Players face difficulties finding open slots, joining games, or knowing whether their booking is confirmed.  
Facility owners, on the other hand, struggle with **unorganized scheduling, overlapping bookings, and limited ways to verify reservations**.  
This results in **wasted time, underutilized resources, and poor user satisfaction**.

---

## 💡 Our Solution
**QuickCourt** is a **comprehensive local sports booking platform** that connects **players** with **facility owners** in a single, seamless ecosystem.

- **Players** can discover nearby sports venues, book slots, join community games, and leave feedback — all through an integrated booking system.
- **Facility Owners** can manage venue details, approve or reject booking requests, and track game participation in real time.
- **Verification Made Simple**: Our companion **Android application** (built with **Kotlin** and **Jetpack Compose**) allows facility owners to verify bookings instantly by checking the player's booking status on the spot.
- Fully **API-driven Spring Boot backend** ensures fast, scalable, and secure interactions.
- Designed for **local communities** to improve accessibility, efficiency, and sports participation.

---

## 🚀 Features

### 1️⃣ **Facility Owner Profile Management**
- Add, update, and manage **sports facilities** with rich metadata.
- Set **pricing per hour**, **operating hours**, and **sports types**.
- Handle multiple **sports under a single venue**.
- Fetch facility details through **REST APIs**.
- Maintain **owner identity and authentication** for secure access.
- Integration-ready for **payment and booking modules**.

---

### 2️⃣ **Sport Details Management**
- Add or update sports with **dynamic pricing**.
- Specify **time slots** and availability.
- Manage **sport types** (e.g., Cricket, Football, Tennis).
- API endpoints to **update prices and availability instantly**.
- Link sports directly to a **venue owner’s profile**.
- Maintain **historical change logs** for audit purposes.

---

### 3️⃣ **Game Creation & Discovery**
- Players can **create games** with location, venue, and time.
- Specify **required player count**.
- **Auto-assign game IDs** for quick reference.
- REST endpoints for **fetching all games or a single game**.
- Supports **real-time listing** of active games.
- Flexible **game update API** to edit details.

---

### 4️⃣ **Join & Leave Game Functionality**
- Players can **join** existing games via email.
- Duplicate join requests are **idempotent** (no double entries).
- Players can **leave games** at any time.
- Automatic update of **remaining player slots**.
- Validation to ensure game capacity isn’t exceeded.
- APIs return **updated game state** after join/leave actions.

---

### 5️⃣ **User Game Profile**
- Create user profiles via email.
- Store and retrieve **list of joined game IDs**.
- Profile auto-creation if not found during game join.
- View **past and active games** from one profile.
- Secure mapping between **user and joined games**.
- Fully **API-driven for mobile/web integration**.

---

### 6️⃣ **Comment & Review System**
- Users can leave **comments and ratings** for sports or venues.
- Rating validation ensures values between **1–5**.
- Support for **threaded replies** (parent comment IDs).
- Separate APIs for **sport-specific comments**.
- Owner can view all reviews for **performance improvement**.
- JSON-based requests for **easy integration with frontend**.

---

### 7️⃣ **Android Facility Verification App**
- Built using **Kotlin** and **Jetpack Compose**.
- Facility owners log in securely to view all current bookings.
- **Instant booking verification** by checking user’s email and slot.
- Color-coded **status display** for quick decision-making.
- Designed for **fast on-the-spot validation** during entry.
- Fully synchronized with **Spring Boot backend** APIs.

---

### 8️⃣ **Modular REST API Architecture**
- Every feature is **modularized** into DTO, Model, Controller, and Service.
- Fully **stateless** design for scalability.
- Easy to extend with **future modules** like tournaments or leaderboards.
- **Standardized JSON responses** for uniform frontend consumption.
- Clear endpoint mapping for each functional module.
- Built for **high concurrency** and reliability.

---

## 🛠 Tech Stack

### Backend
- **Spring Boot (Java)**
- **Spring Data JPA / Hibernate**
- **MySQL / PostgreSQL**
- **Maven**
- **Lombok**
- **REST APIs (JSON)**

### Mobile App
- **Kotlin**
- **Jetpack Compose**
- **Android Studio**
- **Retrofit** for API calls

---

## 👨‍💻 Collaborators

| Name | Email |
|------|-------|
| Adarsh Dubey | adarshiitkota@gmail.com |
| Anmol Upadhyay | 2023kucp1128@iiitkota.ac.in |
| Ayush Singh | bestayush3@gmail.com |
| Sauvir Wodehra | sauvirwodehras3136@gmail.com |

---

## 📌 Repository Notes
This repository contains **production-ready APIs** for **QuickCourt**, complemented by a fully functional **Android app** for booking verification.  
It’s built following **enterprise-grade coding standards** to ensure **scalability, security, and maintainability**.

---

## 🎯 Closing Note
> **QuickCourt** is more than a booking platform — it’s a **sports community enabler**.  
By integrating booking, verification, and communication, we’ve built a **complete ecosystem** for local sports.  
We aim to **empower communities** to play more, connect better, and manage facilities efficiently. 🏏⚽🏀

---
