"use client";

import { useEffect, useState } from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { StatusPill } from "@/components/common/status-pill";
import { dashboardService } from "@/services/dashboard";
import { formatDate } from "@/lib/utils";
import type { DashboardSummary } from "@/types";

const metricCards = [
  { key: "totalTasks", label: "Total tasks" },
  { key: "completedTasks", label: "Completed" },
  { key: "pendingTasks", label: "Pending" },
  { key: "overdueTasks", label: "Overdue" },
  { key: "assignedToMe", label: "Assigned to me" },
] as const;

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingState label="Loading dashboard..." />;
  }

  if (!summary) {
    return <LoadingState label="No dashboard data available yet." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Track momentum across projects and conversations"
        description="Review priorities, recent activity, task completion, and recent chat updates from a single executive view."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {metricCards.map((card) => (
          <article key={card.key} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur">
            <p className="text-sm text-slate-400">{card.label}</p>
            <p className="mt-4 text-3xl font-semibold text-white">{summary.metrics[card.key]}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
          <h2 className="text-lg font-semibold text-white">Recent activity</h2>
          <div className="mt-5 space-y-4">
            {summary.recentTasks.map((task) => (
              <div key={task._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-medium text-white">{task.title}</h3>
                  <StatusPill value={task.status} />
                  <StatusPill value={task.priority} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{task.description}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">
                  Due {formatDate(task.dueDate)} • Project {typeof task.projectId === "string" ? task.projectId : task.projectId.title}
                </p>
              </div>
            ))}
          </div>
        </article>
        <article className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Status breakdown</h2>
            <div className="mt-5 space-y-4">
              {[
                ["Todo", summary.statusBreakdown.todo],
                ["In Progress", summary.statusBreakdown.inProgress],
                ["Completed", summary.statusBreakdown.completed],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm text-slate-300">
                    <span>{label}</span>
                    <span>{value}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-900/80">
                    <div
                      className="h-3 rounded-full bg-gradient-to-r from-violet-500 to-emerald-400"
                      style={{ width: `${summary.metrics.totalTasks ? (Number(value) / summary.metrics.totalTasks) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-slate-950/20 backdrop-blur">
            <h2 className="text-lg font-semibold text-white">Recent chats</h2>
            <div className="mt-5 space-y-4">
              {summary.recentChats.map((conversation) => (
                <div key={conversation._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                  <p className="text-sm font-medium text-white">
                    {conversation.isGroupChat
                      ? conversation.groupName
                      : conversation.members.map((member) => member.name).join(", ")}
                  </p>
                  <p className="mt-2 text-sm text-slate-400">{conversation.latestMessage?.content ?? "No messages yet"}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.25em] text-slate-500">Updated {formatDate(conversation.updatedAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
