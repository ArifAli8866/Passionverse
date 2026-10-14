import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/store/theme";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import {
  Flame,
  Search,
  Bell,
  MessageCircle,
  Home,
  Compass,
  PlusSquare,
  Sun,
  Moon,
  LogOut,
  User,
  Settings,
  Bookmark,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchUnread = async () => {
      const { count } = await supabase
        .from("notifications")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("read", false);
      setUnreadNotifications(count || 0);

      const { data } = await supabase
        .from("notifications")
        .select("*, actor:actor_id (id, full_name, username, avatar_url)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);
      setRecentNotifications(data || []);
    };
    fetchUnread();

    // Realtime updates
    const channel = supabase
      .channel("navbar-notifications")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, () => {
        fetchUnread();
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [user]);

  const navLinks = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/messages", label: "Messages", icon: MessageCircle },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-950/85 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo */}
          <Link to="/feed" className="flex items-center gap-2.5 shrink-0 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 shadow-sm shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
                Passionverse
              </span>
            </div>
          </Link>

          {/* Search Bar (SlothUI Reference 2 style) */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for friends, groups, passions..."
                className="w-full rounded-full border border-slate-200/90 bg-slate-50/80 py-2 pl-10 pr-12 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-900"
              />
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 select-none shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </form>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* Add New Post (Reference 2 style primary pill) */}
            <Link to="/create-post" className="hidden sm:inline-flex">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm px-4 py-2 shadow-sm shadow-indigo-500/25 hover:shadow-md hover:shadow-indigo-500/30 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span>Add New Post</span>
                <span className="text-base leading-none font-bold">+</span>
              </button>
            </Link>

            {/* Direct Messages Quick Icon */}
            <Link
              to="/messages"
              className={cn(
                "p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors relative hidden sm:flex items-center justify-center",
                location.pathname === "/messages" && "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
              )}
              title="Messages"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                className={cn(
                  "relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors flex items-center justify-center cursor-pointer",
                  showNotifications && "bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                )}
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
                  </span>
                )}
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2.5 z-20 w-80 sm:w-96 rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 overflow-hidden animate-scale-in">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
                        {unreadNotifications > 0 && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                            {unreadNotifications} new
                          </span>
                        )}
                      </div>
                      <Link
                        to="/notifications"
                        onClick={() => setShowNotifications(false)}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 transition-colors"
                      >
                        View all ↗
                      </Link>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {recentNotifications.length === 0 ? (
                        <div className="px-4 py-10 text-center text-xs text-slate-400 flex flex-col items-center gap-2">
                          <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 stroke-[1.5]" />
                          <p>You are all caught up!</p>
                        </div>
                      ) : (
                        recentNotifications.map((notif) => (
                          <Link
                            key={notif.id}
                            to="/notifications"
                            onClick={() => setShowNotifications(false)}
                            className={cn(
                              "flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/60",
                              !notif.read && "bg-indigo-50/40 dark:bg-indigo-950/20"
                            )}
                          >
                            <Avatar src={notif.actor?.avatar_url} name={notif.actor?.full_name || "User"} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-slate-900 dark:text-slate-100 leading-snug">
                                <span className="font-semibold">{notif.actor?.full_name || "Someone"}</span>{" "}
                                <span className="text-slate-500 dark:text-slate-400">
                                  {notif.type === "like"
                                    ? "liked your passion post"
                                    : notif.type === "comment"
                                    ? "commented on your project"
                                    : notif.type === "follow"
                                    ? "started following you"
                                    : "interacted with you"}
                                </span>
                              </p>
                              <p className="text-[10px] text-slate-400 mt-0.5">
                                {new Date(notif.created_at).toLocaleDateString(undefined, {
                                  month: "short",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            {!notif.read && (
                              <span className="mt-1 w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                            )}
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Quick Settings Icon */}
            <Link
              to="/settings"
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center justify-center"
              title="Settings"
            >
              <Settings className="w-5 h-5" />
            </Link>

            {/* User Menu (Reference 2 style) */}
            <div className="relative pl-1">
              <button
                type="button"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500/20 transition-all cursor-pointer"
              >
                <Avatar
                  src={user?.avatar}
                  name={user?.fullName}
                  size="sm"
                  status="online"
                />
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 top-full mt-2.5 z-20 w-60 rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 overflow-hidden animate-scale-in">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user?.fullName}
                      </p>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs text-slate-500">@{user?.username}</p>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                          Pro Member
                        </span>
                      </div>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link
                        to={`/profile/${user?.username}`}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <User className="w-4 h-4 text-indigo-500" />
                        <span>View Profile</span>
                      </Link>
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Compass className="w-4 h-4 text-purple-500" />
                        <span>Kanban & Analytics</span>
                      </Link>
                      <Link
                        to="/saved"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Bookmark className="w-4 h-4 text-amber-500" />
                        <span>Saved Posts</span>
                      </Link>
                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-slate-500" />
                        <span>Account Settings</span>
                      </Link>
                      <div className="my-1 border-t border-slate-100 dark:border-slate-800/80" />
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                          navigate("/");
                        }}
                        className="flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-xs dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors",
                  location.pathname === link.href
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                )}
              >
                <link.icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            ))}
          </div>
          <Link
            to="/create-post"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-xs shadow-sm shadow-indigo-500/25"
          >
            <PlusSquare className="w-4 h-4" />
            <span>Create New Post</span>
          </Link>
        </div>
      )}
    </nav>
  );
}
