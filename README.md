
# Course-Aid: The Learning Management System (LMS)

This is the backend implementation for the **Course-Aid** platform. The backend manages user authentication, email verification, course management, and payment functionality using Razorpay. It is built using **Node.js**, **Express**, and **MongoDB**.

---

## Features

1. **User Authentication**:
   - Register, login, and logout.
   - Email verification with a unique verification link.
   - Forgot password and password reset functionality.
   - Role-based access control (Admin, Instructor, User).

2. **Payment Gateway Integration**:
   - Razorpay integration for creating and verifying payments.
   - Webhook support to handle payment notifications.

3. **Secure Token Management**:
   - Implements access and refresh tokens for secure session management.
   - Token expiration and refresh capabilities.

4. **Course Management**:
   - Courses can be uploaded by instructors and accessed by users.

5. **Error Handling**:
   - Centralized error handling using custom middleware.

---

## Tech Stack

- **Backend Framework**: Node.js, Express.js
- **Database**: MongoDB (Mongoose for schema modeling)
- **Authentication**: JWT (JSON Web Tokens), bcrypt for password hashing
- **Email Service**: Nodemailer
- **Payment Gateway**: Razorpay
- **Validation**: Joi

---

## Prerequisites

1. **Node.js**: Ensure you have Node.js installed.
2. **MongoDB**: Make sure you have a running MongoDB instance.
3. **Razorpay Account**: Create an account on Razorpay and get your API keys.
4. **Environment Variables**: Configure the following variables in a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_ACCESS_TOKEN=your_jwt_access_secret
JWT_REFRESH_TOKEN=your_jwt_refresh_secret
JWT_ACCESS_TOKEN_EXPIRY=15m
JWT_REFRESH_TOKEN_EXPIRY=7d
RESET_TOKEN_EXPIRY=3600000 # 1 hour in milliseconds
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
WEBHOOK_SECRET=your_webhook_secret
```

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/sujitwagh9/Course-Aid.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Course-Aid
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the application:
   ```bash
   npm start
   ```

---

## API Endpoints

### **Authentication**

- **Register**: `POST /api/users/register`
- **Login**: `POST /api/users/login`
- **Verify Email**: `GET /api/users/verify-email?token=token`
- **Forgot Password**: `POST /api/users/forgot-password`
- **Reset Password**: `POST /api/users/reset-password`

### **Payment**

- **Create Order**: `POST /api/payment/create-order`
- **Verify Payment**: `POST /api/payment/verify-payment`
- **Webhook**: `POST /api/payment/webhook`

---

## Testing the API with Postman

1. Import the Postman collection (if available) or manually test each endpoint.
2. Use environment variables for keys like `token` and `order_id` to simplify testing.
3. Simulate Razorpay events using the Razorpay dashboard for webhooks.

---

## Razorpay Integration

1. **Create Order**:
   - Generates a new Razorpay order ID for payments.
2. **Verify Payment**:
   - Validates Razorpay payment signature.
3. **Webhooks**:
   - Handles asynchronous notifications from Razorpay (e.g., `payment.captured`).

---


## Future Improvements


1. Add support for subscription-based payments.
2. Implement analytics and reporting for payments and user activity.
3. Enhance security by implementing two-factor authentication (2FA).


## Contributors

- **Sujit Wagh** - Backend Developer

---

## Acknowledgements

- [Razorpay Documentation](https://razorpay.com/docs/)
- [Node.js](https://nodejs.org/)
- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
