import type { GitHubRepoAnalysis } from "./types";

export class GitHubIntelligenceService {
  private static cache = new Map<string, { data: GitHubRepoAnalysis; timestamp: number }>();
  private static readonly CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes

  /**
   * Parses an arbitrary GitHub repository link to extract owner and repo name
   */
  public static parseRepoUrl(url: string): { owner: string; repo: string } | null {
    if (!url) return null;
    try {
      const match = url.match(/github\.com\/([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)/);
      if (match) {
        return {
          owner: match[1],
          repo: match[2].replace(/\.git$/, ""),
        };
      }
    } catch {
      return null;
    }
    return null;
  }

  /**
   * Analyzes public repository metadata using GitHub REST API
   * Zero authentication required, rate-limit protected with memory cache.
   */
  public static async analyzeRepo(url: string): Promise<GitHubRepoAnalysis | null> {
    const parsed = this.parseRepoUrl(url);
    if (!parsed) return null;

    const cacheKey = `${parsed.owner}/${parsed.repo}`.toLowerCase();
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL_MS) {
      return cached.data;
    }

    try {
      // 1. Fetch repo metadata
      const repoRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}`, {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!repoRes.ok) return null;
      const repoData = await repoRes.json();

      // 2. Fetch repo languages
      let languages: Record<string, number> = {};
      try {
        const langRes = await fetch(`https://api.github.com/repos/${parsed.owner}/${parsed.repo}/languages`, {
          headers: { Accept: "application/vnd.github.v3+json" },
        });
        if (langRes.ok) {
          languages = await langRes.json();
        }
      } catch {
        // Soft fail
      }

      const languageNames = Object.keys(languages);
      const primaryLang = repoData.language || languageNames[0] || "Software";
      const topics = (repoData.topics as string[]) || [];

      // Detect frameworks and skills from topics and description
      const desc = (repoData.description || "").toLowerCase();
      const detectedFrameworks = new Set<string>();

      [
        "react", "vue", "angular", "nextjs", "tailwind", "fastapi", "django", "flask",
        "express", "pytorch", "tensorflow", "opencv", "docker", "supabase", "flutter", "arduino"
      ].forEach((fw) => {
        if (topics.includes(fw) || desc.includes(fw)) {
          detectedFrameworks.add(fw.charAt(0).toUpperCase() + fw.slice(1));
        }
      });

      // Infer domain
      let domain = "Software Development";
      if (desc.includes("ai") || desc.includes("machine learning") || topics.includes("machine-learning")) {
        domain = "AI & Machine Learning";
      } else if (desc.includes("robot") || desc.includes("arduino") || topics.includes("robotics")) {
        domain = "Robotics & Hardware";
      } else if (desc.includes("security") || topics.includes("cybersecurity")) {
        domain = "Cybersecurity";
      } else if (desc.includes("game") || topics.includes("gamedev")) {
        domain = "Game Development";
      }

      const analysis: GitHubRepoAnalysis = {
        name: repoData.name,
        description: repoData.description || "Public repository showcase",
        stars: repoData.stargazers_count || 0,
        forks: repoData.forks_count || 0,
        language: primaryLang,
        languages,
        topics,
        detectedSkills: Array.from(new Set([primaryLang, ...languageNames.slice(0, 4), ...Array.from(detectedFrameworks)])),
        detectedFrameworks: Array.from(detectedFrameworks),
        domain,
        summary: `${repoData.name}: A ${primaryLang}-based project focusing on ${domain.toLowerCase()} with ${repoData.stargazers_count} stars.`,
      };

      this.cache.set(cacheKey, { data: analysis, timestamp: Date.now() });
      return analysis;
    } catch {
      return null;
    }
  }
}
