"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/context/auth-context";
import { authService } from "@/services/auth";

export default function ProfilePage() {
  const { user, refreshUser } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const profileForm = useForm({
    values: {
      name: user?.name || "",
      email: user?.email || "",
    },
  });

  const passwordForm = useForm();

  const updateProfile = profileForm.handleSubmit(async (values) => {
    setError("");
    setMessage("");
    try {
      await authService.updateProfile(values);
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to update profile.");
    }
  });

  const changePassword = passwordForm.handleSubmit(async (values) => {
    setError("");
    setMessage("");
    try {
      await authService.changePassword(values);
      passwordForm.reset();
      setMessage("Password changed successfully.");
    } catch (requestError) {
      setError(requestError?.response?.data?.message || "Unable to change password.");
    }
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Profile"
        title="Manage your account"
        description="Update your profile details and account password."
      />

      {message ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-200">{message}</p> : null}
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      <section className="grid gap-6 xl:grid-cols-2">
        <form onSubmit={updateProfile} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Profile details</h2>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Full name</label>
            <input {...profileForm.register("name", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Email</label>
            <input {...profileForm.register("email", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <button className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white">Save profile</button>
        </form>

        <form onSubmit={changePassword} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Change password</h2>
          <div>
            <label className="mb-2 block text-sm text-slate-300">Current password</label>
            <input type="password" {...passwordForm.register("currentPassword", { required: true })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <div>
            <label className="mb-2 block text-sm text-slate-300">New password</label>
            <input type="password" {...passwordForm.register("newPassword", { required: true, minLength: 8 })} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white" />
          </div>
          <button className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white">Change password</button>
        </form>
      </section>
    </div>
  );
}
