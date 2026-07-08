# NayePankh Intern Portal - Backend API Documentation

This document provides a detailed explanation of the authentication, user, campaign, donation, and dashboard endpoints for the NayePankh Intern Portal backend. Use this as a reference for integrating the backend with any frontend or for API testing.

---

## Base URL

- **Development:** `https://naye-pankh-intern-portal-ox93.vercel.app`
- **Production:** (your deployed backend URL)

All endpoints are prefixed with `/api`.

---

# 1. AUTH ENDPOINTS (`/api/auth`)

## Base URL

- **Development:** `https://naye-pankh-intern-portal-ox93.vercel.app`
- **Production:** (your deployed backend URL)

All endpoints are prefixed with `/api/auth`.

### 1. **Register a New User (Intern/Admin/SuperAdmin)**

**POST** `/api/auth/signup`

Registers a new user. Interns will receive an OTP on their Gmail for verification. Admins and SuperAdmins register directly.

#### Request Body
```json
{
  "firstname": "John",
  "lastname": "Doe",
  "email": "john.doe@gmail.com",
  "password": "yourpassword",
  "internshipPeriod": "1 month",
  "role": "Intern" // Optional, default is Intern
}
```

#### Responses
- **Intern:**
  ```json
  { "msg": "OTP sent to email. Please verify to complete registration.", "email": "john.doe@gmail.com" }
  ```
- **Admin/SuperAdmin:**
  ```json
  { "token": "<jwt>", "user": { ... } }
  ```
- **Error:**
  ```json
  { "msg": "User already exists" }
  ```

### 2. **Verify Registration OTP (Intern Only)**

**POST** `/api/auth/verify-otp`

Verifies the OTP sent to the intern's Gmail during registration.

#### Request Body
```json
{
  "email": "john.doe@gmail.com",
  "otp": "123456"
}
```

#### Response
```json
{ "msg": "Registration verified. You can now login." }
```

### 3. **Login (All Roles)**

**POST** `/api/auth/login`

Logs in a user. Interns will receive an OTP on their Gmail for verification. Admins and SuperAdmins log in directly.

#### Request Body
```json
{
  "email": "john.doe@gmail.com",
  "password": "yourpassword"
}
```

#### Responses
- **Intern:**
  ```json
  { "msg": "OTP sent to email. Please verify to login.", "email": "john.doe@gmail.com" }
  ```
- **Admin/SuperAdmin:**
  ```json
  { "msg": "Login successful", "token": "<jwt>", "user": { ... } }
  ```
- **Error:**
  ```json
  { "msg": "Invalid Credentials" }
  ```

### 4. **Verify Login OTP (Intern Only)**

**POST** `/api/auth/login-verify-otp`

Verifies the OTP sent to the intern's Gmail during login.

#### Request Body
```json
{
  "email": "john.doe@gmail.com",
  "otp": "654321"
}
```

#### Response
```json
{ "msg": "Login successful", "token": "<jwt>", "user": { ... } }
```

### 5. **Get Authenticated User Details**

**GET** `/api/auth/user`

Returns the details of the currently authenticated user. Requires a valid JWT in the `Authorization` header.

#### Request Header
```
Authorization: Bearer <jwt>
```

#### Response
```json
{ "user": { ... } }
```

---

# 2. USER ENDPOINTS (`/api/users`)

### **GET `/api/users`**
- **Description:** Fetch all users (Super Admin and Moderator only)
- **Auth:** Yes (Super Admin, Moderator)
- **Response:**
```json
{ "users": [ { ...userObj } ] }
```

### **PUT `/api/users/:id`**
- **Description:** Update a user (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Body:**
```json
{ "firstname": "...", "lastname": "...", "email": "...", "password": "...", "referralCode": "...", "internshipPeriod": "..." }
```
- **Response:**
```json
{ "user": { ...updatedUser }, "msg": "User updated successfully" }
```

### **DELETE `/api/users/:id`**
- **Description:** Delete a user (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Response:**
```json
{ "msg": "User deleted successfully" }
```

---

# 3. CAMPAIGN ENDPOINTS (`/api/campaign`)

### **POST `/api/campaign`**
- **Description:** Create a new campaign (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Body:**
```json
{ "title": "...", "description": "...", "goalAmount": 10000, "startDate": "2024-06-01", "endDate": "2024-07-01" }
```
- **Response:**
```json
{ "campaign": { ... }, "msg": "Campaign created successfully" }
```

### **GET `/api/campaign`**
- **Description:** Fetch all campaigns (Super Admin, Admin, Intern)
- **Auth:** Yes
- **Response:**
```json
{ "campaigns": [ { ... } ], "msg": "Campaigns retrieved successfully" }
```

### **PUT `/api/campaign/:id`**
- **Description:** Update a campaign (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Body:**
```json
{ "title": "...", "description": "...", "goalAmount": 10000, "startDate": "2024-06-01", "endDate": "2024-07-01" }
```
- **Response:**
```json
{ "campaign": { ... }, "msg": "Campaign updated successfully" }
```

### **PUT `/api/campaign/:id/extend`**
- **Description:** Extend campaign end date (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Body:**
```json
{ "duration": 604800000 } // Duration in milliseconds
```
- **Response:**
```json
{ "campaign": { ... }, "msg": "Campaign extended successfully" }
```

### **DELETE `/api/campaign/:id`**
- **Description:** Delete a campaign (Super Admin only)
- **Auth:** Yes (Super Admin)
- **Response:**
```json
{ "msg": "Campaign deleted successfully" }
```

---

# 4. DONATE ENDPOINTS (`/api/donate`)

### **GET `/api/donate/public`**
- **Description:** Fetch all active campaigns (public access)
- **Auth:** No
- **Response:**
```json
{ "campaigns": [ { ... } ], "msg": "Campaigns retrieved successfully" }
```

### **GET `/api/donate/:referralCode`**
- **Description:** Fetch campaigns with referral code
- **Auth:** No
- **Response:**
```json
{ "campaigns": [ { ... } ], "msg": "Campaigns retrieved successfully" }
```

### **POST `/api/donate`**
- **Description:** Create donation order (Razorpay)
- **Auth:** No
- **Body:**
```json
{ "donorName": "...", "amount": 10000, "campaignId": "...", "referralCode": "...", "email": "...", "phoneNumber": "...", "campaignDetails": { ... } }
```
- **Response:**
```json
{ "orderId": "...", "amount": 10000, "msg": "Donation order created successfully" }
```

### **POST `/api/donate/verify`**
- **Description:** Verify payment (Razorpay)
- **Auth:** No
- **Body:**
```json
{ "razorpay_order_id": "...", "razorpay_payment_id": "...", "razorpay_signature": "...", "donorName": "...", "amount": 10000, "campaignId": "...", "referralCode": "...", "email": "...", "phoneNumber": "..." }
```
- **Response:**
```json
{ "msg": "Payment verified and donation recorded successfully" }
```

---

# 5. DONATIONS ENDPOINTS (`/api/donations`)

### **GET `/api/donations`**
- **Description:** Fetch donations (role-based: Super Admin/Admin see all, Intern sees own)
- **Auth:** Yes
- **Response:**
```json
{ "donations": [ { ... } ], "msg": "Donations retrieved successfully" }
```

### **GET `/api/donations/leaderboard`**
- **Description:** Fetch leaderboard data (total donations by referral code)
- **Auth:** Yes
- **Response:**
```json
{ "leaderboard": [ { "name": "John Doe", "totalAmount": 5000 }, ... ] }
```

### **GET `/api/donations/by-referral/:referralCode`**
- **Description:** Fetch donations by referral code (Super Admin/Admin only)
- **Auth:** Yes (Super Admin/Admin)
- **Response:**
```json
{ "donations": [ { ... } ] }
```

---

# 6. DASHBOARD ENDPOINTS (`/api/dashboard`)

### **GET `/api/dashboard`**
- **Description:** Get dashboard info for the authenticated user
- **Auth:** Yes
- **Response:**
```json
{ "message": "Hello John, Welcome to your Dashboard!", "user": { ... } }
```

---

## Notes
- All endpoints return errors in the format `{ "msg": "Error message" }`.
- Most endpoints require a valid JWT in the `Authorization` header (see above for which ones).
- Role-based access is enforced for sensitive endpoints (see descriptions).
- For Razorpay integration, ensure your environment variables are set for payment processing.

---

## Contact
For questions or issues, contact the backend maintainers or open an issue in the repository. 