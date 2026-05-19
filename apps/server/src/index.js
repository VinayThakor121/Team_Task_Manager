import { createServer } from "http";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { createApp } from "./app.js";
import { initializeSocket } from "./sockets/index.js";

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
