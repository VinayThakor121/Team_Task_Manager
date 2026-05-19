import { createServer } from "http";
import { connectDb } from "./config/db";
import { env } from "./config/env";
import { createApp } from "./app";
import { initializeSocket } from "./sockets";

const start = async () => {
  await connectDb();
  const app = createApp();
  const server = createServer(app);
  const io = initializeSocket(server);
  app.set("io", io);

  server.listen(env.port, () => {
    console.log(`Server listening on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
