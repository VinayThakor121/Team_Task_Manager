import type { RequestHandler } from "express";
import { ApiError } from "../utils/api-error";

export const authorize = (...roles: Array<"admin" | "member">): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(new ApiError(403, "You do not have permission to perform this action"));
    }

    return next();
  };
};
