-- Rollback migration for Google OAuth columns
DROP INDEX IF EXISTS idx_users_email;
DROP INDEX IF EXISTS idx_users_google_id;
ALTER TABLE users DROP COLUMN IF EXISTS avatar_url;
ALTER TABLE users DROP COLUMN IF EXISTS google_id;
-- Revert password column to NOT NULL if needed:
-- ALTER TABLE users ALTER COLUMN password SET NOT NULL;
