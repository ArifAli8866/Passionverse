import type {
  ScoredPassion,
  AIPassionProfile,
  PassionGuardVerdict,
  PassionMatch,
  ProjectAiAnalysis,
  ProjectMatch,
  GeneratedProjectIdea,
  PassionRoadmap,
} from "@/types";

export interface AIProviderConfig {
  ollamaUrl?: string;
  ollamaModel?: string;
  fallbackMode?: "auto" | "ollama" | "local";
}

export interface TaxonomyCategory {
  id: string;
  name: string;
  icon: string;
  domains: string[];
  keywords: string[];
}

export interface PassionGuardRequest {
  type: "text" | "image" | "video" | "project";
  content: string;
  caption?: string;
  projectTitle?: string;
  projectDescription?: string;
  techStack?: string;
  authorPassions?: string[];
}

export interface UserAnalysisInput {
  userId: string;
  fullName: string;
  username: string;
  bio?: string;
  hobbies?: string[];
  location?: string;
  website?: string;
  posts?: Array<{
    type: string;
    content: string;
    caption?: string;
    projectTitle?: string;
    projectDescription?: string;
    techStack?: string;
    githubLink?: string;
    createdAt?: string;
  }>;
}

export interface ProjectAnalysisInput {
  postId: string;
  projectTitle: string;
  projectDescription?: string;
  content?: string;
  techStack?: string;
  githubLink?: string;
}

export interface ProjectGenerationInput {
  passions: string[];
  interests?: string[];
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
  availableHoursPerWeek: number;
  preferredTechnologies?: string[];
  goal?: string;
}

export interface GitHubRepoAnalysis {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languages: Record<string, number>;
  topics: string[];
  detectedSkills: string[];
  detectedFrameworks: string[];
  domain: string;
  summary: string;
}

export interface ChatSuggestionInput {
  lastMessage: string;
  conversationContext?: string[];
  recipientPassions?: string[];
}
