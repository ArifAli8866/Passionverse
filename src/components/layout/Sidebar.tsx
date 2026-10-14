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
  Sparkles,
  Search,
  Star,
  HelpCircle,
  CreditCard,
  Layers,
  LogOut,
  Flame,
} from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [sidebarSearch, setSidebarSearch] = useState("");

  const mainLinks = [
    { href: "/feed", label: "Feed", icon: Home, badge: "12" },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/groups", label: "Friends & Groups", icon: Users, badge: "4" },
    { href: "/messages", label: "Messages", icon: MessageCircle },
    { href: "/notifications", label: "Notifications", icon: Bell },
  ];

  const toolsLinks = [
    { href: "/dashboard", label: "Kanban & Stats", icon: BarChart3, badge: "New" },
    { href: "/saved", label: "Saved Posts", icon: Bookmark },
    { href: "/settings", label: "Subscription", icon: CreditCard },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside className={cn("w-64 shrink-0 hidden lg:block select-none", className)}>
      <div className="sticky top-20 space-y-4">
        {/* Main Navigation Card (SlothUI Reference 2 style) */}
        <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs p-3.5 space-y-3">
          {/* In-sidebar quick search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={sidebarSearch}
              onChange={(e) => setSidebarSearch(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-xl border border-slate-200/80 bg-slate-50 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
            />
          </div>

          {/* Primary Nav List */}
          <nav className="space-y-1">
            {mainLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group",
                    isActive
                      ? "bg-indigo-600 text-white shadow-sm shadow-indigo-500/25"
                      : "text-slate-600 hover:bg-slate-100/80 dark:text-slate-300 dark:hover:bg-slate-800/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <link.icon
                      className={cn(
                        "w-4 h-4 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                      )}
                    />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span
                      className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full transition-colors",
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      )}
                    >
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* AI Intelligence Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" /> AI Intelligence
            </p>
            <div className="mt-1 space-y-1">
              <Link
                to="/discover"
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  location.pathname === "/discover"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-500" />
                  <span>Passion Matches</span>
                </div>
                <Badge variant="important" size="xs">AI</Badge>
              </Link>
              <Link
                to="/search"
                className={cn(
                  "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                  location.pathname === "/search"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <Search className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Semantic Search</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Tools & Settings Section */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace</p>
            <div className="mt-1 space-y-1">
              {toolsLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.label}
                    to={link.href}
                    className={cn(
                      "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-colors",
                      isActive
                        ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white font-semibold"
                        : "text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800/50"
                    )}
                  >
                    <div className="flex items-center gap-2.5">
                      <link.icon className="w-4 h-4 text-slate-400" />
                      <span>{link.label}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Go Pro SaaS Banner (SlothUI Reference 2 bottom card) */}
        <div className="relative overflow-hidden rounded-3xl p-4 bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white shadow-md shadow-indigo-500/20">
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold tracking-tight flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" /> Go Pro
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                50% OFF
              </span>
            </div>
            <p className="text-[11px] text-indigo-100 leading-snug">
              Unlock AI Project Generator, unlimited portfolio showcases & match analytics.
            </p>
            <Link to="/settings" className="block pt-1">
              <button
                type="button"
                className="w-full py-1.5 px-3 rounded-xl bg-white text-indigo-700 hover:bg-indigo-50 text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
              >
                Upgrade to Pro
              </button>
            </Link>
          </div>
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
        </div>

        {/* User Snippet Bar (SlothUI Reference 2 bottom user bar) */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-2.5 dark:border-slate-800 dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <Link to={`/profile/${user?.username}`} className="flex items-center gap-2.5 min-w-0 flex-1 group">
            <Avatar
              src={user?.avatar || undefined}
              name={user?.fullName}
              size="sm"
              status="online"
            />
            <div className="min-w-0 flex-1">
              <p className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate group-hover:text-indigo-600 transition-colors">
                {user?.fullName || "Passion Creator"}
              </p>
              <p className="text-[10px] text-slate-400 truncate">
                @{user?.username || "creator"} · Pro
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={logout}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}

