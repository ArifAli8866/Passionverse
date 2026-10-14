import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar, AvatarGroup } from "@/components/ui/avatar";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import {
  BarChart3,
  Users,
  UserPlus,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  Activity,
  Calendar,
  Bell,
  Search,
  Plus,
  ArrowUpRight,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  LayoutGrid,
  Kanban,
  Flame,
} from "lucide-react";
import toast from "react-hot-toast";

interface KanbanTask {
  id: string;
  title: string;
  description: string;
  priority: "Important" | "Meh" | "OK" | "High Priority" | "Low Priority" | "Maybe important" | "Not that important";
  status: "in-progress" | "reviewed" | "completed";
  commentsCount: number;
  checksCount: string;
  members: string[];
}

const initialTasks: KanbanTask[] = [
  {
    id: "task-1",
    title: "UI/UX Design in the age of AI",
    description: "Creating conversational micro-interactions and generative UI components for the community.",
    priority: "Important",
    status: "in-progress",
    commentsCount: 11,
    checksCount: "187",
    members: ["Julia Smith", "Vermillion Gray"],
  },
  {
    id: "task-2",
    title: "Responsive Website Design for 23 more clients",
    description: "Optimizing Tailwind CSS layout containers, sticky headers, and mobile drawer transitions.",
    priority: "Meh",
    status: "in-progress",
    commentsCount: 32,
    checksCount: "115",
    members: ["Mai Senpai", "Azunyan Wu", "Taylor Swift", "John Doe"],
  },
  {
    id: "task-3",
    title: "Blog Copywriting (Low priority 😅)",
    description: "Curating inspiring passion-driven developer journeys and weekly project showcase highlights.",
    priority: "OK",
    status: "in-progress",
    commentsCount: 987,
    checksCount: "21.8k",
    members: ["Alex Vance", "Sofia Garcia"],
  },
  {
    id: "task-4",
    title: "Landing page for Azunyan senpai",
    description: "Implementing 3D hero spline graphics and interactive portfolio match showcase.",
    priority: "Not that important",
    status: "in-progress",
    commentsCount: 54,
    checksCount: "92",
    members: ["Azunyan Wu"],
  },
  {
    id: "task-5",
    title: "User flow confirmation for finance app",
    description: "Reviewing checkout flow, Stripe webhook callbacks, and monthly recurring subscription tiers.",
    priority: "Important",
    status: "reviewed",
    commentsCount: 8,
    checksCount: "112",
    members: ["Vermillion Gray"],
  },
  {
    id: "task-6",
    title: "Healthcare app wireframe flow 👨‍⚕️",
    description: "Validating patient consultation schedule, real-time message notifications, and telemetry.",
    priority: "Important",
    status: "reviewed",
    commentsCount: 221,
    checksCount: "87.2k",
    members: ["Julia Smith", "Chen Wei", "David Miller", "Liam Noah"],
  },
  {
    id: "task-7",
    title: "UI/UX Design in the age of AI",
    description: "Completed cross-browser accessibility audit and dark mode color contrast ratios.",
    priority: "High Priority",
    status: "completed",
    commentsCount: 108000,
    checksCount: "997",
    members: ["Mai Senpai", "Taylor Swift"],
  },
  {
    id: "task-8",
    title: "Design tokens and typography revamp",
    description: "Integrated Plus Jakarta Sans font weights and custom SlothUI soft pastel pill tokens.",
    priority: "Low Priority",
    status: "completed",
    commentsCount: 17,
    checksCount: "0",
    members: ["John Doe", "Sofia Garcia"],
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const [activeView, setActiveView] = useState<"kanban" | "analytics">("kanban");
  const [kanbanTab, setKanbanTab] = useState<"status" | "total" | "due" | "extra" | "completed">("status");
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [taskSearch, setTaskSearch] = useState("");
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState<KanbanTask["priority"]>("Important");
  const [newTaskStatus, setNewTaskStatus] = useState<KanbanTask["status"]>("in-progress");

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
    try {
      const { count: postsCount } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      const { count: followersCount } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);

      const { count: followingCount } = await supabase
        .from("followers")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

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

      const { data: notifications } = await supabase
        .from("notifications")
        .select("*, actor:actor_id (full_name, username, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(6);

      setRecentActivity(notifications || []);
    } catch (error) {
      console.error("Dashboard error:", error);
    }
  };

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) {
      toast.error("Please provide a task title");
      return;
    }

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: newTaskDesc.trim() || "Passion milestone in progress.",
      priority: newTaskPriority,
      status: newTaskStatus,
      commentsCount: 0,
      checksCount: "0",
      members: [user?.fullName || "You"],
    };

    setTasks((prev) => [newTask, ...prev]);
    setShowNewTaskModal(false);
    setNewTaskTitle("");
    setNewTaskDesc("");
    toast.success("Task added to Kanban Board!");
  };

  const moveTask = (taskId: string, targetStatus: KanbanTask["status"]) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: targetStatus } : t))
    );
    toast.success("Task moved!");
  };

  const getPriorityBadgeVariant = (priority: KanbanTask["priority"]): BadgeVariant => {
    switch (priority) {
      case "Important":
        return "important";
      case "High Priority":
        return "high";
      case "Low Priority":
        return "low";
      case "Meh":
        return "meh";
      case "OK":
        return "ok";
      case "Maybe important":
        return "slate";
      case "Not that important":
        return "rose";
      default:
        return "default";
    }
  };

  const filteredTasks = tasks.filter((t) =>
    t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
    t.description.toLowerCase().includes(taskSearch.toLowerCase())
  );

  const inProgressTasks = filteredTasks.filter((t) => t.status === "in-progress");
  const reviewedTasks = filteredTasks.filter((t) => t.status === "reviewed");
  const completedTasks = filteredTasks.filter((t) => t.status === "completed");

  const statCards = [
    { label: "Total Posts", value: stats.totalPosts, icon: BarChart3, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950/60" },
    { label: "Followers", value: stats.followers, icon: Users, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/60" },
    { label: "Following", value: stats.following, icon: UserPlus, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950/60" },
    { label: "Total Likes", value: stats.totalLikes, icon: Heart, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-50 dark:bg-rose-950/60" },
  ];

  return (
    <AppLayout showRightSidebar={false} fullWidth={true}>
      <div className="space-y-5">
        {/* Top Control Bar: View Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-3 rounded-3xl shadow-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveView("kanban")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer",
                activeView === "kanban"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <Kanban className="w-4 h-4" />
              <span>Kanban Board</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView("analytics")}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer",
                activeView === "analytics"
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>Analytics Overview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success("Dashboard link copied to clipboard!");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Share2 className="w-3.5 h-3.5 text-indigo-500" />
              <span>Share</span>
            </button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowNewTaskModal(true)}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Add Task
            </Button>
          </div>
        </div>

        {/* View 1: SlothUI Modern Kanban Dashboard (Reference 1) */}
        {activeView === "kanban" ? (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-5 sm:p-7 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-6">
            {/* Header: Title & Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-2">
                  <span>Kanban Dashboard</span>
                  <span className="text-2xl">👨‍🎨</span>
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Manage your passion projects, design sprints, and roadmap milestones.
                </p>
              </div>

              {/* Search, Share, Export, Add Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    placeholder="Search tasks..."
                    className="w-44 sm:w-56 rounded-full border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => toast.success("Exported Kanban data to JSON / CSV!")}
                  className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors shadow-2xs cursor-pointer"
                  title="Export"
                >
                  <Download className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-medium">
                  <span>Sort By</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">Newest</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Reference 1 style) */}
            <div className="flex items-center gap-4 sm:gap-6 border-b border-slate-200/80 dark:border-slate-800 pb-2 overflow-x-auto no-scrollbar">
              {[
                { id: "status", label: "By Status" },
                { id: "total", label: `By Total Tasks (${tasks.length})` },
                { id: "due", label: "Tasks Due" },
                { id: "extra", label: "Extra Tasks" },
                { id: "completed", label: "Tasks Completed" },
              ].map((tab) => {
                const isActive = kanbanTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setKanbanTab(tab.id as any)}
                    className={cn(
                      "text-xs font-bold transition-all relative pb-2 shrink-0 cursor-pointer select-none",
                      isActive
                        ? "text-indigo-600 dark:text-indigo-400"
                        : "text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300"
                    )}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 3 Kanban Columns (SlothUI Reference 1 layout) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Column 1: In Progress */}
              <div className="space-y-3">
                {/* Column Header Pill */}
                <div className="flex items-center justify-between rounded-full bg-indigo-600 text-white px-4 py-2 shadow-sm shadow-indigo-500/25">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-[11px]">
                      {inProgressTasks.length}
                    </span>
                    <span className="font-bold text-xs">In Progress</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTaskStatus("in-progress");
                      setShowNewTaskModal(true);
                    }}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {inProgressTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-850 p-4 shadow-2xs hover:shadow-md transition-all duration-200 space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant={getPriorityBadgeVariant(task.priority)} size="xs">
                          {task.priority}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => moveTask(task.id, "reviewed")}
                          className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline transition-opacity cursor-pointer"
                        >
                          Move to Review →
                        </button>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <AvatarGroup limit={3} size="xs">
                          {task.members.map((m, i) => (
                            <Avatar key={i} name={m} />
                          ))}
                        </AvatarGroup>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{task.commentsCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{task.checksCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 2: Reviewed */}
              <div className="space-y-3">
                {/* Column Header Pill */}
                <div className="flex items-center justify-between rounded-full bg-amber-500 text-white px-4 py-2 shadow-sm shadow-amber-500/25">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-[11px]">
                      {reviewedTasks.length}
                    </span>
                    <span className="font-bold text-xs">Reviewed</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTaskStatus("reviewed");
                      setShowNewTaskModal(true);
                    }}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {reviewedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-850 p-4 shadow-2xs hover:shadow-md transition-all duration-200 space-y-2.5 group"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant={getPriorityBadgeVariant(task.priority)} size="xs">
                          {task.priority}
                        </Badge>
                        <button
                          type="button"
                          onClick={() => moveTask(task.id, "completed")}
                          className="opacity-0 group-hover:opacity-100 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline transition-opacity cursor-pointer"
                        >
                          Mark Completed ✓
                        </button>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <AvatarGroup limit={3} size="xs">
                          {task.members.map((m, i) => (
                            <Avatar key={i} name={m} />
                          ))}
                        </AvatarGroup>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{task.commentsCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{task.checksCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="space-y-3">
                {/* Column Header Pill */}
                <div className="flex items-center justify-between rounded-full bg-emerald-600 text-white px-4 py-2 shadow-sm shadow-emerald-500/25">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-[11px]">
                      {completedTasks.length}
                    </span>
                    <span className="font-bold text-xs">Completed</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNewTaskStatus("completed");
                      setShowNewTaskModal(true);
                    }}
                    className="w-5 h-5 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-sm font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Cards List */}
                <div className="space-y-3">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="rounded-2xl border border-slate-200/90 bg-white dark:border-slate-800 dark:bg-slate-850 p-4 shadow-2xs hover:shadow-md transition-all duration-200 space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant={getPriorityBadgeVariant(task.priority)} size="xs">
                          {task.priority}
                        </Badge>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Done
                        </span>
                      </div>

                      <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 leading-snug">
                        {task.title}
                      </h4>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80">
                        <AvatarGroup limit={3} size="xs">
                          {task.members.map((m, i) => (
                            <Avatar key={i} name={m} />
                          ))}
                        </AvatarGroup>

                        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-400">
                          <span className="flex items-center gap-1">
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>{task.commentsCount >= 1000 ? `${(task.commentsCount / 1000).toFixed(0)}k` : task.commentsCount}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{task.checksCount}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* View 2: Analytics Overview */
          <div className="space-y-5">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl border border-slate-200/80 bg-white p-5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center gap-4"
                >
                  <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0", stat.bg, stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      {stat.label}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Activity Bar Chart */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Weekly Project & Passion Activity
                  </h3>
                  <p className="text-xs text-slate-500">Your contributions over the last 7 days</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>+18% growth</span>
                </div>
              </div>

              <div className="flex items-end justify-between gap-3 h-44 pt-6">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, idx) => {
                  const count = weeklyPosts[idx] || 0;
                  const height = Math.max(count * 28 + 12, 16);
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center h-32">
                        <div
                          style={{ height: `${height}px` }}
                          className="w-full max-w-[36px] rounded-xl bg-gradient-to-t from-indigo-600 to-purple-500 hover:from-indigo-500 hover:to-purple-400 transition-all shadow-xs"
                          title={`${count} posts on ${day}`}
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Activity Stream */}
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Recent Interactions & Activity Stream
              </h3>
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {recentActivity.length === 0 ? (
                  <p className="py-6 text-center text-xs text-slate-400">
                    No recent activity yet. Interact with posts to see stream analytics!
                  </p>
                ) : (
                  recentActivity.map((item) => (
                    <div key={item.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <Avatar src={item.actor?.avatar_url} name={item.actor?.full_name || "Peer"} size="sm" />
                        <div>
                          <p className="text-xs text-slate-900 dark:text-slate-100">
                            <span className="font-bold">{item.actor?.full_name || "Someone"}</span>{" "}
                            <span className="text-slate-500">
                              {item.type === "like" ? "liked your project" : "interacted with your roadmap"}
                            </span>
                          </p>
                          <p className="text-[10px] text-slate-400">{formatDate(item.created_at)}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                        View ↗
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add New Task Modal */}
      {showNewTaskModal && (
        <Modal
          isOpen={showNewTaskModal}
          onClose={() => setShowNewTaskModal(false)}
          title="Create New Kanban Task"
          description="Add a milestone, design task, or roadmap item to your board."
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="e.g. Healthcare app wireframe flow 👨‍⚕️"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={newTaskDesc}
                onChange={(e) => setNewTaskDesc(e.target.value)}
                rows={3}
                placeholder="Detail what needs to be accomplished..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Priority Badge
                </label>
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Important">Important</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Low Priority">Low Priority</option>
                  <option value="Meh">Meh</option>
                  <option value="OK">OK</option>
                  <option value="Maybe important">Maybe important</option>
                  <option value="Not that important">Not that important</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Status
                </label>
                <select
                  value={newTaskStatus}
                  onChange={(e) => setNewTaskStatus(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="in-progress">In Progress</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setShowNewTaskModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleCreateTask}>
                Add to Board
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AppLayout>
  );
}
