import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-6 shadow-sm",
        "dark:border-gray-800 dark:bg-gray-900",
        hover && "transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-gray-700 cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800",
        className
      )}
    />
  );
}
