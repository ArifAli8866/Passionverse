// Settings v2 - avatar upload enabled
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
  User, Bell, Shield, Palette, LogOut, Save,
  Sun, Moon, Smartphone, Camera, Trash2,
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
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(user?.hobbies || []);
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
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy", icon: Shield },
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
    if (error) { toast.error("Failed to upload avatar"); return null; }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
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

      const { error } = await supabase.from("profiles").update({
        full_name: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar_url: avatarUrl,
        is_online: privacy.showOnlineStatus,
      }).eq("id", user.id);

      if (error) throw error;

      updateUser({
        fullName: formData.fullName,
        username: formData.username,
        bio: formData.bio,
        location: formData.location,
        website: formData.website,
        avatar: avatarUrl,
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
      prev.includes(hobbyId) ? prev.filter((h) => h !== hobbyId) : [...prev, hobbyId]
    );
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: () => void }) => (
    <button onClick={onChange}
      className={`relative w-12 h-6 rounded-full transition-colors ${value ? "bg-indigo-600" : "bg-gray-300 dark:bg-gray-600"}`}>
      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${value ? "translate-x-6" : "translate-x-0.5"}`} />
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-48 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                    ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                    : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                    }`}>
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <>
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Information</h2>

                  {/* Avatar Upload */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      {avatarPreview || user?.avatar ? (
                        <img
                          src={avatarPreview || user?.avatar}
                          alt="Avatar"
                          className="w-20 h-20 rounded-full object-cover ring-4 ring-indigo-100"
                        />
                      ) : (
                        <Avatar name={user?.fullName} size="xl" />
                      )}
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 rounded-full text-white hover:bg-indigo-700 transition-colors cursor-pointer">
                        <Camera className="w-3.5 h-3.5" />
                      </label>
                    </div>
                    <div>
                      <label
                        htmlFor="avatar-upload"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer">
                        Change Avatar
                      </label>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 5MB.</p>
                      {avatarFile && (
                        <p className="text-xs text-emerald-500 mt-1">✓ New avatar selected</p>
                      )}
                    </div>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarSelect}
                      style={{ display: "none" }}
                      id="avatar-upload"
                    />
                  </div>

                  <div className="space-y-4">
                    <Input id="fullName" label="Full Name" value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                    <Input id="username" label="Username" value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                      <textarea value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Tell us about yourself..." />
                    </div>
                    <Input id="location" label="Location" value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country" />
                    <Input id="website" label="Website" value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yoursite.com" />
                  </div>
                </Card>

                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Hobbies</h2>
                  <p className="text-sm text-gray-500 mb-4">Select the hobbies you are passionate about</p>
                  <div className="flex flex-wrap gap-2">
                    {HOBBIES.map((hobby) => (
                      <button key={hobby.id} type="button" onClick={() => toggleHobby(hobby.id)}>
                        <Badge variant={selectedHobbies.includes(hobby.id) ? "primary" : "default"}>
                          {hobby.name}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </Card>

                <div className="flex items-center justify-between">
                  <Button variant="primary" onClick={handleSave} isLoading={isSaving}>
                    <Save className="w-4 h-4" /> Save Changes
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => { logout(); window.location.href = "/"; }}>
                    <LogOut className="w-4 h-4" /> Sign Out
                  </Button>
                </div>
              </>
            )}

            {activeTab === "appearance" && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Appearance</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      {theme === "dark" ? <Moon className="w-5 h-5 text-indigo-500" /> : <Sun className="w-5 h-5 text-orange-500" />}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                        <p className="text-sm text-gray-500">Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
                      </div>
                    </div>
                    <Toggle value={theme === "dark"} onChange={toggleTheme} />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Reduce Animations</p>
                        <p className="text-sm text-gray-500">Minimize motion effects</p>
                      </div>
                    </div>
                    <Toggle value={false} onChange={() => { }} />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    { key: "likes" as const, label: "Likes", desc: "When someone likes your post" },
                    { key: "comments" as const, label: "Comments", desc: "When someone comments on your post" },
                    { key: "newFollowers" as const, label: "New Followers", desc: "When someone follows you" },
                    { key: "messages" as const, label: "Messages", desc: "When you receive a direct message" },
                    { key: "mentions" as const, label: "Mentions", desc: "When someone mentions you" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        value={notifications[item.key]}
                        onChange={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key] }))}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Privacy Settings</h2>
                <div className="space-y-4">
                  {[
                    { key: "privateProfile" as const, label: "Private Profile", desc: "Only followers can see your posts" },
                    { key: "showOnlineStatus" as const, label: "Show Online Status", desc: "Let others see when you are active" },
                    { key: "allowFriendRequests" as const, label: "Allow Friend Requests", desc: "Anyone can send you requests" },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <Toggle
                        value={privacy[item.key]}
                        onChange={() => {
                          setPrivacy((prev) => ({ ...prev, [item.key]: !prev[item.key] }));
                          if (item.key === "showOnlineStatus") {
                            supabase.from("profiles").update({
                              is_online: !privacy.showOnlineStatus,
                            }).eq("id", user?.id || "");
                          }
                        }}
                      />
                    </div>
                  ))}

                  <hr className="border-gray-100 dark:border-gray-800" />

                  {/* Delete Account */}
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10">
                    <h3 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                    <p className="text-sm text-red-500 mt-1">Permanently delete your account and all data</p>
                    {!showDeleteConfirm ? (
                      <Button variant="danger" size="sm" className="mt-3"
                        onClick={() => setShowDeleteConfirm(true)}>
                        <Trash2 className="w-4 h-4" /> Delete Account
                      </Button>
                    ) : (
                      <div className="mt-3 space-y-2">
                        <p className="text-sm font-medium text-red-600">Are you sure? This cannot be undone!</p>
                        <div className="flex gap-2">
                          <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDeleteAccount}>
                            Yes, Delete Everything
                          </Button>
                          <Button variant="secondary" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
