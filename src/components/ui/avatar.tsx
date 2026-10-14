import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React from "react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  status?: "online" | "offline" | "busy" | "away";
  storyRing?: boolean;
  className?: string;
}

export function Avatar({
  src,
  name,
  size = "md",
  status,
  storyRing = false,
  className,
}: AvatarProps) {
  const sizes = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-20 h-20 text-2xl",
  };

  const statusSizes = {
    xs: "w-1.5 h-1.5",
    sm: "w-2 h-2",
    md: "w-2.5 h-2.5",
    lg: "w-3 h-3",
    xl: "w-3.5 h-3.5",
    "2xl": "w-4 h-4",
  };

  const statusColors = {
    online: "bg-emerald-500 ring-2 ring-white dark:ring-slate-900",
    offline: "bg-slate-400 ring-2 ring-white dark:ring-slate-900",
    busy: "bg-rose-500 ring-2 ring-white dark:ring-slate-900",
    away: "bg-amber-500 ring-2 ring-white dark:ring-slate-900",
  };

  const initials = name
    ? name
        .trim()
        .split(/\s+/)
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const colors = [
    "bg-gradient-to-br from-indigo-500 to-purple-600",
    "bg-gradient-to-br from-purple-500 to-pink-500",
    "bg-gradient-to-br from-emerald-500 to-teal-600",
    "bg-gradient-to-br from-amber-500 to-orange-600",
    "bg-gradient-to-br from-blue-500 to-cyan-600",
    "bg-gradient-to-br from-rose-500 to-red-600",
  ];

  const colorIndex = name ? Math.abs(name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length : 0;

  const content = src ? (
    <img
      src={src}
      alt={name || "Avatar"}
      className={cn(
        "rounded-full object-cover ring-2 ring-white/90 dark:ring-slate-900/90 shadow-2xs",
        sizes[size],
        className
      )}
    />
  ) : (
    <div
      className={cn(
        "rounded-full flex items-center justify-center text-white font-semibold shadow-2xs ring-2 ring-white/90 dark:ring-slate-900/90 select-none",
        colors[colorIndex],
        sizes[size],
        className
      )}
    >
      {initials || <User className="w-1/2 h-1/2" />}
    </div>
  );

  return (
    <div className={cn("relative inline-flex shrink-0", storyRing && "p-0.5 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600")}>
      {content}
      {status && (
        <span
          className={cn(
            "absolute bottom-0 right-0 rounded-full",
            statusSizes[size],
            statusColors[status]
          )}
        />
      )}
    </div>
  );
}

export function AvatarGroup({
  children,
  limit = 4,
  size = "sm",
  className,
}: {
  children: React.ReactNode;
  limit?: number;
  size?: "xs" | "sm" | "md";
  className?: string;
}) {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, limit);
  const remaining = childrenArray.length - limit;

  const sizeStyles = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-xs",
  };

  return (
    <div className={cn("flex items-center -space-x-2.5 overflow-hidden", className)}>
      {visibleAvatars.map((avatar, idx) => (
        <div key={idx} className="shrink-0 transition-transform hover:z-10 hover:scale-105">
          {avatar}
        </div>
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            "rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 ring-2 ring-white dark:ring-slate-900 flex items-center justify-center font-bold shrink-0",
            sizeStyles[size]
          )}
        >
          +{remaining}
        </div>
      )}
    </div>
  );
}

