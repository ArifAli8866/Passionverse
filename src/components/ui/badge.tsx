import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type BadgeVariant =
  | "default"
  | "primary"
  | "outline"
  | "indigo"
  | "amber"
  | "emerald"
  | "rose"
  | "slate"
  | "purple"
  | "cyan"
  | "important"
  | "high"
  | "low"
  | "meh"
  | "ok";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "xs" | "sm" | "md";
  dot?: boolean;
  onRemove?: () => void;
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "sm",
  dot = false,
  onRemove,
  className,
}: BadgeProps) {
  const variants: Record<BadgeVariant, string> = {
    default: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50",
    primary: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50",
    outline: "border border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-300 bg-white/50 dark:bg-slate-900/50",
    indigo: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/50",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/50",
    emerald: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/50",
    rose: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/50",
    slate: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/50",
    cyan: "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border border-cyan-200/60 dark:border-cyan-800/50",
    // SlothUI Kanban reference badges:
    important: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50 font-semibold",
    high: "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-100 dark:border-rose-800/50 font-semibold",
    low: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-800/50 font-semibold",
    meh: "bg-slate-100 text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/50 font-semibold",
    ok: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-100 dark:border-amber-800/50 font-semibold",
  };

  const dotColors: Record<BadgeVariant, string> = {
    default: "bg-slate-400",
    primary: "bg-indigo-500",
    outline: "bg-slate-400",
    indigo: "bg-indigo-500",
    amber: "bg-amber-500",
    emerald: "bg-emerald-500",
    rose: "bg-rose-500",
    slate: "bg-slate-400",
    purple: "bg-purple-500",
    cyan: "bg-cyan-500",
    important: "bg-indigo-500",
    high: "bg-rose-500",
    low: "bg-emerald-500",
    meh: "bg-slate-400",
    ok: "bg-amber-500",
  };

  const sizes = {
    xs: "text-[10px] px-2 py-0.5",
    sm: "text-xs px-2.5 py-0.5",
    md: "text-xs font-semibold px-3 py-1",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full tracking-tight transition-colors shadow-2xs font-medium",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", dotColors[variant])} />}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 text-current transition-colors cursor-pointer"
        >
          <X className="w-2.5 h-2.5" />
        </button>
      )}
    </span>
  );
}

