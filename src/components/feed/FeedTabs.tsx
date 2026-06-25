import { cn } from "@/lib/utils";
import { Globe, Users, HeartHandshake } from "lucide-react";
import type { FeedType } from "@/types";

interface FeedTabsProps {
  activeTab: FeedType;
  onTabChange: (tab: FeedType) => void;
}

const tabs: { id: FeedType; label: string; icon: typeof Globe }[] = [
  { id: "global", label: "Global", icon: Globe },
  { id: "following", label: "Following", icon: Users },
  { id: "hobby", label: "Hobby", icon: HeartHandshake },
];

export default function FeedTabs({ activeTab, onTabChange }: FeedTabsProps) {
  return (
    <div className="flex items-center gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all",
              isActive
                ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
