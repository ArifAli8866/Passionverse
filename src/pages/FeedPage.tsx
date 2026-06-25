import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import CreatePostCard from "@/components/feed/CreatePostCard";
import PostCard from "@/components/feed/PostCard";
import FeedTabs from "@/components/feed/FeedTabs";
import { Skeleton } from "@/components/ui/card";
import { MOCK_POSTS } from "@/lib/utils";
import type { Post, FeedType } from "@/types";
import { Flame, RefreshCw } from "lucide-react";

export default function FeedPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<FeedType>("global");
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setPosts(MOCK_POSTS as Post[]);
      setIsLoading(false);
    }, 800);
  }, [activeTab]);

  // Infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Load more posts
        }
      },
      { threshold: 0.5 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const userHobbies = user?.hobbies || [];

  const filteredPosts = activeTab === "hobby"
    ? posts.filter((post) =>
        post.user.hobbies.some((h) => userHobbies.includes(h))
      )
    : posts;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Page Header */}
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
          <button className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {/* Feed Tabs */}
        <FeedTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Create Post */}
        <CreatePostCard />

        {/* Posts */}
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
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-48 h-48 rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Flame className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No posts yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {activeTab === "following"
                ? "Follow people to see their posts here"
                : activeTab === "hobby"
                ? "Select hobbies to personalize your feed"
                : "Be the first to share something!"}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
            {/* Infinite Scroll Loader */}
            <div ref={loaderRef} className="flex justify-center py-8">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                Loading more posts...
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
