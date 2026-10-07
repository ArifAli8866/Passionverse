import type { AIPassionProfile, ScoredPassion } from "@/types";
import type { UserAnalysisInput } from "./types";
import { PASSION_TAXONOMY, analyzeTextTaxonomy, tokenizeText } from "./taxonomy";
import { EmbeddingService } from "./EmbeddingService";
import { AIService } from "./AIService";
import { supabase } from "@/lib/supabase";

export class PassionAnalysisService {
  /**
   * Generates or fetches an AI Passion Profile for a user
   */
  public static async analyzeUser(input: UserAnalysisInput, forceRefresh = false): Promise<AIPassionProfile> {
    // 1. Check if cached profile exists in Supabase
    if (!forceRefresh && input.userId) {
      try {
        const { data: cached } = await supabase
          .from("ai_profiles")
          .select("*")
          .eq("user_id", input.userId)
          .single();

        if (cached && cached.passions && (cached.passions as any[]).length > 0) {
          return {
            id: cached.id,
            userId: cached.user_id,
            summary: cached.summary || "",
            passions: (cached.passions as ScoredPassion[]) || [],
            skills: (cached.skills as string[]) || [],
            technologies: (cached.technologies as string[]) || [],
            currentlyLearning: (cached.currently_learning as string[]) || [],
            lookingFor: (cached.looking_for as string[]) || [],
            goals: (cached.goals as string[]) || [],
            lastAnalyzedAt: cached.last_analyzed_at,
          };
        }
      } catch {
        // Table or row might not exist yet, proceed with fresh analysis
      }
    }

    // 2. Perform calculated analysis based on user data
    const profile = await this.computeProfileFromData(input);

    // 3. Persist to Supabase ai_profiles
    if (input.userId) {
      try {
        const embeddingSql = profile.embedding ? EmbeddingService.vectorToSql(profile.embedding) : null;
        await supabase.from("ai_profiles").upsert(
          {
            user_id: input.userId,
            summary: profile.summary,
            passions: profile.passions,
            skills: profile.skills,
            technologies: profile.technologies,
            currently_learning: profile.currentlyLearning,
            looking_for: profile.lookingFor,
            goals: profile.goals,
            embedding: embeddingSql as any,
            last_analyzed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
      } catch (err) {
        console.warn("Could not persist ai_profile to database:", err);
      }
    }

    return profile;
  }

  /**
   * Clearly defined scoring methodology:
   * Explicit hobby = 35 base points
   * Bio mention = 20 points
   * Project post in domain = 25 points per project (high commitment)
   * General post content = 10 points per occurrence
   * Recency / frequency weights
   */
  private static async computeProfileFromData(input: UserAnalysisInput): Promise<AIPassionProfile> {
    const rawScores: Record<string, { categoryName: string; icon: string; points: number; matches: Set<string> }> = {};

    PASSION_TAXONOMY.forEach((cat) => {
      rawScores[cat.id] = {
        categoryName: cat.name,
        icon: cat.icon,
        points: 0,
        matches: new Set<string>(),
      };
    });

    const userHobbies = (input.hobbies || []).map((h) => h.toLowerCase());
    const bioText = (input.bio || "").toLowerCase();
    const bioTokens = tokenizeText(bioText);

    // Score explicit hobbies
    userHobbies.forEach((h) => {
      PASSION_TAXONOMY.forEach((cat) => {
        if (cat.keywords.some((k) => h.includes(k) || k.includes(h))) {
          rawScores[cat.id].points += 40;
          rawScores[cat.id].matches.add(h);
        }
      });
    });

    // Score bio text
    PASSION_TAXONOMY.forEach((cat) => {
      cat.keywords.forEach((kw) => {
        if (kw.includes(" ") ? bioText.includes(kw) : bioTokens.includes(kw)) {
          rawScores[cat.id].points += 20;
          rawScores[cat.id].matches.add(kw);
        }
      });
    });

    // Score posts & projects
    const allSkills = new Set<string>();
    const allTechnologies = new Set<string>();
    const learningTopics = new Set<string>();
    const lookingForList = new Set<string>();

    const posts = input.posts || [];
    posts.forEach((post) => {
      const text = [
        post.projectTitle || "",
        post.projectDescription || "",
        post.content || "",
        post.caption || "",
        post.techStack || "",
      ].join(" ");

      const analysis = analyzeTextTaxonomy(text);

      analysis.matchedCategories.forEach((match) => {
        const catId = match.category.id;
        if (rawScores[catId]) {
          const isProject = post.type === "project";
          const addPoints = isProject ? 30 : 15;
          rawScores[catId].points += addPoints;
          match.matchedKeywords.forEach((k) => rawScores[catId].matches.add(k));
        }
      });

      // Extract technologies from techStack
      if (post.techStack) {
        post.techStack
          .split(/[,/|•]+/)
          .map((t) => t.trim())
          .filter((t) => t.length > 1)
          .forEach((t) => allTechnologies.add(t));
      }

      // Check if learning something
      const lower = text.toLowerCase();
      if (lower.includes("learning") || lower.includes("studying") || lower.includes("exploring") || lower.includes("practicing")) {
        analysis.matchedCategories.forEach((m) => {
          m.matchedKeywords.forEach((k) => learningTopics.add(k));
        });
      }

      // Check collaboration keywords
      if (lower.includes("collaborat") || lower.includes("partner") || lower.includes("looking for team")) {
        lookingForList.add("Project Collaborators");
      }
    });

    // Add declared hobbies to skills/technologies
    userHobbies.forEach((h) => allSkills.add(h.charAt(0).toUpperCase() + h.slice(1)));

    // Derive scored passions (filter points > 0, calculate normalized percentages)
    const scoredPassions: ScoredPassion[] = Object.values(rawScores)
      .filter((s) => s.points > 0)
      .map((s) => {
        // Logarithmic scale so points 40 => ~60%, 120 => ~92%, max 98%
        const score = Math.min(98, Math.round(45 + Math.log10(s.points + 1) * 26));
        return {
          name: s.categoryName,
          score,
          category: s.categoryName,
          icon: s.icon,
          confidence: Math.min(0.99, 0.6 + s.matches.size * 0.08),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);

    // If no passions found yet, supply initial hobbies or generic exploration
    if (scoredPassions.length === 0 && userHobbies.length > 0) {
      userHobbies.forEach((h) => {
        scoredPassions.push({
          name: h.charAt(0).toUpperCase() + h.slice(1),
          score: 65,
          category: "General Hobby",
          icon: "✨",
        });
      });
    }

    if (scoredPassions.length === 0) {
      scoredPassions.push({
        name: "General Exploration",
        score: 50,
        category: "Learning",
        icon: "🧭",
      });
    }

    // Default lookingFor & learning if empty
    if (lookingForList.size === 0) {
      lookingForList.add("Like-minded creators");
      lookingForList.add("Project collaborators");
    }

    if (learningTopics.size === 0 && scoredPassions.length > 0) {
      learningTopics.add(scoredPassions[0].name);
    }

    // Goals extraction
    const goals: string[] = [
      `Deepen expertise in ${scoredPassions[0]?.name || "personal passions"}`,
      `Share projects and collaborate with Passionverse community`,
    ];

    // Summary generation
    const topPassions = scoredPassions.slice(0, 3).map((p) => p.name).join(", ");
    const summary = `${input.fullName} is actively focused on ${topPassions}, passionate about learning in public and collaborating on creative & technical projects.`;

    // Generate Profile Vector Embedding
    const textForEmbedding = `${input.fullName} ${input.bio || ""} ${topPassions} ${Array.from(allSkills).join(" ")} ${Array.from(allTechnologies).join(" ")}`;
    const embedding = await EmbeddingService.generateEmbedding(textForEmbedding);

    return {
      userId: input.userId,
      summary,
      passions: scoredPassions,
      skills: Array.from(allSkills).slice(0, 10),
      technologies: Array.from(allTechnologies).slice(0, 10),
      currentlyLearning: Array.from(learningTopics).slice(0, 5),
      lookingFor: Array.from(lookingForList).slice(0, 4),
      goals,
      embedding,
      lastAnalyzedAt: new Date().toISOString(),
    };
  }
}
