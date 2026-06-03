"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/interview/create", label: "Create Interview" },
  { href: "/history", label: "History" },
  { href: "/analytics", label: "Analytics" },
  { href: "/profile", label: "Profile" },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="rounded-3xl border border-white/10 bg-slate-950/70 p-5 shadow-2xl shadow-slate-950/30 backdrop-blur">
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">Interview Prep</p>
        <h2 className="mt-3 text-2xl font-semibold text-white">Prepwise Flask</h2>
        <p className="mt-2 text-sm text-slate-400">AI mock interviews, analytics, transcript feedback, and leaderboard.</p>
      </div>
      <nav className="space-y-2">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active ? "bg-violet-500 text-white shadow-lg shadow-violet-500/20" : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
