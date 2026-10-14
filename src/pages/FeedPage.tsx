import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedTabs from "@/components/feed/FeedTabs";
import { StoriesBar } from "@/components/feed/StoriesBar";
import { Skeleton } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Post, FeedType } from "@/types";
import { Flame, RefreshCw, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedType>("global");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("posts")
        .select(`
          *,
          profiles:user_id (
            id,
            full_name,
            username,
            avatar_url
          ),
          post_likes (user_id),
          comments (id)
        `)
        .order("created_at", { ascending: false });

      // Filter by following
      if (activeTab === "following" && user) {
        const { data: followingData } = await supabase
          .from("followers")
          .select("following_id")
          .eq("follower_id", user.id);
        const followingIds = (followingData || []).map((f) => f.following_id);
        if (followingIds.length === 0) {
          setPosts([]);
          setIsLoading(false);
          return;
        }
        query = query.in("user_id", followingIds);
      }

      const { data, error } = await query;
      if (error) throw error;

      const formatted = (data || []).map((post: any) => ({
        id: post.id,
        userId: post.user_id,
        type: post.type || "text",
        content: post.content || "",
        caption: post.caption || "",
        imageUrl: post.image_url,
        projectTitle: post.project_title,
        projectDescription: post.project_description,
        githubLink: post.github_link,
        demoLink: post.demo_link,
        techStack: post.tech_stack,
        createdAt: post.created_at,
        likesCount: post.post_likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        isLiked: post.post_likes?.some(
          (like: any) => like.user_id === user?.id
        ) || false,
        user: {
          id: post.profiles?.id || post.user_id,
          fullName: post.profiles?.full_name || "Creator",
          username: post.profiles?.username || "creator",
          avatar: post.profiles?.avatar_url || "",
          hobbies: [],
        },
      }));

      setPosts(formatted as Post[]);
    } catch (error: any) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [activeTab]);

  return (
    <AppLayout showRightSidebar={true}>
      <div className="space-y-4">
        {/* Stories / Creators Carousel (Reference 2) */}
        <StoriesBar />

        {/* Feed Header */}
        <div className="flex items-center justify-between px-1">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              {activeTab === "global" && "Global Feed"}
              {activeTab === "following" && "Following Feed"}
              {activeTab === "hobby" && "Hobby & Passion Feed"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activeTab === "global" && "Explore live creations and questions from community members"}
              {activeTab === "following" && "Updates from the creators you follow"}
              {activeTab === "hobby" && "Handpicked discussions and projects based on your hobbies"}
            </p>
          </div>
          <button
            type="button"
            onClick={fetchPosts}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title="Refresh Feed"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
          </button>
        </div>

        {/* Modern Tabs */}
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Quick Create Card */}
        <CreatePostCard />

        {/* Feed Items */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl border border-slate-200/80 bg-white p-5 dark:border-slate-800/80 dark:bg-slate-900 shadow-xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="w-32 h-3.5 rounded-md" />
                    <Skeleton className="w-20 h-2.5 rounded-md" />
                  </div>
                </div>
                <Skeleton className="w-full h-4 rounded-md" />
                <Skeleton className="w-3/4 h-4 rounded-md" />
                <Skeleton className="w-full h-48 rounded-2xl" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 p-8 shadow-xs">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 mb-4 shadow-sm">
              <Flame className="h-8 w-8" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
              No posts in this feed yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Be the first to share your passion project, ask a question, or inspire the community!
            </p>
            <CreatePostCard />
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <ErrorBoundary key={post.id}>
                <PostCard post={post} />
              </ErrorBoundary>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}