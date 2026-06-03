"use client";

import { useEffect } from "react";
import { LoadingState } from "@/components/common/loading-state";
import { PageHeader } from "@/components/common/page-header";
import { useApiState } from "@/hooks/use-api-state";
import { analyticsService } from "@/services/analytics";

export default function AnalyticsPage() {
  const performanceState = useApiState();
  const leaderboardState = useApiState([]);
  const { run: runPerformance } = performanceState;
  const { run: runLeaderboard } = leaderboardState;

  useEffect(() => {
    runPerformance(() => analyticsService.performance()).catch((err) => {
      console.error(err);
    });
    runLeaderboard(() => analyticsService.leaderboard()).catch((err) => {
      console.error(err);
    });
  }, [runLeaderboard, runPerformance]);

  if (performanceState.loading) return <LoadingState label="Loading analytics..." />;

  const trends = performanceState.data?.scoreTrends || [];
  const weakAreas = performanceState.data?.weakAreas || [];
  const recommendations = performanceState.data?.recommendations || {};

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Analytics"
        title="Performance analytics and leaderboard"
        description="Track score trends, weak areas, growth over time, and personalized recommendations."
      />

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Interview count</p>
          <p className="mt-3 text-3xl font-semibold text-white">{performanceState.data?.interviewCount || 0}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Performance growth</p>
          <p className="mt-3 text-3xl font-semibold text-white">{performanceState.data?.performanceGrowth || 0}</p>
        </article>
        <article className="rounded-3xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Latest score</p>
          <p className="mt-3 text-3xl font-semibold text-white">{trends.length ? trends[trends.length - 1].overall : 0}/100</p>
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Score trends</h2>
          <div className="mt-4 space-y-3">
            {trends.slice(-8).map((row, index) => (
              <div key={`${row.date}-${index}`} className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Interview {index + 1}</p>
                <div className="mt-2 h-2 rounded-full bg-slate-800">
                  <div className="h-2 rounded-full bg-violet-500" style={{ width: `${row.overall}%` }} />
                </div>
                <p className="mt-2 text-sm text-slate-200">Overall: {row.overall} • Technical: {row.technical} • Communication: {row.communication}</p>
              </div>
            ))}
            {!trends.length ? <p className="text-sm text-slate-400">No trend data yet.</p> : null}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">Weak topics & recommendations</h2>
          <div className="mt-4 space-y-3">
            {weakAreas.map((item) => (
              <p key={item.topic} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200">{item.topic} ({item.count})</p>
            ))}
            {!weakAreas.length ? <p className="text-sm text-slate-400">No weak areas identified yet.</p> : null}
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {Object.entries(recommendations)
              .filter(([key]) => key !== "weakTopics")
              .map(([key, values]) => (
                <div key={key} className="rounded-2xl border border-white/10 bg-slate-950/60 p-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300">{key}</p>
                  <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-slate-300">
                    {(values || []).map((value) => <li key={value}>{value}</li>)}
                  </ul>
                </div>
              ))}
          </div>
        </article>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Leaderboard</h2>
        <div className="mt-4 space-y-2">
          {(leaderboardState.data || []).map((entry) => (
            <div key={entry.userId} className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 p-3 text-sm">
              <p className="text-violet-300">#{entry.rank}</p>
              <p className="text-slate-200">{entry.name}</p>
              <p className="text-slate-300">{entry.averageScore}</p>
              <p className="text-slate-500">{entry.interviewsCompleted} interviews</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
