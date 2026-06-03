import { cn } from "@/lib/utils";

export const Button = ({ className = "", as: Comp = "button", ...props }) => {
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition disabled:opacity-70",
        className,
      )}
      {...props}
    />
  );
};
