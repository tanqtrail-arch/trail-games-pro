-- 探究教室 TRAIL Database Schema
-- Version 1.5

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMs
CREATE TYPE user_role AS ENUM ('child', 'parent');
CREATE TYPE plan_type AS ENUM ('free', 'monitor', 'paid');
CREATE TYPE feedback_type AS ENUM ('game_review', 'nps', 'feature_request', 'churn_reason');
CREATE TYPE subject_category AS ENUM ('理科', '社会', '算数', '美術');

-- Table: users
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  grade TEXT NOT NULL CHECK (grade IN ('小1','小2','小3','小4','小5','小6','中1','中2','中3','高1','高2','高3')),
  role user_role NOT NULL DEFAULT 'child',
  parent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  level INT NOT NULL DEFAULT 1 CHECK (level >= 1 AND level <= 99),
  xp INT NOT NULL DEFAULT 0,
  plan_type plan_type NOT NULL DEFAULT 'free',
  total_play_time INT NOT NULL DEFAULT 0,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: games
CREATE TABLE games (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category subject_category NOT NULL,
  grade_min INT NOT NULL CHECK (grade_min >= 1 AND grade_min <= 12),
  grade_max INT NOT NULL CHECK (grade_max >= 1 AND grade_max <= 12),
  skill_tags JSONB NOT NULL DEFAULT '{"思考力":3,"探究力":3,"創造力":3}',
  description TEXT,
  thumbnail_url TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN ('quiz', 'card', 'maze', 'simulation', 'puzzle')),
  game_config JSONB NOT NULL DEFAULT '{}',
  score_display_config JSONB NOT NULL DEFAULT '{"type":"points"}',
  is_published BOOLEAN NOT NULL DEFAULT false,
  play_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: game_scores
CREATE TABLE game_scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  score INT NOT NULL,
  max_score INT NOT NULL,
  time_seconds INT NOT NULL DEFAULT 0,
  skills JSONB NOT NULL DEFAULT '{"思考力":0,"探究力":0,"創造力":0}',
  details JSONB DEFAULT '[]',
  played_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table: game_sessions
CREATE TABLE game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_id TEXT NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  completed BOOLEAN NOT NULL DEFAULT false,
  drop_point INT,
  source TEXT DEFAULT 'direct'
);

-- Table: user_feedback
CREATE TABLE user_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  game_id TEXT REFERENCES games(id) ON DELETE SET NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  type feedback_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_game_scores_user_id ON game_scores(user_id);
CREATE INDEX idx_game_scores_game_id ON game_scores(game_id);
CREATE INDEX idx_game_scores_played_at ON game_scores(played_at DESC);
CREATE INDEX idx_game_scores_user_game ON game_scores(user_id, game_id);
CREATE INDEX idx_game_sessions_user_id ON game_sessions(user_id);
CREATE INDEX idx_game_sessions_game_id ON game_sessions(game_id);
CREATE INDEX idx_games_category ON games(category);
CREATE INDEX idx_games_published ON games(is_published) WHERE is_published = true;
CREATE INDEX idx_users_level ON users(level DESC);
CREATE INDEX idx_users_parent ON users(parent_id);
CREATE INDEX idx_user_feedback_type ON user_feedback(type);

-- Useful views
CREATE OR REPLACE VIEW v_rankings_overall AS
SELECT
  u.id, u.name, u.grade, u.level, u.xp,
  COUNT(gs.id) AS total_games_played,
  COALESCE(AVG(gs.score::float / NULLIF(gs.max_score, 0) * 100), 0) AS avg_score_percent
FROM users u
LEFT JOIN game_scores gs ON u.id = gs.user_id
WHERE u.role = 'child'
GROUP BY u.id, u.name, u.grade, u.level, u.xp
ORDER BY u.xp DESC;

CREATE OR REPLACE VIEW v_platform_stats AS
SELECT
  (SELECT COUNT(DISTINCT user_id) FROM game_scores WHERE user_id IS NOT NULL) AS total_players,
  (SELECT COALESCE(SUM(time_seconds), 0) FROM game_scores) AS total_play_time_seconds,
  (SELECT COUNT(DISTINCT user_id) FROM game_scores WHERE played_at >= CURRENT_DATE AND user_id IS NOT NULL) AS today_players,
  (SELECT COUNT(*) FROM games WHERE is_published = true) AS total_games,
  (SELECT COALESCE(MAX(level), 1) FROM users) AS highest_level;

CREATE OR REPLACE VIEW v_game_performance AS
SELECT
  g.id AS game_id,
  g.title,
  g.category,
  COUNT(gs.id) AS play_count,
  COUNT(DISTINCT gs.user_id) AS unique_players,
  COALESCE(AVG(gs.score::float / NULLIF(gs.max_score, 0) * 100), 0) AS avg_score_percent,
  COALESCE(AVG(gs.time_seconds), 0) AS avg_time_seconds,
  COUNT(CASE WHEN gsess.completed THEN 1 END)::float / NULLIF(COUNT(gsess.id), 0) * 100 AS completion_rate
FROM games g
LEFT JOIN game_scores gs ON g.id = gs.game_id
LEFT JOIN game_sessions gsess ON g.id = gsess.game_id
GROUP BY g.id, g.title, g.category;

-- Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;

-- Games are publicly readable
CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (is_published = true);

-- Game scores: anyone can insert (anonymous play supported), users can read their own
CREATE POLICY "Anyone can submit scores" ON game_scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view own scores" ON game_scores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role full access scores" ON game_scores USING (auth.role() = 'service_role');

-- Users can view/update their own profile
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Parents can view children" ON users FOR SELECT USING (auth.uid() = parent_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER games_updated_at BEFORE UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at();
