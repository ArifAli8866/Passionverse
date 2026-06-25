import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, HOBBIES, MOCK_USERS, MOCK_POSTS } from "@/lib/utils";
import { Search, Users, Hash, MapPin } from "lucide-react";
import type { User } from "@/types";

type SearchTab = "people" | "hobbies" | "posts";

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialHobby = searchParams.get("hobby") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>(initialHobby ? "hobbies" : "people");
  const [results, setResults] = useState<{
    people: User[];
    hobbies: { id: string; name: string; category: string }[];
    posts: typeof MOCK_POSTS;
  }>({
    people: [],
    hobbies: [],
    posts: [],
  });

  useEffect(() => {
    const searchTerm = query.toLowerCase();
    const hobbyFilter = initialHobby.toLowerCase();

    const filteredHobbies = HOBBIES.filter(
      (h) =>
        h.name.toLowerCase().includes(hobbyFilter || searchTerm) ||
        h.category.toLowerCase().includes(searchTerm)
    );

    const filteredPeople = MOCK_USERS.filter(
      (u) =>
        u.fullName.toLowerCase().includes(searchTerm) ||
        u.username.toLowerCase().includes(searchTerm) ||
        u.hobbies.some((h) => h.includes(searchTerm))
    );

    const filteredPosts = MOCK_POSTS.filter(
      (p) =>
        p.content.toLowerCase().includes(searchTerm) ||
        p.user.fullName.toLowerCase().includes(searchTerm)
    );

    setResults({ people: filteredPeople as User[], hobbies: filteredHobbies, posts: filteredPosts });
  }, [query, initialHobby]);

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

        {/* Results */}
        {activeTab === "people" && (
          <div className="space-y-3">
            {results.people.length === 0 ? (
              <EmptyState icon={Users} title="No people found" desc="Try a different search term" />
            ) : (
              results.people.map((user) => (
                <Link key={user.id} to={`/profile/${user.username}`}>
                  <Card hover className="flex items-center gap-4 p-4">
                    <Avatar name={user.fullName} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{user.fullName}</p>
                      <p className="text-sm text-gray-500">@{user.username}</p>
                      {user.location && (
                        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" /> {user.location}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {user.hobbies.slice(0, 3).map((h) => (
                          <Badge key={h} variant="outline" size="sm">
                            {HOBBIES.find((hb) => hb.id === h)?.name?.replace(/^[^\s]+\s/, "") || h}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{user.followers} followers</p>
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {activeTab === "hobbies" && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {results.hobbies.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={Hash} title="No hobbies found" desc="Try a different category" />
              </div>
            ) : (
              results.hobbies.map((hobby) => (
                <Link key={hobby.id} to={`/search?hobby=${hobby.id}`}>
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

        {activeTab === "posts" && (
          <div className="space-y-3">
            {results.posts.length === 0 ? (
              <EmptyState icon={Search} title="No posts found" desc="Try different keywords" />
            ) : (
              results.posts.map((post) => (
                <Link key={post.id} to="/feed" className="block">
                  <Card hover className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Avatar name={post.user.fullName} size="sm" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {post.user.fullName}
                        </p>
                        <p className="text-xs text-gray-500">@{post.user.username}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{post.content}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                      <span>❤️ {post.likes}</span>
                      <span>💬 {post.comments}</span>
                    </div>
                  </Card>
                </Link>
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
