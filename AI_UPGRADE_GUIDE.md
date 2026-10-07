# Passionverse — Production AI Upgrade Guide 🚀

Passionverse has been upgraded into a truly **AI-powered, passion-aware** social platform with **$0 external API cost**, utilizing open-source and local AI architecture.

---

## 🏗️ AI System Architecture

```
React 19 + Vite Frontend (Tailwind + Lucide)
       ↓
Service Abstraction Layer (`src/services/ai/`)
  ├── AIService (Local Ollama / Lightweight LLM fallback)
  ├── EmbeddingService (Deterministic 384-dim Unit Vector Space)
  ├── PassionGuardService (Taxonomy & Content Quality Gate)
  ├── PassionAnalysisService (Structured Passion Scoring)
  ├── MatchingService (Vector Similarity & Complementary Skills)
  ├── ProjectGeneratorService (Interactive Idea & Roadmap Engine)
  ├── GitHubIntelligenceService (Repo & Tech Stack Auto-Extraction)
  └── ChatAssistantService (Quick Replies & Collaboration Insights)
       ↓
Supabase / PostgreSQL + pgvector
  ├── `ai_profiles` (JSONB passions, skills, learning goals, 384-dim embeddings)
  ├── `project_ai_analysis` (Difficulty, tech stack, collaboration roles)
  ├── `post_ai_analysis` (Relevance scores, detected topics, review status)
  └── Vector similarity RPC functions (`match_users`, `match_projects`, `search_semantic`)
```

---

## 🛠️ Included Features & Upgrades

### 1. AI Passion Intelligence (`AIPassionProfileCard.tsx` in `/profile/:username`)
* Analyzes user bio, hobbies, project history, and GitHub repos.
* Produces transparent scored passions (e.g. *Artificial Intelligence — 94%*, *Robotics — 86%*), skills, current learning goals, and collaboration interests.
* Saves directly to `ai_profiles` with caching and 1-click refresh.

### 2. PassionGuard AI (`PassionGuardModal.tsx` in `/create-post`)
* Content quality gate evaluating posts against a 14-category extensible taxonomy (Tech, Arts, Robotics, Crafts, Outdoor, etc.).
* Prevents spam and off-topic noise while offering constructive advice and revision suggestions to help creators align with Passionverse.

### 3. AI Post Assistant & GitHub Auto-Sync (`AIPostAssistant.tsx` in `/create-post`)
* Automatically fetches repository details, README summaries, and tech stacks directly from public GitHub URLs.
* Generates engaging project titles and suggested tags.

### 4. PassionMatch AI (`PassionMatchCard.tsx` in `/discover`)
* Replaces generic suggestions with semantic similarity and complementary skill matching.
* Highlights shared passions and cross-domain synergy (e.g., Software Maker paired with Hardware Robot Designer).

### 5. AI Project Matching (`ProjectMatchBadge.tsx` in Feed & Discover)
* Displays real-time compatibility for project posts:
  * Shows matching skills vs. new learning opportunities.
  * Explains exactly *why* you match with the project.

### 6. AI Project Generator (`AIProjectGeneratorModal.tsx`)
* Generates complete project blueprints based on your passions, skill level, and weekly available hours.
* Delivers milestones, required tech stacks, learning goals, and suggested collaborator roles.

### 7. AI Passion Roadmap (`PassionRoadmapModal.tsx`)
* Turns any passion or skill (e.g., *Computer Vision*, *Game Development*) into a structured, milestone-by-milestone curriculum with practical starter projects.

### 8. Semantic AI Search (`src/pages/SearchPage.tsx`)
* Natural language queries:
  * *"Find people interested in AI and robotics"*
  * *"Beginner Python developers"*
  * *"Projects involving computer vision"*
* Uses vector embeddings and semantic cosine similarity to rank candidates accurately.

### 9. AI Collaboration Assistant in Messages (`src/pages/MessagesPage.tsx`)
* Contextual quick-reply chips.
* 1-click **AI Collaboration Insights** button extracting action items and next steps from conversation history.

---

## ⚡ Activating Local Ollama (Optional)

The system works out-of-the-box with **0ms latency** using the embedded heuristic & client-side embedding engine.

To connect with local Ollama:
1. Install [Ollama](https://ollama.com/):
   ```bash
   curl -fsSL https://ollama.ai/install.sh | sh
   ```
2. Pull a lightweight model (works on standard laptops without dedicated GPUs):
   ```bash
   ollama pull llama3.2:1b
   ```
3. Set your `.env` variable (already prepared in `.env.example`):
   ```env
   VITE_AI_PROVIDER=ollama
   VITE_OLLAMA_ENDPOINT=http://localhost:11434
   VITE_OLLAMA_MODEL=llama3.2:1b
   ```

---

## 🗄️ Supabase Database Migration

To apply the database tables and pgvector indexes in your Supabase project:
1. Open the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor**.
3. Copy and run the contents of [`src/database/ai_schema.sql`](./src/database/ai_schema.sql).
4. All tables include Row Level Security (RLS) policies allowing public read and owner-only update/delete operations.
