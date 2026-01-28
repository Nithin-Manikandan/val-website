-- ============================================
-- Make yourself an admin
-- REPLACE 'your-email@example.com' with your actual email!
-- ============================================

-- First, check what email addresses exist
SELECT email, is_admin FROM profiles;

-- Then, update YOUR email to be admin
-- REPLACE 'your-email@example.com' with your actual email!
UPDATE profiles 
SET is_admin = true 
WHERE email = 'your-email@example.com';

-- Verify it worked
SELECT email, is_admin FROM profiles WHERE is_admin = true;

