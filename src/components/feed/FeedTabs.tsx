import { cn } from "@/lib/utils";
import { Globe, Users, HeartHandshake, Sparkles } from "lucide-react";
import type { FeedType } from "@/types";

interface FeedTabsProps {
  activeTab: FeedType;
  onTabChange: (tab: FeedType) => void;
}

const tabs: { id: FeedType; label: string; count?: string; icon: typeof Globe }[] = [
  { id: "global", label: "Global Feed", count: "All", icon: Globe },
  { id: "following", label: "Following", count: "12", icon: Users },
  { id: "hobby", label: "Hobby Feed", count: "AI & Tech", icon: HeartHandshake },
];

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-200/80 dark:border-slate-800 pb-1 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all relative shrink-0 cursor-pointer select-none",
              isActive
                ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50/70 dark:bg-indigo-950/40"
                : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100/60 dark:hover:bg-slate-800/40"
            )}
          >
            <tab.icon className={cn("w-4 h-4", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400")} />
            <span>{tab.label}</span>
            {tab.count && (
              <span
                className={cn(
                  "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full transition-colors",
                  isActive
                    ? "bg-indigo-600 text-white dark:bg-indigo-500"
                    : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                )}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <span className="absolute bottom-[-5px] left-3 right-3 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
            )}
          </button>
        );
      })}
    </div>
  );
}

