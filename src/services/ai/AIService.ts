import type { AIProviderConfig } from "./types";

export class AIService {
  private static config: AIProviderConfig = {
    ollamaUrl: import.meta.env.VITE_OLLAMA_API_URL || "http://localhost:11434",
    ollamaModel: import.meta.env.VITE_OLLAMA_MODEL || "llama3.2:1b",
    fallbackMode: (import.meta.env.VITE_AI_FALLBACK_MODE as any) || "auto",
  };

  private static isOllamaHealthy: boolean | null = null;
  private static lastHealthCheck = 0;

  /**
   * Health check to detect if local Ollama daemon is reachable
   */
  public static async isLocalAIAvailable(): Promise<boolean> {
    const now = Date.now();
    // Cache health check for 30 seconds
    if (this.isOllamaHealthy !== null && now - this.lastHealthCheck < 30000) {
      return this.isOllamaHealthy;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1200);

    try {
      const res = await fetch(`${this.config.ollamaUrl}/api/tags`, {
        method: "GET",
        signal: controller.signal,
      });
      this.isOllamaHealthy = res.ok;
    } catch {
      this.isOllamaHealthy = false;
    } finally {
      clearTimeout(timeout);
      this.lastHealthCheck = now;
    }

    return this.isOllamaHealthy;
  }

  /**
   * Runs prompt against local Ollama if available; falls back to internal logic otherwise
   */
  public static async generateText(prompt: string, systemPrompt?: string): Promise<string | null> {
    const available = await this.isLocalAIAvailable();
    if (!available) return null;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      const res = await fetch(`${this.config.ollamaUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: this.config.ollamaModel,
          prompt,
          system: systemPrompt,
          stream: false,
          options: {
            temperature: 0.3,
            top_p: 0.9,
          },
        }),
        signal: controller.signal,
      });

      if (!res.ok) return null;
      const data = await res.json();
      return (data.response as string)?.trim() || null;
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  /**
   * Generates structured JSON from LLM or returns null on failure
   */
  public static async generateJSON<T>(prompt: string, systemPrompt?: string): Promise<T | null> {
    const response = await this.generateText(prompt, systemPrompt);
    if (!response) return null;

    try {
      // Find JSON block if wrapped in markdown
      const match = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, response];
      const jsonStr = match[1] || response;
      return JSON.parse(jsonStr) as T;
    } catch {
      return null;
    }
  }

  /**
   * Post Assistant: Enhances a post caption
   */
  public static async enhanceCaption(content: string, type: string): Promise<string> {
    const prompt = `Rewrite the following ${type} post caption for a passion/hobby social network to make it engaging, authentic, and inspiring. Keep it concise (1-3 sentences max) without emojis spam:\n\n"${content}"`;
    const enhanced = await this.generateText(prompt, "You are a friendly social media copywriter for Passionverse.");

    if (enhanced && enhanced.length > 10) {
      return enhanced.replace(/^"|"$/g, "");
    }

    // Heuristic enhancement fallback
    const trimmed = content.trim();
    if (trimmed.length > 0 && !/[.!?]$/.test(trimmed)) {
      return `${trimmed}. Excited to share this with the community!`;
    }
    return trimmed;
  }

  /**
   * Post Assistant: Suggests relevant passion hashtags/topics
   */
  public static suggestTags(content: string, type: string, detectedTopics: string[]): string[] {
    const tags = new Set<string>();

    detectedTopics.forEach((topic) => {
      tags.add(topic.replace(/[^a-zA-Z0-9]/g, ""));
    });

    if (type === "project") tags.add("BuildInPublic");
    if (type === "image") tags.add("PassionShowcase");

    if (tags.size === 0) {
      tags.add("Passionverse");
      tags.add("LearningInPublic");
    }

    return Array.from(tags).slice(0, 5);
  }
}
