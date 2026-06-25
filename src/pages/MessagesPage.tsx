import { useState, useEffect, useRef } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate, MOCK_CHATS, generateId } from "@/lib/utils";
import type { Chat, Message } from "@/types";
import { Search, Send, Phone, Video, MoreHorizontal, Smile, Paperclip, ArrowLeft, MessageCircle } from "lucide-react";

const initialMessages: Record<string, Message[]> = {
  chat1: [
    { id: "m1", chatId: "chat1", senderId: "user2", content: "Hey! Love your latest photo!", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
    { id: "m2", chatId: "chat1", senderId: "currentUser", content: "Thanks so much! 😊", createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(), read: true },
    { id: "m3", chatId: "chat1", senderId: "currentUser", content: "That photo is absolutely stunning!", createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: true },
  ],
  chat2: [
    { id: "m4", chatId: "chat2", senderId: "user3", content: "Great workout today!", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: true },
    { id: "m5", chatId: "chat2", senderId: "currentUser", content: "Thanks for the fitness tips! They really helped.", createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: true },
  ],
  chat3: [
    { id: "m6", chatId: "chat3", senderId: "currentUser", content: "Hey! How's the project going?", createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(), read: true },
    { id: "m7", chatId: "chat3", senderId: "user1", content: "Going great! Check out my new project on GitHub!", createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(), read: true },
  ],
  chat4: [
    { id: "m8", chatId: "chat4", senderId: "user4", content: "Would love to collaborate on a project!", createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(), read: true },
    { id: "m9", chatId: "chat4", senderId: "currentUser", content: "That sounds amazing! Let's do it!", createdAt: new Date(Date.now() - 1000 * 60 * 119).toISOString(), read: true },
  ],
};

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChatData = chats.find((c) => c.id === activeChat);

  useEffect(() => {
    if (activeChat) {
      setMessages(initialMessages[activeChat] || []);
      setShowMobileChat(true);
    }
  }, [activeChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !activeChat) return;
    const msg: Message = {
      id: generateId(),
      chatId: activeChat,
      senderId: "currentUser",
      content: newMessage,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setMessages((prev) => [...prev, msg]);
    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChat
          ? { ...c, lastMessage: { content: newMessage, senderId: "currentUser", timestamp: msg.createdAt } }
          : c
      )
    );
    setNewMessage("");
  };

  const filteredChats = chats.filter((c) =>
    c.user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AppLayout showSidebar={false}>
      <div className="flex h-[calc(100vh-8rem)] rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden dark:border-gray-800 dark:bg-gray-900">
        {/* Chat Sidebar */}
        <div className={cn(
          "w-full sm:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-800 flex flex-col",
          showMobileChat && "hidden sm:flex"
        )}>
          <div className="p-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search conversations..."
                className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2 pl-10 pr-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 border-0"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800",
                  activeChat === chat.id && "bg-indigo-50 dark:bg-indigo-900/20"
                )}
              >
                <div className="relative">
                  <Avatar name={chat.user.fullName} size="md" />
                  {chat.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
                  )}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {chat.user.fullName}
                    </p>
                    <span className="text-xs text-gray-400 flex-shrink-0">
                      {formatDate(chat.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-0.5">
                    {chat.lastMessage.senderId === "currentUser" && "You: "}
                    {chat.lastMessage.content}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <Badge variant="primary" size="sm">{chat.unread}</Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col",
          !showMobileChat && "hidden sm:flex"
        )}>
          {activeChatData ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setShowMobileChat(false)}
                  className="sm:hidden p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={activeChatData.user.fullName} size="md" />
                <div className="flex-1">
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {activeChatData.user.fullName}
                  </p>
                  <p className="text-xs text-emerald-500">
                    {activeChatData.online ? "Online" : "Offline"}
                  </p>
                </div>
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Phone className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <Video className="w-5 h-5" />
                </button>
                <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((msg) => {
                  const isMine = msg.senderId === "currentUser";
                  return (
                    <div key={msg.id} className={cn("flex", isMine ? "justify-end" : "justify-start")}>
                      <div className={cn(
                        "max-w-[75%] rounded-2xl px-4 py-2.5",
                        isMine
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-md"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md"
                      )}>
                        <p className="text-sm">{msg.content}</p>
                        <p className={cn("text-xs mt-1", isMine ? "text-indigo-200" : "text-gray-400")}>
                          {formatDate(msg.createdAt)}
                          {isMine && <span className="ml-1">{msg.read ? "✓✓" : "✓"}</span>}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {/* Typing indicator */}
                {activeChatData.typing && (
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                    typing...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                    <Paperclip className="w-5 h-5" />
                  </button>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="w-full rounded-xl bg-gray-50 dark:bg-gray-800 py-2.5 px-4 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/30 border-0 pr-10"
                      onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    />
                    <button className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600">
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>
                  <button
                    onClick={handleSend}
                    disabled={!newMessage.trim()}
                    className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
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
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
