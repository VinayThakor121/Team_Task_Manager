import { Response, NextFunction } from "express";
import { asyncHandler } from "../utils/async-handler";
import { ApiError } from "../utils/api-error";
import { verifyToken } from "../utils/jwt";
import { User } from "../models/User";
import type { Request } from "express";

export const requireAuth = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
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
