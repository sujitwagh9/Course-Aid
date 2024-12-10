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
// Protected Routes (Requires Authentication)
router.get("/profile", authenticateUser, (req, res) => {
  res.json({ user: req.user }); // View logged-in user's profile
});

// Admin-only Route (Example: Getting all instructors)
router.get(
  "/instructors",
  authenticateUser,
  authorizeRoles("admin"), // Only admin can access
  async (req, res, next) => {
    try {
      const instructors = await User.find({ role: "instructor" }, { password: 0, refreshTokens: 0 });
      res.status(200).json({
        message: "Instructors retrieved successfully",
        instructors,
      });
    } catch (error) {
      next(new ApiError(500, "Error retrieving instructors"));
    }
  }
);

export default router;
