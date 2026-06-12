-- ============================================================
-- Couples Counseling App — Full Database Schema v2
-- Neon PostgreSQL 18+ with RLS enabled
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 0. USERS
-- Identity source of truth from MantraCare handshake.
-- id is a BIGINT provided externally (not auto-generated here).
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id            BIGINT PRIMARY KEY,
  email         TEXT,
  display_name  TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1. COUPLES
-- Stores each couple's core profile (created during onboarding)
-- Tied to a user via user_id.
-- ============================================================
CREATE TABLE IF NOT EXISTS couples (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       BIGINT REFERENCES users(id) ON DELETE CASCADE,
  partner1_name TEXT NOT NULL,
  partner2_name TEXT NOT NULL,
  anniversary   DATE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE couples ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 2. JOURNAL ENTRIES
-- ============================================================
CREATE TABLE IF NOT EXISTS journal_entries (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id  UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id    BIGINT REFERENCES users(id) ON DELETE CASCADE,
  prompt     TEXT,
  content    TEXT NOT NULL,
  mood       TEXT CHECK (mood IN ('great', 'good', 'neutral', 'low', 'struggling')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. ASSESSMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS assessments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id     UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id       BIGINT REFERENCES users(id) ON DELETE CASCADE,
  score         INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  communication INTEGER CHECK (communication >= 0 AND communication <= 100),
  trust         INTEGER CHECK (trust >= 0 AND trust <= 100),
  intimacy      INTEGER CHECK (intimacy >= 0 AND intimacy <= 100),
  conflict_res  INTEGER CHECK (conflict_res >= 0 AND conflict_res <= 100),
  shared_goals  INTEGER CHECK (shared_goals >= 0 AND shared_goals <= 100),
  answers       JSONB,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. THERAPISTS (shared directory, no RLS — public read)
-- ============================================================
CREATE TABLE IF NOT EXISTS therapists (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  credentials      TEXT NOT NULL,
  specializations  TEXT[] NOT NULL DEFAULT '{}',
  rating           NUMERIC(3,2) CHECK (rating >= 0 AND rating <= 5),
  review_count     INTEGER DEFAULT 0,
  price_per_hour   INTEGER NOT NULL,
  bio              TEXT,
  image_url        TEXT,
  is_available     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 5. BOOKINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id      UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id        BIGINT REFERENCES users(id) ON DELETE CASCADE,
  therapist_id   UUID NOT NULL REFERENCES therapists(id) ON DELETE RESTRICT,
  session_date   DATE NOT NULL,
  session_time   TEXT NOT NULL,
  session_type   TEXT NOT NULL CHECK (session_type IN ('video', 'phone', 'in-person')),
  duration_mins  INTEGER NOT NULL DEFAULT 60,
  notes          TEXT,
  status         TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 6. ACTIVITIES
-- ============================================================
CREATE TABLE IF NOT EXISTS activities (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id    UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id      BIGINT REFERENCES users(id) ON DELETE CASCADE,
  activity_key TEXT NOT NULL,
  title        TEXT NOT NULL,
  category     TEXT,
  score        INTEGER,
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  played_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. LOVE BOMBS
-- ============================================================
CREATE TABLE IF NOT EXISTS love_bombs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id   UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
  from_name   TEXT NOT NULL,
  to_name     TEXT NOT NULL,
  message     TEXT NOT NULL,
  category    TEXT CHECK (category IN ('sweet', 'fun', 'romantic', 'thoughtful')),
  sent_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE love_bombs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 8. GOALS
-- ============================================================
CREATE TABLE IF NOT EXISTS goals (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id   UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  due_date    DATE,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 9. COURSE PROGRESS
-- ============================================================
CREATE TABLE IF NOT EXISTS course_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id    UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE,
  user_id      BIGINT REFERENCES users(id) ON DELETE CASCADE,
  course_id    TEXT NOT NULL,
  course_title TEXT NOT NULL,
  progress_pct INTEGER NOT NULL DEFAULT 0 CHECK (progress_pct >= 0 AND progress_pct <= 100),
  completed    BOOLEAN NOT NULL DEFAULT FALSE,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (couple_id, course_id)
);
ALTER TABLE course_progress ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 10. NOTIFICATION SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS notification_settings (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  couple_id         UUID NOT NULL REFERENCES couples(id) ON DELETE CASCADE UNIQUE,
  user_id           BIGINT REFERENCES users(id) ON DELETE CASCADE,
  daily_reminders   BOOLEAN NOT NULL DEFAULT TRUE,
  session_reminders BOOLEAN NOT NULL DEFAULT TRUE,
  love_bomb_alerts  BOOLEAN NOT NULL DEFAULT TRUE,
  email_digest      BOOLEAN NOT NULL DEFAULT FALSE,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE notification_settings ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_couples_user              ON couples(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_couple    ON journal_entries(couple_id);
CREATE INDEX IF NOT EXISTS idx_journal_user              ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_assessments_couple        ON assessments(couple_id);
CREATE INDEX IF NOT EXISTS idx_assessments_user          ON assessments(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_couple           ON bookings(couple_id);
CREATE INDEX IF NOT EXISTS idx_bookings_therapist        ON bookings(therapist_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user             ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_activities_couple         ON activities(couple_id);
CREATE INDEX IF NOT EXISTS idx_activities_user           ON activities(user_id);
CREATE INDEX IF NOT EXISTS idx_love_bombs_couple         ON love_bombs(couple_id);
CREATE INDEX IF NOT EXISTS idx_love_bombs_user           ON love_bombs(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_couple              ON goals(couple_id);
CREATE INDEX IF NOT EXISTS idx_goals_user                ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_couple    ON course_progress(couple_id);
CREATE INDEX IF NOT EXISTS idx_course_progress_user      ON course_progress(user_id);

-- ============================================================
-- SEED DATA — Therapists directory
-- ============================================================
INSERT INTO therapists (name, credentials, specializations, rating, review_count, price_per_hour, bio, image_url) VALUES
  ('Dr. Sarah Johnson',  'PhD, Licensed Marriage Therapist',      ARRAY['Communication', 'Intimacy', 'Conflict Resolution'],   4.9, 156, 120, 'Dr. Sarah Johnson has been helping couples rebuild connection and communication for over 12 years.', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400'),
  ('Dr. Michael Chen',   'PsyD, Certified Gottman Therapist',     ARRAY['Trust Issues', 'Infidelity Recovery', 'Premarital'],  5.0, 203, 150, 'Dr. Michael Chen is an expert in helping couples heal from betrayal and rebuild trust.',            'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400'),
  ('Dr. Priya Sharma',   'LMFT, Emotionally Focused Therapy',     ARRAY['Emotional Connection', 'Long Distance', 'Cultural'],  4.8,  92, 100, 'Dr. Priya Sharma helps couples navigate cultural, cross-border, and emotional connection challenges.', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400'),
  ('Dr. James Martinez', 'LCSW, Trauma-Informed Therapist',       ARRAY['Anxiety', 'PTSD', 'Blended Families'],                4.7, 118, 130, 'Dr. James Martinez specializes in trauma-informed couples therapy with compassion.',                  'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400')
ON CONFLICT DO NOTHING;

-- ============================================================
-- DEV ONLY: Mock user for local testing
-- ⚠️  Remove or comment out before production deployment
-- ============================================================
INSERT INTO users (id, email, display_name)
VALUES (10000001, 'amy@localhost.dev', 'Amy (Dev)')
ON CONFLICT (id) DO NOTHING;
