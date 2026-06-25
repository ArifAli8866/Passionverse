import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "outline";
  size?: "sm" | "md";
  onRemove?: () => void;
  className?: string;
}

export function Badge({ children, variant = "default", size = "sm", onRemove, className }: BadgeProps) {
  const variants = {
    default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    primary: "bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
    outline: "border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300",
  };

  const sizes = {
    sm: "text-xs px-2.5 py-1",
    md: "text-sm px-3 py-1.5",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium transition-colors",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 hover:text-red-500 transition-colors"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
