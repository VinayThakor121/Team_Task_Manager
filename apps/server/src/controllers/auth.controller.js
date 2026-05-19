import { authService } from "../services/auth.service.js";

export const authController = {
  async register(req, res) {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  },
  async login(req, res) {
    const result = await authService.login(req.body);
    res.json(result);
  },
  async me(req, res) {
    res.json({ user: authService.serializeUser(req.user) });
  },
};
