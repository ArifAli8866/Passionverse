import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { useAuth } from "@/store/auth";
import { supabase } from "@/lib/supabase";
import { cn, formatDate } from "@/lib/utils";
import { Search, Send, MoreHorizontal, Smile, ArrowLeft, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
}

interface ChatUser {
  id: string;
  full_name: string;
  username: string;
  avatar_url: string;
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user) fetchConversations();
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!activeUser || !user) return;
    fetchMessages(activeUser.id);

    // Realtime subscription
    const subscription = supabase
      .channel("messages")
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `receiver_id=eq.${user.id}`,
      }, (payload: any) => {
        if (payload.new.sender_id === activeUser.id) {
          setMessages((prev) => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, [activeUser, user]);

  const fetchConversations = async () => {
    if (!user) return;
    try {
      const { data: sent } = await supabase
        .from("messages")
        .select("receiver_id")
        .eq("sender_id", user.id);

      const { data: received } = await supabase
        .from("messages")
        .select("sender_id")
        .eq("receiver_id", user.id);

      const userIds = new Set<string>();
      sent?.forEach((m) => userIds.add(m.receiver_id));
      received?.forEach((m) => userIds.add(m.sender_id));

      if (userIds.size === 0) return;

      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
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

      // Mark messages as read
      await supabase
        .from("messages")
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
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .or(`full_name.ilike.%${query}%,username.ilike.%${query}%`)
        .neq("id", user?.id)
        .limit(5);
      setSearchResults(data || []);
    } catch (error) {
      console.error("Search failed");
    }
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

  const handleSend = async () => {
    if (!newMessage.trim() || !activeUser || !user) return;
    const content = newMessage.trim();
    setNewMessage("");
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          sender_id: user.id,
          receiver_id: activeUser.id,
          content: content,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;
      setMessages((prev) => [...prev, data]);
    } catch (error: any) {
      toast.error("Failed to send message");
      setNewMessage(content);
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
                <Avatar name={chatUser.full_name} size="md" />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{chatUser.full_name}</p>
                  <p className="text-xs text-gray-500 truncate">@{chatUser.username}</p>
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
                <button onClick={() => setShowMobileChat(false)} className="sm:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={activeUser.full_name} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{activeUser.full_name}</p>
                  <p className="text-xs text-gray-400">@{activeUser.username}</p>
                </div>
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {isLoading && (
                  <div className="text-center text-sm text-gray-400">Loading messages...</div>
                )}
                {messages.map((msg) => {
                  const isMine = msg.sender_id === user?.id;
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5",
                        isMine ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md")}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn("text-xs mt-1", isMine ? "text-indigo-200" : "text-gray-400")}>
                          {formatDate(msg.created_at)}
                          {isMine && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="flex-1 relative">
                    <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2.5 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 border-0 pr-10"
                      onKeyDown={(e) => e.key === "Enter" && handleSend()} />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button onClick={handleSend} disabled={!newMessage.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                    <Send className="w-5 h-5" />
                  </button>
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
