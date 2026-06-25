import { useState } from "react";
import { useAuth } from "@/store/auth";
import { useTheme } from "@/store/theme";
import AppLayout from "@/components/layout/AppLayout";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { HOBBIES } from "@/lib/utils";
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
} from "lucide-react";

type SettingsTab = "profile" | "appearance" | "notifications" | "privacy";

export default function SettingsPage() {
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    username: user?.username || "",
    bio: user?.bio || "",
    location: user?.location || "",
    website: user?.website || "",
  });
  const [selectedHobbies, setSelectedHobbies] = useState<string[]>(user?.hobbies || []);

  const tabs = [
    { id: "profile" as const, label: "Profile", icon: User },
    { id: "appearance" as const, label: "Appearance", icon: Palette },
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "privacy" as const, label: "Privacy", icon: Shield },
  ];

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      updateUser({
        ...formData,
        hobbies: selectedHobbies,
      });
      setIsSaving(false);
    }, 800);
  };

  const toggleHobby = (hobbyId: string) => {
    setSelectedHobbies((prev) =>
      prev.includes(hobbyId) ? prev.filter((h) => h !== hobbyId) : [...prev, hobbyId]
    );
  };

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account and preferences</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-48 flex-shrink-0">
            <div className="flex lg:flex-col gap-1 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
                      : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-6">
            {activeTab === "profile" && (
              <>
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    Profile Information
                  </h2>
                  <div className="flex items-center gap-4 mb-6">
                    <Avatar name={user?.fullName} size="xl" />
                    <div>
                      <Button variant="secondary" size="sm">Change Avatar</Button>
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG. Max 5MB.</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Input
                      id="fullName"
                      label="Full Name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                    <Input
                      id="username"
                      label="Username"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bio</label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={3}
                        className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                    <Input
                      id="location"
                      label="Location"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="City, Country"
                    />
                    <Input
                      id="website"
                      label="Website"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      placeholder="https://yoursite.com"
                    />
                  </div>
                </Card>

                {/* Hobbies Selection */}
                <Card>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Your Hobbies
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">Select the hobbies you're passionate about</p>
                  <div className="flex flex-wrap gap-2">
                    {HOBBIES.map((hobby) => (
                      <button
                        key={hobby.id}
                        type="button"
                        onClick={() => toggleHobby(hobby.id)}
                      >
                        <Badge
                          variant={selectedHobbies.includes(hobby.id) ? "primary" : "default"}
                          onRemove={selectedHobbies.includes(hobby.id) ? () => toggleHobby(hobby.id) : undefined}
                        >
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
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => {
                      logout();
                      window.location.href = "/";
                    }}
                  >
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
                      {theme === "dark" ? (
                        <Moon className="w-5 h-5 text-indigo-500" />
                      ) : (
                        <Sun className="w-5 h-5 text-orange-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Theme</p>
                        <p className="text-sm text-gray-500">
                          Current: {theme === "dark" ? "Dark Mode" : "Light Mode"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className={`relative w-12 h-6 rounded-full transition-colors ${
                        theme === "dark" ? "bg-indigo-600" : "bg-gray-300"
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                          theme === "dark" ? "translate-x-6" : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">Reduce Animations</p>
                        <p className="text-sm text-gray-500">Minimize motion effects</p>
                      </div>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600" />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === "notifications" && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Likes", desc: "When someone likes your post" },
                    { label: "Comments", desc: "When someone comments on your post" },
                    { label: "New Followers", desc: "When someone follows you" },
                    { label: "Messages", desc: "When you receive a direct message" },
                    { label: "Mentions", desc: "When someone mentions you" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-indigo-600 relative cursor-pointer">
                        <div className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {activeTab === "privacy" && (
              <Card>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                  Privacy Settings
                </h2>
                <div className="space-y-4">
                  {[
                    { label: "Private Profile", desc: "Only followers can see your posts" },
                    { label: "Show Online Status", desc: "Let others see when you're active" },
                    { label: "Allow Friend Requests", desc: "Anyone can send you requests" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <div className="w-12 h-6 rounded-full bg-gray-300 dark:bg-gray-600 relative cursor-pointer">
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow" />
                      </div>
                    </div>
                  ))}
                  <hr className="border-gray-100 dark:border-gray-800" />
                  <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/10">
                    <h3 className="font-medium text-red-600 dark:text-red-400">Danger Zone</h3>
                    <p className="text-sm text-red-500 mt-1">Delete your account and all associated data</p>
                    <Button variant="danger" size="sm" className="mt-3">Delete Account</Button>
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
