// Settings v2 - SaaS styled
import { useState, useRef } from "react";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/store/theme";
import AppLayout from "@/components/layout/AppLayout";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { HOBBIES } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import toast from "react-hot-toast";
import {
  User,
  Bell,
  Shield,
  Palette,
  LogOut,
  Save,
  Sun,
  Moon,
  Smartphone,
  Camera,
  Trash2,
  Sparkles,
  Plus,
  AlertTriangle,
  Check,
} from "lucide-react";

type SettingsTab = "profile" | "appearance" | "notifications" | "privacy";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(
    user?.hobbies || []
  );
  const [customHobby, setCustomHobby] = useState("");
  const [privacy, setPrivacy] = useState({
    privateProfile: false,
    showOnlineStatus: true,
    allowFriendRequests: true,
  });
  const [notifications, setNotifications] = useState({
    likes: true,
    comments: true,
    newFollowers: true,
    messages: true,
    mentions: true,
  });

  const tabs = [
    { id: "profile" as const, label: "Profile Info", icon: User },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy & Security", icon: Shield },
  ];

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile || !user) return null;
    const ext = avatarFile.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { data, error } = await supabase.storage
      .from("avatars")
      .upload(path, avatarFile, { upsert: true });
    if (error) {
      toast.error("Failed to upload avatar");
      return null;
    }
    const { data: urlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSave = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      let avatarUrl = user.avatar;
      if (avatarFile) {
        const url = await uploadAvatar();
        if (url) avatarUrl = url;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio,
          location: formData.location,
          website: formData.website,
          avatar_url: avatarUrl,
          is_online: privacy.showOnlineStatus,
          hobbies: selectedHobbies,
        })
        .eq("id", user.id);

      if (error) throw error;

      updateUser({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar: avatarUrl ? `${avatarUrl}?t=${Date.now()}` : user?.avatar,
        hobbies: selectedHobbies,
      });

      setAvatarFile(null);
      toast.success("Profile saved successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setIsDeleting(true);
    try {
      await supabase.from("posts").delete().eq("user_id", user.id);
      await supabase.from("profiles").delete().eq("id", user.id);
      await supabase.auth.signOut();
      toast.success("Account deleted");
      window.location.href = "/";
    } catch (error: any) {
      toast.error("Failed to delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleHobby = (hobbyId: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyId)
        ? prev.filter((h) => h !== hobbyId)
        : [...prev, hobbyId]
    );
  };

  const Toggle = ({
    value,
    onChange,
  }: {
    value: boolean;
    onChange: () => void;
  }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 ${
        value ? "bg-violet-600" : "bg-gray-200 dark:bg-gray-700"
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
          value ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
              Account Settings
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage your creator portfolio, notifications, and application preferences
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleSave}
              isLoading={isSaving}
              className="gap-2 shadow-xs"
            >
              <Save className="w-4 h-4" /> Save Changes
            </Button>
          </div>
        </div>

        {/* Layout: Sidebar Tabs + Content Panel */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabs Sidebar */}
          <div className="md:w-56 shrink-0">
            <div className="flex md:flex-col gap-1.5 overflow-x-auto p-1 rounded-2xl bg-gray-100/70 dark:bg-gray-900/50">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap text-left ${
                      isActive
                        ? "bg-white text-violet-700 shadow-xs dark:bg-gray-800 dark:text-violet-300"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/40"
                    }`}
                  >
                    <tab.icon
                      className={`w-4 h-4 ${
                        isActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-gray-400"
                      }`}
                    />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <>
                {/* Profile Card */}
                <Card className="p-6 space-y-6">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                      Public Profile
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      This information is displayed publicly on your creator page
                    </p>
                  </div>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-5 p-4 rounded-2xl bg-gray-50/70 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div className="relative group cursor-pointer">
                      {avatarPreview || user?.avatar ? (
                        <img
                          src={avatarPreview || user?.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white dark:ring-gray-900 shadow-md transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <Avatar
                          src={user?.avatar}
                          name={user?.fullName}
                          size="xl"
                          className="w-20 h-20 rounded-2xl ring-4 ring-white dark:ring-gray-900 shadow-md"
                        />
                      )}
                      <label
                        htmlFor="avatar-upload"
                        className="absolute -bottom-1 -right-1 p-2 bg-violet-600 hover:bg-violet-700 text-white rounded-xl shadow-md transition-colors cursor-pointer"
                        title="Upload photo"
                      >
                        <Camera className="w-3.5 h-3.5" />
                      </label>
                    </div>

                    <div className="space-y-1">
                      <label
                        htmlFor="avatar-upload"
                        className="text-sm font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 cursor-pointer inline-flex items-center gap-1.5"
                      >
                        <span>Upload new photo</span>
                      </label>
                      <p className="text-xs text-gray-400">
                        Recommended: Square JPG or PNG, at least 400x400px (Max 5MB)
                      </p>
                      {avatarFile && (
                        <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Ready to save: {avatarFile.name}
                        </p>
                      )}
                    </div>

                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      className="hidden"
                      id="avatar-upload"
                    />
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="fullName"
                        label="Full Name"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                      <Input
                        id="username"
                        label="Username Handle"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Creator Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3.5 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Tell the community what you're passionate about and what you love building..."
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="location"
                        label="Location"
                        value={formData.location}
                        onChange={(e) =>
                          setFormData({ ...formData, location: e.target.value })
                        }
                        placeholder="San Francisco, CA or Remote"
                      />
                      <Input
                        id="website"
                        label="Personal Website / Portfolio"
                        value={formData.website}
                        onChange={(e) =>
                          setFormData({ ...formData, website: e.target.value })
                        }
                        placeholder="https://yoursite.com"
                      />
                    </div>
                  </div>
                </Card>

                {/* Hobbies / Passions Card */}
                <Card className="p-6 space-y-5">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <span>Passions & Interests</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 font-semibold">
                        {selectedHobbies.length} selected
                      </span>
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Our AI uses these affinities to match you with compatible collaborators and recommended projects
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 max-h-56 overflow-y-auto p-1">
                    {HOBBIES.map((hobby) => {
                      const isSelected = selectedHobbies.includes(hobby.id);
                      return (
                        <button
                          key={hobby.id}
                          type="button"
                          onClick={() => toggleHobby(hobby.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-violet-600 text-white shadow-xs"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                          <span>{hobby.name}</span>
                        </button>
                      );
                    })}

                    {/* Custom hobbies */}
                    {selectedHobbies
                      .filter((h) => !HOBBIES.find((hb) => hb.id === h))
                      .map((custom) => (
                        <button
                          key={custom}
                          type="button"
                          onClick={() => toggleHobby(custom)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-violet-600 text-white shadow-xs"
                        >
                          <Check className="w-3 h-3" />
                          <span>✨ {custom} &times;</span>
                        </button>
                      ))}
                  </div>

                  {/* Add custom hobby */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={customHobby}
                      onChange={(e) => setCustomHobby(e.target.value)}
                      placeholder="Add a specialized hobby (e.g. Generative AI)..."
                      className="flex-1 rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs sm:text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && customHobby.trim()) {
                          if (!selectedHobbies.includes(customHobby.trim())) {
                            setSelectedHobbies((prev) => [
                              ...prev,
                              customHobby.trim(),
                            ]);
                          }
                          setCustomHobby("");
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        if (
                          customHobby.trim() &&
                          !selectedHobbies.includes(customHobby.trim())
                        ) {
                          setSelectedHobbies((prev) => [
                            ...prev,
                            customHobby.trim(),
                          ]);
                        }
                        setCustomHobby("");
                      }}
                      className="gap-1 px-3 text-xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </Button>
                  </div>
                </Card>

                {/* Bottom Action Footer */}
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="primary"
                    onClick={handleSave}
                    isLoading={isSaving}
                    className="gap-2 shadow-xs"
                  >
                    <Save className="w-4 h-4" /> Save Profile Changes
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                    className="gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 dark:border-rose-900/40 dark:hover:bg-rose-950/20"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              </>
            )}

            {activeTab === "appearance" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                    Display & Theme
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Customize your interface look and animation behavior
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                        {theme === "dark" ? (
                          <Moon className="w-5 h-5" />
                        ) : (
                          <Sun className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Dark Mode
                        </p>
                        <p className="text-xs text-gray-500">
                          Currently using {theme === "dark" ? "Dark Theme" : "Light Theme"}
                        </p>
                      </div>
                    </div>
                    <Toggle value={theme === "dark"} onChange={toggleTheme} />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-gray-50/80 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                          Smooth Transitions
                        </p>
                        <p className="text-xs text-gray-500">
                          Enable hardware-accelerated animations across feed
                        </p>
                      </div>
                    </div>
                    <Toggle value={true} onChange={() => {}} />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Choose what alerts and activities you want to receive
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: "likes" as const,
                      label: "Post Appreciations & Likes",
                      desc: "When someone likes or bookmarks your project posts",
                    },
                    {
                      key: "comments" as const,
                      label: "Discussion & Feedback",
                      desc: "When someone leaves a comment on your milestones",
                    },
                    {
                      key: "newFollowers" as const,
                      label: "New Network Connections",
                      desc: "When someone follows your creator profile",
                    },
                    {
                      key: "messages" as const,
                      label: "Direct Inquiries",
                      desc: "When you receive a direct collaboration message",
                    },
                    {
                      key: "mentions" as const,
                      label: "Mentions & Project Tags",
                      desc: "When someone mentions @yourhandle in a discussion",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800/70 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        value={notifications[item.key]}
                        onChange={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card className="p-6 space-y-6">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">
                    Privacy & Safeguards
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Control visibility and manage account security
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    {
                      key: "privateProfile" as const,
                      label: "Private Profile",
                      desc: "Only approved followers can view your project blueprints and posts",
                    },
                    {
                      key: "showOnlineStatus" as const,
                      label: "Show Online Presence",
                      desc: "Display active green indicator when you are exploring Passionverse",
                    },
                    {
                      key: "allowFriendRequests" as const,
                      label: "Direct Collaboration Inquiries",
                      desc: "Allow creators from outside your circle to message you",
                    },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-3.5 rounded-2xl border border-gray-100 dark:border-gray-800/70"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {item.label}
                        </p>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        value={privacy[item.key]}
                        onChange={() => {
                          setPrivacy((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key],
                          }));
                          if (item.key === "showOnlineStatus") {
                            supabase
                              .from("profiles")
                              .update({
                                is_online: !privacy.showOnlineStatus,
                              })
                              .eq("id", user?.id || "");
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>

                {/* Danger Zone */}
                <div className="mt-8 p-5 rounded-2xl border border-rose-200 bg-rose-50/60 dark:bg-rose-950/20 dark:border-rose-900/40">
                  <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Danger Zone</span>
                  </div>
                  <p className="text-xs text-rose-600/90 dark:text-rose-400/80 mt-1">
                    Permanently delete your account, posts, and creator profile. This action cannot be undone.
                  </p>
                  {!showDeleteConfirm ? (
                    <Button
                      variant="danger"
                      size="sm"
                      className="mt-4 gap-2 text-xs"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete Account
                    </Button>
                  ) : (
                    <div className="mt-4 space-y-2 p-3.5 rounded-xl bg-white/80 dark:bg-gray-900/80 border border-rose-200 dark:border-rose-900/50">
                      <p className="text-xs font-bold text-rose-600">
                        Confirm Account Deletion? All posts and messages will be permanently erased.
                      </p>
                      <div className="flex gap-2">
                        <Button
                          variant="danger"
                          size="sm"
                          isLoading={isDeleting}
                          onClick={handleDeleteAccount}
                          className="text-xs"
                        >
                          Confirm & Delete Everything
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
