import { cn } from "@/lib/utils";
import type { ReactNode, HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  variant?: "default" | "flat" | "glass" | "bordered" | "gradient";
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className,
  variant = "default",
  hover = false,
  onClick,
  ...props
}: CardProps) {
  const variants = {
    default:
      "bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-xs",
    flat: "bg-slate-50/70 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/50",
    glass: "glass-card",
    bordered: "bg-transparent border border-slate-200 dark:border-slate-800",
    gradient:
      "bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/30 dark:from-indigo-950/20 dark:via-slate-900 dark:to-purple-950/20 border border-indigo-100/80 dark:border-indigo-900/40",
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl p-5 sm:p-6 transition-all duration-200",
        variants[variant],
        hover &&
          "cursor-pointer hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col space-y-1.5 pb-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-xs text-slate-500 dark:text-slate-400 leading-relaxed", className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("pt-0", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center pt-4 border-t border-slate-100 dark:border-slate-800/80", className)} {...props}>
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-slate-200/70 dark:bg-slate-800/80",
        className
      )}
    />
  );
}

