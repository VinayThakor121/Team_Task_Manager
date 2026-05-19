import { Server } from "socket.io";
import { env } from "../config/env.js";
import { verifyToken } from "../utils/jwt.js";

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  const onlineUsers = new Set();

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.replace("Bearer ", "");
      if (!token) {
        return next(new Error("Unauthorized"));
      }
      const { userId } = verifyToken(token);
      socket.data.userId = userId;
      return next();
    } catch (error) {
      return next(error);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;
    onlineUsers.add(userId);
    socket.join(`user:${userId}`);
    io.emit("presence:update", Array.from(onlineUsers));

    socket.on("conversation:join", (conversationId) => {
      socket.join(conversationId);
    });
    socket.on("conversation:leave", (conversationId) => {
      socket.leave(conversationId);
    });
    socket.on("message:typing", (conversationId) => {
      socket.to(conversationId).emit("conversation:typing", { conversationId, userId });
    });
    socket.on("message:stop-typing", (conversationId) => {
      socket.to(conversationId).emit("conversation:stop-typing", { conversationId, userId });
    });
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("presence:update", Array.from(onlineUsers));
    });
  });

  return io;
};
