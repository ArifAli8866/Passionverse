import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DashboardStats } from "@/types";
import {
  BarChart3,
  Users,
  UserPlus,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Activity,
  Calendar,
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();

  const stats: DashboardStats = {
    totalPosts: user?.posts || 0,
    followers: user?.followers || 0,
    following: user?.following || 0,
    profileViews: 1289,
    engagement: 23.5,
    totalLikes: 4523,
    totalComments: 892,
    totalShares: 345,
  };

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: BarChart3, color: "from-indigo-500 to-purple-600", bg: "bg-indigo-50 dark:bg-indigo-900/20" },
    { label: "Followers", value: stats.followers, icon: Users, color: "from-emerald-500 to-teal-600", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
    { label: "Following", value: stats.following, icon: UserPlus, color: "from-orange-500 to-red-600", bg: "bg-orange-50 dark:bg-orange-900/20" },
    { label: "Profile Views", value: stats.profileViews, icon: Eye, color: "from-cyan-500 to-blue-600", bg: "bg-cyan-50 dark:bg-cyan-900/20" },
  ];

  const engagementCards = [
    { label: "Total Likes", value: stats.totalLikes, icon: Heart, change: "+12%", positive: true },
    { label: "Total Comments", value: stats.totalComments, icon: MessageCircle, change: "+8%", positive: true },
    { label: "Total Shares", value: stats.totalShares, icon: Share2, change: "-3%", positive: false },
    { label: "Engagement Rate", value: `${stats.engagement}%`, icon: TrendingUp, change: "+5%", positive: true },
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
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
            <Avatar name={user?.fullName} size="xl" className="ring-4 ring-white/30" />
            <div>
              <h2 className="text-xl font-bold">Welcome back, {user?.fullName?.split(" ")[0]}!</h2>
              <p className="text-indigo-100 text-sm mt-1">
                You're making great progress. Keep sharing your passion!
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <div className={cn("w-5 h-5 rounded bg-gradient-to-br", stat.color)}>
                    <stat.icon className="w-5 h-5 text-white p-0.5" />
                  </div>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {typeof stat.value === "number" ? stat.value.toLocaleString() : stat.value}
              </p>
              <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>

        {/* Engagement */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Engagement Overview</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {engagementCards.map((card) => (
              <Card key={card.label} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <card.icon className={cn(
                    "w-5 h-5",
                    card.label === "Total Likes" ? "text-pink-500" :
                    card.label === "Total Comments" ? "text-indigo-500" :
                    card.label === "Total Shares" ? "text-blue-500" : "text-emerald-500"
                  )} />
                  <span className={cn(
                    "text-xs font-medium px-1.5 py-0.5 rounded",
                    card.positive ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" :
                    "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20"
                  )}>
                    {card.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  {typeof card.value === "number" ? card.value.toLocaleString() : card.value}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{card.label}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Activity Chart Placeholder */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-500" />
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Weekly Activity</h3>
            </div>
          </div>
          <div className="flex items-end gap-2 h-32">
            {[40, 65, 35, 80, 55, 90, 70].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-lg bg-gradient-to-t from-indigo-500 to-purple-500 transition-all hover:opacity-80"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-gray-400">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[
              { action: "Someone liked your post", time: "5 minutes ago", icon: Heart, color: "text-pink-500" },
              { action: "New follower: Priya Sharma", time: "1 hour ago", icon: UserPlus, color: "text-emerald-500" },
              { action: "New comment on your post", time: "3 hours ago", icon: MessageCircle, color: "text-indigo-500" },
              { action: "Your post was shared", time: "5 hours ago", icon: Share2, color: "text-blue-500" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{item.action}</p>
                  <p className="text-xs text-gray-500">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
