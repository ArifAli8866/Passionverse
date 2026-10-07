import { useState } from "react";
import { Sparkles, CheckCircle2, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import type { ProjectMatch } from "@/types";

interface ProjectMatchBadgeProps {
  match: ProjectMatch;
}

export default function ProjectMatchBadge({ match }: ProjectMatchBadgeProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mb-3 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 to-purple-50/70 p-3 dark:border-indigo-900/40 dark:from-indigo-950/20 dark:to-purple-950/20 text-xs">
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-900 px-2.5 py-1 rounded-xl shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            {match.headline}
          </span>
          <span className="text-gray-500 hidden sm:inline">{match.explanation}</span>
        </div>
        <button type="button" className="text-indigo-600 dark:text-indigo-400 p-1">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-2.5 pt-2.5 border-t border-indigo-100 dark:border-indigo-900/40 space-y-2 animate-fade-in">
          <p className="text-gray-700 dark:text-gray-300 sm:hidden">{match.explanation}</p>

          <div className="flex flex-wrap gap-4 text-xs">
            {match.matchingSkills.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                  Your Matching Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.matchingSkills.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.skillsToLearn.length > 0 && (
              <div>
                <span className="text-[10px] uppercase font-semibold text-gray-400 block mb-1">
                  Learning Opportunities:
                </span>
                <div className="flex flex-wrap gap-1">
                  {match.skillsToLearn.map((s, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                    >
                      <BookOpen className="w-3 h-3 text-indigo-500" />
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
