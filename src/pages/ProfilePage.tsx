import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PostCard from "@/components/feed/PostCard";
import { Skeleton } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatCount } from "@/lib/utils";
import type { Post } from "@/types";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Image as ImageIcon,
  Grid,
  Settings,
  UserPlus,
  UserCheck,
  MessageCircle,
  Camera,
  Pencil,
  Trash2,
  X,
  Check,
  Share2,
  Sparkles,
  FolderKanban,
  Flame,
  Award,
  Compass,
} from "lucide-react";
import AIPassionProfileCard from "@/components/ai/AIPassionProfileCard";
import toast from "react-hot-toast";

type ProfileTab = "all" | "projects" | "media" | "intelligence";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [activeTab, setActiveTab] = useState<ProfileTab>("all");
  const isOwnProfile = currentUser?.username === username;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("username", username)
          .single();
        if (error) throw error;
        setProfileUser(profile);

        const { count: fCount } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profile.id);
        setFollowersCount(fCount || 0);

        const { count: fgCount } = await supabase
          .from("followers")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profile.id);
        setFollowingCount(fgCount || 0);

        if (currentUser && !isOwnProfile) {
          const { data: followData } = await supabase
            .from("followers")
            .select("*")
            .eq("follower_id", currentUser.id)
            .eq("following_id", profile.id)
            .single();
          setIsFollowing(!!followData);
        }

        const { data: posts } = await supabase
          .from("posts")
          .select(
            "*, profiles:user_id (id, full_name, username, avatar_url), post_likes (user_id), comments (id)"
          )
          .eq("user_id", profile.id)
          .order("created_at", { ascending: false });

        const formatted = (posts || []).map((post: any) => ({
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
          isLiked:
            post.post_likes?.some(
              (like: any) => like.user_id === currentUser?.id
            ) || false,
          user: {
            id: post.profiles?.id,
            fullName: post.profiles?.full_name,
            username: post.profiles?.username,
            avatar: post.profiles?.avatar_url || "",
            hobbies: [],
          },
        }));
        setUserPosts(formatted as Post[]);
      } catch (error: any) {
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };
    if (username) fetchProfile();
  }, [username, currentUser]);

  const handleFollow = async () => {
    if (!currentUser || !profileUser) return;
    try {
      if (isFollowing) {
        await supabase
          .from("followers")
          .delete()
          .eq("follower_id", currentUser.id)
          .eq("following_id", profileUser.id);
        setFollowersCount((prev) => Math.max(0, prev - 1));
      } else {
        await supabase
          .from("followers")
          .insert({ follower_id: currentUser.id, following_id: profileUser.id });
        setFollowersCount((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      toast.error("Failed to update follow");
    }
  };

  const handleShareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await supabase.from("posts").delete().eq("id", postId);
      setUserPosts((prev) => prev.filter((p) => p.id !== postId));
      toast.success("Post deleted!");
    } catch (error: any) {
      toast.error("Failed to delete post");
    }
  };

  const handleEditPost = async (postId: string) => {
    if (!editContent.trim()) return;
    try {
      await supabase
        .from("posts")
        .update({ content: editContent })
        .eq("id", postId);
      setUserPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, content: editContent } : p))
      );
      setEditingPostId(null);
      toast.success("Post updated!");
    } catch (error: any) {
      toast.error("Failed to update post");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setCoverUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `covers/${currentUser.id}/cover.${ext}`;
      const { data, error } = await supabase.storage
        .from("covers")
        .upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from("covers")
        .getPublicUrl(data.path);
      await supabase
        .from("profiles")
        .update({ cover_url: urlData.publicUrl })
        .eq("id", currentUser.id);
      setProfileUser((prev: any) => ({ ...prev, cover_url: urlData.publicUrl }));
      toast.success("Cover photo updated!");
    } catch (error: any) {
      toast.error("Failed to upload cover");
    } finally {
      setCoverUploading(false);
    }
  };

  const projectPosts = userPosts.filter(
    (p) => p.type === "project" || !!p.projectTitle
  );
  const mediaPosts = userPosts.filter((p) => !!p.imageUrl);

  const displayedPosts =
    activeTab === "projects"
      ? projectPosts
      : activeTab === "media"
      ? mediaPosts
      : userPosts;

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="w-full h-56 rounded-3xl" />
          <div className="flex items-end gap-5 -mt-16 px-6">
            <Skeleton className="w-28 h-28 rounded-3xl border-4 border-white dark:border-gray-950" />
            <div className="space-y-2 flex-1 pb-2">
              <Skeleton className="w-48 h-7 rounded-xl" />
              <Skeleton className="w-28 h-4 rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profileUser) {
    return (
      <AppLayout>
        <div className="max-w-md mx-auto text-center py-20 px-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 mb-4">
            <Compass className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Creator Not Found
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
            The profile you are looking for does not exist or has been removed.
          </p>
          <Link
            to="/feed"
            className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-sm transition-all shadow-md shadow-violet-200 dark:shadow-none"
          >
            Back to Feed
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Cover Banner */}
        <div className="relative h-48 sm:h-64 rounded-3xl overflow-hidden bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 shadow-md group">
          {profileUser.cover_url ? (
            <img
              src={profileUser.cover_url}
              alt="Cover"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Modern SaaS generative grid background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -top-10 -left-10 w-64 h-64 bg-fuchsia-400/20 rounded-full blur-3xl pointer-events-none" />
            </>
          )}

          {/* Action pills on Cover */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShareProfile}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-md transition-all shadow-sm"
              title="Share Profile"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {isOwnProfile && (
              <>
                <label
                  htmlFor="cover-upload"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 hover:bg-black/60 text-white text-xs font-medium backdrop-blur-md transition-all cursor-pointer shadow-sm"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{coverUploading ? "Uploading..." : "Change Cover"}</span>
                </label>
                <input
                  id="cover-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>

        {/* Profile Card & Info */}
        <div className="relative px-4 sm:px-6 -mt-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            {/* Avatar & Identifiers */}
            <div className="flex items-end gap-4">
              <div className="relative">
                <Avatar
                  src={profileUser.avatar_url || undefined}
                  name={profileUser.full_name}
                  size="xl"
                  className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl ring-4 ring-white dark:ring-gray-950 shadow-xl object-cover"
                />
                <span
                  className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-950"
                  title="Active Creator"
                />
              </div>

              <div className="pb-1.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">
                    {profileUser.full_name}
                  </h1>
                  <Badge variant="primary" size="sm" className="hidden sm:inline-flex gap-1 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-violet-500 fill-violet-500" />
                    Creator
                  </Badge>
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  @{profileUser.username}
                </p>
              </div>
            </div>

            {/* Profile CTA Buttons */}
            <div className="flex items-center gap-2 self-start sm:self-end pt-2 sm:pt-0">
              {isOwnProfile ? (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/settings")}
                    className="gap-2 shadow-xs"
                  >
                    <Settings className="w-4 h-4" /> Edit Profile
                  </Button>
                  <Link to="/create-post">
                    <Button variant="primary" size="sm" className="gap-2 shadow-xs">
                      <Sparkles className="w-4 h-4" /> New Post
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    size="sm"
                    onClick={handleFollow}
                    className="gap-2"
                  >
                    {isFollowing ? (
                      <>
                        <UserCheck className="w-4 h-4" /> Following
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" /> Follow
                      </>
                    )}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate("/messages")}
                    className="gap-2"
                  >
                    <MessageCircle className="w-4 h-4" /> Message
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Bio & Details */}
          <div className="mt-5 space-y-3.5">
            {profileUser.bio && (
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl">
                {profileUser.bio}
              </p>
            )}

            {/* Passions / Hobbies Pills */}
            {profileUser.hobbies && profileUser.hobbies.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {profileUser.hobbies.map((hobby: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-medium bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-100 dark:border-violet-900/40"
                  >
                    #{hobby}
                  </span>
                ))}
              </div>
            )}

            {/* Metadata Chips */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {profileUser.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {profileUser.location}
                </span>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-violet-600 dark:text-violet-400 hover:underline font-medium"
                >
                  <LinkIcon className="w-4 h-4" />
                  {profileUser.website.replace(/https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Joined {new Date(profileUser.created_at || Date.now()).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-gray-400" />
                {formatCount(followersCount)} followers
              </span>
            </div>
          </div>

          {/* SaaS Stat Metric Cards */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl border border-gray-100 bg-white/80 dark:bg-gray-900/80 dark:border-gray-800 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Posts</span>
                <Grid className="w-4 h-4 text-violet-500" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {formatCount(userPosts.length)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Published stories</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-white/80 dark:bg-gray-900/80 dark:border-gray-800 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Followers</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {formatCount(followersCount)}
              </p>
              <p className="text-[11px] text-emerald-500 font-medium mt-0.5">Active network</p>
            </div>

            <div className="p-4 rounded-2xl border border-gray-100 bg-white/80 dark:bg-gray-900/80 dark:border-gray-800 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Following</span>
                <Award className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100">
                {formatCount(followingCount)}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Creators following</p>
            </div>

            <div className="p-4 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50/50 to-purple-50/50 dark:from-violet-950/20 dark:to-purple-950/20 dark:border-violet-900/40 backdrop-blur-sm shadow-xs transition-all hover:shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-violet-700 dark:text-violet-300 uppercase tracking-wider">Passion Index</span>
                <Flame className="w-4 h-4 text-violet-600 fill-violet-600" />
              </div>
              <p className="text-xl sm:text-2xl font-extrabold text-violet-700 dark:text-violet-300">
                {Math.min(99, 78 + (userPosts.length * 3))}%
              </p>
              <p className="text-[11px] text-violet-600/80 dark:text-violet-400 mt-0.5 font-medium">Top 5% creator affinity</p>
            </div>
          </div>

          {/* AI Passion Intelligence Section */}
          <div className="mt-6">
            <AIPassionProfileCard
              userId={profileUser.id}
              fullName={profileUser.full_name}
              username={profileUser.username}
              bio={profileUser.bio}
              hobbies={profileUser.hobbies || []}
              posts={userPosts}
              isOwnProfile={isOwnProfile}
            />
          </div>

          {/* Interactive Profile Tabs */}
          <div className="mt-8 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-px">
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={() => setActiveTab("all")}
                className={`flex items-center gap-2 px-3.5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "all"
                    ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <Grid className="w-4 h-4" />
                <span>All Posts</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  {userPosts.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex items-center gap-2 px-3.5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "projects"
                    ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <FolderKanban className="w-4 h-4" />
                <span>Projects</span>
                {projectPosts.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300">
                    {projectPosts.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("media")}
                className={`flex items-center gap-2 px-3.5 py-3 text-sm font-semibold border-b-2 transition-all ${
                  activeTab === "media"
                    ? "border-violet-600 text-violet-600 dark:text-violet-400 dark:border-violet-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Media</span>
                {mediaPosts.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {mediaPosts.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Posts List */}
          <div className="mt-6 space-y-4">
            {displayedPosts.length === 0 ? (
              <div className="text-center py-16 px-4 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 dark:bg-violet-950/40 text-violet-600 mb-4">
                  {activeTab === "projects" ? (
                    <FolderKanban className="h-8 w-8" />
                  ) : activeTab === "media" ? (
                    <ImageIcon className="h-8 w-8" />
                  ) : (
                    <Sparkles className="h-8 w-8" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {activeTab === "projects"
                    ? "No passion projects showcased yet"
                    : activeTab === "media"
                    ? "No media uploads yet"
                    : "No posts published yet"}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                  {isOwnProfile
                    ? "Share your milestones, project prototypes, or passion stories with the community!"
                    : "This creator has not shared anything in this category yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/create-post">
                    <Button variant="primary" size="sm" className="mt-4 gap-2">
                      <Sparkles className="w-4 h-4" /> Create First Post
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              displayedPosts.map((post) => (
                <div key={post.id} className="relative group/card">
                  {/* Edit/Delete controls for own posts */}
                  {isOwnProfile && (
                    <div className="absolute top-4 right-14 z-10 flex gap-1.5 opacity-90 sm:opacity-0 sm:group-hover/card:opacity-100 transition-opacity">
                      <button
                        onClick={() => {
                          setEditingPostId(post.id);
                          setEditContent(post.content);
                        }}
                        className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 hover:bg-violet-50 hover:text-violet-600 transition-colors backdrop-blur-sm"
                        title="Edit post"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-xs border border-gray-200 dark:border-gray-700 hover:bg-rose-50 hover:text-rose-500 transition-colors backdrop-blur-sm"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Edit inline card */}
                  {editingPostId === post.id && (
                    <div className="mb-4 rounded-2xl border border-violet-200 bg-violet-50/70 dark:bg-violet-950/20 p-4 backdrop-blur-sm animate-in fade-in">
                      <p className="text-sm font-semibold text-violet-800 dark:text-violet-200 mb-2">
                        Edit Post Content
                      </p>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-violet-200 bg-white dark:bg-gray-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-400 dark:text-gray-100"
                      />
                      <div className="flex gap-2 mt-2.5">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleEditPost(post.id)}
                          className="gap-1.5 text-xs"
                        >
                          <Check className="w-3.5 h-3.5" /> Save Changes
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setEditingPostId(null)}
                          className="gap-1.5 text-xs"
                        >
                          <X className="w-3.5 h-3.5" /> Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  <PostCard post={post} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
