import { Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import { Avatar } from "@/components/ui/avatar";
import { Image, FileText, Rocket } from "lucide-react";

export default function CreatePostCard() {
  const { user } = useAuth();

  return (
    <Link
      to="/create-post"
      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 block"
    >
      <div className="flex items-center gap-3">
        <Avatar name={user?.fullName} size="md" />
        <div className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-400 dark:text-gray-500">
          What are you passionate about?
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-gray-50 dark:border-gray-800 pt-3">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Image className="w-4 h-4 text-emerald-500" />
            <span className="hidden sm:inline">Photo</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <FileText className="w-4 h-4 text-indigo-500" />
            <span className="hidden sm:inline">Text</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <Rocket className="w-4 h-4 text-purple-500" />
            <span className="hidden sm:inline">Project</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
