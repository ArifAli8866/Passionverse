import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import PostCard from "@/components/feed/PostCard";
import { Skeleton } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatCount } from "@/lib/utils";
import type { Post } from "@/types";
import { MapPin, Link as LinkIcon, Calendar, Users, Image, Grid, Settings, UserPlus, UserCheck, MessageCircle, Camera, Pencil, Trash2, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser, updateUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const isOwnProfile = currentUser?.username === username;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const { data: profile, error } = await supabase.from("profiles").select("*").eq("username", username).single();
        if (error) throw error;
        setProfileUser(profile);
        const { count: fCount } = await supabase.from("followers").select("*", { count: "exact", head: true }).eq("following_id", profile.id);
        setFollowersCount(fCount || 0);
        const { count: fgCount } = await supabase.from("followers").select("*", { count: "exact", head: true }).eq("follower_id", profile.id);
        setFollowingCount(fgCount || 0);
        if (currentUser && !isOwnProfile) {
          const { data: followData } = await supabase.from("followers").select("*").eq("follower_id", currentUser.id).eq("following_id", profile.id).single();
          setIsFollowing(!!followData);
        }
        const { data: posts } = await supabase.from("posts").select("*, profiles:user_id (id, full_name, username, avatar_url), post_likes (user_id), comments (id)").eq("user_id", profile.id).order("created_at", { ascending: false });
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
          isLiked: post.post_likes?.some((like: any) => like.user_id === currentUser?.id) || false,
          user: { id: post.profiles?.id, fullName: post.profiles?.full_name, username: post.profiles?.username, avatar: post.profiles?.avatar_url || "", hobbies: [] },
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
        await supabase.from("followers").delete().eq("follower_id", currentUser.id).eq("following_id", profileUser.id);
        setFollowersCount((prev) => prev - 1);
      } else {
        await supabase.from("followers").insert({ follower_id: currentUser.id, following_id: profileUser.id });
        setFollowersCount((prev) => prev + 1);
      }
      setIsFollowing(!isFollowing);
    } catch (error: any) {
      toast.error("Failed to update follow");
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
      await supabase.from("posts").update({ content: editContent }).eq("id", postId);
      setUserPosts((prev) => prev.map((p) => p.id === postId ? { ...p, content: editContent } : p));
      setEditingPostId(null);
      toast.success("Post updated!");
    } catch (error: any) {
      toast.error("Failed to update post");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentUser) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be less than 5MB"); return; }
    setCoverUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `covers/${currentUser.id}/cover.${ext}`;
      const { data, error } = await supabase.storage.from("covers").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("covers").getPublicUrl(data.path);
      await supabase.from("profiles").update({ cover_url: urlData.publicUrl }).eq("id", currentUser.id);
      setProfileUser((prev: any) => ({ ...prev, cover_url: urlData.publicUrl }));
      toast.success("Cover photo updated!");
    } catch (error: any) {
      toast.error("Failed to upload cover");
    } finally {
      setCoverUploading(false);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="w-full h-48 rounded-2xl mb-6" />
          <div className="flex items-end gap-4 -mt-12 px-4">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="space-y-2 flex-1 pb-2">
              <Skeleton className="w-40 h-6" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  if (!profileUser) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User not found</h2>
          <p className="text-gray-500 mt-2">This user does not exist.</p>
          <Link to="/feed" className="mt-4 inline-block text-indigo-600">Go back to feed</Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Cover Image */}
        <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600 group">
          {profileUser.cover_url && (
            <img src={profileUser.cover_url} alt="Cover" className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Cover change button - only for own profile */}
          {isOwnProfile && (
            <>
              <button
                onClick={() => coverInputRef.current?.click()}
                disabled={coverUploading}
                className="absolute bottom-3 right-3 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white text-sm px-3 py-1.5 rounded-xl backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                <Camera className="w-4 h-4" />
                {coverUploading ? "Uploading..." : "Change Cover"}
              </button>
              <input ref={coverInputRef} type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
            </>
          )}
        </div>

        <div className="relative px-4 sm:px-6 -mt-14">
          <div className="flex items-end gap-4">
            {/* Avatar with real image */}
            <div className="relative">
              <Avatar
                src={profileUser.avatar_url || undefined}
                name={profileUser.full_name}
                size="xl"
                className="ring-4 ring-white dark:ring-gray-950"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between flex-wrap gap-2">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{profileUser.full_name}</h1>
                  <p className="text-sm text-gray-500">@{profileUser.username}</p>
                </div>
                {isOwnProfile ? (
                  <Button variant="secondary" size="sm" onClick={() => navigate("/settings")}>
                    <Settings className="w-4 h-4" /> Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant={isFollowing ? "outline" : "primary"} size="sm" onClick={handleFollow}>
                      {isFollowing ? (<><UserCheck className="w-4 h-4" /> Following</>) : (<><UserPlus className="w-4 h-4" /> Follow</>)}
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => navigate("/messages")}>
                      <MessageCircle className="w-4 h-4" /> Message
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Info */}
          <div className="mt-4 space-y-3">
            {profileUser.bio && <p className="text-sm text-gray-700 dark:text-gray-300">{profileUser.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {profileUser.location && (<span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser.location}</span>)}
              {profileUser.website && (
                <a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline">
                  <LinkIcon className="w-4 h-4" />{profileUser.website.replace(/https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(profileUser.created_at).getFullYear()}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{formatCount(followersCount)} followers</span>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCount(userPosts.length)}</p>
              <p className="text-xs text-gray-500">Posts</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCount(followersCount)}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCount(followingCount)}</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>

          {/* Posts Tab */}
          <div className="mt-6 flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
              <Grid className="w-4 h-4" /> Posts
            </button>
          </div>

          {/* Posts List */}
          <div className="mt-4 space-y-4">
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No posts yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{isOwnProfile ? "Share your first passion project!" : "This user has not posted anything yet."}</p>
                {isOwnProfile && (<Link to="/create-post"><Button variant="primary" size="sm" className="mt-4">Create Post</Button></Link>)}
              </div>
            ) : (
              userPosts.map((post) => (
                <div key={post.id} className="relative">
                  {/* Edit/Delete buttons for own posts */}
                  {isOwnProfile && (
                    <div className="absolute top-3 right-12 z-10 flex gap-1">
                      <button
                        onClick={() => { setEditingPostId(post.id); setEditContent(post.content); }}
                        className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                        title="Edit post">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="p-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors"
                        title="Delete post">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* Edit modal */}
                  {editingPostId === post.id && (
                    <div className="mb-3 rounded-xl border border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20 p-4">
                      <p className="text-sm font-medium text-indigo-700 dark:text-indigo-300 mb-2">Edit Post</p>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-indigo-200 bg-white dark:bg-gray-900 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:text-gray-100"
                      />
                      <div className="flex gap-2 mt-2">
                        <button onClick={() => handleEditPost(post.id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button onClick={() => setEditingPostId(null)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300">
                          <X className="w-3.5 h-3.5" /> Cancel
                        </button>
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
