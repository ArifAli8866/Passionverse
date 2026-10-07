import type { User, Post, PassionMatch, ProjectMatch, AIPassionProfile, ProjectAiAnalysis } from "@/types";
import { EmbeddingService } from "./EmbeddingService";
import { PassionAnalysisService } from "./PassionAnalysisService";
import { supabase } from "@/lib/supabase";

export class MatchingService {
  /**
   * Matches candidate users with current user using semantic vectors & complementary passions
   */
  public static async matchUsers(
    currentUserProfile: AIPassionProfile,
    candidateUsers: User[]
  ): Promise<PassionMatch[]> {
    const results: PassionMatch[] = [];

    for (const candidate of candidateUsers) {
      if (candidate.id === currentUserProfile.userId) continue;

      // Extract candidate passions/skills
      const candidatePassions = (candidate.hobbies || []).map((h) => h.toLowerCase());
      const candidateBio = (candidate.bio || "").toLowerCase();

      // Shared passions
      const myPassionNames = currentUserProfile.passions.map((p) => p.name.toLowerCase());
      const shared: string[] = [];
      const complementary: string[] = [];

      myPassionNames.forEach((myP) => {
        if (candidatePassions.some((cp) => cp.includes(myP) || myP.includes(cp)) || candidateBio.includes(myP)) {
          shared.push(myP);
        }
      });

      // Check complementary skills (e.g. user knows dev, candidate knows design/marketing/robotics)
      const isTech = myPassionNames.some((p) => p.includes("software") || p.includes("ai") || p.includes("web"));
      const candHasDesign = candidateBio.includes("design") || candidateBio.includes("art") || candidatePassions.some((p) => p.includes("art") || p.includes("design"));
      const candHasRobotics = candidateBio.includes("robot") || candidateBio.includes("electronics");

      if (isTech && candHasDesign) complementary.push("Visual Design & UI");
      if (isTech && candHasRobotics) complementary.push("Hardware & Robotics");
      if (!isTech && candidatePassions.some((p) => p.includes("programming"))) complementary.push("Software Engineering");

      // Compute vector similarity if candidate has profile
      let vectorScore = 0.55;
      if (currentUserProfile.embedding) {
        const candidateText = `${candidate.fullName} ${candidate.bio || ""} ${candidate.hobbies.join(" ")}`;
        const candidateVector = EmbeddingService.generateSemanticFallbackVector(candidateText);
        vectorScore = EmbeddingService.cosineSimilarity(currentUserProfile.embedding, candidateVector);
      }

      // Calculate final match score: 60% vector similarity + 40% shared passions bonus
      const sharedBonus = Math.min(0.35, shared.length * 0.15);
      const complementBonus = Math.min(0.15, complementary.length * 0.08);
      const rawMatch = Math.min(0.98, vectorScore * 0.55 + sharedBonus + complementBonus + 0.25);
      const matchScore = Math.round(rawMatch * 100);

      // Human-readable explanation
      let headline = `${matchScore}% Passion Match`;
      let explanation = "";

      if (shared.length > 0) {
        const readableShared = shared.slice(0, 3).map((s) => s.charAt(0).toUpperCase() + s.slice(1)).join(", ");
        explanation = `Both of you are passionate about ${readableShared}.`;
      } else if (complementary.length > 0) {
        headline = `${matchScore}% Collaboration Match`;
        explanation = `Great synergy! They bring skills in ${complementary.join(" & ")}.`;
      } else {
        explanation = `Similar learning path and community focus.`;
      }

      const potential: "High" | "Very High" | "Exceptional" =
        matchScore >= 90 ? "Exceptional" : matchScore >= 78 ? "Very High" : "High";

      results.push({
        user: candidate,
        matchScore,
        headline,
        explanation,
        sharedPassions: shared.slice(0, 4),
        complementarySkills: complementary,
        collaborationPotential: potential,
      });
    }

    // Sort by match score descending
    return results.sort((a, b) => b.matchScore - a.matchScore);
  }

  /**
   * Matches a project post with a user's skills and interests
   */
  public static matchProject(project: Post, userProfile: AIPassionProfile): ProjectMatch {
    const projectText = [
      project?.projectTitle || "",
      project?.projectDescription || "",
      project?.techStack || "",
      project?.content || "",
    ].join(" ").toLowerCase();

    // Matching skills
    const matchingSkills: string[] = [];
    const skillsToLearn: string[] = [];

    const userTechs = Array.isArray(userProfile?.technologies) ? userProfile.technologies : [];
    const userSkills = Array.isArray(userProfile?.skills) ? userProfile.skills : [];

    userTechs.forEach((tech) => {
      if (tech && projectText.includes(String(tech).toLowerCase())) {
        matchingSkills.push(tech);
      }
    });

    userSkills.forEach((skill) => {
      if (skill && projectText.includes(String(skill).toLowerCase()) && !matchingSkills.includes(skill)) {
        matchingSkills.push(skill);
      }
    });

    // Extract tech stack items from project
    if (project?.techStack) {
      String(project.techStack)
        .split(/[,/|•]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 1)
        .forEach((tech) => {
          if (!matchingSkills.some((m) => m.toLowerCase() === tech.toLowerCase())) {
            skillsToLearn.push(tech);
          }
        });
    }

    // Vector similarity
    let vectorSim = 0.5;
    if (userProfile?.embedding && Array.isArray(userProfile.embedding)) {
      const projVector = EmbeddingService.generateSemanticFallbackVector(projectText);
      vectorSim = EmbeddingService.cosineSimilarity(userProfile.embedding, projVector);
    }

    // Score computation
    const skillBonus = Math.min(0.4, matchingSkills.length * 0.15);
    const scoreVal = Math.min(96, Math.max(45, Math.round((vectorSim * 0.5 + skillBonus + 0.3) * 100)));

    let headline = `${scoreVal}% Project Match`;
    let explanation = "";

    if (matchingSkills.length > 0) {
      explanation = `You have experience with ${matchingSkills.slice(0, 3).join(", ")}, which this project uses.`;
    } else if (skillsToLearn.length > 0) {
      explanation = `Exciting learning opportunity involving ${skillsToLearn.slice(0, 2).join(" and ")}.`;
    } else {
      explanation = `Aligned with your primary interests and technology roadmap.`;
    }

    return {
      post: project,
      matchScore: scoreVal,
      headline,
      explanation,
      matchingSkills,
      skillsToLearn: skillsToLearn.slice(0, 3),
      difficulty: (project?.projectAiAnalysis?.difficulty as any) || "Intermediate",
    };
  }

  /**
   * Alias for matchProject to support direct user matching
   */
  public static matchProjectToUser(project: Post, userProfile: AIPassionProfile): ProjectMatch {
    return this.matchProject(project, userProfile);
  }

  /**
   * Analyzes a project post to extract structured tech metadata
   */
  public static async analyzeProjectPost(post: Post): Promise<ProjectAiAnalysis> {
    const text = `${post.projectTitle || ""} ${post.projectDescription || ""} ${post.content || ""} ${post.techStack || ""}`;

    // Extract tech
    const techs = new Set<string>();
    if (post.techStack) {
      post.techStack.split(/[,/|•]+/).forEach((t) => t.trim().length > 1 && techs.add(t.trim()));
    }

    // Infer difficulty from tech count and keywords
    let difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" = "Intermediate";
    const lower = text.toLowerCase();
    if (lower.includes("beginner") || lower.includes("starter") || lower.includes("simple") || lower.includes("first")) {
      difficulty = "Beginner";
    } else if (lower.includes("advanced") || lower.includes("distributed") || lower.includes("neural") || lower.includes("microservices")) {
      difficulty = "Advanced";
    }

    return {
      postId: post.id,
      summary: post.projectDescription || post.content.slice(0, 140),
      difficulty,
      domain: post.type,
      technologies: Array.from(techs),
      requiredSkills: Array.from(techs).slice(0, 4),
      learningOpportunities: ["Collaborative development", "Code review & architecture"],
      collaborationRoles: ["Co-Developer", "Tester / Reviewer"],
    };
  }
}
