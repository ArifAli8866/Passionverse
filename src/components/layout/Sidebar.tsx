import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { HOBBIES } from "@/lib/utils";
import {
  Home,
  Compass,
  MessageCircle,
  Bell,
  User,
  Bookmark,
  Settings,
  BarChart3,
  Users,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const mainLinks = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const yourLinks = [
    { href: `/profile/${user?.username || ""}`, label: "Profile", icon: User },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/saved", label: "Saved Posts", icon: Bookmark },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 flex-shrink-0 hidden lg:block", className)}>
      <div className="sticky top-20 space-y-6">
        {/* User Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <Link to={`/profile/${user?.username}`} className="flex items-center gap-3">
            <Avatar src={user?.avatar || undefined} name={user?.fullName} size="lg" />
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user?.fullName}</p>
              <p className="text-sm text-gray-500">@{user?.username}</p>
            </div>
          </Link>
          <div className="mt-3 flex items-center justify-between text-center">
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.posts || 0}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.followers || 0}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{user?.following || 0}</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="rounded-2xl border border-gray-100 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Main</p>
          {mainLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 dark:from-indigo-900/20 dark:to-purple-900/20 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
          <p className="mt-3 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Your Space</p>
          {yourLinks.map((link) => {
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 dark:from-indigo-900/20 dark:to-purple-900/20 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                )}
              >
                <link.icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Trending Hobbies */}
        <div className="rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Trending Hobbies</h3>
          <div className="flex flex-wrap gap-2">
            {HOBBIES.slice(0, 8).map((hobby) => (
              <Link key={hobby.id} to={`/search?hobby=${hobby.id}`}>
                <Badge variant="primary" size="sm">
                  {hobby.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-3 text-xs text-gray-400">
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <span>About</span>
            <span>Privacy</span>
            <span>Terms</span>
            <span>Help</span>
            <span>© 2024 PassionVerse</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
