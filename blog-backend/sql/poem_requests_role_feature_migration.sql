-- Ensure users table has role column with a default user role.
ALTER TABLE users
ADD COLUMN IF NOT EXISTS role ENUM('user', 'admin') NOT NULL DEFAULT 'user';

-- Ensure poem_requests table has required columns.
ALTER TABLE poem_requests
ADD COLUMN IF NOT EXISTS mood VARCHAR(120) NOT NULL,
ADD COLUMN IF NOT EXISTS theme VARCHAR(255) NOT NULL,
ADD COLUMN IF NOT EXISTS reply_text TEXT NULL,
ADD COLUMN IF NOT EXISTS replied_at DATETIME NULL,
ADD COLUMN IF NOT EXISTS status ENUM('pending', 'completed') NOT NULL DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;
