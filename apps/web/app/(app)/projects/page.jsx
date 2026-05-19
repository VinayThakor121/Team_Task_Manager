"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { projectService } from "@/services/projects";
import { userService } from "@/services/users";

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: { memberIds: [] },
  });

  const loadData = async () => {
    setLoading(true);
    const [projectItems, userItems] = await Promise.all([projectService.list(), userService.search()]);
    setProjects(projectItems);
    setUsers(userItems);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    await projectService.create(values);
    reset({ title: "", description: "", memberIds: [] });
    await loadData();
  });

  if (loading) {
    return <LoadingState label="Loading projects..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Projects"
        title="Organize work into execution-ready team spaces"
        description="Create project hubs, assign members, and drill into project-level task planning and AI-assisted delivery."
        action={
          user?.role === "admin" ? (
            <button
              type="submit"
              form="project-form"
              disabled={isSubmitting}
              className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:opacity-70"
            >
              {isSubmitting ? "Creating..." : "Create project"}
            </button>
          ) : null
        }
      />

      {user?.role === "admin" && (
        <form id="project-form" onSubmit={onSubmit} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur lg:grid-cols-[1fr_1fr_0.8fr]">
          <input
            {...register("title", { required: true })}
            placeholder="Project title"
            className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
          <input
            {...register("description")}
            placeholder="Project description"
            className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
          />
          <select
            multiple
            {...register("memberIds")}
            className="min-h-32 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
          >
            {users.filter((member) => member.id !== user.id).map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} ({member.role})
              </option>
            ))}
          </select>
        </form>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        {projects.map((project) => (
          <article key={project._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">{project.title}</h2>
                <p className="mt-2 text-sm text-slate-300">{project.description}</p>
              </div>
              <Link href={`/projects/${project._id}`} className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-100 hover:bg-white/10">
                Open
              </Link>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.members.map((member) => (
                <span key={member.id || member._id} className="rounded-full border border-white/10 bg-slate-950/70 px-3 py-1 text-xs text-slate-200">
                  {member.name}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-slate-500">Updated {formatDate(project.updatedAt)}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
