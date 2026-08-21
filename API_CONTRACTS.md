# PriceLens - Authentication API Contracts & Schema Specification

This document defines the RESTful API endpoints, request payloads, response schemas, and validation contracts required for backend integration with the PriceLens authentication service.

---

## Base URL
`https://api.pricelens.com/v1/auth`

---

## 1. User Login

### Endpoint
`POST /login`

### Request Headers
```http
Content-Type: application/json
```

### Request Payload
```json
{
  "identifier": "name@example.com", // Valid Email OR 10-digit Mobile Number
  "password": "Password123!",
  "rememberMe": true
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "d7a8e9f0c1b2a3...",
    "user": {
      "id": "usr_987654321",
      "fullName": "Alex Johnson",
      "email": "alex.johnson@example.com",
      "mobile": "9876543210",
      "avatarUrl": "https://api.pricelens.com/avatars/usr_987654321.png"
    }
  }
}
```

### Error Responses
- **400 Bad Request** (Validation Error):
```json
{
  "success": false,
  "statusCode": 400,
  "error": "BAD_REQUEST",
  "message": "Identifier must be a valid email or 10-digit mobile number."
}
```
- **401 Unauthorized**:
```json
{
  "success": false,
  "statusCode": 401,
  "error": "UNAUTHORIZED",
  "message": "Invalid credentials."
}
```

---

## 2. User Sign Up (Registration)

### Endpoint
`POST /signup`

### Request Payload
```json
{
  "fullName": "Alex Johnson",
  "email": "alex.johnson@example.com",
  "mobile": "9876543210",
  "password": "Password123!",
  "confirmPassword": "Password123!"
}
```

### Success Response (201 Created)
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Account created successfully",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_987654321",
      "fullName": "Alex Johnson",
      "email": "alex.johnson@example.com",
      "mobile": "9876543210"
    }
  }
}
```

---

## 3. Forgot Password - Step 1: Request OTP

### Endpoint
`POST /forgot-password/request-otp`

### Request Payload
```json
{
  "identifier": "alex.johnson@example.com" // Email OR 10-digit Mobile Number
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Verification OTP has been sent successfully",
  "data": {
    "identifier": "alex.johnson@example.com",
    "otpExpiresInSeconds": 300
  }
}
```

---

## 4. Forgot Password - Step 2: Verify OTP

### Endpoint
`POST /forgot-password/verify-otp`

### Request Payload
```json
{
  "identifier": "alex.johnson@example.com",
  "otp": "123456"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "OTP verified successfully",
  "data": {
    "resetToken": "rst_tok_a1b2c3d4e5f6"
  }
}
```

---

## 5. Forgot Password - Step 3: Reset Password

### Endpoint
`POST /forgot-password/reset`

### Request Payload
```json
{
  "identifier": "alex.johnson@example.com",
  "resetToken": "rst_tok_a1b2c3d4e5f6",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### Success Response (200 OK)
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password updated successfully"
}
```

---

## 6. Google Social Authentication (UI OAuth Integration)

### Endpoint
`POST /google`

### Request Payload
```json
{
  "idToken": "google_oauth2_id_token_string..."
}
```
