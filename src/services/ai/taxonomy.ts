import type { TaxonomyCategory } from "./types";

export const PASSION_TAXONOMY: TaxonomyCategory[] = [
  {
    id: "ai_ml",
    name: "AI & Machine Learning",
    icon: "🤖",
    domains: ["Artificial Intelligence", "Deep Learning", "Computer Vision", "NLP", "Robotics AI"],
    keywords: [
      "ai", "artificial intelligence", "machine learning", "ml", "deep learning", "neural network",
      "computer vision", "opencv", "yolo", "nlp", "llm", "transformers", "pytorch", "tensorflow",
      "data science", "keras", "huggingface", "generative ai", "reinforcement learning", "ollama",
      "model", "dataset", "agentic", "embedding", "prompt engineering", "diffusion", "rag"
    ],
  },
  {
    id: "programming",
    name: "Software & Web Development",
    icon: "💻",
    domains: ["Web Development", "Mobile Apps", "Full Stack", "Cloud & DevOps", "Systems"],
    keywords: [
      "programming", "coding", "software", "developer", "javascript", "typescript", "python",
      "react", "nextjs", "vue", "angular", "node", "nodejs", "golang", "rust", "c++", "c#", "java",
      "backend", "frontend", "fullstack", "api", "rest", "graphql", "database", "sql", "postgresql",
      "supabase", "mongodb", "docker", "kubernetes", "git", "github", "tailwind", "css", "html",
      "vite", "microservices", "serverless", "linux", "cloud", "aws", "devops", "algorithm", "debug"
    ],
  },
  {
    id: "robotics_hardware",
    name: "Robotics & Electronics",
    icon: "🦾",
    domains: ["Robotics", "Embedded Systems", "IoT", "Circuit Design", "Automation"],
    keywords: [
      "robotics", "robot", "arduino", "raspberry pi", "esp32", "microcontroller", "sensors",
      "electronics", "circuit", "pcb", "soldering", "hardware", "firmware", "iot", "automation",
      "servos", "motors", "drone", "3d printing", "cad", "actuators", "mechatronics"
    ],
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity & Networks",
    icon: "🔐",
    domains: ["Information Security", "Ethical Hacking", "Cryptography", "Network Security"],
    keywords: [
      "cybersecurity", "security", "infosec", "penetration testing", "pentest", "ethical hacking",
      "kali", "network", "firewall", "encryption", "cryptography", "vulnerability", "malware",
      "reverse engineering", "wireshark", "ctf", "zero day", "auth", "oauth", "jwt"
    ],
  },
  {
    id: "photography_video",
    name: "Photography & Videography",
    icon: "📷",
    domains: ["Visual Media", "Cinematography", "Editing", "Color Grading", "Lighting"],
    keywords: [
      "photography", "photo", "camera", "lens", "portrait", "landscape", "dslr", "mirrorless",
      "lightroom", "photoshop", "videography", "cinematography", "video editing", "premiere",
      "davinci resolve", "shutter speed", "aperture", "iso", "lighting", "golden hour", "frame",
      "cinematic", "drone footage", "b-roll", "focal length", "composition"
    ],
  },
  {
    id: "creative_art",
    name: "Art & Digital Design",
    icon: "🎨",
    domains: ["Illustration", "UI/UX Design", "Graphic Design", "3D Art", "Painting"],
    keywords: [
      "art", "artist", "drawing", "illustration", "sketch", "painting", "acrylic", "watercolor",
      "digital art", "procreate", "figma", "ui", "ux", "graphic design", "typography", "branding",
      "blender", "3d modeling", "animation", "visual", "concept art", "canvas", "render"
    ],
  },
  {
    id: "writing_literature",
    name: "Writing & Literature",
    icon: "✍️",
    domains: ["Creative Writing", "Journalism", "Poetry", "Blogging", "Storytelling"],
    keywords: [
      "writing", "writer", "reading", "book", "books", "literature", "novel", "poetry", "poem",
      "essay", "article", "blog", "storytelling", "author", "fiction", "non-fiction", "manuscript",
      "publishing", "words", "narrative", "prose"
    ],
  },
  {
    id: "music_audio",
    name: "Music & Audio Production",
    icon: "🎵",
    domains: ["Music Production", "Instruments", "Singing", "Sound Engineering", "Composition"],
    keywords: [
      "music", "musician", "instrument", "guitar", "piano", "drums", "violin", "singing", "vocal",
      "songwriting", "composition", "ableton", "fl studio", "logic pro", "daw", "mixing", "mastering",
      "beats", "synth", "audio", "recording", "studio", "melody", "chords", "harmony"
    ],
  },
  {
    id: "fitness_sports",
    name: "Fitness & Athletics",
    icon: "💪",
    domains: ["Strength Training", "Cardio", "Sports", "Nutrition", "Calisthenics"],
    keywords: [
      "fitness", "workout", "gym", "bodybuilding", "calisthenics", "running", "marathon", "cycling",
      "swimming", "football", "soccer", "cricket", "basketball", "tennis", "badminton", "crossfit",
      "strength", "endurance", "nutrition", "diet", "macros", "cardio", "lifting", "training", "coach"
    ],
  },
  {
    id: "culinary_arts",
    name: "Cooking & Culinary Arts",
    icon: "🍳",
    domains: ["Baking", "Gastronomy", "Recipe Crafting", "Coffee & Brewing"],
    keywords: [
      "cooking", "cook", "chef", "baking", "recipe", "kitchen", "culinary", "food", "ingredients",
      "cuisine", "pastry", "sourdough", "fermentation", "spices", "gourmet", "meal prep", "brewing",
      "coffee", "espresso", "barista", "flavors", "roasting"
    ],
  },
  {
    id: "travel_exploration",
    name: "Travel & Exploration",
    icon: "✈️",
    domains: ["Backpacking", "Cultural Immersion", "Hiking", "Outdoor Adventure"],
    keywords: [
      "travel", "traveling", "trip", "journey", "backpacking", "hiking", "camping", "mountains",
      "adventure", "culture", "destination", "wanderlust", "nature", "trekking", "solo travel",
      "nomad", "exploration", "geography"
    ],
  },
  {
    id: "entrepreneurship",
    name: "Startups & Entrepreneurship",
    icon: "💼",
    domains: ["Product Building", "Venture", "Strategy", "Bootstrapping", "Growth"],
    keywords: [
      "entrepreneurship", "startup", "founder", "building in public", "indie hacker", "saas",
      "product", "mvp", "venture", "business", "marketing", "monetization", "pitch", "growth",
      "launch", "customer", "bootstrapping", "scale"
    ],
  },
  {
    id: "science_research",
    name: "Science & Discovery",
    icon: "🔬",
    domains: ["Physics", "Biology", "Astronomy", "Mathematics", "Scientific Research"],
    keywords: [
      "science", "research", "physics", "astronomy", "space", "biology", "genetics", "chemistry",
      "mathematics", "math", "quantum", "experiment", "hypothesis", "laboratory", "paper", "scientific",
      "discovery", "cosmos", "nanotechnology"
    ],
  },
  {
    id: "gaming_interactive",
    name: "Gaming & Game Dev",
    icon: "🎮",
    domains: ["Game Development", "Esports", "Game Design", "Virtual Worlds"],
    keywords: [
      "gaming", "game", "gamedev", "game dev", "game design", "unity", "unreal engine", "godot",
      "pixel art", "shaders", "gameplay", "esports", "multiplayer", "indie game", "vr", "virtual reality"
    ],
  },
];

// Universal passion indicator tokens (words signifying active passion/learning/projects)
export const PASSION_ACTION_TRIGGERS = [
  "built", "building", "created", "creating", "coded", "designed", "learned", "learning",
  "practiced", "practicing", "explored", "exploring", "shipped", "launched", "debugged",
  "studied", "researched", "experimented", "improved", "trained", "recorded", "composed",
  "painted", "photographed", "cooked", "wrote", "published", "collaborating", "collaborate",
  "partner", "feedback", "tutorial", "roadmap", "project", "hobby", "skill", "passion",
  "technique", "milestone", "challenge", "progress", "prototype"
];

// Irrelevant / spam tokens (low relevance markers)
export const UNRELATED_INDICATORS = [
  "buy crypto", "free bitcoin", "click here", "discount code", "cash advance",
  "dm for price", "whatsapp number", "loan approved", "urgent sale", "casino"
];

/**
 * Normalizes text to tokens
 */
export function tokenizeText(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

/**
 * Extracts matched categories and scores from arbitrary text
 */
export function analyzeTextTaxonomy(text: string): {
  matchedCategories: Array<{ category: TaxonomyCategory; matchedKeywords: string[]; score: number }>;
  actionMatches: string[];
  isPassionRelated: boolean;
  rawScore: number;
} {
  const normalized = text.toLowerCase();
  const tokens = tokenizeText(normalized);
  const tokenSet = new Set(tokens);

  const matchedCategories: Array<{
    category: TaxonomyCategory;
    matchedKeywords: string[];
    score: number;
  }> = [];

  for (const cat of PASSION_TAXONOMY) {
    const matchedKeywords: string[] = [];
    let catScore = 0;

    for (const kw of cat.keywords) {
      if (kw.includes(" ")) {
        if (normalized.includes(kw)) {
          matchedKeywords.push(kw);
          catScore += 18;
        }
      } else {
        if (tokenSet.has(kw)) {
          matchedKeywords.push(kw);
          catScore += 10;
        }
      }
    }

    if (matchedKeywords.length > 0) {
      matchedCategories.push({
        category: cat,
        matchedKeywords,
        score: Math.min(100, catScore),
      });
    }
  }

  // Sort categories by score descending
  matchedCategories.sort((a, b) => b.score - a.score);

  // Check action triggers
  const actionMatches = PASSION_ACTION_TRIGGERS.filter(
    (action) => tokenSet.has(action) || normalized.includes(action)
  );

  // Check spam/unrelated markers
  const spamMatches = UNRELATED_INDICATORS.filter((spam) => normalized.includes(spam));

  // Compute raw passion relevance (0 - 100)
  let rawScore = 0;
  if (matchedCategories.length > 0) {
    // Primary category contributes heavily
    const primary = matchedCategories[0].score;
    const actionBonus = Math.min(30, actionMatches.length * 8);
    const breadthBonus = Math.min(15, (matchedCategories.length - 1) * 5);
    rawScore = Math.min(100, Math.round(primary * 0.6 + actionBonus + breadthBonus));
  } else if (actionMatches.length >= 2) {
    // Has strong learning/crafting intent even if novel topic
    rawScore = Math.min(65, actionMatches.length * 20);
  } else if (actionMatches.length === 1 && tokens.length > 5) {
    rawScore = 35;
  } else {
    rawScore = Math.min(25, tokens.length * 2);
  }

  if (spamMatches.length > 0) {
    rawScore = Math.max(0, rawScore - 60);
  }

  return {
    matchedCategories,
    actionMatches,
    isPassionRelated: rawScore >= 40,
    rawScore,
  };
}

/**
 * Discovers potential novel passion keywords not in current static list
 */
export function discoverNovelKeywords(text: string): string[] {
  const tokens = tokenizeText(text);
  const known = new Set<string>();
  PASSION_TAXONOMY.forEach((c) => c.keywords.forEach((k) => known.add(k)));
  PASSION_ACTION_TRIGGERS.forEach((a) => known.add(a));

  const candidates = tokens.filter(
    (t) =>
      t.length > 3 &&
      !known.has(t) &&
      !["this", "that", "with", "from", "have", "were", "they", "will", "been", "about", "there", "what"].includes(t)
  );

  return Array.from(new Set(candidates)).slice(0, 5);
}
