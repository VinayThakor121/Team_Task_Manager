"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";

interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
  role: "admin" | "member";
}

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      role: "member",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      await registerUser(values);
      router.replace("/dashboard");
    } catch (submitError) {
      setError("Unable to register. Try a different email address.");
      console.error(submitError);
    }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center px-4 py-16">
      <div className="grid w-full gap-8 rounded-[2rem] border border-white/10 bg-slate-950/60 p-8 shadow-2xl shadow-slate-950/30 backdrop-blur lg:grid-cols-2 lg:p-10">
        <section>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Create your workspace</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Spin up a recruiter-ready task management experience.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">
            Admins can create projects, assign tasks, manage group chats, and monitor analytics. Members can execute work, update statuses, and collaborate instantly.
          </p>
        </section>
        <form onSubmit={onSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input
              {...register("name", { required: "Name is required" })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
            />
            {errors.name && <p className="mt-2 text-xs text-rose-300">{errors.name.message}</p>}
          </div>
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
              {...register("password", { required: "Password is required", minLength: 8 })}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
            />
            {errors.password && <p className="mt-2 text-xs text-rose-300">Use at least 8 characters.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Role</label>
            <select
              {...register("role")}
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-violet-500 px-4 py-3 font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:opacity-70"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
          <p className="text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-violet-300">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
