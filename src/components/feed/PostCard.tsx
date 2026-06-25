import { useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@/components/ui/avatar";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button";
import { cn, formatDate, formatCount } from "@/lib/utils";
import type { Post, Comment } from "@/types";
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Flag,
  ExternalLink,
} from "lucide-react";

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onSave?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onSave }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked || false);
  const [isSaved, setIsSaved] = useState(post.isSaved || false);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);


  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
    onLike?.(post.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    onSave?.(post.id);
  };

  const handleComment = () => {
    if (!commentText.trim()) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      postId: post.id,
      userId: "currentUser",
      content: commentText,
      createdAt: new Date().toISOString(),
      user: {
        id: "currentUser",
        fullName: "You",
        username: "you",
        avatar: "",
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

  return (
    <div className="rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <Link to={`/profile/${post.user.username}`} className="flex items-center gap-3 group">
          <Avatar name={post.user.fullName} size="md" />
          <div>
            <p className="font-semibold text-gray-900 group-hover:text-indigo-600 dark:text-gray-100 dark:group-hover:text-indigo-400 transition-colors">
              {post.user.fullName}
            </p>
            <p className="text-xs text-gray-500">@{post.user.username} · {formatDate(post.createdAt)}</p>
          </div>
        </Link>
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <MoreHorizontal className="w-5 h-5 text-gray-400" />
          </button>
          {showOptions && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowOptions(false)} />
              <div className="absolute right-0 top-full mt-1 z-20 w-48 rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-900 overflow-hidden">
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Flag className="w-4 h-4" /> Report Post
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800">
                  <Share2 className="w-4 h-4" /> Share Post
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pb-3">
        {post.type === "project" && (
          <div className="mb-3 inline-block rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:from-indigo-900/30 dark:to-purple-900/30 dark:text-indigo-400">
            🚀 Project Showcase
          </div>
        )}
        {/* For text posts with markdown-like formatting */}
        <div className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line">
          {post.content}
        </div>
      </div>

      {/* Post Image */}
      {post.type !== "text" && (
        <div
          className={cn(
            "mx-5 mb-3 rounded-xl overflow-hidden bg-gradient-to-br",
            placeholderColor
          )}
          style={{ aspectRatio: "16/9", maxHeight: "400px" }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center text-white/80 p-8">
              {post.type === "image" ? (
                <>
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm font-medium">{post.caption || "Post Image"}</p>
                  <p className="text-xs mt-1 opacity-70">Click to view full image</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-2">🚀</div>
                  <p className="text-lg font-bold">{post.projectTitle}</p>
                  <p className="text-sm mt-1 opacity-80 line-clamp-2">{post.projectDescription}</p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Project Links */}
      {post.type === "project" && (
        <div className="px-5 pb-3 flex flex-wrap gap-2">
          {post.githubLink && (
            <a
              href={post.githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg> GitHub
            </a>
          )}
          {post.demoLink && (
            <a
              href={post.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Live Demo
            </a>
          )}
        </div>
      )}

      {/* Action Stats */}
      <div className="flex items-center gap-4 px-5 py-2 border-t border-gray-50 dark:border-gray-800">
        <span className="text-xs text-gray-400">{formatCount(likesCount)} likes</span>
        <span className="text-xs text-gray-400">{formatCount((post.commentsCount || 0) + comments.length)} comments</span>
        <span className="text-xs text-gray-400">{formatCount(0)} shares</span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between px-5 py-2 border-t border-gray-50 dark:border-gray-800">
        <div className="flex items-center gap-1">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
              isLiked
                ? "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-900/20"
                : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            )}
          >
            <Heart className={cn("w-4 h-4", isLiked && "fill-current")} />
            Like
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
          >
            <MessageCircle className="w-4 h-4" />
            Comment
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
        <button
          onClick={handleSave}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
            isSaved
              ? "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-900/20"
              : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isSaved && "fill-current")} />
        </button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div className="border-t border-gray-50 dark:border-gray-800 px-5 py-4 space-y-4">
          {/* Existing Comments */}
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Avatar name={comment.user.fullName} size="sm" />
              <div className="flex-1">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {comment.user.fullName}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{comment.content}</p>
                </div>
                <p className="text-xs text-gray-400 mt-1">{formatDate(comment.createdAt)}</p>
              </div>
            </div>
          ))}

          {/* Add Comment */}
          <div className="flex items-center gap-3">
            <Avatar name="You" size="sm" />
            <div className="flex-1 flex items-center gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Write a comment..."
                className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 px-4 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30"
                onKeyDown={(e) => e.key === "Enter" && handleComment()}
              />
              <button
                onClick={handleComment}
                disabled={!commentText.trim()}
                className="p-2 rounded-lg text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <Modal isOpen={showShareModal} onClose={() => setShowShareModal(false)} title="Share Post" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">Share this post with your friends!</p>
          <div className="flex items-center gap-3">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/post/${post.id}`}
              className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100"
            />
            <Button
              variant="primary"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`);
                setShowShareModal(false);
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
