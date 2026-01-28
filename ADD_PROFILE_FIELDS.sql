-- ============================================
-- ADD ADDITIONAL PROFILE FIELDS
-- Run this in Supabase SQL Editor
-- ============================================

-- Add new columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS parent_contact TEXT,
ADD COLUMN IF NOT EXISTS grade_level TEXT,
ADD COLUMN IF NOT EXISTS school TEXT;

-- Verify the changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

