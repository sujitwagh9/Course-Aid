import { User } from "../models/user.model.js";
import ApiError from "../utils/apiError.js";
import crypto from "crypto"
import sendEmail from "../utils/emailSender.js";
import jwt from "jsonwebtoken"
import Joi from "joi";





const isTokenExpired = (token) => {
    try {
      const decoded = jwt.decode(token);  
      if (!decoded || !decoded.exp) {
        return true; 
      }
      return decoded.exp * 1000 < Date.now(); 
    } catch (error) {
      return true;  // Invalid token or other error
    }
  };
  
  


  const generateAccessAndRefreshTokens = async (userId) => {
    try {
      const user = await User.findById(userId);
      // console.log(user)
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      // console.log("Access Token: ")
      const accessToken = user.generateAccessToken();
      // console.log(accessToken)
      const refreshToken = user.generateRefreshToken();
  
      if (user.refreshTokens && user.refreshTokens.length > 0) {
        user.refreshTokens = user.refreshTokens.filter(token => !isTokenExpired(token));
      } else {
        user.refreshTokens = [];
      }
  
      user.refreshTokens.push(refreshToken);
      await user.save({ validateBeforeSave: false });
  
      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(500, "Error while generating tokens",error);
    }
  };
  
  const verifyEmail = async (req, res, next) => {
    const { token } = req.query;
  
    if (!token) {
      return next(new ApiError(400, 'Token is required'));
    }
  
    try {
      // Find user by verification token and ensure it hasn't expired
      const user = await User.findOne({
        emailVerificationToken: token,
        emailVerificationTokenExpires: { $gt: Date.now() }, // Check if token is not expired
      });
  
      if (!user) {
        return next(new ApiError(400, 'Invalid or expired verification token'));
      }
  
      // Verify email and clear verification token fields
      user.emailVerified = true;
      user.emailVerificationToken = undefined;
      user.emailVerificationTokenExpires = undefined;
      await user.save();
  
      res.status(200).json({ message: 'Email verified successfully!' });
    } catch (error) {
      next(new ApiError(500, 'Error while verifying email'));
    }
  };

  const registerUser = async (req, res, next) => {
    // Define Joi schema
    const schema = Joi.object({
      username: Joi.string().min(3).max(30).required(),
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "edu"] } })
        .required(),
      password: Joi.string().min(6).max(128).required(),
      role: Joi.string().valid("user", "instructor", "admin").required(),
      profilePicture: Joi.string().uri().optional(),
      bio: Joi.string().max(500).optional(),
    });
  
    // Validate request body
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      return next(new ApiError(400, error.details.map((err) => err.message).join(", ")));
    }
  
    // Destructure validated request data
    const { username, email, password, role, profilePicture, bio } = req.body;
  
    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username: username }, { email: email }],
      });
  
      if (existingUser) {
        return next(new ApiError(400, "User already exists!"));
      }
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password,
        role,
        profilePicture,
        bio,
        emailVerified: false,
      });
      const verificationToken = crypto.randomBytes(32).toString('hex');
      newUser.emailVerificationToken = verificationToken;
      newUser.emailVerificationTokenExpires = Date.now() + 360000;
  
      // Save the new user to the database
      await newUser.save();


  
      const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      newUser.email,
      'Email Verification for Your Account',
      `Please verify your email address by clicking the link below:\n\n${verificationLink}\n\nThis link will expire in 1 hour.`
    );

      res.status(201).json({
        message: 'User registered successfully. Please check your email for verification.',
      });
  
    } catch (error) {
      
      // Catch unexpected errors and pass them to the error handler
      next(new ApiError(500, "Error while registering user", error));
    }
  };



  const loginUser = async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return next(new ApiError(400, "All credentials are required!!"));
    }
  
    try {
      const user = await User.findOne({ username });
  
      if (!user) {
        return next(new ApiError(404, "User not found"));
      }
  
      // Check if the email is verified
      if (!user.emailVerified) {
        return next(new ApiError(401, "Please verify your email before logging in"));
      }
  
      const isPasswordValid = await user.isPasswordCorrect(password);
  
      if (!isPasswordValid) {
        return next(new ApiError(401, "Incorrect password"));
      }
  
      const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
  
      res.status(200).json({
        message: "Login successful",
        accessToken,
        refreshToken,
      });
    } catch (error) {
      next(new ApiError(500, "Error while logging in"));
    }
  };
  
//refreshAccessToken

const refreshAccessToken = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(400, "Refresh token is required"));
  }

  try {
    jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return next(new ApiError(401, "Invalid refresh token"));
      }

      const user = await User.findById(decoded._id);
      if (!user || !user.refreshTokens.includes(refreshToken)) {
        return next(new ApiError(403, "Refresh token mismatch"));
      }

      const accessToken = user.generateAccessToken();
      res.status(200).json({ accessToken });
    });
  } catch (error) {
    next(new ApiError(500, "Error while refreshing token"));
  }
};




const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new ApiError(400, "Email is required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ApiError(404, "User not found"));
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    // Save hashed token and expiration to the database
    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpires = Date.now() + parseInt(process.env.RESET_TOKEN_EXPIRY); // 1 hour
    await user.save();

    // Send reset email
    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendEmail(
      user.email,
      "COURSE-AID: Password Reset Request",
      `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you didn't request this, please ignore this email.`
    );

    res.status(200).json({ message: "Reset link sent to your email" });
  } catch (error) {
    next(new ApiError(500, "Error while processing request"));
  }
};


const resetPassword = async (req, res, next) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return next(new ApiError(400, "Token and new password are required"));
  }

  try {
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Find user by token and ensure token hasn't expired
    const user = await User.findOne({
      resetPasswordToken: tokenHash,
      resetPasswordExpires: { $gt: Date.now() }, // Check token expiration
    });

    if (!user) {
      return next(new ApiError(400, "Invalid or expired reset token"));
    }

    // Update user's password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    next(new ApiError(500, "Error while resetting password"));
  }
};

const logoutUser = async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return next(new ApiError(400, "Refresh token is required"));
  }
};




export { registerUser, loginUser, refreshAccessToken, forgotPassword, resetPassword, verifyEmail, logoutUser};
