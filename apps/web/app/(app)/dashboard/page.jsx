"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useApiState } from "@/hooks/use-api-state";
import { analyticsService } from "@/services/analytics";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data, loading, error, run } = useApiState();

  useEffect(() => {
    run(() => analyticsService.dashboard()).catch((err) => {
      console.error(err);
    });
  }, [run]);

  if (loading) return <LoadingState label="Loading dashboard..." />;

  const stats = data?.statistics || { interviewsCreated: 0, interviewsCompleted: 0, averageScore: 0 };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title="Your AI interview preparation cockpit"
        description="Track recent interviews, completion stats, score average, and quickly jump into new mock sessions."
        action={
          <Link href="/interview/create" className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white">
            Create Interview
          </Link>
        }
      />

      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Interviews Created", stats.interviewsCreated],
          ["Interviews Completed", stats.interviewsCompleted],
          ["Average Score", `${stats.averageScore}/100`],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Recent interviews</h2>
        <div className="mt-4 space-y-3">
          {(data?.recentInterviews || []).map((interview) => (
            <div key={interview._id} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-base font-medium text-white">{interview.role} • {interview.interviewType}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(interview.createdAt)}</p>
              </div>
              <p className="mt-2 text-sm text-slate-300">Experience: {interview.experienceLevel} • Stack: {interview.techStack?.join(", ")}</p>
              <div className="mt-3 flex gap-3">
                <Link href={`/interview/${interview._id}`} className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-200">Details</Link>
                <Link href={`/interview/${interview._id}/start`} className="rounded-full bg-violet-500 px-3 py-1 text-xs font-semibold text-white">Start</Link>
              </div>
            </div>
          ))}
          {!data?.recentInterviews?.length ? <p className="text-sm text-slate-400">No interviews yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
