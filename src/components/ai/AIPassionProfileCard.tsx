import { useState, useEffect } from "react";
import { Sparkles, Brain, RefreshCw, Compass, Users, Target, Code, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { PassionAnalysisService } from "@/services/ai/PassionAnalysisService";
import type { AIPassionProfile } from "@/types";
import toast from "react-hot-toast";

interface AIPassionProfileCardProps {
  userId: string;
  fullName: string;
  username: string;
  bio?: string;
  hobbies?: string[];
  posts?: any[];
  isOwnProfile?: boolean;
}

export default function AIPassionProfileCard({
  userId,
  fullName,
  username,
  bio,
  hobbies,
  posts,
  isOwnProfile,
}: AIPassionProfileCardProps) {
  const [profile, setProfile] = useState<AIPassionProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (userId) {
      loadAnalysis();
    }
  }, [userId, hobbies?.length, posts?.length]);

  const loadAnalysis = async (force = false) => {
    if (force) setIsRefreshing(true);
    else setIsLoading(true);

    try {
      const data = await PassionAnalysisService.analyzeUser(
        {
          userId,
          fullName,
          username,
          bio,
          hobbies,
          posts,
        },
        force
      );
      setProfile(data);
      if (force) toast.success("AI Passion Profile updated!");
    } catch {
      // Soft fail
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4 border-indigo-100 dark:border-indigo-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/40 animate-pulse" />
            <div className="w-36 h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div className="w-3/4 h-3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
      </Card>
    );
  }

  if (!profile) return null;

  return (
    <Card className="relative overflow-hidden border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/20 p-6 shadow-sm dark:border-indigo-900/40 dark:bg-gray-900 dark:from-gray-900 dark:via-indigo-950/20 dark:to-purple-950/20">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-36 h-36 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-200 dark:shadow-none">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base flex items-center gap-2">
              Passion Intelligence
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-xs">
                AI Profile
              </span>
            </h3>
            <p className="text-xs text-gray-400">Calculated from activity, projects & interests</p>
          </div>
        </div>

        {isOwnProfile && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => loadAnalysis(true)}
            isLoading={isRefreshing}
            className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            title="Recalculate your passion intelligence profile"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            Sync AI
          </Button>
        )}
      </div>

      {/* Summary */}
      {profile.summary && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-5 bg-white/70 dark:bg-gray-800/50 p-3.5 rounded-2xl border border-indigo-50 dark:border-gray-800">
          {profile.summary}
        </p>
      )}

      {/* Primary Passions Bar Chart */}
      <div className="space-y-3 mb-5">
        <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          <span>Primary Passions</span>
          <span>Affinities</span>
        </div>
        <div className="space-y-2.5">
          {profile.passions.map((passion, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                  <span>{passion.icon || "✨"}</span>
                  <span className="font-semibold">{passion.name}</span>
                </span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">
                  {passion.score}%
                </span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-700 ease-out"
                  style={{ width: `${passion.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid of Exploring & Looking For */}
      <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800">
        {/* Currently Exploring */}
        {profile.currentlyLearning && profile.currentlyLearning.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Compass className="w-3.5 h-3.5 text-indigo-500" />
              <span>Currently Exploring</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.currentlyLearning.map((topic, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40"
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Looking For */}
        {profile.lookingFor && profile.lookingFor.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              <span>Looking For</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {profile.lookingFor.map((item, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                >
                  <Users className="w-3 h-3 text-emerald-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Skills & Technologies Tags */}
      {profile.technologies && profile.technologies.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            <Code className="w-3.5 h-3.5 text-indigo-500" />
            <span>Technologies & Tools</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {profile.technologies.map((tech, i) => (
              <Badge key={i} variant="outline" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
