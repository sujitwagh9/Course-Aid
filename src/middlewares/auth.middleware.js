import jwt from "jsonwebtoken";
import ApiError from "../utils/apiError.js";

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return next(new ApiError(401, "Access token is missing!"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return next(new ApiError(401, "Invalid or expired access token!"));
  }
};

export default authenticateUser;
