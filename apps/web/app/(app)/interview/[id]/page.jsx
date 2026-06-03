"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useApiState } from "@/hooks/use-api-state";
import { interviewService } from "@/services/interviews";

export default function InterviewDetailsPage() {
  const params = useParams();
  const { data, loading, error, run } = useApiState();

  useEffect(() => {
    if (params?.id) run(() => interviewService.getById(params.id)).catch(() => {});
  }, [params?.id, run]);

  if (loading) return <LoadingState label="Loading interview details..." />;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview"
        title={data ? `${data.role} interview` : "Interview details"}
        description="Review generated questions and start your AI voice interview session."
        action={
          data ? (
            <Link href={`/interview/${data._id}/start`} className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white">
              Start interview
            </Link>
          ) : null
        }
      />

      {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</p> : null}

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <p className="text-sm text-slate-300">Type: {data?.interviewType} • Level: {data?.experienceLevel}</p>
        <p className="mt-2 text-sm text-slate-400">Tech stack: {data?.techStack?.join(", ")}</p>
        <h2 className="mt-6 text-lg font-semibold text-white">Questions</h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-200">
          {(data?.questions || []).map((question) => <li key={question}>{question}</li>)}
        </ol>
      </section>
    </div>
  );
}
