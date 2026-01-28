-- ============================================
-- CHECK RLS POLICIES ON PROFILES TABLE
-- Run this in Supabase SQL Editor to diagnose the issue
-- ============================================

-- Step 1: Check what columns exist in profiles table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Step 2: Check if RLS is enabled on profiles
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'profiles';

-- Step 3: Check all RLS policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'profiles';

-- Step 4: Test if you can read your own profile with is_admin
-- This will show you exactly what columns are being returned
SELECT * FROM profiles WHERE id = auth.uid();

-- Step 5: Check your actual data
SELECT id, email, is_admin, role FROM profiles LIMIT 5;

