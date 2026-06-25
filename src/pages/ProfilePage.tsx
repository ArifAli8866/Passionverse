import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import PostCard from "@/components/feed/PostCard";
import { Skeleton } from "@/components/ui/card";
import { cn, formatCount, MOCK_USERS, MOCK_POSTS, HOBBIES } from "@/lib/utils";
import type { Post, User } from "@/types";
import {
  MapPin,
  Link as LinkIcon,
  Calendar,
  Users,
  Image,
  Grid,
  Bookmark,
  Settings,
  UserPlus,
  UserCheck,
} from "lucide-react";

export default function ProfilePage() {
  const { username } = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");

  const isOwnProfile = currentUser?.username === username;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const found = MOCK_USERS.find((u) => u.username === username);
      if (found) {
        setProfileUser(found as User);
        setFollowersCount(found.followers);
      } else if (isOwnProfile && currentUser) {
        setProfileUser(currentUser);
        setFollowersCount(currentUser.followers);
      }
      const posts = (MOCK_POSTS as Post[]).filter((p) => p.user.username === username);
      setUserPosts(posts);
      setIsLoading(false);
    }, 600);
  }, [username, currentUser, isOwnProfile]);

  const handleFollow = () => {
    if (isFollowing) {
      setFollowersCount((prev) => prev - 1);
    } else {
      setFollowersCount((prev) => prev + 1);
    }
    setIsFollowing(!isFollowing);
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto">
          <Skeleton className="w-full h-48 rounded-2xl mb-6" />
          <div className="flex items-end gap-4 -mt-12 px-4">
            <Skeleton className="w-24 h-24 rounded-full ring-4 ring-white" />
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
          <p className="text-gray-500 mt-2">This user doesn't exist.</p>
          <Link to="/feed" className="mt-4 inline-block text-indigo-600">Go back to feed</Link>
        </div>
      </AppLayout>
    );
  }

  const getHobbyName = (id: string) => HOBBIES.find((h) => h.id === id)?.name || id;
  const memberSince = new Date().getFullYear() - 2;

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        {/* Cover Image */}
        <div
          className={cn(
            "relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-gradient-to-r",
            profileUser.coverColor || "from-indigo-500 to-purple-600"
          )}
        >
          <div className="absolute inset-0 bg-black/10" />
          {profileUser.coverImage && (
            <img src={profileUser.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
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

        {/* Profile Info */}
        <div className="relative px-4 sm:px-6 -mt-14">
          <div className="flex items-end gap-4">
            <Avatar name={profileUser.fullName} size="xl" className="ring-4 ring-white dark:ring-gray-950" />
            <div className="flex-1 pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {profileUser.fullName}
                  </h1>
                  <p className="text-sm text-gray-500">@{profileUser.username}</p>
                </div>
                {!isOwnProfile && (
                  <Button
                    variant={isFollowing ? "outline" : "primary"}
                    size="sm"
                    onClick={handleFollow}
                  >
                    {isFollowing ? (
                      <><UserCheck className="w-4 h-4" /> Following</>
                    ) : (
                      <><UserPlus className="w-4 h-4" /> Follow</>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Info */}
          <div className="mt-4 space-y-3">
            {profileUser.bio && (
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{profileUser.bio}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              {profileUser.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {profileUser.location}
                </span>
              )}
              {profileUser.website && (
                <a
                  href={profileUser.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-indigo-600 hover:underline"
                >
                  <LinkIcon className="w-4 h-4" /> {profileUser.website.replace(/https?:\/\//, "")}
                </a>
              )}
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Member since {memberSince}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {formatCount(followersCount)} followers
              </span>
            </div>
          </div>

          {/* Hobbies */}
          {profileUser.hobbies.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {profileUser.hobbies.map((hobbyId) => (
                <Badge key={hobbyId} variant="primary">
                  {getHobbyName(hobbyId)}
                </Badge>
              ))}
            </div>
          )}

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
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{formatCount(profileUser.following)}</p>
              <p className="text-xs text-gray-500">Following</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex items-center gap-1 border-b border-gray-100 dark:border-gray-800">
            <button
              onClick={() => setActiveTab("posts")}
              className={cn(
                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                activeTab === "posts"
                  ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <Grid className="w-4 h-4" /> Posts
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setActiveTab("saved")}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all",
                  activeTab === "saved"
                    ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                )}
              >
                <Bookmark className="w-4 h-4" /> Saved
              </button>
            )}
          </div>

          {/* Posts Grid */}
          <div className="mt-4 space-y-4">
            {userPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <Image className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">No posts yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isOwnProfile ? "Share your first passion project!" : "This user hasn't posted anything yet."}
                </p>
                {isOwnProfile && (
                  <Link to="/create-post">
                    <Button variant="primary" size="sm" className="mt-4">Create Post</Button>
                  </Link>
                )}
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
