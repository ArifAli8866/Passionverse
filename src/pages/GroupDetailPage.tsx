import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/auth";
import { Users, MessageCircle, Grid, Settings, Send, ArrowLeft, Lock, Globe, UserPlus, UserMinus, Check, X, Image, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import toast from "react-hot-toast";

export default function GroupDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [group, setGroup] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [joinRequests, setJoinRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"posts" | "chat" | "members" | "settings">("posts");
  const [isLoading, setIsLoading] = useState(true);
  const [myRole, setMyRole] = useState<"admin" | "member" | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [postContent, setPostContent] = useState("");
  const [posting, setPosting] = useState(false);
  const [sending, setSending] = useState(false);
  const [editGroup, setEditGroup] = useState({ name: "", description: "", privacy: "public" });
  const [saving, setSaving] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (id) {
      fetchGroup();
      fetchMembers();
      fetchPosts();
    }
    return () => { if (channelRef.current) supabase.removeChannel(channelRef.current); };
  }, [id]);

  useEffect(() => {
    if (activeTab === "chat") {
      fetchMessages();
      setupRealtime();
    }
    if (activeTab === "members" && myRole === "admin") {
      fetchJoinRequests();
    }
  }, [activeTab]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchGroup = async () => {
    setIsLoading(true);
    try {
      const { data } = await supabase.from("groups").select("*, profiles:created_by (full_name, username, avatar_url)").eq("id", id).single();
      setGroup(data);
      setEditGroup({ name: data?.name || "", description: data?.description || "", privacy: data?.privacy || "public" });
    } catch (error) {
      toast.error("Group not found");
      navigate("/groups");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    const { data } = await supabase.from("group_members")
      .select("*, profiles:user_id (id, full_name, username, avatar_url)")
      .eq("group_id", id)
      .order("joined_at", { ascending: true });
    setMembers(data || []);
    const me = (data || []).find((m: any) => m.user_id === user?.id);
    setMyRole(me?.role || null);
  };

  const fetchMessages = async () => {
    const { data } = await supabase.from("group_messages")
      .select("*, profiles:user_id (id, full_name, username, avatar_url)")
      .eq("group_id", id)
      .order("created_at", { ascending: true });
    setMessages(data || []);
  };

  const fetchPosts = async () => {
    const { data } = await supabase.from("group_posts")
      .select("*, profiles:user_id (id, full_name, username, avatar_url), group_post_likes (user_id)")
      .eq("group_id", id)
      .order("created_at", { ascending: false });
    setPosts(data || []);
  };

  const fetchJoinRequests = async () => {
    const { data } = await supabase.from("group_join_requests")
      .select("*, profiles:user_id (id, full_name, username, avatar_url)")
      .eq("group_id", id)
      .eq("status", "pending");
    setJoinRequests(data || []);
  };

  const setupRealtime = () => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const channel = supabase.channel(`group-${id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${id}` },
        async (payload: any) => {
          const { data } = await supabase.from("group_messages")
            .select("*, profiles:user_id (id, full_name, username, avatar_url)")
            .eq("id", payload.new.id).single();
          if (data) setMessages((prev) => [...prev, data]);
        })
      .subscribe();
    channelRef.current = channel;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    setSending(true);
    try {
      await supabase.from("group_messages").insert({ group_id: id, user_id: user.id, content: newMessage.trim() });
      setNewMessage("");
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handlePost = async () => {
    if (!postContent.trim() || !user) return;
    setPosting(true);
    try {
      await supabase.from("group_posts").insert({ group_id: id, user_id: user.id, content: postContent.trim() });
      setPostContent("");
      fetchPosts();
      toast.success("Post shared!");
    } catch (error) {
      toast.error("Failed to post");
    } finally {
      setPosting(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Delete this post?")) return;
    await supabase.from("group_posts").delete().eq("id", postId);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    toast.success("Post deleted");
  };

  const handleLikePost = async (postId: string, isLiked: boolean) => {
    if (!user) return;
    if (isLiked) {
      await supabase.from("group_post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("group_post_likes").insert({ post_id: postId, user_id: user.id });
    }
    fetchPosts();
  };

  const handleApproveRequest = async (requestId: string, userId: string) => {
    await supabase.from("group_join_requests").update({ status: "approved" }).eq("id", requestId);
    await supabase.from("group_members").insert({ group_id: id, user_id: userId, role: "member" });
    toast.success("Request approved!");
    fetchJoinRequests();
    fetchMembers();
  };

  const handleRejectRequest = async (requestId: string) => {
    await supabase.from("group_join_requests").update({ status: "rejected" }).eq("id", requestId);
    toast.success("Request rejected");
    fetchJoinRequests();
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm("Remove this member?")) return;
    await supabase.from("group_members").delete().eq("id", memberId);
    toast.success("Member removed");
    fetchMembers();
  };

  const handleLeaveGroup = async () => {
    if (!confirm("Leave this group?")) return;
    await supabase.from("group_members").delete().eq("group_id", id).eq("user_id", user?.id);
    toast.success("Left group");
    navigate("/groups");
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      await supabase.from("groups").update({ name: editGroup.name, description: editGroup.description, privacy: editGroup.privacy }).eq("id", id);
      toast.success("Settings saved!");
      fetchGroup();
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGroup = async () => {
    if (!confirm("Delete this group permanently? This cannot be undone.")) return;
    await supabase.from("groups").delete().eq("id", id);
    toast.success("Group deleted");
    navigate("/groups");
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="max-w-4xl mx-auto">
          <div className="h-48 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse mb-4" />
          <div className="h-8 w-48 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
        </div>
      </AppLayout>
    );
  }

  if (!group) return null;

  const tabs = [
    { id: "posts", label: "Posts", icon: Grid },
    { id: "chat", label: "Chat", icon: MessageCircle },
    { id: "members", label: `Members (${members.length})`, icon: Users },
    ...(myRole === "admin" ? [{ id: "settings", label: "Settings", icon: Settings }] : []),
  ];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link to="/groups" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Groups
        </Link>

        {/* Group Header */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden mb-6">
          <div className="h-36 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
            <div className="absolute inset-0 bg-black/10" />
            <div className="absolute bottom-4 left-6 flex items-end gap-4">
              {group.avatar_url ? (
                <img src={group.avatar_url} alt={group.name} className="w-16 h-16 rounded-2xl border-4 border-white object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-2xl border-4 border-white bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-2xl">
                  {group.name[0]}
                </div>
              )}
            </div>
            <div className="absolute top-3 right-3">
              {group.privacy === "private" ? (
                <span className="flex items-center gap-1 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  <Lock className="w-3 h-3" /> Private
                </span>
              ) : (
                <span className="flex items-center gap-1 bg-black/30 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                  <Globe className="w-3 h-3" /> Public
                </span>
              )}
            </div>
          </div>
          <div className="p-5 pt-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{group.name}</h1>
                {group.description && <p className="text-sm text-gray-500 mt-1">{group.description}</p>}
                <p className="text-xs text-gray-400 mt-1">{members.length} members · Created by {group.profiles?.full_name}</p>
              </div>
              {myRole && myRole !== "admin" && (
                <button onClick={handleLeaveGroup} className="flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg transition-colors">
                  <UserMinus className="w-4 h-4" /> Leave
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-white dark:bg-gray-900 text-indigo-600 shadow-sm" : "text-gray-500"}`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-4">
            {myRole && (
              <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
                <div className="flex gap-3">
                  <Avatar src={user?.avatar} name={user?.fullName} size="md" />
                  <div className="flex-1">
                    <textarea value={postContent} onChange={(e) => setPostContent(e.target.value)}
                      placeholder="Share something with the group..."
                      rows={3}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-100 resize-none" />
                    <div className="flex justify-end mt-2">
                      <button onClick={handlePost} disabled={!postContent.trim() || posting}
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium disabled:opacity-50 hover:opacity-90 transition-opacity">
                        {posting ? "Posting..." : "Post"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {posts.length === 0 ? (
              <div className="text-center py-12">
                <Grid className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No posts yet. Be the first to share!</p>
              </div>
            ) : (
              posts.map((post) => {
                const isLiked = post.group_post_likes?.some((l: any) => l.user_id === user?.id);
                const likesCount = post.group_post_likes?.length || 0;
                return (
                  <div key={post.id} className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5">
                    <div className="flex items-center justify-between mb-3">
                      <Link to={`/profile/${post.profiles?.username}`} className="flex items-center gap-3">
                        <Avatar src={post.profiles?.avatar_url} name={post.profiles?.full_name} size="md" />
                        <div>
                          <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{post.profiles?.full_name}</p>
                          <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                        </div>
                      </Link>
                      {(post.user_id === user?.id || myRole === "admin") && (
                        <button onClick={() => handleDeletePost(post.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed mb-4">{post.content}</p>
                    {post.image_url && <img src={post.image_url} alt="Post" className="rounded-xl mb-4 w-full object-cover max-h-80" />}
                    <div className="flex items-center gap-4 pt-3 border-t border-gray-50 dark:border-gray-800">
                      <button onClick={() => handleLikePost(post.id, isLiked)}
                        className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${isLiked ? "text-pink-600" : "text-gray-500 hover:text-pink-600"}`}>
                        <svg className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" fill="none">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                        {likesCount} {likesCount === 1 ? "like" : "likes"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === "chat" && (
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden" style={{ height: "600px", display: "flex", flexDirection: "column" }}>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-50" />
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              {messages.map((msg) => {
                const isMine = msg.user_id === user?.id;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                    <Avatar src={msg.profiles?.avatar_url} name={msg.profiles?.full_name} size="sm" />
                    <div className={`max-w-[70%] ${isMine ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                      {!isMine && <p className="text-xs text-gray-400 ml-1">{msg.profiles?.full_name}</p>}
                      <div className={`rounded-2xl px-4 py-2.5 ${isMine ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-sm" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-sm"}`}>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                      <p className="text-xs text-gray-400 mx-1">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            {myRole ? (
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex gap-2">
                  <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-xl bg-gray-50 dark:bg-gray-800 border-0 px-4 py-2.5 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                    onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} />
                  <button onClick={handleSendMessage} disabled={!newMessage.trim() || sending}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white disabled:opacity-50 hover:opacity-90 transition-opacity">
                    <Send className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 border-t border-gray-100 dark:border-gray-800 text-center text-sm text-gray-400">
                Join the group to participate in the chat
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === "members" && (
          <div className="space-y-4">
            {/* Join Requests - Admin only */}
            {myRole === "admin" && joinRequests.length > 0 && (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 dark:bg-amber-900/10 dark:border-amber-900/30 p-4">
                <h3 className="font-semibold text-amber-800 dark:text-amber-400 mb-3">
                  Pending Requests ({joinRequests.length})
                </h3>
                <div className="space-y-3">
                  {joinRequests.map((req) => (
                    <div key={req.id} className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-xl p-3">
                      <Avatar src={req.profiles?.avatar_url} name={req.profiles?.full_name} size="sm" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{req.profiles?.full_name}</p>
                        <p className="text-xs text-gray-400">@{req.profiles?.username}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleApproveRequest(req.id, req.user_id)}
                          className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleRejectRequest(req.id)}
                          className="p-1.5 bg-red-100 text-red-500 rounded-lg hover:bg-red-200 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members list */}
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
              {members.map((member, i) => (
                <div key={member.id} className={`flex items-center gap-3 p-4 ${i < members.length - 1 ? "border-b border-gray-50 dark:border-gray-800" : ""}`}>
                  <Avatar src={member.profiles?.avatar_url} name={member.profiles?.full_name} size="md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{member.profiles?.full_name}</p>
                      {member.role === "admin" && (
                        <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-medium">Admin</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">@{member.profiles?.username}</p>
                  </div>
                  {myRole === "admin" && member.user_id !== user?.id && (
                    <button onClick={() => handleRemoveMember(member.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <UserMinus className="w-4 h-4" />
                    </button>
                  )}
                  {member.user_id === user?.id && (
                    <span className="text-xs text-gray-400">You</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Tab - Admin only */}
        {activeTab === "settings" && myRole === "admin" && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Group Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                  <input type="text" value={editGroup.name} onChange={(e) => setEditGroup({ ...editGroup, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-100" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea value={editGroup.description} onChange={(e) => setEditGroup({ ...editGroup, description: e.target.value })}
                    rows={3} className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:text-gray-100 resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Privacy</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "public", label: "Public", desc: "Anyone can join", icon: Globe },
                      { value: "private", label: "Private", desc: "Approval required", icon: Lock },
                    ].map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setEditGroup({ ...editGroup, privacy: opt.value })}
                        className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${editGroup.privacy === opt.value ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20" : "border-gray-200 dark:border-gray-700"}`}>
                        <opt.icon className={`w-5 h-5 ${editGroup.privacy === opt.value ? "text-indigo-600" : "text-gray-400"}`} />
                        <div>
                          <p className={`text-sm font-medium ${editGroup.privacy === opt.value ? "text-indigo-600" : "text-gray-900 dark:text-gray-100"}`}>{opt.label}</p>
                          <p className="text-xs text-gray-400">{opt.desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={handleSaveSettings} disabled={saving}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium text-sm disabled:opacity-50 hover:opacity-90 transition-opacity">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 p-6">
              <h3 className="font-semibold text-red-600 dark:text-red-400 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-500 mb-4">Deleting the group is permanent and cannot be undone.</p>
              <button onClick={handleDeleteGroup}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                <Trash2 className="w-4 h-4" /> Delete Group
              </button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
