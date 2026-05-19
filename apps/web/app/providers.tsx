"use client";

import { AuthProvider } from "@/context/auth-context";
import { SocketProvider } from "@/socket/socket-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthProvider>
      <SocketProvider>{children}</SocketProvider>
    </AuthProvider>
  );
};
