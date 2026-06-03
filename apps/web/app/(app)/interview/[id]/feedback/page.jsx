"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useApiState } from "@/hooks/use-api-state";
import { feedbackService } from "@/services/feedback";

export default function InterviewFeedbackPage() {
  const params = useParams();
  const { data, loading, error, run } = useApiState();

  useEffect(() => {
    if (params?.id) run(() => feedbackService.getByInterviewId(params.id)).catch((err) => {
      console.error(err);
    });
  }, [params?.id, run]);

  if (loading) return <LoadingState label="Loading feedback..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Feedback"
        title="AI interview feedback"
        description="Review scores, strengths, weaknesses, and personalized improvement suggestions."
      />

      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      <section className="grid gap-4 md:grid-cols-4">
        {[
          ["Overall", data?.overallScore],
          ["Technical", data?.technicalScore],
          ["Communication", data?.communicationScore],
          ["Confidence", data?.confidenceScore],
        ].map(([label, value]) => (
          <article key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-white">{value || 0}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Strengths</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {(data?.strengths || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Weaknesses</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {(data?.weaknesses || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Suggestions</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-200">
            {(data?.suggestions || []).map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </section>

      <div className="flex gap-3">
        <Link href="/history" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Back to history</Link>
        <Link href={`/interview/${params.id}/start`} className="rounded-full bg-violet-500 px-4 py-2 text-sm font-semibold text-white">Retake interview</Link>
      </div>
    </div>
  );
}
