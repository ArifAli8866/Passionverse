import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { cn, HOBBIES } from "@/lib/utils";
import { Compass, Users, TrendingUp, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

const categories = Array.from(new Set(HOBBIES.map((h) => h.category)));

export default function DiscoverPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [popularCreators, setPopularCreators] = useState<any[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  const filteredHobbies = selectedCategory === "All"
    ? HOBBIES
    : HOBBIES.filter((h) => h.category === selectedCategory);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // Get users I already follow
      const { data: followingData } = await supabase
        .from("followers")
        .select("following_id")
        .eq("follower_id", user.id);
      const followingIds = new Set((followingData || []).map((f) => f.following_id));
      setFollowing(followingIds);

      // Get suggested users (not following, not self)
      const excludeIds = [user.id, ...Array.from(followingIds)];
      const { data: suggested } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, bio")
        .not("id", "in", `(${excludeIds.join(",")})`)
        .limit(6);
      setSuggestedUsers(suggested || []);

      // Get popular creators by follower count
      const { data: popular } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .neq("id", user.id)
        .limit(8);

      // Get follower counts
      const popularWithCounts = await Promise.all(
        (popular || []).map(async (p) => {
          const { count } = await supabase
            .from("followers")
            .select("*", { count: "exact", head: true })
            .eq("following_id", p.id);
          return { ...p, followersCount: count || 0 };
        })
      );
      popularWithCounts.sort((a, b) => b.followersCount - a.followersCount);
      setPopularCreators(popularWithCounts.slice(0, 4));
    } catch (error) {
      toast.error("Failed to load discover page");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFollow = async (e: React.MouseEvent, targetId: string) => {
    e.preventDefault();
    if (!user) return;
    try {
      if (following.has(targetId)) {
        await supabase.from("followers").delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetId);
        setFollowing((prev) => { const next = new Set(prev); next.delete(targetId); return next; });
      } else {
        await supabase.from("followers").insert({
          follower_id: user.id,
          following_id: targetId,
        });
        setFollowing((prev) => new Set([...prev, targetId]));
      }
    } catch (error) {
      toast.error("Failed to update follow");
    }
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Discover</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Explore new hobbies and connect with creators</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700")}>
              {cat}
            </button>
          ))}
        </div>

        {/* Hobbies Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trending Hobbies</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredHobbies.map((hobby) => (
              <Link key={hobby.id} to={`/search?q=${hobby.name}`}>
                <Card hover className="p-4 text-center">
                  <div className="text-2xl mb-2">{hobby.name.split(" ")[0]}</div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {hobby.name.replace(/^[^\s]+\s/, "")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{hobby.category}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Suggested Users */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Suggested for You</h2>
            </div>
            <Link to="/search" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">View all</Link>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : suggestedUsers.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No suggestions available right now</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {suggestedUsers.map((person) => (
                <Link key={person.id} to={`/profile/${person.username}`}>
                  <Card hover className="flex items-center gap-4 p-4">
                    <Avatar src={person.avatar_url} name={person.full_name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{person.full_name}</p>
                      <p className="text-sm text-gray-500">@{person.username}</p>
                      {person.bio && <p className="text-xs text-gray-400 mt-1 line-clamp-1">{person.bio}</p>}
                    </div>
                    <Button variant={following.has(person.id) ? "outline" : "primary"} size="sm"
                      onClick={(e) => handleFollow(e, person.id)}>
                      {following.has(person.id) ? "Following" : "Follow"}
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Popular Creators */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Popular Creators</h2>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse">
                  <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mx-auto" />
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto mt-3" />
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto mt-2" />
                </div>
              ))}
            </div>
          ) : popularCreators.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No creators found yet</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {popularCreators.map((creator) => (
                <Link key={creator.id} to={`/profile/${creator.username}`}>
                  <Card hover className="text-center p-6">
                    <Avatar src={creator.avatar_url} name={creator.full_name} size="xl" className="mx-auto" />
                    <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100 truncate">{creator.full_name}</h3>
                    <p className="text-sm text-gray-500">@{creator.username}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-gray-100">{creator.followersCount}</span> followers
                    </div>
                    <Button variant={following.has(creator.id) ? "outline" : "primary"} size="sm"
                      className="mt-3 w-full"
                      onClick={(e) => handleFollow(e, creator.id)}>
                      {following.has(creator.id) ? "Following" : "Follow"}
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Communities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommended Communities</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {HOBBIES.filter((_, i) => i < 6).map((hobby) => (
              <Link key={hobby.id} to={`/search?q=${hobby.name}`}>
                <Card hover className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <span className="text-xl">{hobby.name.split(" ")[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{hobby.name.replace(/^[^\s]+\s/, "")}</p>
                      <p className="text-sm text-gray-500">{hobby.category}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400" />
                </Card>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
