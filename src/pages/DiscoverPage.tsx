import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { cn, HOBBIES, MOCK_USERS } from "@/lib/utils";
import { Compass, Users, TrendingUp, Sparkles, ArrowRight } from "lucide-react";

const categories = Array.from(new Set(HOBBIES.map((h) => h.category)));

export default function DiscoverPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredHobbies = selectedCategory === "All"
    ? HOBBIES
    : HOBBIES.filter((h) => h.category === selectedCategory);

  const suggestedUsers = MOCK_USERS.filter((_, i) => i < 4);
  const popularCreators = MOCK_USERS.filter((_, i) => i >= 2 && i < 6);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Discover</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Explore new hobbies and connect with creators</p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2">
          {["All", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all",
                selectedCategory === cat
                  ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Hobbies Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Trending Hobbies</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filteredHobbies.map((hobby) => (
              <Link key={hobby.id} to={`/search?hobby=${hobby.id}`}>
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
            <Link to="/search" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View all
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {suggestedUsers.map((user) => (
              <Link key={user.id} to={`/profile/${user.username}`}>
                <Card hover className="flex items-center gap-4 p-4">
                  <Avatar name={user.fullName} size="lg" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {user.hobbies.slice(0, 2).map((h) => (
                        <Badge key={h} variant="outline" size="sm">
                          {HOBBIES.find((hb) => hb.id === h)?.name?.replace(/^[^\s]+\s/, "") || h}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button variant="primary" size="sm">Follow</Button>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Popular Creators */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Popular Creators</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularCreators.map((creator) => (
              <Link key={creator.id} to={`/profile/${creator.username}`}>
                <Card hover className="text-center p-6">
                  <Avatar name={creator.fullName} size="xl" className="mx-auto" />
                  <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100">{creator.fullName}</h3>
                  <p className="text-sm text-gray-500">@{creator.username}</p>
                  <div className="mt-2 flex items-center justify-center gap-3 text-sm text-gray-500">
                    <span className="font-medium text-gray-900 dark:text-gray-100">{creator.followers.toLocaleString()}</span> followers
                  </div>
                  <Button variant="outline" size="sm" className="mt-3 w-full">Follow</Button>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Communities */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-rose-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recommended Communities</h2>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {HOBBIES.filter((_, i) => i < 6).map((hobby) => (
              <Link key={hobby.id} to={`/search?hobby=${hobby.id}`}>
                <Card hover className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30">
                      <span className="text-xl">{hobby.name.split(" ")[0]}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {hobby.name.replace(/^[^\s]+\s/, "")}
                      </p>
                      <p className="text-sm text-gray-500">{Math.floor(Math.random() * 50 + 1)}K members</p>
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
