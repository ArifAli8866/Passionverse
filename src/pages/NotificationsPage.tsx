import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { cn, formatDate, MOCK_NOTIFICATIONS } from "@/lib/utils";
import type { Notification } from "@/types";
import { Bell, Heart, MessageCircle, UserPlus, Reply } from "lucide-react";

const typedNotifications = MOCK_NOTIFICATIONS as unknown as Notification[];

const typeIcons: Record<string, typeof Heart> = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  reply: Reply,
  message: MessageCircle,
};

const typeColors: Record<string, string> = {
  like: "text-pink-500 bg-pink-50 dark:bg-pink-900/20",
  comment: "text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20",
  follow: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20",
  reply: "text-purple-500 bg-purple-50 dark:bg-purple-900/20",
  message: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(typedNotifications);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const filtered = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

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
            <button
              onClick={markAllRead}
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "all"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-4 py-2 rounded-xl text-sm font-medium transition-all",
              filter === "unread"
                ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400"
            )}
          >
            Unread
          </button>
        </div>

        {/* Notifications List */}
        {filtered.length === 0 ? (
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
              const Icon = typeIcons[notif.type];
              return (
                <Link
                  key={notif.id}
                  to={notif.postId ? "/feed" : `/profile/${notif.user.username}`}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                    !notif.read && "bg-indigo-50/50 dark:bg-indigo-900/10"
                  )}
                >
                  <div className="relative">
                    <Avatar name={notif.user.fullName} size="md" />
                    <div
                      className={cn(
                        "absolute -bottom-1 -right-1 p-1 rounded-full",
                        typeColors[notif.type]
                      )}
                    >
                      <Icon className="w-3 h-3" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 dark:text-gray-100">
                      <span className="font-semibold">{notif.user.fullName}</span>{" "}
                      <span className="text-gray-500">{notif.message}</span>
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{formatDate(notif.createdAt)}</p>
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
