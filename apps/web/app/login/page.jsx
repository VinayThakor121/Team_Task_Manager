"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "admin@teamtaskmanager.dev",
      password: "Password123!",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      await login(values);
      router.replace("/dashboard");
    } catch (submitError) {
      setError("Unable to sign in. Please verify your credentials.");
      console.error(submitError);
    }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-16">
      <div className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur lg:grid-cols-2 lg:p-10">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-violet-300">Welcome back</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Sign in to manage your team workspace.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Access your dashboard, manage projects, generate AI subtasks, and collaborate with your team in real time.
          </p>
          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm text-slate-300">
            Demo admin: <strong className="text-white">admin@teamtaskmanager.dev</strong><br />
            Demo member: <strong className="text-white">member@teamtaskmanager.dev</strong><br />
            Password: <strong className="text-white">Password123!</strong>
          </div>
        </section>
        <form onSubmit={onSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input
              {...register("email", { required: "Email is required" })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
            />
            {errors.email && <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
            />
            {errors.password && <p className="mt-2 text-xs text-rose-300">{errors.password.message}</p>}
          </div>
          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:opacity-70"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
          <p className="text-sm text-slate-400">
            Need an account? <Link href="/register" className="text-violet-300">Create one</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
