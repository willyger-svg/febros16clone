-- ========================================================
-- FEBROS16 BACKEND MIGRATION: Google OAuth 2.0 Integration
-- ========================================================

-- 1. Allow password column to be NULL (Google OAuth users authenticate without a password)
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- 2. Add google_id as a UNIQUE column
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR(255) UNIQUE;

-- 3. Add avatar_url column to store user's profile picture from Google
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 4. Create indexes to speed up lookups by google_id and email
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users (google_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);
