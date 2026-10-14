import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import {
  UserPlus,
  Check,
  TrendingUp,
  Calendar,
  Gift,
  Bell,
  MoreHorizontal,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

interface SuggestedUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  isFollowing?: boolean;
}

export function RightSidebar({ className }: { className?: string }) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<SuggestedUser[]>([]);
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        let query = supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url, bio")
          .limit(5);

        if (user?.id) {
          query = query.neq("id", user.id);
        }

        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
          setSuggestions(data);
        } else {
          // Curated SaaS community suggestions fallback
          setSuggestions([
            { id: "1", full_name: "Julia Smith", username: "juliasmith", bio: "Product Designer & UI specialist" },
            { id: "2", full_name: "Vermillion D. Gray", username: "vermilliongray", bio: "Fullstack SaaS Engineer" },
            { id: "3", full_name: "Mai Senpai", username: "maisenpai", bio: "AI Prompt & Design Explorer" },
            { id: "4", full_name: "Azunyan U. Wu", username: "azunyandesu", bio: "Creative Technologist" },
            { id: "5", full_name: "Oarack Babama", username: "obama21", bio: "Passionate Community Mentor" },
          ]);
        }
      } catch (err) {
        setSuggestions([
          { id: "1", full_name: "Julia Smith", username: "juliasmith" },
          { id: "2", full_name: "Vermillion D. Gray", username: "vermilliongray" },
          { id: "3", full_name: "Mai Senpai", username: "maisenpai" },
          { id: "4", full_name: "Azunyan U. Wu", username: "azunyandesu" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  const toggleFollow = async (suggestedId: string, name: string) => {
    const isNow = !followingMap[suggestedId];
    setFollowingMap((prev) => ({ ...prev, [suggestedId]: isNow }));

    if (isNow) {
      toast.success(`You are now following ${name}!`);
      if (user?.id) {
        try {
          await supabase.from("followers").insert({
            follower_id: user.id,
            following_id: suggestedId,
          });
        } catch (e) {
          // ignore error
        }
      }
    } else {
      toast.success(`Unfollowed ${name}`);
      if (user?.id) {
        try {
          await supabase
            .from("followers")
            .delete()
            .match({ follower_id: user.id, following_id: suggestedId });
        } catch (e) {
          // ignore error
        }
      }
    }
  };

  return (
    <aside className={className}>
      <div className="sticky top-20 space-y-4">
        {/* Friend Suggestions / Recommended Creators (SlothUI Reference 2) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4.5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Friend Suggestions
            </h3>
            <Link
              to="/discover"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-0.5"
            >
              See All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {suggestions.map((item) => {
              const isFollowed = !!followingMap[item.id];
              return (
                <div key={item.id} className="flex items-center justify-between gap-3 group">
                  <Link
                    to={`/profile/${item.username}`}
                    className="flex items-center gap-2.5 min-w-0 flex-1"
                  >
                    <Avatar
                      src={item.avatar_url}
                      name={item.full_name}
                      size="sm"
                      status="online"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                        {item.full_name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        @{item.username}
                      </p>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => toggleFollow(item.id, item.full_name)}
                    className={
                      isFollowed
                        ? "w-7 h-7 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                        : "w-7 h-7 rounded-full bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-indigo-600 flex items-center justify-center font-bold text-sm transition-all cursor-pointer shadow-2xs"
                    }
                    title={isFollowed ? "Following" : "Follow"}
                  >
                    {isFollowed ? <Check className="w-3.5 h-3.5" /> : "+"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Profile Activity Analytics Card (SlothUI Reference 2) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4.5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Profile Activity
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* Stacked Avatars */}
          <div className="flex items-center justify-between">
            <AvatarGroup limit={5} size="sm">
              <Avatar name="Julia Smith" />
              <Avatar name="Alex Vance" />
              <Avatar name="Chen Wei" />
              <Avatar name="Sofia Garcia" />
              <Avatar name="David Miller" />
              <Avatar name="Emma Watson" />
              <Avatar name="Liam Noah" />
            </AvatarGroup>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Network
            </span>
          </div>

          {/* Followers Growth Stat */}
          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                +{user?.followers ? user.followers + 120 : "1,158"}
              </span>
              <span className="text-xs font-semibold text-slate-500">Followers</span>
            </div>
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>23% vs last month</span>
            </div>
          </div>

          {/* Soft Lavender Card Highlight */}
          <div className="rounded-2xl p-3 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100/80 dark:border-indigo-900/40">
            <p className="text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
              You gained a substantial amount of followers and passion matches this month!
            </p>
          </div>
        </div>

        {/* Upcoming Events / Meetups (SlothUI Reference 2) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-4.5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Upcoming Events
            </h3>
            <button
              type="button"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    Community Creator Jam
                  </p>
                  <p className="text-[11px] text-slate-400">Jun 25, 2028 · 6:00 PM</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Reminder set for Creator Jam!")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                title="Set reminder"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-300 flex items-center justify-center shrink-0">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 dark:text-slate-100">
                    AI Passion Demo Day
                  </p>
                  <p className="text-[11px] text-slate-400">Jul 10, 2028 · Online</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => toast.success("Reminder set for Demo Day!")}
                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors cursor-pointer"
                title="Set reminder"
              >
                <Bell className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
