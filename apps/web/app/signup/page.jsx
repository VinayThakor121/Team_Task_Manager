"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    try {
      await signup(values);
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
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300">Create account</p>
          <h1 className="mt-4 text-4xl font-semibold text-white">Start preparing with AI interviews.</h1>
          <p className="mt-4 text-sm leading-7 text-slate-300">Signup with your full name, email, and password. Access dashboard, history, profile, and analytics.</p>
        </section>
        <form onSubmit={onSubmit} className="space-y-5 rounded-[1.75rem] border border-white/10 bg-white/5 p-6">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <Input {...register("name", { required: "Full name is required" })} />
            {errors.name && <p className="mt-2 text-xs text-rose-300">{errors.name.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <Input {...register("email", { required: "Email is required" })} />
            {errors.email && <p className="mt-2 text-xs text-rose-300">{errors.email.message}</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Password</label>
            <Input type="password" {...register("password", { required: "Password is required", minLength: 8 })} />
            {errors.password && <p className="mt-2 text-xs text-rose-300">Use at least 8 characters.</p>}
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Confirm password</label>
            <Input
              type="password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) => value === watch("password") || "Passwords must match",
              })}
            />
            {errors.confirmPassword && <p className="mt-2 text-xs text-rose-300">{errors.confirmPassword.message}</p>}
          </div>
          {error && <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</p>}
          <Button type="submit" disabled={isSubmitting} className="w-full bg-violet-500 shadow-lg shadow-violet-500/30 hover:bg-violet-400">
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
          <p className="text-sm text-slate-400">
            Already have an account? <Link href="/login" className="text-violet-300">Sign in</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
