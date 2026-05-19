import type { Server as HttpServer } from "http";
import { Server } from "socket.io";
import { env } from "../config/env";
import { verifyToken } from "../utils/jwt";

export const initializeSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: env.clientUrl,
      credentials: true,
    },
  });

  const onlineUsers = new Set<string>();

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
      return next(error as Error);
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    onlineUsers.add(userId);
    socket.join(`user:${userId}`);
    io.emit("presence:update", Array.from(onlineUsers));

    socket.on("conversation:join", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on("conversation:leave", (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on("message:typing", (conversationId: string) => {
      socket.to(conversationId).emit("conversation:typing", { conversationId, userId });
    });

    socket.on("message:stop-typing", (conversationId: string) => {
      socket.to(conversationId).emit("conversation:stop-typing", { conversationId, userId });
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("presence:update", Array.from(onlineUsers));
    });
  });

  return io;
};
