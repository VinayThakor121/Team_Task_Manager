import { cn } from "@/lib/utils";

export const Input = ({ className = "", ...props }) => (
  <input
    className={cn(
      "w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400",
      className,
    )}
    {...props}
  />
);
