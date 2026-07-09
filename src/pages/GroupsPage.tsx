import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { Users, Plus, Lock, Globe, Search, X, Check } from "lucide-react";
import toast from "react-hot-toast";

export default function GroupsPage() {
  const { user } = useAuth();
  const [groups, setGroups] = useState<any[]>([]);
  const [myGroups, setMyGroups] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [activeTab, setActiveTab] = useState<"discover" | "my">("discover");
  const [creating, setCreating] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    privacy: "public" as "public" | "private",
    avatar_url: "",
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchGroups();
    fetchMyGroups();
  }, [user]);

  const fetchGroups = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase
        .from("groups")
        .select("*, profiles:created_by (full_name, username, avatar_url), group_members (user_id)")
        .eq("privacy", "public")
        .order("created_at", { ascending: false });
      setGroups(data || []);
    } catch (error) {
      toast.error("Failed to load groups");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyGroups = async () => {
    if (!user) return;
    try {
      const { data: memberData } = await supabase
        .from("group_members")
        .select("group_id")
        .eq("user_id", user.id);
      const groupIds = (memberData || []).map((m) => m.group_id);
      if (groupIds.length === 0) { setMyGroups([]); return; }
      const { data } = await supabase
        .from("groups")
        .select("*, profiles:created_by (full_name, username, avatar_url), group_members (user_id)")
        .in("id", groupIds)
        .order("created_at", { ascending: false });
      setMyGroups(data || []);
    } catch (error) {
      console.error("Failed to load my groups");
    }
  };

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setAvatarPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !user) return;
    setCreating(true);
    try {
      let avatarUrl = "";
      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop();
        const path = `groups/${user.id}/${Date.now()}.${ext}`;
        const { data, error } = await supabase.storage.from("avatars").upload(path, avatarFile);
        if (!error) {
          const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(data.path);
          avatarUrl = urlData.publicUrl;
        }
      }

      const { data: group, error } = await supabase.from("groups").insert({
        name: form.name.trim(),
        description: form.description.trim(),
        privacy: form.privacy,
        created_by: user.id,
        avatar_url: avatarUrl,
      }).select().single();

      if (error) throw error;

      // Auto add creator as admin
      await supabase.from("group_members").insert({
        group_id: group.id,
        user_id: user.id,
        role: "admin",
      });

      toast.success("Group created!");
      setShowCreate(false);
      setForm({ name: "", description: "", privacy: "public", avatar_url: "" });
      setAvatarFile(null);
      setAvatarPreview(null);
      fetchGroups();
      fetchMyGroups();
    } catch (error: any) {
      toast.error(error.message || "Failed to create group");
    } finally {
      setCreating(false);
    }
  };

  const handleJoin = async (group: any) => {
    if (!user) return;
    const isMember = group.group_members?.some((m: any) => m.user_id === user.id);
    if (isMember) return;

    if (group.privacy === "public") {
      try {
        await supabase.from("group_members").insert({ group_id: group.id, user_id: user.id, role: "member" });
        toast.success("Joined group!");
        fetchGroups();
        fetchMyGroups();
      } catch (error) {
        toast.error("Failed to join group");
      }
    } else {
      try {
        const { error } = await supabase.from("group_join_requests").insert({ group_id: group.id, user_id: user.id });
        if (error) throw error;
        toast.success("Join request sent!");
      } catch (error: any) {
        if (error.code === "23505") {
          toast.error("Request already sent!");
        } else {
          toast.error("Failed to send request");
        }
      }
    }
  };

  const filteredGroups = (activeTab === "my" ? myGroups : groups).filter((g) =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Groups</h1>
            <p className="text-sm text-gray-500 mt-1">Connect with people sharing your passion</p>
          </div>
          <button onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium text-sm shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transition-all hover:scale-105">
            <Plus className="w-4 h-4" /> Create Group
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groups..."
            className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100" />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          {[["discover", "Discover"], ["my", "My Groups"]].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === tab ? "bg-white dark:bg-gray-900 text-indigo-600 shadow-sm" : "text-gray-500"}`}>
              {label} {tab === "my" && `(${myGroups.length})`}
            </button>
          ))}
        </div>

        {/* Groups Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
            ))}
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              {activeTab === "my" ? "You haven't joined any groups yet" : "No groups found"}
            </h3>
            <p className="text-sm text-gray-500">
              {activeTab === "my" ? "Discover and join groups that match your interests" : "Be the first to create a group!"}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {filteredGroups.map((group) => {
              const isMember = group.group_members?.some((m: any) => m.user_id === user?.id);
              const memberCount = group.group_members?.length || 0;
              return (
                <div key={group.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1">
                  {/* Cover gradient */}
                  <div className="h-20 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/10" />
                    <div className="absolute -bottom-6 left-4">
                      {group.avatar_url ? (
                        <img src={group.avatar_url} alt={group.name} className="w-12 h-12 rounded-xl border-2 border-white object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl border-2 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                          {group.name[0]}
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2">
                      {group.privacy === "private" ? (
                        <span className="flex items-center gap-1 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                          <Lock className="w-3 h-3" /> Private
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 bg-black/30 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                          <Globe className="w-3 h-3" /> Public
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-4 pt-8">
                    <Link to={isMember ? `/groups/${group.id}` : "#"}>
                      <h3 className="font-bold text-gray-900 dark:text-gray-100 hover:text-indigo-600 transition-colors">{group.name}</h3>
                    </Link>
                    {group.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{group.description}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {group.group_members?.slice(0, 3).map((m: any, i: number) => (
                            <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 border border-white flex items-center justify-center text-white text-xs font-bold">
                              {i + 1}
                            </div>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{memberCount} members</span>
                      </div>
                      {isMember ? (
                        <Link to={`/groups/${group.id}`}
                          className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-medium hover:bg-indigo-100 transition-colors">
                          Open
                        </Link>
                      ) : (
                        <button onClick={() => handleJoin(group)}
                          className="text-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-3 py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity">
                          {group.privacy === "private" ? "Request" : "Join"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Group Modal */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-md shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Create Group</h3>
                <button onClick={() => setShowCreate(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Group avatar" className="w-16 h-16 rounded-2xl object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-2xl font-bold">
                      {form.name ? form.name[0].toUpperCase() : "G"}
                    </div>
                  )}
                  <label htmlFor="group-avatar" className="absolute -bottom-1 -right-1 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center cursor-pointer">
                    <Plus className="w-3.5 h-3.5 text-white" />
                  </label>
                  <input id="group-avatar" type="file" accept="image/*" onChange={handleAvatarSelect} className="hidden" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Group Avatar</p>
                  <p className="text-xs text-gray-400">Click the + to upload</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter group name..."
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What is this group about?"
                    rows={3}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-100 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "public", label: "Public", desc: "Anyone can join", icon: Globe },
                      { value: "private", label: "Private", desc: "Approval required", icon: Lock },
                    ].map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setForm({ ...form, privacy: opt.value as any })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${form.privacy === opt.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                        <opt.icon className={`w-5 h-5 ${form.privacy === opt.value ? "text-indigo-600" : "text-gray-400"}`} />
                        <div>
                          <p className={`text-sm font-medium ${form.privacy === opt.value ? "text-indigo-600" : "text-gray-900 dark:text-gray-100"}`}>{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowCreate(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreate} disabled={!form.name.trim() || creating}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {creating ? "Creating..." : "Create Group"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
