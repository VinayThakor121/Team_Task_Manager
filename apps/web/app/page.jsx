"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = window.localStorage.getItem("prepwise_token");
    router.replace(token ? "/dashboard" : "/login");
  }, [router]);

  return <main className="p-10 text-center text-slate-300">Redirecting...</main>;
}
