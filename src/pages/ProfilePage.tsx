import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import PostCard from "@/components/feed/PostCard";
import { Skeleton } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatCount } from "@/lib/utils";
import type { Post } from "@/types";
import { MapPin, Link as LinkIcon, Calendar, Users, Image, Grid, Settings, UserPlus, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const isOwnProfile = currentUser?.username === username;

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
        <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-r from-indigo-500 to-purple-600">
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-4 right-4">
            {isOwnProfile && (
              <Link to="/settings">
                <Button variant="secondary" size="sm">
                  <Settings className="w-4 h-4" /> Edit Profile
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="relative px-4 sm:px-6 -mt-14">
          <div className="flex items-end gap-4">
            <Avatar name={profileUser.full_name} size="xl" className="ring-4 ring-white dark:ring-gray-950" />
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{profileUser.full_name}</h1>
                  <p className="text-sm text-gray-500">@{profileUser.username}</p>
                </div>
                {!isOwnProfile && (
                  <Button variant={isFollowing ? "outline" : "primary"} size="sm" onClick={handleFollow}>
                    {isFollowing ? (<><UserCheck className="w-4 h-4" /> Following</>) : (<><UserPlus className="w-4 h-4" /> Follow</>)}
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {profileUser.bio && <p className="text-sm text-gray-700 dark:text-gray-300">{profileUser.bio}</p>}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {profileUser.location && (<span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profileUser.location}</span>)}
              {profileUser.website && (<a href={profileUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline"><LinkIcon className="w-4 h-4" />{profileUser.website.replace(/https?:\/\//, "")}</a>)}
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" />Joined {new Date(profileUser.created_at).getFullYear()}</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" />{formatCount(followersCount)} followers</span>
            </div>
          </div>
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
          <div className="mt-6 flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 border-indigo-600 text-indigo-600">
              <Grid className="w-4 h-4" /> Posts
            </button>
          </div>
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
              userPosts.map((post) => <PostCard key={post.id} post={post} />)
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
