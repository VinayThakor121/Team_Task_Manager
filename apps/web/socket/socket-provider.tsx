"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io, type Socket } from "socket.io-client";
import { useAuth } from "@/context/auth-context";

interface SocketContextValue {
  socket: Socket | null;
  onlineUserIds: string[];
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  onlineUserIds: [],
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([]);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/api$/, "");
    const nextSocket = io(baseUrl, {
      auth: { token },
    });

    nextSocket.on("presence:update", (userIds: string[]) => {
      setOnlineUserIds(userIds);
    });

    setSocket(nextSocket);

    return () => {
      nextSocket.disconnect();
    };
  }, [token]);

  const value = useMemo(() => ({ socket, onlineUserIds }), [onlineUserIds, socket]);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
