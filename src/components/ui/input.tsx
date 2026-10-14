import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
  pill?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, icon, rightElement, id, pill, ...props }, ref) => {
    return (
      <div className="space-y-1.5 w-full">
        {label && (
          <label htmlFor={id} className="block text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-tight">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            id={id}
            className={cn(
              "w-full border border-slate-200/90 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-150",
              "focus:border-indigo-500 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 shadow-2xs",
              "dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-100 dark:placeholder:text-slate-500",
              "dark:focus:border-indigo-500 dark:focus:ring-indigo-500/20",
              pill ? "rounded-full px-4" : "rounded-xl",
              icon && "pl-10",
              rightElement && "pr-10",
              error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500/15 dark:border-rose-600",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center text-slate-400">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs font-medium text-rose-500">{error}</p>}
        {!error && hint && <p className="text-[11px] text-slate-400">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;

