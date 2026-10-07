import type { ChatSuggestionInput } from "./types";
import { AIService } from "./AIService";

export class ChatAssistantService {
  /**
   * Generates 3 contextual quick-reply chips for chat
   */
  public static async generateQuickReplies(input: ChatSuggestionInput): Promise<string[]> {
    const lastMsg = input.lastMessage.trim();
    if (!lastMsg) return [];

    // Optional LLM quick generation
    try {
      const isAIAvailable = await AIService.isLocalAIAvailable();
      if (isAIAvailable) {
        const prompt = `Given this incoming message on a passion & project collaboration social platform:
"${lastMsg}"
Suggest 3 concise, friendly, authentic reply phrases (under 8 words each).
Return ONLY a JSON array of 3 strings: ["reply1", "reply2", "reply3"]`;

        const replies = await AIService.generateJSON<string[]>(prompt);
        if (replies && Array.isArray(replies) && replies.length > 0) {
          return replies.slice(0, 3);
        }
      }
    } catch {
      // Fall through
    }

    // High-accuracy Contextual Heuristic Replies
    const lower = lastMsg.toLowerCase();

    if (lower.includes("collaborat") || lower.includes("project") || lower.includes("build together")) {
      return [
        "I'd love to collaborate on this!",
        "What tech stack are you thinking?",
        "Sounds great, let's discuss details!",
      ];
    }

    if (lower.includes("how did you") || lower.includes("what tool") || lower.includes("tutorial")) {
      return [
        "Happy to share my setup!",
        "I can send you a quick breakdown.",
        "It took some trial and error!",
      ];
    }

    if (lower.includes("check out") || lower.includes("github") || lower.includes("link")) {
      return [
        "Checking it out now!",
        "This looks really impressive!",
        "Starring the repository ⭐",
      ];
    }

    if (lower.endsWith("?")) {
      return [
        "Yes, absolutely!",
        "Let me look into that.",
        "Great question! Here's my thought:",
      ];
    }

    return [
      "Thanks for sharing!",
      "Love this progress!",
      "Let's stay in touch!",
    ];
  }

  /**
   * Summarizes a discussion and extracts concrete collaboration action items
   */
  public static summarizeCollaboration(messages: Array<{ sender_id: string; content: string }>): {
    summary: string;
    actionItems: string[];
    nextStep: string;
  } {
    if (!messages || messages.length === 0) {
      return {
        summary: "No messages to summarize yet.",
        actionItems: [],
        nextStep: "Start a conversation to plan your collaboration.",
      };
    }

    const allText = messages.map((m) => m.content).join(" ");
    const actionItems: string[] = [];

    if (allText.toLowerCase().includes("github") || allText.toLowerCase().includes("repo")) {
      actionItems.push("Share and review GitHub repository code");
    }
    if (allText.toLowerCase().includes("call") || allText.toLowerCase().includes("meet") || allText.toLowerCase().includes("chat")) {
      actionItems.push("Schedule a brief alignment call or chat");
    }
    if (allText.toLowerCase().includes("design") || allText.toLowerCase().includes("ui") || allText.toLowerCase().includes("figma")) {
      actionItems.push("Align on UI mockups and design direction");
    }
    if (allText.toLowerCase().includes("api") || allText.toLowerCase().includes("database") || allText.toLowerCase().includes("backend")) {
      actionItems.push("Draft API schema and shared data contracts");
    }

    if (actionItems.length === 0) {
      actionItems.push("Define project scope and milestone timeline");
      actionItems.push("Assign initial component responsibilities");
    }

    return {
      summary: `Active collaboration thread covering ${messages.length} message exchange.`,
      actionItems,
      nextStep: "Confirm responsibilities and set milestone deadline.",
    };
  }
}
