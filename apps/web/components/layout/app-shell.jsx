"use client";

import { useRouter, usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { useAuth } from "@/context/auth-context";
import { getInitials } from "@/lib/utils";

export const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:grid lg:grid-cols-[280px_1fr]">
      <Sidebar />
      <div className="space-y-6">
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl shadow-slate-950/20 backdrop-blur md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">AI Interview Platform</p>
            <h1 className="mt-2 text-xl font-semibold text-white">{pathname.replace("/", "") || "dashboard"}</h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-slate-950/70 px-3 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500 font-semibold text-white">
                {user ? getInitials(user.name) : "PW"}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{user?.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.replace("/login");
                }}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300 hover:bg-white/10"
              >
                Logout
              </button>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
};
