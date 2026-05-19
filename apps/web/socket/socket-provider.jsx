"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "@/context/auth-context";

const SocketContext = createContext({
  socket: null,
  onlineUserIds: [],
});

export const SocketProvider = ({ children }) => {
  const { token } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUserIds, setOnlineUserIds] = useState([]);

  useEffect(() => {
    if (!token) {
      setSocket(null);
      return;
    }

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api").replace(/\/api$/, "");
    const nextSocket = io(baseUrl, {
      auth: { token },
    });

    nextSocket.on("presence:update", (userIds) => {
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
