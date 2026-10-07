import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { cn, HOBBIES } from "@/lib/utils";
import type { User as UserType, PassionMatch, ProjectMatch } from "@/types";
import {
  Compass,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Rocket,
  Lightbulb,
  ExternalLink,
  Code,
} from "lucide-react";
import toast from "react-hot-toast";

// AI Components & Services
import PassionMatchCard from "@/components/ai/PassionMatchCard";
import AIProjectGeneratorModal from "@/components/ai/AIProjectGeneratorModal";
import PassionRoadmapModal from "@/components/ai/PassionRoadmapModal";
import ProjectMatchBadge from "@/components/ai/ProjectMatchBadge";
import { MatchingService } from "@/services/ai/MatchingService";
import { PassionAnalysisService } from "@/services/ai/PassionAnalysisService";

const categories = Array.from(new Set(HOBBIES.map((h) => h.category)));

export default function DiscoverPage() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [suggestedUsers, setSuggestedUsers] = useState<any[]>([]);
  const [aiMatches, setAiMatches] = useState<PassionMatch[]>([]);
  const [matchedProjects, setMatchedProjects] = useState<ProjectMatch[]>([]);
  const [popularCreators, setPopularCreators] = useState<any[]>([]);
  const [following, setFollowing] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeSuggestedTab, setActiveSuggestedTab] = useState<"ai" | "all">("ai");

  // Modals
  const [showProjectGenerator, setShowProjectGenerator] = useState(false);
  const [showRoadmapModal, setShowRoadmapModal] = useState(false);
  const [roadmapTopic, setRoadmapTopic] = useState("");

  const filteredHobbies =
    selectedCategory === "All"
      ? HOBBIES
      : HOBBIES.filter((h) => h.category === selectedCategory);

  useEffect(() => {
    if (user) fetchUsers();
  }, [user]);

  const fetchUsers = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      // 1. Get users I already follow
      const { data: followingData } = await supabase
        .from("followers")
        .select("following_id")
        .eq("follower_id", user.id);
      const followingIds = new Set((followingData || []).map((f) => f.following_id));
      setFollowing(followingIds);

      // 2. Get suggested users (not following, not self)
      const excludeIds = [user.id, ...Array.from(followingIds)];
      const { data: suggested } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, bio, hobbies, location, website")
        .not("id", "in", `(${excludeIds.join(",")})`)
        .limit(8);
      setSuggestedUsers(suggested || []);

      // 3. AI Passion Matching
      try {
        const candidateUsers: UserType[] = (suggested || []).map((p: any) => ({
          id: p.id,
          fullName: p.full_name || "Creator",
          username: p.username || "",
          avatar: p.avatar_url || "",
          bio: p.bio || "",
          location: p.location || "",
          website: p.website || "",
          hobbies: Array.isArray(p.hobbies) ? p.hobbies : p.hobbies ? JSON.parse(p.hobbies) : [],
          followers: 0,
          following: 0,
          posts: 0,
        }));

        const myProfile = await PassionAnalysisService.analyzeUser({
          userId: user.id,
          bio: user.bio,
          hobbies: user.hobbies,
          posts: [],
        });

        const matches = await MatchingService.matchUsers(myProfile, candidateUsers);
        setAiMatches(matches);

        // 4. Fetch Project posts for Project Matching
        const { data: projectData } = await supabase
          .from("posts")
          .select("*, profiles:user_id (id, full_name, username, avatar_url)")
          .eq("type", "project")
          .neq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(4);

        if (projectData && projectData.length > 0) {
          const matchedProjectsList: ProjectMatch[] = projectData.map((p: any) => {
            const formattedPost = {
              id: p.id,
              userId: p.user_id,
              content: p.content,
              caption: p.caption,
              imageUrl: p.image_url,
              type: p.type,
              projectTitle: p.project_title,
              projectDescription: p.project_description,
              githubLink: p.github_link,
              demoLink: p.demo_link,
              techStack: p.tech_stack,
              likesCount: p.likes_count || 0,
              commentsCount: p.comments_count || 0,
              createdAt: p.created_at,
              user: {
                id: p.profiles?.id,
                fullName: p.profiles?.full_name || "Maker",
                username: p.profiles?.username || "",
                avatar: p.profiles?.avatar_url || "",
                bio: "",
                location: "",
                website: "",
                hobbies: [],
                followers: 0,
                following: 0,
                posts: 0,
              },
            };
            return MatchingService.matchProjectToUser(formattedPost as any, myProfile);
          });
          setMatchedProjects(matchedProjectsList);
        }
      } catch (aiErr) {
        console.warn("AI matching computation error:", aiErr);
      }

      // 5. Get popular creators by follower count
      const { data: popular } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .neq("id", user.id)
        .limit(8);

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

  const handleFollow = async (e: React.MouseEvent | undefined, targetId: string) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!user) return;
    try {
      if (following.has(targetId)) {
        await supabase
          .from("followers")
          .delete()
          .eq("follower_id", user.id)
          .eq("following_id", targetId);
        setFollowing((prev) => {
          const next = new Set(prev);
          next.delete(targetId);
          return next;
        });
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
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Compass className="w-6 h-6 text-indigo-600" /> Discover
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Explore passions, find intelligent collaborators, and build projects
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setRoadmapTopic("");
                setShowRoadmapModal(true);
              }}
              className="text-xs"
            >
              <Lightbulb className="w-3.5 h-3.5 mr-1 text-purple-500" />
              Passion Roadmap
            </Button>
            <Button
              size="sm"
              onClick={() => setShowProjectGenerator(true)}
              className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs shadow-md shadow-indigo-500/20"
            >
              <Rocket className="w-3.5 h-3.5 mr-1" />
              AI Project Generator
            </Button>
          </div>
        </div>

        {/* AI Innovation Studio Banner */}
        <div className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white shadow-xl shadow-indigo-500/10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5" />
                Passionverse AI Engine
              </div>
              <h2 className="text-xl font-bold">Turn Any Hobby Into Your Next Big Project</h2>
              <p className="text-xs text-white/80 leading-relaxed">
                Our free local AI analyzes your skills, generates step-by-step roadmaps, and
                intelligently matches you with makers who complement your strengths.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setShowProjectGenerator(true)}
                className="rounded-xl bg-white px-4 py-2 text-xs font-bold text-indigo-700 shadow-md hover:bg-gray-50 transition-all"
              >
                Spark Project Idea
              </button>
              <button
                type="button"
                onClick={() => {
                  setRoadmapTopic("Full Stack AI Development");
                  setShowRoadmapModal(true);
                }}
                className="rounded-xl border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xs hover:bg-white/20 transition-all"
              >
                Create Learning Roadmap
              </button>
            </div>
          </div>
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

        {/* AI Passion Matching / Suggested Users */}
        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {activeSuggestedTab === "ai" ? "PassionMatch AI — Smart Collaborators" : "Suggested Creators"}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="inline-flex rounded-xl bg-gray-100 p-0.5 dark:bg-gray-800 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveSuggestedTab("ai")}
                  className={cn(
                    "px-3 py-1 rounded-lg font-medium transition-all",
                    activeSuggestedTab === "ai"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-gray-900 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  )}
                >
                  AI Matches
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSuggestedTab("all")}
                  className={cn(
                    "px-3 py-1 rounded-lg font-medium transition-all",
                    activeSuggestedTab === "all"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-gray-900 dark:text-indigo-400"
                      : "text-gray-500 hover:text-gray-900 dark:text-gray-400"
                  )}
                >
                  All Suggestions
                </button>
              </div>
              <Link to="/search" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium ml-2">
                View all
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
                >
                  <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : activeSuggestedTab === "ai" && aiMatches.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {aiMatches.map((match) => (
                <PassionMatchCard
                  key={match.user.id}
                  match={match}
                  isFollowing={following.has(match.user.id)}
                  onFollow={(targetId) => handleFollow(undefined, targetId)}
                />
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
                      <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {person.full_name}
                      </p>
                      <p className="text-sm text-gray-500">@{person.username}</p>
                      {person.bio && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{person.bio}</p>
                      )}
                    </div>
                    <Button
                      variant={following.has(person.id) ? "outline" : "primary"}
                      size="sm"
                      onClick={(e) => handleFollow(e, person.id)}
                    >
                      {following.has(person.id) ? "Following" : "Follow"}
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* AI Matched Projects Showcase */}
        {matchedProjects.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-indigo-600" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Projects Matched to Your Skills
                </h2>
              </div>
              <span className="text-xs text-gray-400 font-medium">Ranked by skill compatibility</span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {matchedProjects.map((match) => (
                <Card
                  key={match.post.id}
                  hover
                  className="p-4 flex flex-col justify-between border-indigo-50 dark:border-gray-800"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                          {match.post.projectTitle || "Untitled Project"}
                        </h3>
                        <Link
                          to={`/profile/${match.post.user?.username}`}
                          className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1.5 mt-0.5"
                        >
                          <Avatar
                            src={match.post.user?.avatar}
                            name={match.post.user?.fullName}
                            size="xs"
                          />
                          by {match.post.user?.fullName}
                        </Link>
                      </div>
                      <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        {match.matchScore}% Match
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {match.post.projectDescription || match.post.content}
                    </p>

                    <ProjectMatchBadge match={match} />
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {match.post.githubLink && (
                        <a
                          href={match.post.githubLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-200"
                        >
                          <Code className="w-3.5 h-3.5" /> Code
                        </a>
                      )}
                      {match.post.demoLink && (
                        <a
                          href={match.post.demoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Demo
                        </a>
                      )}
                    </div>
                    <Link
                      to={`/feed`}
                      className="font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                    >
                      View on Feed <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Trending Hobbies Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Trending Hobbies
            </h2>
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

        {/* Popular Creators */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Popular Creators
            </h2>
          </div>
          {isLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="text-center p-6 rounded-2xl border border-gray-100 dark:border-gray-800 animate-pulse"
                >
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
                    <Avatar
                      src={creator.avatar_url}
                      name={creator.full_name}
                      size="xl"
                      className="mx-auto"
                    />
                    <h3 className="mt-3 font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {creator.full_name}
                    </h3>
                    <p className="text-sm text-gray-500">@{creator.username}</p>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="font-medium text-gray-900 dark:text-gray-100">
                        {creator.followersCount}
                      </span>{" "}
                      followers
                    </div>
                    <Button
                      variant={following.has(creator.id) ? "outline" : "primary"}
                      size="sm"
                      className="mt-3 w-full"
                      onClick={(e) => handleFollow(e, creator.id)}
                    >
                      {following.has(creator.id) ? "Following" : "Follow"}
                    </Button>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Recommended Communities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-rose-500" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Recommended Communities
            </h2>
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
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {hobby.name.replace(/^[^\s]+\s/, "")}
                      </p>
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

      {/* AI Modals */}
      <AIProjectGeneratorModal
        isOpen={showProjectGenerator}
        onClose={() => setShowProjectGenerator(false)}
      />

      <PassionRoadmapModal
        isOpen={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        initialTopic={roadmapTopic}
        onOpenProjectGenerator={(topic) => setShowProjectGenerator(true)}
      />
    </AppLayout>
  );
}
