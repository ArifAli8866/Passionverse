import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/auth";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  Image,
  FileText,
  Rocket,
  Link as LinkIcon,
  Upload,
  X,
  Video,
} from "lucide-react";

type PostType = "image" | "text" | "project" | "video";

export default function CreatePostPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [postType, setPostType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [caption, setCaption] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [demoLink, setDemoLink] = useState("");
  const [techStack, setTechStack] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error("File size must be less than 50MB");
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setFilePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (videoInputRef.current) videoInputRef.current.value = "";
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${user?.id}/${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from("post-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error("Failed to upload file");
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("post-images")
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!content.trim() && postType === "text") {
      toast.error("Please write something!");
      return;
    }
    if (postType === "project" && !projectTitle.trim()) {
      toast.error("Please add a project title!");
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      let fileUrl: string | null = null;

      if (selectedFile) {
        setUploadProgress(30);
        fileUrl = await uploadFile(selectedFile);
        setUploadProgress(70);
        if (!fileUrl) return;
      }

      const postData: any = {
        user_id: user.id,
        type: postType,
        content: content.trim(),
      };

      if (postType === "image" || postType === "video") {
        postData.image_url = fileUrl;
        postData.caption = caption;
      }

      if (postType === "project") {
        postData.project_title = projectTitle;
        postData.project_description = projectDescription;
        postData.github_link = githubLink || null;
        postData.demo_link = demoLink || null;
        postData.image_url = fileUrl;
        postData.tech_stack = techStack || null;
      }

      setUploadProgress(90);
      const { error } = await supabase.from("posts").insert(postData);
      if (error) throw error;

      setUploadProgress(100);
      toast.success("Post published successfully!");
      navigate("/feed");
    } catch (error: any) {
      toast.error(error.message || "Failed to publish post");
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const postTypes = [
    { id: "text" as const, label: "Text Post", icon: FileText, desc: "Share your thoughts" },
    { id: "image" as const, label: "Image Post", icon: Image, desc: "Show and tell" },
    { id: "video" as const, label: "Video Post", icon: Video, desc: "Share a video" },
    { id: "project" as const, label: "Project", icon: Rocket, desc: "Show off your work" },
  ];

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Create Post</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Share your passion with the world</p>
        </div>

        {/* Post Type Selection */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          {postTypes.map((type) => {
            const isActive = postType === type.id;
            return (
              <button key={type.id} onClick={() => { setPostType(type.id); removeFile(); }}
                className={cn("flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all",
                  isActive ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20"
                    : "border-gray-100 bg-white hover:border-gray-200 dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700")}>
                <div className={cn("p-2 rounded-xl", isActive ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400")}>
                  <type.icon className="w-5 h-5" />
                </div>
                <div className="text-center">
                  <p className={cn("text-xs font-semibold", isActive ? "text-indigo-600 dark:text-indigo-400" : "text-gray-900 dark:text-gray-100")}>
                    {type.label}
                  </p>
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
            <textarea value={content} onChange={(e) => setContent(e.target.value)}
              placeholder={
                postType === "text" ? "What's on your mind?"
                  : postType === "image" ? "Describe your image..."
                    : postType === "video" ? "Describe your video..."
                      : "Tell us about your project..."
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
            />

            {/* Image Upload */}
            {postType === "image" && (
              <div className="space-y-3">
                {filePreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={filePreview} alt="Preview" className="w-full max-h-80 object-cover rounded-2xl" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-indigo-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload an image</p>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WEBP up to 50MB</p>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>
            )}

            {/* Video Upload */}
            {postType === "video" && (
              <div className="space-y-3">
                {filePreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <video src={filePreview} controls className="w-full max-h-80 rounded-2xl" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => videoInputRef.current?.click()}
                    className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 hover:border-indigo-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Video className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Click to upload a video</p>
                      <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI up to 50MB</p>
                    </div>
                  </div>
                )}
                <input ref={videoInputRef} type="file" accept="video/*" onChange={handleFileSelect} className="hidden" />
                <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption..."
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
              </div>
            )}

            {/* Project Fields */}
            {postType === "project" && (
              <div className="space-y-3">
                <input type="text" value={projectTitle} onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Project Title *"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                <textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe your project..."
                  rows={3}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                <input type="text" value={techStack} onChange={(e) => setTechStack(e.target.value)}
                  placeholder="Tech Stack (e.g. React, Node.js, Supabase)"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />

                {/* Project Image */}
                {filePreview ? (
                  <div className="relative rounded-2xl overflow-hidden">
                    <img src={filePreview} alt="Preview" className="w-full max-h-60 object-cover rounded-2xl" />
                    <button type="button" onClick={removeFile}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white hover:bg-black/70">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-6 hover:border-indigo-400 transition-colors cursor-pointer">
                    <div className="text-center">
                      <Image className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Add project screenshot (optional)</p>
                    </div>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="url" value={githubLink} onChange={(e) => setGithubLink(e.target.value)}
                      placeholder="GitHub Link (optional)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                  <div className="flex-1 relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="url" value={demoLink} onChange={(e) => setDemoLink(e.target.value)}
                      placeholder="Demo Link (optional)"
                      className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100" />
                  </div>
                </div>
              </div>
            )}

            {/* Upload Progress */}
            {isSubmitting && uploadProgress > 0 && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }} />
                </div>
              </div>
            )}

            {/* Submit */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2">
                {postType === "text" && <FileText className="w-4 h-4 text-indigo-500" />}
                {postType === "image" && <Image className="w-4 h-4 text-emerald-500" />}
                {postType === "video" && <Video className="w-4 h-4 text-blue-500" />}
                {postType === "project" && <Rocket className="w-4 h-4 text-purple-500" />}
                <span className="text-sm text-gray-500 capitalize">{postType} post</span>
              </div>
              <div className="flex items-center gap-3">
                <Button type="button" variant="ghost" size="md" onClick={() => navigate("/feed")}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" isLoading={isSubmitting}
                  disabled={postType === "text" && !content.trim()}>
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