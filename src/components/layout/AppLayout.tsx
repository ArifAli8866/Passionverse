import { type ReactNode } from "react";
import Navbar from "./Navbar";
import { Sidebar } from "./Sidebar";
import { cn } from "@/lib/utils";

interface AppLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function AppLayout({ children, showSidebar = true }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-8">
          {showSidebar && <Sidebar />}
          <main className={cn("flex-1 min-w-0", showSidebar ? "" : "max-w-4xl mx-auto w-full")}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
