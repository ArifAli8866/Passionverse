import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import {
  BarChart3, Users, UserPlus, Heart,
  MessageCircle, Share2, TrendingUp, Activity,
  Calendar, Bell,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    followers: 0,
    following: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [weeklyPosts, setWeeklyPosts] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Total posts
      const { count: postsCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      // Followers
      const { count: followersCount } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);

      // Following
      const { count: followingCount } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

      // Total likes on my posts
      const { data: myPosts } = await supabase
        .from("posts")
        .select("id")
        .eq("user_id", user.id);

      const postIds = (myPosts || []).map((p) => p.id);
      let totalLikes = 0;
      let totalComments = 0;

      if (postIds.length > 0) {
        const { count: likesCount } = await supabase
          .from("post_likes")
          .select("*", { count: "exact", head: true })
          .in("post_id", postIds);

        const { count: commentsCount } = await supabase
          .from("comments")
          .select("*", { count: "exact", head: true })
          .in("post_id", postIds);

        totalLikes = likesCount || 0;
        totalComments = commentsCount || 0;
      }

      setStats({
        totalPosts: postsCount || 0,
        followers: followersCount || 0,
        following: followingCount || 0,
        totalLikes,
        totalComments,
      });

      // Weekly posts activity
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
      const { data: weekPosts } = await supabase
        .from("posts")
        .select("created_at")
        .eq("user_id", user.id)
        .gte("created_at", sevenDaysAgo.toISOString());

      const dayCounts = [0, 0, 0, 0, 0, 0, 0];
      (weekPosts || []).forEach((post) => {
        const day = new Date(post.created_at).getDay();
        const index = (day + 6) % 7;
        dayCounts[index]++;
      });
      setWeeklyPosts(dayCounts);

      // Recent activity from notifications
      const { data: notifications } = await supabase
        .from("notifications")
        .select("*, actor:actor_id (full_name, username, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentActivity(notifications || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: BarChart3, color: "from-indigo-500 to-purple-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Followers", value: stats.followers, icon: Users, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Following", value: stats.following, icon: UserPlus, color: "from-orange-500 to-red-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "from-pink-500 to-rose-600", bg: "bg-pink-50 dark:bg-pink-900/20" },
  ];

  const engagementCards = [
    { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "text-pink-500" },
    { label: "Total Comments", value: stats.totalComments, icon: MessageCircle, color: "text-indigo-500" },
    { label: "Total Posts", value: stats.totalPosts, icon: Share2, color: "text-blue-500" },
    { label: "Followers", value: stats.followers, icon: TrendingUp, color: "text-emerald-500" },
  ];

  const typeMessages: Record<string, string> = {
    like: "liked your post",
    comment: "commented on your post",
    follow: "started following you",
    reply: "replied to your comment",
    message: "sent you a message",
  };

  const typeColors: Record<string, string> = {
    like: "text-pink-500",
    comment: "text-indigo-500",
    follow: "text-emerald-500",
    reply: "text-purple-500",
    message: "text-blue-500",
  };

  const typeIcons: Record<string, any> = {
    like: Heart,
    comment: MessageCircle,
    follow: UserPlus,
    reply: MessageCircle,
    message: MessageCircle,
  };

  const maxPosts = Math.max(...weeklyPosts, 1);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Your passion metrics at a glance</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Calendar className="w-4 h-4" />
            <span>Last 30 days</span>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={user?.fullName} size="xl" className="ring-4 ring-white/30" />
            <div>
              <h2 className="text-xl font-bold">Welcome back, {user?.fullName?.split(" ")[0]}!</h2>
              <p className="text-indigo-100 text-sm mt-1">
                You have {stats.totalPosts} posts and {stats.followers} followers. Keep it up!
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat) => (
              <Card key={stat.label} className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn("p-2 rounded-xl", stat.bg)}>
                    <div className={cn("w-5 h-5 rounded bg-gradient-to-br flex items-center justify-center", stat.color)}>
                      <stat.icon className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Engagement */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Engagement Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementCards.map((card) => (
              <Card key={card.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className={cn("w-5 h-5", card.color)} />
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {card.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Weekly Activity Chart */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Posts Activity</h3>
          </div>
          <div className="flex items-end gap-2 h-32">
            {weeklyPosts.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all hover:opacity-80 min-h-[4px]"
                  style={{ height: `${(count / maxPosts) * 100}%` }}
                />
                <span className="text-xs text-gray-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
          {weeklyPosts.every((c) => c === 0) && (
            <p className="text-center text-sm text-gray-400 mt-2">No posts this week yet</p>
          )}
        </Card>

        {/* Recent Activity */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-indigo-500" />
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Activity</h3>
          </div>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">No recent activity yet</p>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((item) => {
                const Icon = typeIcons[item.type] || Bell;
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar
                        src={item.actor?.avatar_url}
                        name={item.actor?.full_name || "User"}
                        size="sm"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-900 dark:text-gray-100">
                        <span className="font-medium">{item.actor?.full_name || "Someone"}</span>{" "}
                        <span className="text-gray-500">{typeMessages[item.type] || "interacted with you"}</span>
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(item.created_at)}</p>
                    </div>
                    <Icon className={cn("w-4 h-4 flex-shrink-0", typeColors[item.type] || "text-gray-400")} />
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}
