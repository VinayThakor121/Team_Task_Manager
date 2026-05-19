"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusPill } from "@/components/common/status-pill";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { aiService } from "@/services/ai";
import { projectService } from "@/services/projects";
import { taskService } from "@/services/tasks";
import { userService } from "@/services/users";
import type { Project, Task, User } from "@/types";

interface ProjectDetailPageProps {
  params: Promise<{ id: string }>;
}

interface TaskFormValues {
  title: string;
  description: string;
  assignedTo: string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Completed";
  dueDate: string;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { user } = useAuth();
  const [projectId, setProjectId] = useState("");
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [aiSubtasks, setAiSubtasks] = useState<string[]>([]);
  const [selectedSubtasks, setSelectedSubtasks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting },
  } = useForm<TaskFormValues>({
    defaultValues: {
      priority: "Medium",
      status: "Todo",
    },
  });

  const watchedTitle = watch("title");
  const watchedDescription = watch("description");

  const loadData = async (id: string) => {
    setLoading(true);
    const [{ item, tasks: projectTasks }, userItems] = await Promise.all([projectService.getById(id), userService.search()]);
    setProject(item);
    setTasks(projectTasks);
    setUsers(userItems);
    setLoading(false);
  };

  useEffect(() => {
    params.then(({ id }) => {
      setProjectId(id);
      loadData(id);
    });
  }, [params]);

  const projectMembers = useMemo(() => {
    const memberIds = new Set(project?.members.map((member) => member.id || member._id));
    return users.filter((candidate) => memberIds.has(candidate.id));
  }, [project?.members, users]);

  const onGenerateSubtasks = async () => {
    setAiLoading(true);
    const subtasks = await aiService.generateSubtasks({
      title: watchedTitle || project?.title || "New task",
      description: watchedDescription,
    });
    setAiSubtasks(subtasks);
    setSelectedSubtasks(subtasks);
    setAiLoading(false);
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!projectId) return;

    await taskService.create({
      ...values,
      projectId,
      dueDate: new Date(values.dueDate).toISOString(),
      subtasks: selectedSubtasks,
    });
    reset({ title: "", description: "", assignedTo: "", priority: "Medium", status: "Todo", dueDate: "" });
    setAiSubtasks([]);
    setSelectedSubtasks([]);
    await loadData(projectId);
  });

  if (loading) {
    return <LoadingState label="Loading project details..." />;
  }

  if (!project) {
    return <LoadingState label="Project not found." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Project workspace"
        title={project.title}
        description={project.description}
        action={<p className="text-sm text-slate-400">Members: {project.members.length}</p>}
      />

      {user?.role === "admin" && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <form onSubmit={onSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Create a task</h2>
              <button
                type="button"
                onClick={onGenerateSubtasks}
                disabled={aiLoading}
                className="rounded-full border border-violet-400/30 bg-violet-500/15 px-4 py-2 text-sm font-medium text-violet-100 hover:bg-violet-500/25 disabled:opacity-70"
              >
                {aiLoading ? "Generating..." : "Generate AI Subtasks"}
              </button>
            </div>
            <input {...register("title", { required: true })} placeholder="Task title" className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400" />
            <textarea {...register("description")} placeholder="Task description" rows={4} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400" />
            <div className="grid gap-4 md:grid-cols-2">
              <select {...register("assignedTo", { required: true })} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400">
                <option value="">Assign to member</option>
                {projectMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <input {...register("dueDate", { required: true })} type="date" className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <select {...register("priority")} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400">
                {['Low', 'Medium', 'High'].map((priority) => (
                  <option key={priority} value={priority}>{priority}</option>
                ))}
              </select>
              <select {...register("status")} className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400">
                {['Todo', 'In Progress', 'Completed'].map((status) => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400 disabled:opacity-70">
              {isSubmitting ? "Saving..." : "Create task"}
            </button>
          </form>
          <aside className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">AI task breakdown</h2>
            <p className="mt-2 text-sm text-slate-300">Generate structured subtasks for complex work, then include the ones you want before creating the task.</p>
            <div className="mt-5 space-y-3">
              {aiSubtasks.length === 0 ? (
                <p className="rounded-2xl border border-dashed border-white/10 bg-slate-950/60 p-4 text-sm text-slate-400">
                  Trigger the AI assistant to suggest implementation subtasks.
                </p>
              ) : (
                aiSubtasks.map((subtask) => {
                  const selected = selectedSubtasks.includes(subtask);
                  return (
                    <button
                      key={subtask}
                      type="button"
                      onClick={() =>
                        setSelectedSubtasks((current) =>
                          current.includes(subtask) ? current.filter((item) => item !== subtask) : [...current, subtask],
                        )
                      }
                      className={`block w-full rounded-2xl border px-4 py-3 text-left text-sm ${
                        selected
                          ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                          : "border-white/10 bg-slate-950/60 text-slate-300"
                      }`}
                    >
                      {subtask}
                    </button>
                  );
                })
              )}
            </div>
          </aside>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        {tasks.map((task) => {
          const isOverdue = task.status !== "Completed" && new Date(task.dueDate).getTime() < Date.now();
          return (
            <article key={task._id} className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-semibold text-white">{task.title}</h2>
                <StatusPill value={task.status} />
                <StatusPill value={task.priority} />
              </div>
              <p className="mt-3 text-sm text-slate-300">{task.description}</p>
              {task.subtasks?.length ? (
                <ul className="mt-4 space-y-2 rounded-2xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                  {task.subtasks.map((subtask) => (
                    <li key={subtask}>• {subtask}</li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                <span>Assignee {task.assignedTo.name}</span>
                <span>Due {formatDate(task.dueDate)}</span>
                {isOverdue && <span className="text-rose-300">Overdue</span>}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
