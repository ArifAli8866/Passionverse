export interface User {
  id: string;
  email?: string;
  fullName: string;
  username: string;
  avatar: string;
  coverImage?: string;
  coverColor?: string;
  bio: string;
  location: string;
  website: string;
  hobbies: string[];
  followers: number;
  following: number;
  posts: number;
  createdAt?: string;
}

export interface Post {
  id: string;
  userId: string;
  type: "image" | "text" | "project";
  content: string;
  image: string;
  caption: string;
  projectTitle?: string;
  projectDescription?: string;
  githubLink?: string;
  demoLink?: string;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  createdAt: string;
  user: User;
  isLiked?: boolean;
  isSaved?: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
  replies?: CommentReply[];
}

export interface CommentReply {
  id: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  image?: string;
  createdAt: string;
  read: boolean;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: {
    content: string;
    senderId: string;
    timestamp: string;
  };
  user: User;
  unread: number;
  online?: boolean;
  typing?: boolean;
}

export interface Notification {
  id: string;
  type: "like" | "comment" | "follow" | "reply" | "message";
  message: string;
  userId: string;
  user: User;
  postId?: string;
  createdAt: string;
  read: boolean;
}

export type FeedType = "global" | "following" | "hobby";

export interface DashboardStats {
  totalPosts: number;
  followers: number;
  following: number;
  profileViews: number;
  engagement: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
