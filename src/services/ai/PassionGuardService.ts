import type { PassionGuardVerdict } from "@/types";
import type { PassionGuardRequest } from "./types";
import { analyzeTextTaxonomy, discoverNovelKeywords } from "./taxonomy";
import { AIService } from "./AIService";

export class PassionGuardService {
  private static readonly APPROVAL_THRESHOLD = 40;

  /**
   * Evaluates post content for passion and community relevance
   */
  public static async evaluatePost(request: PassionGuardRequest): Promise<PassionGuardVerdict> {
    const combinedText = [
      request.projectTitle || "",
      request.projectDescription || "",
      request.content || "",
      request.caption || "",
      request.techStack || "",
    ]
      .filter(Boolean)
      .join(" \n ");

    // 1. Run taxonomy & action analysis
    const analysis = analyzeTextTaxonomy(combinedText);
    let score = analysis.rawScore;

    // 2. Check author hobbies alignment bonus (if user is posting about their registered passion)
    if (request.authorPassions && request.authorPassions.length > 0) {
      const lowerText = combinedText.toLowerCase();
      const userMatches = request.authorPassions.filter((hobby) =>
        lowerText.includes(hobby.toLowerCase())
      );
      if (userMatches.length > 0) {
        score = Math.min(100, score + userMatches.length * 12);
      }
    }

    // 3. Project type bonus (a project with title + tech stack or description is inherently passion-driven)
    if (request.type === "project") {
      if (request.projectTitle && request.projectTitle.trim().length > 3) {
        score = Math.max(score, 55);
      }
      if (request.techStack && request.techStack.trim().length > 2) {
        score = Math.min(100, score + 20);
      }
    }

    // 4. Extract detected topics
    const detectedTopics: string[] = [];
    analysis.matchedCategories.forEach((match) => {
      detectedTopics.push(...match.matchedKeywords);
    });

    // Add unique category names
    const categoryNames = analysis.matchedCategories.map((c) => c.category.name);
    const primaryCategory = categoryNames[0] || (analysis.actionMatches.length > 0 ? "Personal Project / Learning" : "General");

    const uniqueTopics = Array.from(new Set([...detectedTopics, ...analysis.actionMatches])).slice(0, 6);

    // 5. If score is borderline (30-45) and local LLM is available, consult Ollama
    if (score >= 25 && score <= 48) {
      try {
        const isAIAvailable = await AIService.isLocalAIAvailable();
        if (isAIAvailable) {
          const prompt = `Evaluate if this social post relates to any hobby, skill, creative activity, technology, project, sports, or learning:\n\n"${combinedText}"\n\nReply with a single JSON object in format: {"isPassion": boolean, "score": number, "topics": string[]}`;
          const aiCheck = await AIService.generateJSON<{ isPassion: boolean; score: number; topics: string[] }>(prompt);
          if (aiCheck && typeof aiCheck.score === "number") {
            score = Math.round((score + aiCheck.score) / 2);
            if (aiCheck.topics && Array.isArray(aiCheck.topics)) {
              aiCheck.topics.forEach((t) => uniqueTopics.push(t));
            }
          }
        }
      } catch {
        // Fall back gracefully to existing calculated score
      }
    }

    const isApproved = score >= this.APPROVAL_THRESHOLD;

    // 6. Generate human-friendly explanations and helpful guidance
    let feedback = "";
    const suggestions: string[] = [];

    if (isApproved) {
      if (score >= 80) {
        feedback = `Excellent! High passion relevance (${score}%). This connects well with ${primaryCategory} and the Passionverse community.`;
      } else {
        feedback = `Approved (${score}% relevance). Your post touches on meaningful activities and interests.`;
      }
      suggestions.push("Add hashtags or detail your learning process to increase engagement.");
    } else {
      feedback = `This post has low passion relevance (${score}%). Passionverse is dedicated to hobbies, skills, projects, learning, creative arts, and collaboration.`;
      suggestions.push("Connect your thought to a hobby, skill, or creative pursuit.");
      suggestions.push("Share what you learned, built, practiced, or experimented with today.");
      suggestions.push("Looking for help? Ask for collaborators, learning partners, or feedback.");
    }

    return {
      relevanceScore: Math.min(100, Math.max(5, score)),
      status: isApproved ? "APPROVED" : "NEEDS_REVISION",
      detectedTopics: uniqueTopics.length > 0 ? uniqueTopics : discoverNovelKeywords(combinedText),
      primaryCategory,
      feedback,
      suggestions,
      confidence: Math.min(0.98, 0.75 + uniqueTopics.length * 0.05),
    };
  }
}
