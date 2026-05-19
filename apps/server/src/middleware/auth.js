import { asyncHandler } from "../utils/async-handler.js";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";
import { User } from "../models/User.js";

export const requireAuth = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;
  if (!token) {
    throw new ApiError(401, "Authentication required");
  }
  const { userId } = verifyToken(token);
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(401, "Invalid token");
  }
  req.user = user;
  next();
});
