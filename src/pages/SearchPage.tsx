import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { cn, HOBBIES } from "@/lib/utils";
import {
  Search,
  Users,
  Hash,
  MapPin,
  Sparkles,
  Rocket,
  ExternalLink,
  Code,
  CheckCircle2,
} from "lucide-react";
import { EmbeddingService } from "@/services/ai/EmbeddingService";
import { analyzeTextTaxonomy } from "@/services/ai/taxonomy";

type SearchTab = "people" | "projects" | "posts" | "hobbies";

const NATURAL_PROMPTS = [
  "Find people interested in AI and robotics",
  "Beginner Python developers",
  "Projects involving computer vision",
  "Photographers interested in travel",
];

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<SearchTab>("people");
  const [people, setPeople] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [semanticMode, setSemanticMode] = useState(true);

  const filteredHobbies = HOBBIES.filter(
    (h) =>
      h.name.toLowerCase().includes(query.toLowerCase()) ||
      h.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (query.trim().length < 1) {
      setPeople([]);
      setPosts([]);
      setProjects([]);
      return;
    }
    const timer = setTimeout(() => {
      searchAll(query);
    }, 350);
    return () => clearTimeout(timer);
  }, [query, semanticMode]);

  const searchAll = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const termLower = searchTerm.toLowerCase();
      const taxonomy = analyzeTextTaxonomy(searchTerm);
      const queryVector = EmbeddingService.generateSemanticFallbackVector(searchTerm);

      // 1. Search People
      let candidatePeople: any[] = [];
      if (semanticMode) {
        // Broad fetch to re-rank with semantic similarity
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url, bio, hobbies, location")
          .limit(35);

        if (data) {
          candidatePeople = data.map((p) => {
            const hobbiesArr = Array.isArray(p.hobbies)
              ? p.hobbies
              : p.hobbies
              ? JSON.parse(p.hobbies)
              : [];
            const profileText = `${p.full_name} ${p.username} ${p.bio || ""} ${hobbiesArr.join(" ")}`;
            const profileVector = EmbeddingService.generateSemanticFallbackVector(profileText);
            const sim = EmbeddingService.cosineSimilarity(queryVector, profileVector);

            // Check taxonomy overlap
            const matchedTaxonomy = taxonomy.matchedCategories.filter((cat) =>
              profileText.toLowerCase().includes(cat.toLowerCase())
            );

            const score = Math.round(
              Math.min(99, Math.max(30, (sim * 0.65 + matchedTaxonomy.length * 0.2 + 0.15) * 100))
            );

            return {
              ...p,
              hobbiesArr,
              semanticScore: score,
              matchedTaxonomy,
            };
          });

          // Sort by semantic score descending
          candidatePeople.sort((a, b) => b.semanticScore - a.semanticScore);
        }
      } else {
        // Standard SQL keyword query
        const { data } = await supabase
          .from("profiles")
          .select("id, full_name, username, avatar_url, bio, location")
          .or(`full_name.ilike.%${searchTerm}%,username.ilike.%${searchTerm}%`)
          .limit(15);
        candidatePeople = data || [];
      }
      setPeople(candidatePeople);

      // 2. Search Posts & Projects
      const { data: postsData } = await supabase
        .from("posts")
        .select(
          "*, profiles:user_id (id, full_name, username, avatar_url), post_likes (user_id), comments (id)"
        )
        .order("created_at", { ascending: false })
        .limit(40);

      if (postsData) {
        const scoredPosts = postsData.map((post) => {
          const contentText = `${post.content || ""} ${post.project_title || ""} ${post.project_description || ""} ${post.tech_stack || ""}`;
          const postVector = EmbeddingService.generateSemanticFallbackVector(contentText);
          const sim = EmbeddingService.cosineSimilarity(queryVector, postVector);
          const containsWord = contentText.toLowerCase().includes(termLower);
          const score = Math.round(
            Math.min(99, Math.max(25, (sim * 0.7 + (containsWord ? 0.3 : 0)) * 100))
          );
          return {
            ...post,
            semanticScore: score,
          };
        });

        // Separate general posts and project posts
        const sortedGeneral = scoredPosts
          .filter((p) => p.type !== "project" && (semanticMode ? p.semanticScore > 40 : p.content?.toLowerCase().includes(termLower)))
          .sort((a, b) => (semanticMode ? b.semanticScore - a.semanticScore : 0));

        const sortedProjects = scoredPosts
          .filter((p) => p.type === "project" && (semanticMode ? p.semanticScore > 40 : true))
          .sort((a, b) => (semanticMode ? b.semanticScore - a.semanticScore : 0));

        setPosts(sortedGeneral.slice(0, 15));
        setProjects(sortedProjects.slice(0, 10));
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Search Header */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Search className="w-6 h-6 text-indigo-600" />
              Discover & Search
            </h1>

            {/* Semantic Mode Toggle */}
            <button
              type="button"
              onClick={() => setSemanticMode(!semanticMode)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border",
                semanticMode
                  ? "bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800 shadow-xs"
                  : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
              )}
            >
              <Sparkles className={cn("w-3.5 h-3.5", semanticMode ? "text-purple-600 animate-pulse" : "text-gray-400")} />
              {semanticMode ? "Semantic AI Search: ON" : "Keyword Search"}
            </button>
          </div>

          {/* Search Bar Input */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSearchParams({ q: e.target.value });
              }}
              placeholder={
                semanticMode
                  ? 'Ask anything (e.g. "Find people interested in AI and robotics", "Beginner Python developers")...'
                  : "Search people, hobbies, posts..."
              }
              autoFocus
              className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 shadow-xs focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Natural Query Suggestion Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[11px] font-medium text-gray-400 mr-1">Suggestions:</span>
            {NATURAL_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setQuery(prompt);
                  setSearchParams({ q: prompt });
                }}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-800 dark:hover:bg-indigo-950/40 dark:hover:text-indigo-300 text-gray-600 dark:text-gray-300 transition-colors"
              >
                ✨ {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
          {[
            { id: "people" as const, label: `People (${people.length})`, icon: Users },
            { id: "projects" as const, label: `Projects (${projects.length})`, icon: Rocket },
            { id: "posts" as const, label: `Posts (${posts.length})`, icon: Search },
            { id: "hobbies" as const, label: "Hobbies", icon: Hash },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all flex-1 justify-center",
                activeTab === tab.id
                  ? "bg-white dark:bg-gray-900 text-indigo-600 dark:text-indigo-400 shadow-xs"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
              )}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-2 text-sm text-gray-400">
            <Sparkles className="w-5 h-5 text-indigo-500 animate-spin" />
            <span>Scanning semantic vectors and taxonomy...</span>
          </div>
        )}

        {/* People Results */}
        {activeTab === "people" && !isLoading && (
          <div className="space-y-3">
            {query.trim() === "" ? (
              <EmptyState
                icon={Users}
                title="Search for Passionate People"
                desc="Try natural phrases like 'Find beginner Python developers' or 'Photographers in Tokyo'"
              />
            ) : people.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No creators found"
                desc="Try adjusting your semantic query or toggling keyword search"
              />
            ) : (
              people.map((person) => (
                <Link key={person.id} to={`/profile/${person.username}`}>
                  <Card hover className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 min-w-0">
                      <Avatar src={person.avatar_url} name={person.full_name} size="lg" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {person.full_name}
                          </p>
                          <span className="text-xs text-gray-400">@{person.username}</span>
                        </div>
                        {person.location && (
                          <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {person.location}
                          </p>
                        )}
                        {person.bio && (
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">
                            {person.bio}
                          </p>
                        )}
                        {person.hobbiesArr && person.hobbiesArr.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {person.hobbiesArr.slice(0, 4).map((h: string, i: number) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                              >
                                {h}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {semanticMode && person.semanticScore && (
                      <div className="shrink-0 text-right">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <Sparkles className="w-3 h-3 text-indigo-500" />
                          {person.semanticScore}% Match
                        </span>
                      </div>
                    )}
                  </Card>
                </Link>
              ))
            )}
          </div>
        )}

        {/* Projects Results */}
        {activeTab === "projects" && !isLoading && (
          <div className="space-y-3">
            {query.trim() === "" ? (
              <EmptyState
                icon={Rocket}
                title="Discover Projects"
                desc="Search projects by tech stack, difficulty, or natural description"
              />
            ) : projects.length === 0 ? (
              <EmptyState
                icon={Rocket}
                title="No projects found"
                desc="Try describing the kind of project you're looking for"
              />
            ) : (
              projects.map((proj) => (
                <Card key={proj.id} hover className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                        {proj.project_title || "Showcase Project"}
                      </h3>
                      <Link
                        to={`/profile/${proj.profiles?.username}`}
                        className="text-xs text-gray-500 hover:text-indigo-600 flex items-center gap-1.5 mt-0.5"
                      >
                        <Avatar
                          src={proj.profiles?.avatar_url}
                          name={proj.profiles?.full_name}
                          size="xs"
                        />
                        by {proj.profiles?.full_name || "Maker"}
                      </Link>
                    </div>
                    {semanticMode && proj.semanticScore && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {proj.semanticScore}% Relevance
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {proj.project_description || proj.content}
                  </p>

                  {proj.tech_stack && (
                    <div className="flex flex-wrap gap-1">
                      {proj.tech_stack.split(",").map((t: string, idx: number) => (
                        <span
                          key={idx}
                          className="text-[10px] px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-gray-800 text-xs">
                    {proj.github_link && (
                      <a
                        href={proj.github_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-gray-600 hover:text-gray-900 dark:text-gray-300"
                      >
                        <Code className="w-3.5 h-3.5" /> Code Repo
                      </a>
                    )}
                    {proj.demo_link && (
                      <a
                        href={proj.demo_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                      </a>
                    )}
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Posts Results */}
        {activeTab === "posts" && !isLoading && (
          <div className="space-y-3">
            {query.trim() === "" ? (
              <EmptyState
                icon={Search}
                title="Search for Posts"
                desc="Find discussions, questions, and tutorials"
              />
            ) : posts.length === 0 ? (
              <EmptyState icon={Search} title="No posts found" desc="Try different terms" />
            ) : (
              posts.map((post) => (
                <Card key={post.id} hover className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Link to={`/profile/${post.profiles?.username}`}>
                      <Avatar
                        src={post.profiles?.avatar_url}
                        name={post.profiles?.full_name}
                        size="sm"
                      />
                    </Link>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {post.profiles?.full_name}
                      </p>
                      <p className="text-xs text-gray-500">@{post.profiles?.username}</p>
                    </div>
                    {semanticMode && post.semanticScore && (
                      <span className="ml-auto text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        {post.semanticScore}% Semantic
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
                    {post.content}
                  </p>
                  {post.image_url && post.type === "image" && (
                    <img
                      src={post.image_url}
                      alt="Post"
                      className="mt-2 rounded-xl w-full max-h-48 object-cover"
                    />
                  )}
                  <div className="flex items-center gap-4 mt-2.5 text-xs text-gray-400">
                    <span>❤️ {post.post_likes?.length || 0} likes</span>
                    <span>💬 {post.comments?.length || 0} comments</span>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Hobbies Results */}
        {activeTab === "hobbies" && !isLoading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredHobbies.length === 0 ? (
              <div className="col-span-full">
                <EmptyState icon={Hash} title="No hobbies found" desc="Try a different keyword" />
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
      <p className="text-xs text-gray-500 dark:text-gray-400 max-w-sm mx-auto mt-1">{desc}</p>
    </div>
  );
}
