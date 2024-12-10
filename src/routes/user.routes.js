import express from "express";
import { registerUser, loginUser, refreshAccessToken, forgotPassword, resetPassword,verifyEmail} from "../controllers/userAuth.controller.js";
import authenticateUser from "../middlewares/auth.middleware.js";
import authorizeRoles from "../middlewares/authorizeRoles.middleware.js";


const router = express.Router();

// Public Routes
router.post("/register", registerUser); // User registration
router.post("/login", loginUser); // User login
router.post("/refresh-token", refreshAccessToken); // Refresh access token
router.post("/forgot-password", forgotPassword); // Forgot password request
router.post("/reset-password", resetPassword); // Reset password
router.get('/verify-email', verifyEmail);


export default router;
