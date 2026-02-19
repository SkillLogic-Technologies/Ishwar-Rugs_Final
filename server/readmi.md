# Authentication Module – OTP Based Login

This project implements an **OTP-based authentication system** where users can log in using only their email address.  
The same flow works for both **existing users and new users** — no separate signup API is required.

---

## 🔐 Authentication Flow Overview

1. User enters their **email address**
2. System sends a **One-Time Password (OTP)** to the email
3. User verifies the OTP using **email, OTP, and username**
   - `username` is required **only for first-time users**
4. On successful verification, a **JWT token** is issued
5. Authenticated user can:
   - Access their profile
   - Log out securely

---

## 🚀 API Endpoints

### 1️⃣ Send OTP (Login Request)

**Endpoint**

## Admin 
## Name: Adil Haya Fatima
## Email: adilshah25012@gmail.com
