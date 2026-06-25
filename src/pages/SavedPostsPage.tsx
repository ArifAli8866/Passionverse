import AppLayout from "@/components/layout/AppLayout";
import PostCard from "@/components/feed/PostCard";
import { MOCK_POSTS } from "@/lib/utils";
import type { Post } from "@/types";
import { Bookmark } from "lucide-react";

export default function SavedPostsPage() {
  // In production, this would fetch from the database
  const savedPosts = (MOCK_POSTS as Post[]).filter((_, i) => [0, 2, 4].includes(i)).map(p => ({ ...p, isSaved: true }));

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Saved Posts</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {savedPosts.length} saved posts
          </p>
        </div>

        {savedPosts.length === 0 ? (
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
