import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { authRouter } from "./routes/auth.routes";
import { userRouter } from "./routes/user.routes";
import { projectRouter } from "./routes/project.routes";
import { taskRouter } from "./routes/task.routes";
import { dashboardRouter } from "./routes/dashboard.routes";
import { aiRouter } from "./routes/ai.routes";
import { chatRouter } from "./routes/chat.routes";
import { messageRouter } from "./routes/message.routes";
import { errorHandler } from "./middleware/error-handler";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    }),
  );
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
