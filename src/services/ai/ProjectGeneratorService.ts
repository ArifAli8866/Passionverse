import type { GeneratedProjectIdea, PassionRoadmap, RoadmapMilestone } from "@/types";
import type { ProjectGenerationInput } from "./types";
import { AIService } from "./AIService";

export class ProjectGeneratorService {
  /**
   * Generates a tailored project idea with step-by-step roadmap and tech stack
   */
  public static async generateProjectIdea(input: ProjectGenerationInput): Promise<GeneratedProjectIdea> {
    const prompt = `Generate a realistic, inspiring project idea for a maker with the following preferences:
- Passions: ${input.passions.join(", ")}
- Skill Level: ${input.skillLevel}
- Available Time: ${input.availableHoursPerWeek} hours/week
- Preferred Technologies: ${(input.preferredTechnologies || []).join(", ") || "Open to suggestions"}
- Goal: ${input.goal || "Build an engaging portfolio project and learn new skills"}

Return ONLY a JSON object with this exact format:
{
  "title": "Project Title",
  "description": "2-3 sentences overview of what the project does",
  "difficulty": "${input.skillLevel}",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "skillsToLearn": ["Skill1", "Skill2", "Skill3"],
  "estimatedEffort": "e.g. 4-6 weeks (25 total hours)",
  "roadmap": ["Step 1: Description", "Step 2: Description", "Step 3: Description", "Step 4: Description", "Step 5: Description"],
  "extensions": ["Extension 1", "Extension 2"],
  "collaboratorRoles": ["Role 1", "Role 2"]
}`;

    try {
      const generated = await AIService.generateJSON<GeneratedProjectIdea>(
        prompt,
        "You are an expert mentor on Passionverse who crafts inspiring, actionable project blueprints."
      );
      if (generated && generated.title && Array.isArray(generated.roadmap)) {
        return generated;
      }
    } catch {
      // Fall through to deterministic template synthesis
    }

    // Deterministic High-Quality Project Synthesis (Zero-latency fallback)
    return this.synthesizeDeterministicProject(input);
  }

  /**
   * Generates an interest-to-milestone learning roadmap (Feature 7)
   */
  public static async generateRoadmap(
    topic: string,
    level: "Beginner" | "Intermediate" | "Advanced" = "Beginner"
  ): Promise<PassionRoadmap> {
    const prompt = `Generate a structured, progressive learning roadmap for "${topic}" at ${level} level.
Return ONLY a JSON object with this exact format:
{
  "topic": "${topic}",
  "level": "${level}",
  "estimatedDuration": "3 - 4 Months",
  "milestones": [
    {
      "step": 1,
      "title": "Foundation & Core Principles",
      "description": "Master essential terminology and environment setup.",
      "skills": ["Skill1", "Skill2"],
      "suggestedProjects": ["Starter project"],
      "estimatedWeeks": 2
    }
  ],
  "suggestedCommunities": ["Community1", "Community2"]
}`;

    try {
      const generated = await AIService.generateJSON<PassionRoadmap>(
        prompt,
        "You are a curriculum designer for Passionverse."
      );
      if (generated && generated.milestones && generated.milestones.length > 0) {
        return generated;
      }
    } catch {
      // Fall through to deterministic roadmap synthesis
    }

    return this.synthesizeDeterministicRoadmap(topic, level);
  }

  /**
   * Deterministic project synthesis based on inputs
   */
  private static synthesizeDeterministicProject(input: ProjectGenerationInput): GeneratedProjectIdea {
    const primaryPassion = input.passions[0] || "Creative Coding";
    const lower = primaryPassion.toLowerCase();

    if (lower.includes("robot") || lower.includes("hardware") || lower.includes("arduino")) {
      return {
        title: "AI-Powered Object Tracking Robot",
        description: "An autonomous wheeled robot that detects and follows designated objects or gestures in real time using edge vision and microcontrollers.",
        difficulty: input.skillLevel,
        technologies: ["Python", "OpenCV", "Arduino / ESP32", "Ultrasonic Sensors"],
        skillsToLearn: ["Computer Vision fundamentals", "Serial communication", "Motor control PID loops"],
        estimatedEffort: `${Math.round(40 / Math.max(1, input.availableHoursPerWeek))} weeks (~40 hours total)`,
        roadmap: [
          "Phase 1: Setup Python and test basic webcam object detection using OpenCV color masking",
          "Phase 2: Assemble robot chassis, motor drivers, and test movement commands via Arduino",
          "Phase 3: Establish serial communication between computer/Raspberry Pi and Arduino controller",
          "Phase 4: Integrate visual target tracking to steer motors towards center of frame",
          "Phase 5: Add obstacle avoidance and fine-tune response latency",
        ],
        extensions: ["Add wireless camera feed over WebSockets", "Implement face recognition unlock"],
        collaboratorRoles: ["Hardware / Chassis Designer", "Computer Vision Engineer"],
      };
    }

    if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("data")) {
      return {
        title: "Personal Passion Knowledge Engine",
        description: "A local, private retrieval-augmented intelligence system that indexes your hobby notes, articles, and bookmarks with semantic search and instant summaries.",
        difficulty: input.skillLevel,
        technologies: ["Python", "FastAPI", "Transformers / Ollama", "ChromaDB / pgvector", "React"],
        skillsToLearn: ["Vector embeddings", "Semantic chunking & search", "Local LLM inference"],
        estimatedEffort: `${Math.round(30 / Math.max(1, input.availableHoursPerWeek))} weeks (~30 hours total)`,
        roadmap: [
          "Phase 1: Build document parser for markdown and web bookmarks",
          "Phase 2: Generate local vector embeddings with open-source models",
          "Phase 3: Create cosine similarity search query API",
          "Phase 4: Connect local Ollama prompt to summarize retrieved context",
          "Phase 5: Build a clean interactive web UI for search & insights",
        ],
        extensions: ["Browser extension for 1-click hobby saving", "Voice audio transcription"],
        collaboratorRoles: ["Full-Stack Developer", "UX / UI Designer"],
      };
    }

    if (lower.includes("photo") || lower.includes("video") || lower.includes("art")) {
      return {
        title: "Cinematic Visual Storytelling Anthology",
        description: "A curated digital exhibition exploring light, geometry, and human emotion through cohesive visual composition and narrative pacing.",
        difficulty: input.skillLevel,
        technologies: ["Digital Camera / Mirrorless", "Lightroom", "Figma", "Web Portfolio"],
        skillsToLearn: ["Natural lighting mastery", "Color theory & grading", "Curation & visual narrative"],
        estimatedEffort: `${Math.round(25 / Math.max(1, input.availableHoursPerWeek))} weeks (~25 hours total)`,
        roadmap: [
          "Phase 1: Define core thematic concept and moodboard",
          "Phase 2: Plan 3 specific on-location shoot sessions across different lighting hours",
          "Phase 3: Edit and color grade photo series using cohesive color palette",
          "Phase 4: Write reflective story essays for each image",
          "Phase 5: Publish interactive showcase on Passionverse and gather community feedback",
        ],
        extensions: ["Create physical limited-print zine", "Produce behind-the-scenes video breakdown"],
        collaboratorRoles: ["Creative Writer / Storyteller", "Web Developer"],
      };
    }

    // Default Web / Software project
    return {
      title: `${primaryPassion} Interactive Community Hub`,
      description: `A modern, lightweight platform tailored specifically for ${primaryPassion} enthusiasts to share progress milestones, exchange feedback, and discover project partners.`,
      difficulty: input.skillLevel,
      technologies: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
      skillsToLearn: ["Component architecture", "Relational database modeling", "Responsive UX design"],
      estimatedEffort: `${Math.round(30 / Math.max(1, input.availableHoursPerWeek))} weeks (~30 hours total)`,
      roadmap: [
        "Phase 1: Sketch user journey and database schema for projects and milestones",
        "Phase 2: Scaffold frontend with Tailwind CSS and responsive layout",
        "Phase 3: Connect authentication and CRUD actions for posts",
        "Phase 4: Implement filtering, search, and activity feeds",
        "Phase 5: Deploy to production and invite initial beta creators",
      ],
      extensions: ["Add realtime milestone reactions", "Export portfolio summary as PDF"],
      collaboratorRoles: ["Frontend Specialist", "Backend / Database Engineer"],
    };
  }

  /**
   * Deterministic roadmap synthesis
   */
  private static synthesizeDeterministicRoadmap(
    topic: string,
    level: "Beginner" | "Intermediate" | "Advanced"
  ): PassionRoadmap {
    const milestones: RoadmapMilestone[] = [
      {
        step: 1,
        title: "Core Foundations & Setup",
        description: `Learn foundational syntax, terminology, and setup tools for ${topic}.`,
        skills: ["Fundamental Concepts", "Environment Configuration", "Core Terminology"],
        suggestedProjects: ["Introductory 'Hello World' milestone project"],
        estimatedWeeks: 2,
      },
      {
        step: 2,
        title: "Hands-on Practical Techniques",
        description: `Apply essential tools and design patterns to solve real-world mini challenges in ${topic}.`,
        skills: ["Technique Application", "Workflow Efficiency", "Problem Solving"],
        suggestedProjects: ["Functional mini-project focusing on a single feature"],
        estimatedWeeks: 3,
      },
      {
        step: 3,
        title: "Intermediate Mastery & Integration",
        description: `Build multi-component solutions, integrating data and third-party tools.`,
        skills: ["Integration", "Architecture Design", "Optimization"],
        suggestedProjects: ["Complete portfolio-worthy project"],
        estimatedWeeks: 4,
      },
      {
        step: 4,
        title: "Advanced Polish & Collaborative Showcase",
        description: `Publish project publicly on Passionverse, write documentation, and collaborate.`,
        skills: ["Code Review", "Community Collaboration", "Documentation"],
        suggestedProjects: ["Production-ready showcase with open collaboration"],
        estimatedWeeks: 3,
      },
    ];

    return {
      topic,
      level,
      estimatedDuration: "12 Weeks (3 Months)",
      milestones,
      suggestedCommunities: [topic, "BuildInPublic", "LearningJourney"],
    };
  }
}
