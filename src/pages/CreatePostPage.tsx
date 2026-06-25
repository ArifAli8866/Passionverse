import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Image, FileText, Rocket, Link as LinkIcon } from "lucide-react";

type PostType = "image" | "text" | "project";

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim() && postType !== "image") {
      toast.error("Please write something!");
      return;
    }
    setIsSubmitting(true);
    try {
      const postData: any = {
        user_id: user.id,
        type: postType,
        content: content.trim(),
      };

      if (postType === "image") {
        postData.caption = caption;
      }

      if (postType === "project") {
        postData.project_title = projectTitle;
        postData.project_description = projectDescription;
        postData.github_link = githubLink || null;
        postData.demo_link = demoLink || null;
      }

      const { error } = await supabase.from("posts").insert(postData);

      if (error) throw error;

      toast.success("Post published successfully!");
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const postTypes = [
    { id: "text" as const, label: "Text Post", icon: FileText, desc: "Share your thoughts" },
    { id: "image" as const, label: "Image Post", icon: Image, desc: "Show and tell" },
    { id: "project" as const, label: "Project Showcase", icon: Rocket, desc: "Show off your work" },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your passion with the world</p>
        </div>

        {/* Post Type Selection */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {postTypes.map((type) => {
            const isActive = postType === type.id;
            return (
              <button
                key={type.id}
                onClick={() => setPostType(type.id)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                  isActive
                    ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20"
                    : "border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl",
                  isActive ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                )}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className={cn("text-sm font-semibold", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100")}>
                    {type.label}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">{type.desc}</p>
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="space-y-4">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
              <Avatar name={user?.fullName} size="md" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">{user?.fullName}</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>

            {/* Content Input */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === "text"
                  ? "What's on your mind? Share your thoughts, ideas, or experiences..."
                  : postType === "image"
                    ? "Describe your image and what it means to you..."
                    : "Tell us about your project..."
              }
              rows={5}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
            />

            {/* Image Post Fields */}
            {postType === "image" && (
              <div className="space-y-3">
                <div className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-indigo-400 transition-colors cursor-pointer">
                  <div className="text-center">
                    <Image className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload an image</p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF up to 10MB</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
              </div>
            )}

            {/* Project Fields */}
            {postType === "project" && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project Title"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project, what problem it solves, tech stack used..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                />
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="GitHub Link (optional)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="url"
                      value={demoLink}
                      onChange={(e) => setDemoLink(e.target.value)}
                      placeholder="Demo Link (optional)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {postType === "text" && <FileText className="w-4 h-4 text-indigo-500" />}
                {postType === "image" && <Image className="w-4 h-4 text-emerald-500" />}
                {postType === "project" && <Rocket className="w-4 h-4 text-purple-500" />}
                <span className="text-sm text-gray-500">
                  {postType === "text" && "Text post"}
                  {postType === "image" && "Image post"}
                  {postType === "project" && "Project showcase"}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={() => navigate("/feed")}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  disabled={!content.trim() && postType !== "image"}
                >
                  {postType === "project" ? "Publish Project" : "Publish Post"}
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </AppLayout>
  );
}
