import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import {
  Search, Send, ArrowLeft, MessageCircle, Image,
  Mic, MicOff, X, File, Trash2, Forward, MoreVertical
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
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);
  const activeUserRef = useRef<ChatUser | null>(null);
  const channelRef = useRef<any>(null);
  const isTypingRef = useRef(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const [forwardingMessage, setForwardingMessage] = useState<Message | null>(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  useEffect(() => {
    activeUserRef.current = activeUser;
  }, [activeUser]);

  useEffect(() => {
    if (user) {
      fetchConversations();
      updateOnlineStatus(true);

      // Global realtime listener for ALL incoming messages
      const globalChannel = supabase
        .channel("global-messages")
        .on("postgres_changes", {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `receiver_id=eq.${user.id}`,
        }, (payload: any) => {
          const msg = payload.new as Message;
          // If message is from active chat user, add it directly
          if (activeUserRef.current && msg.sender_id === activeUserRef.current.id) {
            setMessages((prev) => {
              if (prev.find((m) => m.id === msg.id)) return prev;
              return [...prev, msg];
            });
            // Mark as read immediately
            supabase.from("messages").update({ read: true }).eq("id", msg.id);
          }
          // Refresh conversations list
          fetchConversations();
        })
        .on("broadcast", { event: "typing" }, (payload) => {
          if (activeUserRef.current && payload.payload.user_id === activeUserRef.current.id) {
            setOtherUserTyping(payload.payload.is_typing);
          }
        })
        .subscribe();

      channelRef.current = globalChannel;
    }

    return () => {
      if (user) updateOnlineStatus(false);
      if (channelRef.current) supabase.removeChannel(channelRef.current);
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, otherUserTyping]);

  const updateOnlineStatus = async (online: boolean) => {
    if (!user) return;
    await supabase.from("profiles").update({
      is_online: online,
      last_seen: new Date().toISOString(),
    }).eq("id", user.id);
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
        .select("id, full_name, username, avatar_url, is_online")
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
      await supabase.from("messages")
        .update({ read: true })
        .eq("sender_id", otherUserId)
        .eq("receiver_id", user.id)
        .eq("read", false);
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
    } catch (error) {
      console.error("Search failed");
    }
  };

  const handleSelectUser = (chatUser: ChatUser) => {
    setActiveUser(chatUser);
    activeUserRef.current = chatUser;
    setShowMobileChat(true);
    setSearchQuery("");
    setSearchResults([]);
    setMessages([]);
    setOtherUserTyping(false);
    fetchMessages(chatUser.id);
    if (!conversations.find((c) => c.id === chatUser.id)) {
      setConversations((prev) => [chatUser, ...prev]);
    }
  };

  const handleTyping = (value: string) => {
    setNewMessage(value);
    if (!channelRef.current || !user) return;
    if (!isTypingRef.current) {
      isTypingRef.current = true;
      channelRef.current.send({
        type: "broadcast",
        event: "typing",
        payload: { user_id: user.id, is_typing: true },
      });
    }
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      isTypingRef.current = false;
      channelRef.current?.send({
        type: "broadcast",
        event: "typing",
        payload: { user_id: user.id, is_typing: false },
      });
    }, 2000);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `messages/${user?.id}/${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage.from("post-images").upload(path, file);
    if (error) { toast.error("Upload failed: " + error.message); return null; }
    const { data: urlData } = supabase.storage.from("post-images").getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await supabase.from("messages").delete().eq("id", messageId);
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleForwardMessage = async (targetUserId: string) => {
    if (!forwardingMessage || !user) return;
    try {
      const { data, error } = await supabase.from("messages").insert({
        sender_id: user.id,
        receiver_id: targetUserId,
        content: forwardingMessage.content,
        read: false,
        message_type: forwardingMessage.message_type,
        file_url: forwardingMessage.file_url,
        file_name: forwardingMessage.file_name,
      }).select().single();
      if (error) throw error;
      toast.success("Message forwarded!");
      setShowForwardModal(false);
      setForwardingMessage(null);
    } catch (error) {
      toast.error("Failed to forward message");
    }
  };

  const handleSend = async () => {
    if ((!newMessage.trim() && !selectedFile) || !activeUser || !user) return;
    const content = newMessage.trim();
    const fileToSend = selectedFile;
    setNewMessage("");
    setSelectedFile(null);
    setFilePreview(null);

    try {
      let fileUrl: string | null = null;
      let msgType = "text";
      let fileName: string | null = null;

      if (fileToSend) {
        const isImage = fileToSend.type.startsWith("image/");
        const isVoice = fileToSend.type.startsWith("audio/");
        msgType = isImage ? "image" : isVoice ? "voice" : "file";
        fileName = fileToSend.name;
        toast.loading("Uploading...", { id: "upload" });
        fileUrl = await uploadFile(fileToSend);
        toast.dismiss("upload");
        if (!fileUrl) return;
      }

      const newMsg = {
        sender_id: user.id,
        receiver_id: activeUser.id,
        content: content || fileName || "",
        read: false,
        message_type: msgType,
        file_url: fileUrl,
        file_name: fileName,
      };

      const { data, error } = await supabase.from("messages").insert(newMsg).select().single();
      if (error) throw error;

      // Add own message immediately to UI
      setMessages((prev) => {
        if (prev.find((m) => m.id === data.id)) return prev;
        return [...prev, data];
      });
    } catch (error: any) {
      toast.error("Failed to send message");
      setNewMessage(content);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) { toast.error("File too large (max 50MB)"); return; }
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
      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
          console.log("chunk received:", e.data.size);
        }
      };

      mediaRecorder.onstop = () => {
        console.log("stopped, chunks:", audioChunksRef.current.length);
        const blob = new Blob(audioChunksRef.current);
        console.log("blob size:", blob.size);
        const audioFile = new File(
          [blob],
          `voice_${Date.now()}.webm`,
          { type: "audio/webm" }
        );
        setSelectedFile(audioFile);
        setFilePreview(null);
        stream.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      toast.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.requestData();
      setTimeout(() => {
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      }, 100);
    }
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
                  <p className="text-xs truncate">
                    {chatUser.is_online
                      ? <span className="text-emerald-500">Online</span>
                      : <span className="text-gray-500">@{chatUser.username}</span>}
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
                    {otherUserTyping
                      ? <span className="text-indigo-500 animate-pulse">typing...</span>
                      : activeUser.is_online
                        ? <span className="text-emerald-500">Online</span>
                        : <span className="text-gray-400">@{activeUser.username}</span>}
                  </p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && <div className="text-center text-sm text-gray-400">Loading messages...</div>}
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex group", isMine ? "justify-end" : "justify-start")}>
                      <div className="flex items-end gap-1">
                        {/* Action buttons - show on hover */}
                        <div className={cn("flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity mb-2",
                          isMine ? "order-first" : "order-last")}>
                          <button
                            onClick={() => { setForwardingMessage(msg); setShowForwardModal(true); }}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-500"
                            title="Forward">
                            <Forward className="w-3.5 h-3.5" />
                          </button>
                          {isMine && (
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-500"
                              title="Delete">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
                          isMine ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md")}>
                          {msg.message_type === "image" && msg.file_url && (
                            <img src={msg.file_url} alt="Image" className="rounded-xl mb-2 max-w-full max-h-48 object-cover cursor-pointer"
                              onClick={() => window.open(msg.file_url, "_blank")} />
                          )}
                          {msg.message_type === "voice" && msg.file_url && (
                            <audio controls src={msg.file_url} className="mb-2 max-w-xs" />
                          )}
                          {msg.message_type === "file" && msg.file_url && (
                            <a href={msg.file_url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-2 mb-2 underline text-sm">
                              <File className="w-4 h-4" /> {msg.file_name || "Download file"}
                            </a>
                          )}
                          {(msg.message_type === "text" || !msg.message_type) && (
                            <p className="text-sm">{msg.content}</p>
                          )}
                          <p className={cn("text-xs mt-1", isMine ? "text-indigo-200" : "text-gray-400")}>
                            {formatDate(msg.created_at)}
                            {isMine && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                          </p>
                        </div>
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

              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                {isRecording && (
                  <div className="flex items-center gap-2 mb-2 text-sm text-red-500">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Recording... {recordingTime}s (click mic again to stop)
                  </div>
                )}
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

                  <div className="flex-1">
                    <input type="text" value={newMessage} onChange={(e) => handleTyping(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2.5 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 border-0"
                      onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                  </div>

                  {!newMessage.trim() && !selectedFile ? (
                    <button
                      onClick={isRecording ? stopRecording : startRecording}
                      className={cn("p-2.5 rounded-xl transition-all select-none",
                        isRecording ? "bg-red-500 text-white animate-pulse" : "bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-indigo-600")}>
                      {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </button>
                  ) : (
                    <button onClick={handleSend}
                      className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all">
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

      {/* Forward Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Forward Message</h3>
              <button onClick={() => { setShowForwardModal(false); setForwardingMessage(null); }}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Select a conversation to forward to:</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {conversations.map((conv) => (
                <button key={conv.id} onClick={() => handleForwardMessage(conv.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <Avatar name={conv.full_name} size="sm" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{conv.full_name}</p>
                    <p className="text-xs text-gray-500">@{conv.username}</p>
                  </div>
                </button>
              ))}
              {conversations.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No conversations to forward to</p>
              )}
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
