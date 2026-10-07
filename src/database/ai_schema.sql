-- ==============================================================================
-- Passionverse AI Upgrade Database Schema
-- Idempotent, safe migration for Supabase / PostgreSQL.
-- Adds pgvector support, AI Profiles, Project Analysis, and Post Guard Audit.
-- Existing tables and RLS are 100% PRESERVED.
-- ==============================================================================

-- 1. Enable pgvector extension for semantic vector similarity
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. AI Passion Profiles Table
-- Stores computed passion intelligence, scored affinities, and profile embeddings
CREATE TABLE IF NOT EXISTS ai_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  summary TEXT DEFAULT '',
  passions JSONB DEFAULT '[]'::jsonb,           -- [{"name": "AI & Machine Learning", "score": 92, "category": "Technology"}]
  skills JSONB DEFAULT '[]'::jsonb,             -- ["Python", "OpenCV", "PyTorch"]
  technologies JSONB DEFAULT '[]'::jsonb,       -- ["React", "FastAPI", "Docker"]
  currently_learning JSONB DEFAULT '[]'::jsonb, -- ["Autonomous Robotics", "Transformer Models"]
  looking_for JSONB DEFAULT '[]'::jsonb,        -- ["Project Collaborators", "AI Learning Partners"]
  goals JSONB DEFAULT '[]'::jsonb,              -- ["Build autonomous drone", "Contribute to open source"]
  embedding vector(384),                        -- 384-dimensional vector (all-MiniLM-L6-v2 / bge-small)
  last_analyzed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Project AI Analysis Table
-- Stores extracted skills, difficulty, and learning opportunities for project posts
CREATE TABLE IF NOT EXISTS project_ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE UNIQUE NOT NULL,
  summary TEXT DEFAULT '',
  difficulty TEXT CHECK (difficulty IN ('Beginner', 'Intermediate', 'Advanced', 'Expert')) DEFAULT 'Intermediate',
  domain TEXT DEFAULT 'General',
  technologies JSONB DEFAULT '[]'::jsonb,
  required_skills JSONB DEFAULT '[]'::jsonb,
  learning_opportunities JSONB DEFAULT '[]'::jsonb,
  collaboration_roles JSONB DEFAULT '[]'::jsonb,
  embedding vector(384),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Post AI Analysis (PassionGuard Audits)
-- Stores the pre-publish / post moderation scores and taxonomy detections
CREATE TABLE IF NOT EXISTS post_ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE UNIQUE NOT NULL,
  relevance_score NUMERIC(5,2) NOT NULL,
  detected_topics JSONB DEFAULT '[]'::jsonb,
  status TEXT CHECK (status IN ('APPROVED', 'NEEDS_REVISION')) NOT NULL,
  feedback TEXT DEFAULT '',
  suggestions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Indexes for fast retrieval and vector similarity
CREATE INDEX IF NOT EXISTS idx_ai_profiles_user_id ON ai_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_project_ai_analysis_post_id ON project_ai_analysis(post_id);
CREATE INDEX IF NOT EXISTS idx_post_ai_analysis_post_id ON post_ai_analysis(post_id);

-- Optional IVFFlat vector indexes (only create if enough rows exist, or use default cosine index)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE indexname = 'idx_ai_profiles_embedding'
  ) THEN
    BEGIN
      CREATE INDEX idx_ai_profiles_embedding ON ai_profiles USING ivfflat (embedding vector_cosine_ops) WITH (lists = 50);
    EXCEPTION WHEN OTHERS THEN
      -- In case table is empty or ivfflat cannot initialize with 0 rows
      NULL;
    END;
  END IF;
END $$;

-- 6. Row Level Security (RLS)
ALTER TABLE ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_ai_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_ai_analysis ENABLE ROW LEVEL SECURITY;

-- AI Profiles Policies:
-- Public can view passion intelligence
DROP POLICY IF EXISTS "Public AI profiles are viewable by everyone" ON ai_profiles;
CREATE POLICY "Public AI profiles are viewable by everyone"
  ON ai_profiles FOR SELECT
  USING (true);

-- Authenticated users can insert/update their own AI profile
DROP POLICY IF EXISTS "Users can insert own AI profile" ON ai_profiles;
CREATE POLICY "Users can insert own AI profile"
  ON ai_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own AI profile" ON ai_profiles;
CREATE POLICY "Users can update own AI profile"
  ON ai_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Project AI Analysis Policies:
-- Public can view project analysis
DROP POLICY IF EXISTS "Project AI analysis viewable by everyone" ON project_ai_analysis;
CREATE POLICY "Project AI analysis viewable by everyone"
  ON project_ai_analysis FOR SELECT
  USING (true);

-- Post owners can insert/update project analysis
DROP POLICY IF EXISTS "Post owners can insert project analysis" ON project_ai_analysis;
CREATE POLICY "Post owners can insert project analysis"
  ON project_ai_analysis FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid()));

DROP POLICY IF EXISTS "Post owners can update project analysis" ON project_ai_analysis;
CREATE POLICY "Post owners can update project analysis"
  ON project_ai_analysis FOR UPDATE
  USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid()));

-- Post AI Analysis Policies:
-- Authors can view their own guard analysis
DROP POLICY IF EXISTS "Post owners can view post AI analysis" ON post_ai_analysis;
CREATE POLICY "Post owners can view post AI analysis"
  ON post_ai_analysis FOR SELECT
  USING (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid()));

DROP POLICY IF EXISTS "Post owners can insert post AI analysis" ON post_ai_analysis;
CREATE POLICY "Post owners can insert post AI analysis"
  ON post_ai_analysis FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM posts WHERE posts.id = post_id AND posts.user_id = auth.uid()));

-- 7. Supabase RPC Functions for Vector Similarity Matching

-- Match Users by Semantic Vector Similarity (PassionMatch AI)
CREATE OR REPLACE FUNCTION match_users (
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 10,
  filter_user_id uuid DEFAULT NULL
)
RETURNS TABLE (
  user_id uuid,
  full_name text,
  username text,
  avatar_url text,
  bio text,
  summary text,
  passions jsonb,
  skills jsonb,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS user_id,
    p.full_name,
    p.username,
    p.avatar_url,
    p.bio,
    ap.summary,
    ap.passions,
    ap.skills,
    1 - (ap.embedding <=> query_embedding) AS similarity
  FROM ai_profiles ap
  JOIN profiles p ON p.id = ap.user_id
  WHERE
    ap.embedding IS NOT NULL
    AND (filter_user_id IS NULL OR ap.user_id <> filter_user_id)
    AND (1 - (ap.embedding <=> query_embedding)) >= match_threshold
  ORDER BY ap.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- Match Projects by Vector Similarity (ProjectMatch AI)
CREATE OR REPLACE FUNCTION match_projects (
  query_embedding vector(384),
  match_threshold float DEFAULT 0.5,
  match_count int DEFAULT 6
)
RETURNS TABLE (
  post_id uuid,
  project_title text,
  project_description text,
  github_link text,
  demo_link text,
  tech_stack text,
  difficulty text,
  technologies jsonb,
  required_skills jsonb,
  author_id uuid,
  author_name text,
  author_username text,
  author_avatar text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id AS post_id,
    p.project_title,
    p.project_description,
    p.github_link,
    p.demo_link,
    p.tech_stack,
    pa.difficulty,
    pa.technologies,
    pa.required_skills,
    prof.id AS author_id,
    prof.full_name AS author_name,
    prof.username AS author_username,
    prof.avatar_url AS author_avatar,
    1 - (pa.embedding <=> query_embedding) AS similarity
  FROM project_ai_analysis pa
  JOIN posts p ON p.id = pa.post_id
  JOIN profiles prof ON prof.id = p.user_id
  WHERE
    pa.embedding IS NOT NULL
    AND (1 - (pa.embedding <=> query_embedding)) >= match_threshold
  ORDER BY pa.embedding <=> query_embedding ASC
  LIMIT match_count;
END;
$$;

-- Semantic Search Across Users and Projects
CREATE OR REPLACE FUNCTION search_semantic (
  query_embedding vector(384),
  match_threshold float DEFAULT 0.4,
  match_count int DEFAULT 10
)
RETURNS TABLE (
  result_id uuid,
  result_type text,
  title text,
  subtitle text,
  description text,
  image_url text,
  similarity float
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  -- Users
  SELECT
    p.id AS result_id,
    'user' AS result_type,
    p.full_name AS title,
    '@' || p.username AS subtitle,
    COALESCE(ap.summary, p.bio) AS description,
    p.avatar_url AS image_url,
    1 - (ap.embedding <=> query_embedding) AS similarity
  FROM ai_profiles ap
  JOIN profiles p ON p.id = ap.user_id
  WHERE ap.embedding IS NOT NULL AND (1 - (ap.embedding <=> query_embedding)) >= match_threshold

  UNION ALL

  -- Projects
  SELECT
    p.id AS result_id,
    'project' AS result_type,
    p.project_title AS title,
    'by @' || prof.username AS subtitle,
    COALESCE(pa.summary, p.project_description, p.content) AS description,
    p.image_url AS image_url,
    1 - (pa.embedding <=> query_embedding) AS similarity
  FROM project_ai_analysis pa
  JOIN posts p ON p.id = pa.post_id
  JOIN profiles prof ON prof.id = p.user_id
  WHERE pa.embedding IS NOT NULL AND (1 - (pa.embedding <=> query_embedding)) >= match_threshold

  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
