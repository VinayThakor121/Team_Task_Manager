"use client";

import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusPill } from "@/components/common/status-pill";
import { useAuth } from "@/context/auth-context";
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/task-options";
import { formatDate } from "@/lib/utils";
import { taskService } from "@/services/tasks";
import type { Task } from "@/types";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: "", priority: "", search: "" });

  const loadTasks = useCallback(async (nextFilters: typeof filters) => {
    setLoading(true);
    const result = await taskService.list(
      Object.fromEntries(Object.entries(nextFilters).filter(([, value]) => value)),
    );
    setTasks(result.items);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTasks(filters);
  }, [filters, loadTasks]);

  const updateStatus = async (task: Task, status: Task["status"]) => {
    await taskService.update(task._id, { status });
    await loadTasks(filters);
  };

  const removeTask = async (id: string) => {
    await taskService.remove(id);
    await loadTasks(filters);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="Prioritize execution with powerful filters"
        description="Filter by status, priority, due date, or assignee while keeping member updates fast and secure."
      />

      <section className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur md:grid-cols-3">
        <select
          value={filters.status}
          onChange={(event) => {
            setFilters((current) => ({ ...current, status: event.target.value }));
          }}
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
        >
          <option value="">All statuses</option>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <select
          value={filters.priority}
          onChange={(event) => {
            setFilters((current) => ({ ...current, priority: event.target.value }));
          }}
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
        >
          <option value="">All priorities</option>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>
        <input
          value={filters.search}
          onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
          placeholder="Search tasks"
          className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
        />
      </section>

      {loading ? (
        <LoadingState label="Loading tasks..." />
      ) : (
        <section className="space-y-4">
          {tasks.map((task) => {
            const isOverdue = task.status !== "Completed" && new Date(task.dueDate).getTime() < Date.now();
            return (
              <article key={task._id} className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-white">{task.title}</h2>
                    <StatusPill value={task.status} />
                    <StatusPill value={task.priority} />
                    {isOverdue && <StatusPill value="Overdue" />}
                  </div>
                  <p className="mt-3 text-sm text-slate-300">{task.description}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                    Assigned to {task.assignedTo.name} • Due {formatDate(task.dueDate)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <select
                    value={task.status}
                    onChange={(event) => updateStatus(task, event.target.value as Task["status"])}
                    className="rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-violet-400"
                  >
                    {TASK_STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {user?.role === "admin" ? (
                    <button
                      type="button"
                      onClick={() => removeTask(task._id)}
                      className="rounded-full border border-rose-400/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-100 hover:bg-rose-500/20"
                    >
                      Delete
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
