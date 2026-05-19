import bcrypt from "bcrypt";
import { User } from "../models/User.js";
import { ApiError } from "../utils/api-error.js";
import { signToken } from "../utils/jwt.js";

const sanitizeUser = (user) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  async register(payload) {
    const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
    if (existingUser) {
      throw new ApiError(409, "A user with this email already exists");
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = await User.create({
      ...payload,
      email: payload.email.toLowerCase(),
      password: hashedPassword,
      role: payload.role ?? "member",
    });
    return {
      token: signToken(String(user._id)),
      user: sanitizeUser(user),
    };
  },

  async login(payload) {
    const user = await User.findOne({ email: payload.email.toLowerCase() }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }
    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid email or password");
    }
    return {
      token: signToken(String(user._id)),
      user: sanitizeUser(user),
    };
  },

  serializeUser: sanitizeUser,
};
