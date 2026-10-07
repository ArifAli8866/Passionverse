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
  type: "image" | "text" | "project" | "video";
  content: string;
  image?: string;
  imageUrl?: string;
  caption?: string;
  projectTitle?: string;
  projectDescription?: string;
  githubLink?: string;
  demoLink?: string;
  techStack?: string;
  likes?: number;
  likesCount?: number;
  comments?: number;
  commentsCount?: number;
  shares?: number;
  saves?: number;
  createdAt: string;
  user: User;
  isLiked?: boolean;
  isSaved?: boolean;
  projectAiAnalysis?: ProjectAiAnalysis;
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

// ============================================
// AI PASSIONVERSE INTERFACES
// ============================================

export interface ScoredPassion {
  name: string;
  score: number; // 0 - 100
  category: string;
  icon?: string;
  confidence?: number;
}

export interface AIPassionProfile {
  id?: string;
  userId: string;
  summary: string;
  passions: ScoredPassion[];
  skills: string[];
  technologies: string[];
  currentlyLearning: string[];
  lookingFor: string[];
  goals: string[];
  lastAnalyzedAt?: string;
  embedding?: number[];
}

export interface PassionGuardVerdict {
  relevanceScore: number; // 0 - 100
  status: "APPROVED" | "NEEDS_REVISION";
  detectedTopics: string[];
  primaryCategory: string;
  feedback: string;
  suggestions: string[];
  confidence: number;
}

export interface PassionMatch {
  user: User;
  matchScore: number; // 0 - 100
  headline: string;
  explanation: string;
  sharedPassions: string[];
  complementarySkills: string[];
  collaborationPotential: "High" | "Very High" | "Exceptional";
}

export interface ProjectAiAnalysis {
  id?: string;
  postId: string;
  summary: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  domain: string;
  technologies: string[];
  requiredSkills: string[];
  learningOpportunities: string[];
  collaborationRoles: string[];
}

export interface ProjectMatch {
  post: Post;
  matchScore: number; // 0 - 100
  headline: string;
  explanation: string;
  matchingSkills: string[];
  skillsToLearn: string[];
  difficulty: string;
}

export interface RoadmapMilestone {
  step: number;
  title: string;
  description: string;
  skills: string[];
  suggestedProjects: string[];
  estimatedWeeks?: number;
}

export interface PassionRoadmap {
  topic: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  estimatedDuration: string;
  milestones: RoadmapMilestone[];
  suggestedCommunities: string[];
}

export interface GeneratedProjectIdea {
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  technologies: string[];
  skillsToLearn: string[];
  estimatedEffort: string;
  roadmap: string[];
  extensions: string[];
  collaboratorRoles: string[];
}

