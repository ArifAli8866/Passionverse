import { useState, useEffect } from "react";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedTabs from "@/components/feed/FeedTabs";
import { Skeleton } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import type { Post, FeedType } from "@/types";
import { Flame, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedType>("global");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      const formatted = (data || []).map((post: any) => ({
        id: post.id,
        type: post.type,
        content: post.content,
        caption: post.caption,
        imageUrl: post.image_url,
        projectTitle: post.project_title,
        projectDescription: post.project_description,
        githubLink: post.github_link,
        demoLink: post.demo_link,
        createdAt: post.created_at,
        likesCount: post.post_likes?.length || 0,
        commentsCount: post.comments?.length || 0,
        isLiked: post.post_likes?.some(
          (like: any) => like.user_id === user?.id
        ) || false,
        user: {
          id: post.profiles?.id,
          fullName: post.profiles?.full_name,
          username: post.profiles?.username,
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
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {activeTab === "global" && "Global Feed"}
              {activeTab === "following" && "Following"}
              {activeTab === "hobby" && "Your Hobby Feed"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "global" && "Discover what everyone is sharing"}
              {activeTab === "following" && "Posts from people you follow"}
              {activeTab === "hobby" && "Posts tailored to your interests"}
            </p>
          </div>
          <button
            onClick={fetchPosts}
            className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />
        <CreatePostCard />

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-gray-100 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="w-32 h-4" />
                    <Skeleton className="w-20 h-3" />
                  </div>
                </div>
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Flame className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              No posts yet
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Be the first to share something!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}