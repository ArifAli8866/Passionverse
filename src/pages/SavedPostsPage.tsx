import { useState, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import type { Post } from "@/types";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";

export default function SavedPostsPage() {
  const { user } = useAuth();
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) fetchSavedPosts();
  }, [user]);

  const fetchSavedPosts = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("saved_posts")
        .select(`
          post_id,
          posts:post_id (
            *,
            profiles:user_id (id, full_name, username, avatar_url),
            post_likes (user_id),
            comments (id)
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted = (data || [])
        .filter((item) => item.posts)
        .map((item: any) => {
          const post = item.posts;
          return {
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
            isLiked: post.post_likes?.some((like: any) => like.user_id === user.id) || false,
            isSaved: true,
            user: {
              id: post.profiles?.id,
              fullName: post.profiles?.full_name,
              username: post.profiles?.username,
              avatar: post.profiles?.avatar_url || "",
              hobbies: [],
            },
          };
        });

      setSavedPosts(formatted as Post[]);
    } catch (error: any) {
      toast.error("Failed to load saved posts");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Saved Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {savedPosts.length} saved posts
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : savedPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Bookmark className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No saved posts</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Save posts you love by tapping the bookmark icon
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {savedPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
