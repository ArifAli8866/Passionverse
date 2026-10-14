import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { cn, formatDate, formatCount } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import type { Post, Comment, ProjectMatch } from "@/types";
import ProjectMatchBadge from "@/components/ai/ProjectMatchBadge";
import { MatchingService } from "@/services/ai/MatchingService";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Flag,
  ExternalLink,
  Paperclip,
  Smile,
} from "lucide-react";
import toast from "react-hot-toast";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onSave }: PostCardProps) {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentsLoaded, setCommentsLoaded] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [projectMatch, setProjectMatch] = useState<ProjectMatch | null>(null);

  useEffect(() => {
    try {
      const authorId = post.userId || post.user?.id;
      if (post.type === "project" && user && authorId && user.id !== authorId) {
        const userHobbies = Array.isArray(user.hobbies) ? user.hobbies : [];
        const userProfile = {
          userId: user.id,
          summary: user.bio || "",
          passions: userHobbies.map((h) => ({ name: h, score: 90, category: "Hobby" })),
          skills: userHobbies,
          technologies: userHobbies,
          currentlyLearning: [],
          lookingFor: [],
          goals: [],
        };
        const match = MatchingService.matchProjectToUser(post, userProfile as any);
        setProjectMatch(match);
      }
    } catch (err) {
      console.warn("Could not calculate project match:", err);
    }
  }, [post, user]);

  const fetchComments = async () => {
    if (commentsLoaded) return;
    setCommentsLoading(true);
    try {
      const { data, error } = await supabase
        .from("comments")
        .select("*, profiles:user_id (id, full_name, username, avatar_url)")
        .eq("post_id", post.id)
        .order("created_at", { ascending: true });

      if (error) throw error;

      const formatted = (data || []).map((c: any) => ({
        id: c.id,
        postId: c.post_id,
        userId: c.user_id,
        content: c.content,
        createdAt: c.created_at,
        user: {
          id: c.profiles?.id,
          fullName: c.profiles?.full_name || "User",
          username: c.profiles?.username || "",
          avatar: c.profiles?.avatar_url || "",
          bio: "",
          location: "",
          website: "",
          hobbies: [],
          followers: 0,
          following: 0,
          posts: 0,
        },
      }));
      setComments(formatted as Comment[]);
      setCommentsLoaded(true);
    } catch (error) {
      console.error("Failed to load comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleToggleComments = () => {
    if (!showComments) fetchComments();
    setShowComments(!showComments);
  };

  const handleLike = async () => {
    if (!user) return;
    try {
      if (isLiked) {
        await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        setIsLiked(false);
        setLikesCount((prev) => prev - 1);
      } else {
        await supabase.from("post_likes").insert({
          post_id: post.id,
          user_id: user.id,
        });
        setIsLiked(true);
        setLikesCount((prev) => prev + 1);
      }
      onLike?.(post.id);
    } catch (error: any) {
      toast.error("Failed to update like");
    }
  };

  const handleSave = async () => {
    if (!user) return;
    try {
      if (isSaved) {
        await supabase
          .from("saved_posts")
          .delete()
          .eq("post_id", post.id)
          .eq("user_id", user.id);
        setIsSaved(false);
        toast.success("Post removed from saved");
      } else {
        await supabase.from("saved_posts").insert({
          post_id: post.id,
          user_id: user.id,
        });
        setIsSaved(true);
        toast.success("Post saved!");
      }
      onSave?.(post.id);
    } catch (error: any) {
      toast.error("Failed to save post");
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !user) return;
    try {
      const { data, error } = await supabase
        .from("comments")
        .insert({
          post_id: post.id,
          user_id: user.id,
          content: commentText.trim(),
        })
        .select("*, profiles:user_id (id, full_name, username, avatar_url)")
        .single();

      if (error) throw error;

      const newComment: Comment = {
        id: data.id,
        postId: data.post_id,
        userId: data.user_id,
        content: data.content,
        createdAt: data.created_at,
        user: {
          id: data.profiles?.id,
          fullName: data.profiles?.full_name,
          username: data.profiles?.username,
          avatar: data.profiles?.avatar_url || "",
          bio: "",
          location: "",
          website: "",
          hobbies: [],
          followers: 0,
          following: 0,
          posts: 0,
        },
      };
      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (error: any) {
      toast.error("Failed to post comment");
    }
  };

  const placeholderColors = [
    "from-indigo-400 to-purple-500",
    "from-pink-400 to-rose-500",
    "from-emerald-400 to-teal-500",
    "from-orange-400 to-red-500",
    "from-cyan-400 to-blue-500",
    "from-violet-400 to-indigo-500",
  ];
  const placeholderColor = placeholderColors[post.id.length % placeholderColors.length];

  const renderFormattedContent = (content: string) => {
    // Highlight hashtags as in Reference 2 (#amazing #great #lifetime #uiux #machinelearning)
    const parts = content.split(/(#[a-zA-Z0-9_-]+)/g);
    return parts.map((part, index) => {
      if (part.startsWith("#")) {
        return (
          <Link
            key={index}
            to={`/search?q=${encodeURIComponent(part)}`}
            className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors inline-block mr-1"
          >
            {part}
          </Link>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white dark:border-slate-800/80 dark:bg-slate-900 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link to={`/profile/${post.user?.username || "user"}`} className="flex items-center gap-3 group">
          <Avatar
            src={post.user?.avatar || undefined}
            name={post.user?.fullName || "User"}
            size="md"
            status="online"
          />
          <div>
            <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-indigo-600 dark:text-slate-100 dark:group-hover:text-indigo-400 transition-colors">
              {post.user?.fullName || "User"}
            </p>
            <p className="text-[11px] text-slate-400">
              {post.type === "project" ? "Software Creator" : "Product Designer, Passionverse"} · {formatDate(post.createdAt)}
            </p>
          </div>
        </Link>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-1.5 z-20 w-44 rounded-2xl border border-slate-200/80 bg-white/95 shadow-xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/95 overflow-hidden animate-scale-in">
                <button
                  type="button"
                  onClick={() => {
                    setShowOptions(false);
                    setShowShareModal(true);
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-500" /> Share Post
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOptions(false);
                    toast.success("Post reported to community moderators");
                  }}
                  className="flex items-center gap-2.5 w-full px-3.5 py-2.5 text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" /> Report Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-3 space-y-2">
        {post.type === "project" && (
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/50">
            <span>🚀 Project Showcase</span>
            {post.projectTitle && <span className="font-semibold text-slate-700 dark:text-slate-300">· {post.projectTitle}</span>}
          </div>
        )}
        <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line">
          {renderFormattedContent(post.content)}
        </div>
      </div>

      {/* Post Image / Media (Reference 2 style) */}
      {post.type !== "text" && (
        <div className="px-5 mb-3">
          <div className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xs">
            {post.imageUrl ? (
              post.type === "video" ? (
                <video
                  src={post.imageUrl}
                  controls
                  className="w-full max-h-[420px] object-cover"
                />
              ) : (
                <img
                  src={post.imageUrl}
                  alt="Post content"
                  className="w-full max-h-[420px] object-cover"
                />
              )
            ) : (
              <div
                className={cn("bg-gradient-to-br p-8 text-white flex flex-col items-center justify-center min-h-[220px]", placeholderColor)}
              >
                <div className="text-3xl mb-2">✨</div>
                <h4 className="text-base font-bold text-center">{post.projectTitle || "Passion Creation"}</h4>
                {post.projectDescription && (
                  <p className="text-xs opacity-90 text-center max-w-md mt-1">{post.projectDescription}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Project Links & Tech Stack */}
      {post.type === "project" && (
        <div className="px-5 pb-3 flex flex-wrap items-center gap-2">
          {post.githubLink && (
            <a
              href={post.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
              <span>GitHub</span>
            </a>
          )}
          {post.demoLink && (
            <a
              href={post.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-colors shadow-2xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Demo</span>
            </a>
          )}
        </div>
      )}

      {/* AI Match Badge */}
      {post.type === "project" && projectMatch && user && user.id !== post.userId && (
        <div className="px-5 pb-3">
          <ProjectMatchBadge match={projectMatch} />
        </div>
      )}

      {/* Action Bar (Reference 2 style: Likes, Comments, Share, Saved) */}
      <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            type="button"
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 font-semibold transition-all cursor-pointer",
              isLiked ? "text-rose-500 scale-105" : "hover:text-slate-800 dark:hover:text-slate-200"
            )}
          >
            <Heart className={cn("w-4 h-4 transition-transform", isLiked && "fill-current scale-110")} />
            <span>{likesCount} Likes</span>
          </button>

          <button
            type="button"
            onClick={handleToggleComments}
            className="flex items-center gap-1.5 font-semibold hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{(post.commentsCount || 0) + comments.length} Comments</span>
          </button>

          <button
            type="button"
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 font-semibold hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 font-semibold transition-colors cursor-pointer",
            isSaved ? "text-indigo-600 dark:text-indigo-400" : "hover:text-slate-800 dark:hover:text-slate-200"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
          <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
        </button>
      </div>

      {/* Modern Inline Comment Composer (matching Reference 2!) */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 px-5 py-3 bg-slate-50/40 dark:bg-slate-900/40">
        <div className="flex items-center gap-2.5">
          <Avatar
            src={user?.avatar || undefined}
            name={user?.fullName || "You"}
            size="sm"
            status="online"
          />
          <div className="flex-1 flex items-center bg-white dark:bg-slate-800 rounded-full border border-slate-200/80 dark:border-slate-700/80 px-3.5 py-1.5 shadow-2xs focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/10 transition-all">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write your comment..."
              className="flex-1 bg-transparent border-0 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleComment()}
            />
            <button
              type="button"
              onClick={() => toast("Attachments feature coming soon! 📎", { icon: "📎" })}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Attach media"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setCommentText((prev) => prev + "🔥 ")}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
              title="Add emoji"
            >
              <Smile className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleComment}
              disabled={!commentText.trim()}
              className="ml-1 w-6 h-6 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer shadow-2xs"
              title="Send comment"
            >
              <Send className="w-3 h-3 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Comments List */}
      {showComments && (
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 py-4 space-y-3 bg-slate-50/20 dark:bg-slate-950/20">
          {commentsLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!commentsLoading && comments.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-3">No comments yet. Be the first to reply!</p>
          )}

          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 items-start">
              <Avatar src={comment.user.avatar || undefined} name={comment.user.fullName} size="sm" />
              <div className="flex-1">
                <div className="bg-slate-100/80 dark:bg-slate-800/80 rounded-2xl px-3.5 py-2">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{comment.user.fullName}</p>
                    <p className="text-[10px] text-slate-400">@{comment.user.username}</p>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{comment.content}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-1 ml-2">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Post" size="sm">
        <div className="space-y-4">
          <p className="text-xs text-slate-600 dark:text-slate-400">
            Share this passion post with peers, creators, or external platforms!
          </p>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/post/${post.id}`}
              className="flex-1 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-2 text-xs text-slate-900 dark:text-slate-100"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                setShowShareModal(false);
                toast.success("Link copied to clipboard!");
              }}
            >
              Copy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}