import { User } from "../models/User.js";

export const userController = {
  async search(req, res) {
    const search = String(req.query.search ?? "").trim();
    const users = await User.find({
      ...(search
        ? {
            $or: [
              { name: { $regex: search, $options: "i" } },
              { email: { $regex: search, $options: "i" } },
            ],
          }
        : {}),
    })
      .select("name email role")
      .sort({ name: 1 })
      .limit(20);
    res.json({ items: users.map((user) => ({ ...user.toObject(), id: String(user._id) })) });
  },
};
