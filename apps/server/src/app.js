import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { projectRouter } from "./routes/project.routes.js";
import { taskRouter } from "./routes/task.routes.js";
import { dashboardRouter } from "./routes/dashboard.routes.js";
import { aiRouter } from "./routes/ai.routes.js";
import { chatRouter } from "./routes/chat.routes.js";
import { messageRouter } from "./routes/message.routes.js";
import { errorHandler } from "./middleware/error-handler.js";

export const createApp = () => {
  const app = express();
  app.use(cors({ origin: env.clientUrl, credentials: true }));
  app.use(express.json());
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });
  app.use("/api/auth", authRouter);
  app.use("/api/users", userRouter);
  app.use("/api/projects", projectRouter);
  app.use("/api/tasks", taskRouter);
  app.use("/api/dashboard", dashboardRouter);
  app.use("/api/ai", aiRouter);
  app.use("/api/chat", chatRouter);
  app.use("/api/message", messageRouter);
  app.use(errorHandler);
  return app;
};
