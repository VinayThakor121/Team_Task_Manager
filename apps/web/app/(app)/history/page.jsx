"use client";

import Link from "next/link";
import { useEffect } from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useApiState } from "@/hooks/use-api-state";
import { interviewService } from "@/services/interviews";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { data, loading, error, run } = useApiState([]);

  useEffect(() => {
    run(() => interviewService.list()).catch((err) => {
      console.error(err);
    });
  }, [run]);

  if (loading) return <LoadingState label="Loading interview history..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="History"
        title="Interview history"
        description="Review your previous mock interviews and open feedback reports."
      />
      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}
      <section className="space-y-3">
        {data?.map((item) => (
          <article key={item._id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-white">{item.role}</h2>
                <p className="text-sm text-slate-300">{item.interviewType} • {item.experienceLevel}</p>
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{formatDate(item.createdAt)}</p>
            </div>
            <p className="mt-2 text-sm text-slate-400">Tech stack: {item.techStack?.join(", ")}</p>
            <div className="mt-4 flex gap-3">
              <Link href={`/interview/${item._id}`} className="rounded-full border border-white/10 px-4 py-2 text-xs text-slate-200">Details</Link>
              <Link href={`/interview/${item._id}/feedback`} className="rounded-full bg-violet-500 px-4 py-2 text-xs font-semibold text-white">Feedback</Link>
            </div>
          </article>
        ))}
        {!data?.length ? <p className="text-sm text-slate-400">No interviews found.</p> : null}
      </section>
    </div>
  );
}
