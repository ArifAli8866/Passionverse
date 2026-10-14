import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "soft" | "pill" | "glow";
  size?: "xs" | "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-tight rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none cursor-pointer";

    const variants = {
      primary:
        "bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white hover:from-indigo-500 hover:to-purple-500 shadow-sm shadow-indigo-500/20 hover:shadow-md hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-indigo-500 border border-transparent",
      secondary:
        "bg-slate-100 text-slate-800 hover:bg-slate-200/80 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:bg-slate-700/80 focus-visible:ring-slate-400 border border-slate-200/60 dark:border-slate-700/60 shadow-xs",
      outline:
        "border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800/70 focus-visible:ring-indigo-500 shadow-xs",
      ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white focus-visible:ring-slate-400",
      danger:
        "bg-rose-600 text-white hover:bg-rose-500 shadow-sm shadow-rose-500/20 hover:shadow-md hover:shadow-rose-500/30 focus-visible:ring-rose-500",
      soft:
        "bg-indigo-50 text-indigo-600 hover:bg-indigo-100/80 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50 border border-indigo-100/80 dark:border-indigo-800/40 focus-visible:ring-indigo-500",
      pill:
        "rounded-full bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-500/25 px-5 py-2 font-semibold hover:-translate-y-0.5 focus-visible:ring-indigo-500",
      glow:
        "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:brightness-105 active:scale-95",
    };

    const sizes = {
      xs: "text-xs px-2.5 py-1 gap-1 rounded-lg",
      sm: "text-xs font-semibold px-3 py-1.5 gap-1.5 rounded-lg",
      md: "text-sm font-medium px-4 py-2 gap-2 rounded-xl",
      lg: "text-base font-semibold px-6 py-2.5 gap-2.5 rounded-2xl",
      icon: "p-2 w-9 h-9 rounded-xl flex items-center justify-center",
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

