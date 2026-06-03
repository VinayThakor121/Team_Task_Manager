"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { InterviewAgent } from "@/components/interview/interview-agent";
import { interviewService } from "@/services/interviews";
import { sessionService } from "@/services/sessions";
import { feedbackService } from "@/services/feedback";

export default function StartInterviewPage() {
  const params = useParams();
  const router = useRouter();

  const [interview, setInterview] = useState(null);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [startedAt, setStartedAt] = useState(null);

  useEffect(() => {
    if (!params?.id) return;
    interviewService.getById(params.id).then(setInterview).catch((err) => {
      console.error(err);
    });
    sessionService
      .start({ interviewId: params.id })
      .then((session) => {
        setSessionInfo(session);
        setStartedAt(Date.now());
      })
      .catch((err) => {
        console.error(err);
      });
  }, [params?.id]);

  const workflowId = useMemo(() => {
    if (sessionInfo?.vapi?.workflowId) return sessionInfo.vapi.workflowId;
    return process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID || "";
  }, [sessionInfo]);

  const onComplete = async (transcript) => {
    try {
      setStatusMessage("Saving transcript and generating feedback...");
      await sessionService.end({
        sessionId: sessionInfo?._id,
        transcript,
        duration: startedAt ? Math.max(1, Math.round((Date.now() - startedAt) / 1000)) : 0,
        status: "completed",
      });
      await feedbackService.generate({ interviewId: params.id, sessionId: sessionInfo?._id });
      router.push(`/interview/${params.id}/feedback`);
    } catch (error) {
      setStatusMessage(error?.response?.data?.message || "Unable to complete interview flow.");
    }
  };

  if (!interview || !sessionInfo) {
    return <LoadingState label="Preparing interview session..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Interview Start"
        title={`${interview.role} voice interview`}
        description="Start Vapi voice interview, collect transcript, and auto-generate Gemini feedback."
      />

      {statusMessage ? <p className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">{statusMessage}</p> : null}

      <InterviewAgent
        questions={interview.questions || []}
        workflowId={workflowId}
        onComplete={onComplete}
      />
    </div>
  );
}
