const palette: Record<string, string> = {
  Todo: "bg-slate-500/20 text-slate-100 border-slate-400/20",
  "In Progress": "bg-amber-500/20 text-amber-100 border-amber-400/20",
  Completed: "bg-emerald-500/20 text-emerald-100 border-emerald-400/20",
  High: "bg-rose-500/20 text-rose-100 border-rose-400/20",
  Medium: "bg-sky-500/20 text-sky-100 border-sky-400/20",
  Low: "bg-emerald-500/20 text-emerald-100 border-emerald-400/20",
};

export const StatusPill = ({ value }: { value: string }) => (
  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${palette[value] ?? "bg-white/10 text-white border-white/10"}`}>
    {value}
  </span>
);
