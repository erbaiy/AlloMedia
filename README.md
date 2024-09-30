# alloMedia Backend Authentication

## Overview

This project implements the backend authentication system for alloMedia, a food delivery application. It uses JSON Web Tokens (JWT) for secure authentication and includes features such as user registration, login with two-factor authentication (2FA), and password reset functionality.

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [JWT Implementation](#jwt-implementation)
- [Two-Factor Authentication](#two-factor-authentication)
- [Database Schema](#database-schema)
- [Testing](#testing)
- [Security Measures](#security-measures)
- [Error Handling](#error-handling)

## Features

- User registration with email verification
- Secure login with JWT
- Two-factor authentication (2FA) using email or SMS
- Password reset functionality
- Role-based access control (Manager, Client, Delivery Person)

## Technologies

- Node.js
- Express.js
- MongoDB with Mongoose
- JSON Web Tokens (jsonwebtoken)
- bcryptjs for password hashing
- Nodemailer for email services
- Jest for testing

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/erbaiy/AlloMedia/tree/devlop
   ```

2. Install dependencies:
   ```
   cd allomedia-backend-auth
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_SECRET=your_jwt_secret
   EMAIL_SERVICE=your_email_service_config
   SMS_SERVICE=your_sms_service_config
   FRONTEND_URL=your_front_end_url
   ```

4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

- POST `/api/auth/register`: Register a new user
- POST `/api/auth/login`: Authenticate a user and receive OTP
- POST `/api/auth/verify-otp`: Verify OTP and receive JWT
- POST `/api/auth/forgetpassword`: Request password reset
- POST `/api/auth/resetpassword/:token`: Reset password

For detailed API documentation, refer to our [API Documentation](postmanDoc).

## JWT Implementation

We use JSON Web Tokens for maintaining user sessions. Here's how it works:

1. Upon successful login and 2FA verification, a JWT is generated containing the user's ID and role.
2. The token is signed using a secret key (JWT_SECRET) and has an expiration time.
3. For protected routes, the JWT must be included in the Authorization header of the request.
4. The server verifies the token's signature and expiration before granting access.

Example of JWT generation:

```javascript
const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}
```

## Two-Factor Authentication

Our 2FA system works as follows:

1. After successful password verification, a 6-digit OTP is generated.
2. The OTP is sent to the user via email or SMS.
3. The user must provide this OTP to complete the login process.
4. Upon OTP verification, a JWT is issued for subsequent requests.

## Database Schema

User Model:

```javascript
{
  name: String,
  email: String,
  password: String,
  phoneNumber: String,
  address: String,
  role: String,
  isVerified: Boolean,
  verificationToken: String,
  resetPasswordToken: String,
  resetPasswordExpires: Date
}
```

## Testing

Run tests using:

```
npm test
```

Our test suite includes:
- Unit tests for authentication functions
- Integration tests for API endpoints
- JWT verification tests

## Security Measures

- Passwords are hashed using bcryptjs
- JWT secrets are stored as environment variables
- Input validation to prevent injection attacks
- Rate limiting on authentication endpoints
- HTTPS enforcement in production

## Error Handling

We use a centralized error handling middleware. Common error responses include:

- 400 Bad Request: Invalid input data
- 401 Unauthorized: Invalid credentials
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side issues

## Deployment

For deployment instructions, please refer to our [Deployment Guide](link-to-deployment-guide).

---

For more detailed information or if you encounter any issues, please refer to our [Full Documentation](link-to-full-docs) or open an issue on this repository.