import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { cn, formatDate } from "@/lib/utils";
import { Bell, Heart, MessageCircle, UserPlus, Reply, Bookmark } from "lucide-react";
import toast from "react-hot-toast";

interface Notification {
  id: string;
  user_id: string;
  type: string;
  actor_id: string;
  post_id: string | null;
  read: boolean;
  created_at: string;
  actor?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string;
  };
}

const typeIcons: Record<string, any> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  reply: Reply,
  message: MessageCircle,
  save: Bookmark,
};

const typeColors: Record<string, string> = {
  like: "text-pink-500 bg-pink-50 dark:bg-pink-900/20",
  comment: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
  follow: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  reply: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  message: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
  save: "text-orange-500 bg-orange-50 dark:bg-orange-900/20",
};

const typeMessages: Record<string, string> = {
  like: "liked your post",
  comment: "commented on your post",
  follow: "started following you",
  reply: "replied to your comment",
  message: "sent you a message",
  save: "saved your post",
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*, actor:actor_id (id, full_name, username, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      setNotifications(data || []);
    } catch (error: any) {
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const markAllRead = async () => {
    if (!user) return;
    try {
      await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const markOneRead = async (id: string) => {
    await supabase.from("notifications").update({ read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = filter === "unread"
    ? notifications.filter((n) => !n.read)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Notifications</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {unreadCount} unread notifications
            </p>
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400">
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          {["all", "unread"].map((f) => (
            <button key={f} onClick={() => setFilter(f as "all" | "unread")}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize",
                filter === f
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400")}>
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">All caught up!</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">No new notifications</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filtered.map((notif) => {
              const Icon = typeIcons[notif.type] || Bell;
              const message = typeMessages[notif.type] || "interacted with you";
              return (
                <Link key={notif.id}
                  to={notif.post_id ? "/feed" : `/profile/${notif.actor?.username}`}
                  onClick={() => !notif.read && markOneRead(notif.id)}
                  className={cn("flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                    !notif.read && "bg-indigo-50/50 dark:bg-indigo-900/10")}>
                  <div className="relative">
                    <Avatar
                      src={notif.actor?.avatar_url}
                      name={notif.actor?.full_name || "User"}
                      size="md"
                    />
                    <div className={cn("absolute -bottom-1 -right-1 p-1 rounded-full", typeColors[notif.type] || "text-gray-500 bg-gray-100")}>
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{notif.actor?.full_name || "Someone"}</span>{" "}
                      <span className="text-gray-500">{message}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(notif.created_at)}</p>
                  </div>
                  {!notif.read && (
                    <span className="mt-2 w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
