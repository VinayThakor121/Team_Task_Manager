import bcrypt from "bcrypt";
import { User } from "../models/User";
import { ApiError } from "../utils/api-error";
import { signToken } from "../utils/jwt";

const sanitizeUser = (user: { _id: unknown; name: string; email: string; role: "admin" | "member" }) => ({
  id: String(user._id),
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  async register(payload: { name: string; email: string; password: string; role?: "admin" | "member" }) {
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

  async login(payload: { email: string; password: string }) {
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
