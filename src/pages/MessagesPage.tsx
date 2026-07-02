import { useState, useEffect, useRef, useCallback } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import {
  Search, Send, ArrowLeft, MessageCircle, Image,
  Mic, MicOff, X, File, Smile
} from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  message_type: string;
  file_url?: string;
  file_name?: string;
}

interface ChatUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
  is_online?: boolean;
  last_seen?: string;
}

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ChatUser[]>([]);
  const [activeUser, setActiveUser] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ChatUser[]>([]);
  const [showMobileChat, setShowMobileChat] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      fetchConversations();
      updateOnlineStatus(true);
    }
    return () => {
      if (user) updateOnlineStatus(false);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  useEffect(() => {
    if (!activeUser || !user) return;
    fetchMessages(activeUser.id);
    setupRealtimeChannel(activeUser.id);
    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [activeUser?.id]);

  const updateOnlineStatus = async (online: boolean) => {
    if (!user) return;
    await supabase.from("profiles").update({
      is_online: online,
      last_seen: new Date().toISOString(),
    }).eq("id", user.id);
  };

  const setupRealtimeChannel = (otherUserId: string) => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
    const channel = supabase.channel(`chat:${user?.id}:${otherUserId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
      }, (payload: any) => {
        const msg = payload.new;
        if (
          (msg.sender_id === otherUserId && msg.receiver_id === user?.id) ||
          (msg.sender_id === user?.id && msg.receiver_id === otherUserId)
        ) {
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          if (msg.sender_id === otherUserId) {
            supabase.from("messages").update({ read: true }).eq("id", msg.id);
          }
        }
      })
      .on("broadcast", { event: "typing" }, (payload) => {
        if (payload.payload.user_id === otherUserId) {
          setOtherUserTyping(payload.payload.is_typing);
        }
      })
      .subscribe();
    channelRef.current = channel;
  };

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const { data: sent } = await supabase.from("messages").select("receiver_id").eq("sender_id", user.id);
      const { data: received } = await supabase.from("messages").select("sender_id").eq("receiver_id", user.id);
      const userIds = new Set<string>();
      sent?.forEach((m) => userIds.add(m.receiver_id));
      received?.forEach((m) => userIds.add(m.sender_id));
      if (userIds.size === 0) return;
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url, is_online, last_seen")
        .in("id", Array.from(userIds));
      setConversations(profiles || []);
    } catch (error) {
      console.error("Failed to fetch conversations");
    }
  };

  const fetchMessages = async (otherUserId: string) => {
    if (!user) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`)
        .order("created_at", { ascending: true });
      if (error) throw error;
      setMessages(data || []);
      await supabase.from("messages").update({ read: true })
        .eq("sender_id", otherUserId).eq("receiver_id", user.id).eq("read", false);
    } catch (error) {
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) { setSearchResults([]); return; }
    try {
      const { data } = await supabase.from("profiles")
        .select("id, full_name, username, avatar_url, is_online")
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq("id", user?.id).limit(5);
      setSearchResults(data || []);
    } catch (error) { console.error("Search failed"); }
  };

  const handleSelectUser = (chatUser: ChatUser) => {
    setActiveUser(chatUser);
    setShowMobileChat(true);
    setSearchQuery("");
    setSearchResults([]);
    if (!conversations.find((c) => c.id === chatUser.id)) {
      setConversations((prev) => [chatUser, ...prev]);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (!channelRef.current || !user) return;
    if (!isTyping) {
      setIsTyping(true);
      channelRef.current.send({ type: "broadcast", event: "typing", payload: { user_id: user.id, is_typing: true } });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      channelRef.current?.send({ type: "broadcast", event: "typing", payload: { user_id: user.id, is_typing: false } });
    }, 2000);
  };

  const uploadFile = async (file: File, bucket: string): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${user?.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) { toast.error("Upload failed"); return null; }
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !activeUser || !user) return;
    const content = newMessage.trim();
    setNewMessage("");
    setSelectedFile(null);
    setFilePreview(null);

    try {
      let fileUrl: string | null = null;
      let msgType = "text";
      let fileName: string | null = null;

      if (selectedFile) {
        const isImage = selectedFile.type.startsWith("image/");
        const isVoice = selectedFile.type.startsWith("audio/");
        msgType = isImage ? "image" : isVoice ? "voice" : "file";
        fileName = selectedFile.name;
        fileUrl = await uploadFile(selectedFile, "post-images");
        if (!fileUrl) return;
      }

      const { error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: activeUser.id,
        content: content || (selectedFile ? selectedFile.name : ""),
        read: false,
        message_type: msgType,
        file_url: fileUrl,
        file_name: fileName,
      });
      if (error) throw error;
    } catch (error: any) {
      toast.error("Failed to send message");
      setNewMessage(content);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioFile = new File([audioBlob], `voice_${Date.now()}.webm`, { type: "audio/webm" });
        setSelectedFile(audioFile);
        stream.getTracks().forEach((t) => t.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const displayList = searchQuery ? searchResults : conversations;

  return (
    <AppLayout showSidebar={false}>
      <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">

        {/* Sidebar */}
        <div className={cn("w-full sm:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-800 flex flex-col",
          showMobileChat && "hidden sm:flex")}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search people..."
                className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 border-0" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {displayList.length === 0 && searchQuery && (
              <p className="text-center text-sm text-gray-400 mt-8">No users found</p>
            )}
            {displayList.length === 0 && !searchQuery && (
              <div className="text-center mt-8 px-4">
                <MessageCircle className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-400 mt-1">Search for people to start chatting</p>
              </div>
            )}
            {displayList.map((chatUser) => (
              <button key={chatUser.id} onClick={() => handleSelectUser(chatUser)}
                className={cn("w-full flex items-center gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                  activeUser?.id === chatUser.id && "bg-indigo-50 dark:bg-indigo-900/20")}>
                <div className="relative">
                  <Avatar name={chatUser.full_name} size="md" />
                  {chatUser.is_online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{chatUser.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {chatUser.is_online ? (
                      <span className="text-emerald-500">Online</span>
                    ) : (
                      `@${chatUser.username}`
                    )}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn("flex-1 flex flex-col", !showMobileChat && "hidden sm:flex")}>
          {activeUser ? (
            <>
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                <button onClick={() => setShowMobileChat(false)} className="sm:hidden p-1 rounded-lg hover:bg-gray-100">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative">
                  <Avatar name={activeUser.full_name} size="md" />
                  {activeUser.is_online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activeUser.full_name}</p>
                  <p className="text-xs">
                    {otherUserTyping ? (
                      <span className="text-indigo-500">typing...</span>
                    ) : activeUser.is_online ? (
                      <span className="text-emerald-500">Online</span>
                    ) : (
                      <span className="text-gray-400">@{activeUser.username}</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && <div className="text-center text-sm text-gray-400">Loading messages...</div>}
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
                        isMine ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md")}>
                        {msg.message_type === "image" && msg.file_url && (
                          <img src={msg.file_url} alt="Image" className="rounded-xl mb-2 max-w-full max-h-48 object-cover" />
                        )}
                        {msg.message_type === "voice" && msg.file_url && (
                          <audio controls src={msg.file_url} className="mb-2 max-w-full" />
                        )}
                        {msg.message_type === "file" && msg.file_url && (
                          <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                            className="flex items-center gap-2 mb-2 underline text-sm">
                            <File className="w-4 h-4" /> {msg.file_name || "Download file"}
                          </a>
                        )}
                        {msg.content && msg.message_type === "text" && (
                          <p className="text-sm">{msg.content}</p>
                        )}
                        <p className={cn("text-xs mt-1", isMine ? "text-indigo-200" : "text-gray-400")}>
                          {formatDate(msg.created_at)}
                          {isMine && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {otherUserTyping && (
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* File Preview */}
              {selectedFile && (
                <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl p-2">
                    {filePreview ? (
                      <img src={filePreview} alt="Preview" className="w-12 h-12 rounded-lg object-cover" />
                    ) : selectedFile.type.startsWith("audio/") ? (
                      <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Mic className="w-6 h-6 text-indigo-600" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        <File className="w-6 h-6 text-gray-500" />
                      </div>
                    )}
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex-1 truncate">{selectedFile.name}</p>
                    <button onClick={() => { setSelectedFile(null); setFilePreview(null); }}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <button onClick={() => imageInputRef.current?.click()}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                    <Image className="w-5 h-5" />
                  </button>
                  <button onClick={() => fileInputRef.current?.click()}
                    className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600">
                    <File className="w-5 h-5" />
                  </button>
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} className="hidden" />

                  <div className="flex-1 relative">
                    <input type="text" value={newMessage} onChange={(e) => handleTyping(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2.5 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 border-0"
                      onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                  </div>

                  {!newMessage.trim() && !selectedFile ? (
                    <button
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      className={cn("p-2.5 rounded-xl transition-all",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600")}>
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  ) : (
                    <button onClick={handleSend} disabled={!newMessage.trim() && !selectedFile}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50">
                      <Send className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800 mb-4">
                  <MessageCircle className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Messages</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Search for people and start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
