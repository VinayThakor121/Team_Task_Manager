"use client";

import { useEffect, useMemo, useState } from "react";
import { getVapi } from "@/lib/vapi";

export const InterviewAgent = ({
  questions,
  onComplete,
  disabled,
  workflowId,
}) => {
  const [status, setStatus] = useState("idle");
  const [transcript, setTranscript] = useState([]);

  const formattedQuestions = useMemo(
    () => questions.map((question) => `- ${question}`).join("\n"),
    [questions],
  );

  useEffect(() => {
    const vapi = getVapi();

    const onCallStart = () => setStatus("active");
    const onCallEnd = () => {
      setStatus("ended");
      onComplete(transcript);
    };
    const onMessage = (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((current) => [
          ...current,
          { speaker: message.role === "assistant" ? "interviewer" : "candidate", text: message.transcript },
        ]);
      }
    };

    vapi.on("call-start", onCallStart);
    vapi.on("call-end", onCallEnd);
    vapi.on("message", onMessage);

    return () => {
      vapi.off("call-start", onCallStart);
      vapi.off("call-end", onCallEnd);
      vapi.off("message", onMessage);
    };
  }, [onComplete, transcript]);

  const start = async () => {
    setStatus("connecting");
    const vapi = getVapi();

    if (workflowId) {
      await vapi.start(workflowId, {
        variableValues: { questions: formattedQuestions },
      });
      return;
    }

    await vapi.start({
      name: "Interviewer",
      firstMessage: "Hi, welcome to your AI mock interview. Let's begin.",
      model: {
        provider: "openai",
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a concise mock interviewer. Ask these questions one by one:\n${formattedQuestions}`,
          },
        ],
      },
      transcriber: { provider: "deepgram", model: "nova-2", language: "en" },
      voice: { provider: "11labs", voiceId: "sarah" },
    });
  };

  const end = () => {
    const vapi = getVapi();
    vapi.stop();
    setStatus("ended");
    onComplete(transcript);
  };

  return (
    <section className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-300">Voice interview status: <span className="font-semibold text-white">{status}</span></p>
        {status !== "active" ? (
          <button
            type="button"
            onClick={start}
            disabled={disabled || status === "connecting"}
            className="rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-70"
          >
            {status === "connecting" ? "Connecting..." : "Start voice interview"}
          </button>
        ) : (
          <button
            type="button"
            onClick={end}
            className="rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white"
          >
            End interview
          </button>
        )}
      </div>
      <div className="max-h-80 space-y-3 overflow-auto rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        {transcript.length ? (
          transcript.map((entry, index) => (
            <div key={`${entry.speaker}-${index}`}>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{entry.speaker}</p>
              <p className="mt-1 text-sm text-slate-100">{entry.text}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-400">Transcript will appear here once the interview starts.</p>
        )}
      </div>
    </section>
  );
};
