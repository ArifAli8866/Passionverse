import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { Image, Code, Sparkles, HelpCircle, Plus } from "lucide-react";

export default function CreatePostCard() {
  const { user } = useAuth();

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-4 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs">
      <Link to="/create-post" className="flex items-center gap-3 group">
        <Avatar
          src={user?.avatar || undefined}
          name={user?.fullName}
          size="md"
          status="online"
        />
        <div className="flex-1 rounded-full bg-slate-50 border border-slate-200/70 dark:bg-slate-800/70 dark:border-slate-700/60 px-4 py-2.5 text-xs text-slate-400 dark:text-slate-500 group-hover:border-indigo-300 dark:group-hover:border-indigo-600/50 group-hover:bg-white dark:group-hover:bg-slate-800 transition-all">
          Share your latest passion project, idea, or questions...
        </div>
      </Link>

      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/70 pt-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Link
            to="/create-post?type=image"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
          >
            <div className="w-5 h-5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Image className="w-3.5 h-3.5" />
            </div>
            <span>Photo</span>
          </Link>

          <Link
            to="/create-post?type=project"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
          >
            <div className="w-5 h-5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Code className="w-3.5 h-3.5" />
            </div>
            <span>Project</span>
          </Link>

          <Link
            to="/create-post?type=ai"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
          >
            <div className="w-5 h-5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>AI Assist</span>
          </Link>
        </div>

        <Link to="/create-post">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs hover:shadow-sm transition-all cursor-pointer"
          >
            <span>Post</span>
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </Link>
      </div>
    </div>
  );
}

