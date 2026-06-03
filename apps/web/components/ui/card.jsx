import { cn } from "@/lib/utils";

export const Card = ({ className = "", ...props }) => (
  <div className={cn("rounded-3xl border border-white/10 bg-white/5", className)} {...props} />
);
