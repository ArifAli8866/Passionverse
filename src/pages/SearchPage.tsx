import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { cn, HOBBIES } from "@/lib/utils";
import { Search, Users, Hash, MapPin } from "lucide-react";

type SearchTab = "people" | "hobbies" | "posts";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>("people");
  const [people, setPeople] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredHobbies = HOBBIES.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (query.trim().length < 1) {
      setPeople([]);
      setPosts([]);
      return;
    }
    const timer = setTimeout(() => {
      searchAll(query);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  const searchAll = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      // Search people
      const { data: peopleData } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, bio, location")
        .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
        .limit(10);
      setPeople(peopleData || []);

      // Search posts
      const { data: postsData } = await supabase
        .from("posts")
        .select("*, profiles:user_id (id, full_name, username, avatar_url), post_likes (user_id), comments (id)")
        .ilike("content", `%${searchTerm}%`)
        .order("created_at", { ascending: false })
        .limit(10);
      setPosts(postsData || []);
    } catch (error) {
      console.error("Search failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSearchParams({ q: e.target.value });
            }}
            placeholder="Search people, hobbies, posts..."
            autoFocus
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800 mb-6">
          {[
            { id: "people" as const, label: "People", icon: Users },
            { id: "hobbies" as const, label: "Hobbies", icon: Hash },
            { id: "posts" as const, label: "Posts", icon: Search },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all flex-1 justify-center",
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="text-center py-8 text-sm text-gray-400">Searching...</div>
        )}

        {/* People Results */}
        {activeTab === "people" && !isLoading && (
          <div className="space-y-3">
            {query.trim() === "" ? (
              <EmptyState icon={Users} title="Search for people" desc="Type a name or username to find people" />
            ) : people.length === 0 ? (
              <EmptyState icon={Users} title="No people found" desc="Try a different search term" />
            ) : (
              people.map((person) => (
                <Link key={person.id} to={`/profile/${person.username}`}>
                  <Card hover className="flex items-center gap-4 p-4">
                    <Avatar name={person.full_name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{person.full_name}</p>
                      <p className="text-sm text-gray-500">@{person.username}</p>
                      {person.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {person.location}
                        </p>
                      )}
                      {person.bio && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{person.bio}</p>
                      )}
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Hobbies Results */}
        {activeTab === "hobbies" && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredHobbies.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={Hash} title="No hobbies found" desc="Try a different category" />
              </div>
            ) : (
              filteredHobbies.map((hobby) => (
                <Link key={hobby.id} to={`/search?q=${hobby.name}`}>
                  <Card hover className="p-4 text-center">
                    <div className="text-2xl mb-2">{hobby.name.split(" ")[0]}</div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {hobby.name.replace(/^[^\s]+\s/, "")}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{hobby.category}</p>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Posts Results */}
        {activeTab === "posts" && !isLoading && (
          <div className="space-y-3">
            {query.trim() === "" ? (
              <EmptyState icon={Search} title="Search for posts" desc="Type keywords to find posts" />
            ) : posts.length === 0 ? (
              <EmptyState icon={Search} title="No posts found" desc="Try different keywords" />
            ) : (
              posts.map((post) => (
                <Card key={post.id} hover className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/profile/${post.profiles?.username}`}>
                      <Avatar name={post.profiles?.full_name} size="sm" />
                    </Link>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {post.profiles?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">@{post.profiles?.username}</p>
                    </div>
                    {post.type !== "text" && (
                      <Badge variant="outline" size="sm" className="ml-auto capitalize">{post.type}</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{post.content}</p>
                  {post.image_url && post.type === "image" && (
                    <img src={post.image_url} alt="Post" className="mt-2 rounded-xl w-full max-h-40 object-cover" />
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span>❤️ {post.post_likes?.length || 0}</span>
                    <span>💬 {post.comments?.length || 0}</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

function EmptyState({ icon: Icon, title, desc }: { icon: any; title: string; desc: string }) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-3">
        <Icon className="h-7 w-7 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
    </div>
  );
}
