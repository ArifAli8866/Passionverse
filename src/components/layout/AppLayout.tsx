import { type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { RightSidebar } from "./RightSidebar";
import { cn } from "@/lib/utils";
import { Home, Compass, Plus, MessageCircle, User } from "lucide-react";
import { useAuth } from "@/store/auth";

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  showRightSidebar?: boolean;
  fullWidth?: boolean;
}

export default function AppLayout({
  children,
  showSidebar = true,
  showRightSidebar = false,
  fullWidth = false,
}: AppLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  const mobileNavItems = [
    { href: "/feed", label: "Feed", icon: Home },
    { href: "/discover", label: "Discover", icon: Compass },
    { href: "/create-post", label: "Create", icon: Plus, isAction: true },
    { href: "/messages", label: "Chat", icon: MessageCircle },
    { href: `/profile/${user?.username || ""}`, label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col selection:bg-indigo-500/20 selection:text-indigo-600 pb-16 md:pb-0">
      <Navbar />
      <div className={cn("mx-auto w-full px-3 sm:px-6 lg:px-8 py-5 flex-1", fullWidth ? "max-w-7xl" : "max-w-7xl")}>
        <div className="flex gap-6 lg:gap-8 justify-center">
          {/* Left Sidebar */}
          {showSidebar && <Sidebar className="w-60 xl:w-64 shrink-0" />}

          {/* Main Workspace / Feed Center */}
          <main
            className={cn(
              "flex-1 min-w-0 transition-all",
              !showSidebar && !showRightSidebar && "max-w-4xl mx-auto w-full",
              showSidebar && !showRightSidebar && "max-w-3xl",
              showSidebar && showRightSidebar && "max-w-2xl xl:max-w-2xl"
            )}
          >
            {children}
          </main>

          {/* Right Sidebar (SlothUI Reference 2) */}
          {showRightSidebar && (
            <RightSidebar className="w-72 xl:w-80 shrink-0 hidden xl:block" />
          )}
        </div>
      </div>

      {/* Mobile Floating Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200/80 dark:border-slate-800 px-3 py-1.5 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            if (item.isAction) {
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className="flex flex-col items-center justify-center -mt-4"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/30 hover:scale-105 transition-transform">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 mt-0.5">
                    Post
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-colors",
                  isActive
                    ? "text-indigo-600 dark:text-indigo-400 font-bold"
                    : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

