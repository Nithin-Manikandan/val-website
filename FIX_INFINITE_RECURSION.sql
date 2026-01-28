-- ============================================
-- FIX INFINITE RECURSION ERROR IN PROFILES RLS
-- This removes the problematic policy causing the loop
-- ============================================

-- Step 1: Drop ALL policies on profiles table
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;

-- Step 2: Create ONLY the user policy (no admin policy to avoid recursion)
CREATE POLICY "Users can view their own profile" 
  ON profiles 
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = id);

-- Step 3: Create UPDATE policy
CREATE POLICY "Users can update their own profile" 
  ON profiles 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Step 4: Verify - should show only 2 policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Step 5: Test - this should return your profile with is_admin
SELECT id, email, is_admin FROM profiles WHERE id = auth.uid();

