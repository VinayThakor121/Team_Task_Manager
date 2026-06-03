"use client";

import { AuthProvider } from "@/context/auth-context";

export const Providers = ({ children }) => <AuthProvider>{children}</AuthProvider>;
