-- ============================================
-- FIX PROFILES RLS TO ALLOW READING is_admin
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Ensure is_admin column exists
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Step 2: Enable RLS on profiles (if not already enabled)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Drop existing SELECT policies on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Step 4: Create new SELECT policy that allows users to read their own profile (including is_admin)
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Step 5: REMOVED - This policy causes infinite recursion
-- Admins will use the "Users can view their own profile" policy
-- and can query all profiles directly without a special policy

-- Step 6: Drop existing UPDATE policies on profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;

-- Step 7: Create UPDATE policy
CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 8: Verify policies were created
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 9: Test - this should return your profile with is_admin column
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid();

