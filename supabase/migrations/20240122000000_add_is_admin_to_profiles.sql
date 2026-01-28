-- Add is_admin column to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Set your user as admin (replace with your actual user ID)
-- You can find your user ID in the Supabase dashboard under Authentication > Users
-- UPDATE profiles SET is_admin = true WHERE id = 'your-user-id-here';

