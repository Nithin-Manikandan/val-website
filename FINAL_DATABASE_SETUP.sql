-- ============================================
-- FINAL COMPLETE DATABASE SETUP FOR VAL TRAINING
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Drop existing tables (clean slate)
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;

-- Step 2: Add is_admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Step 3: Create sessions table
CREATE TABLE sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('group', 'private', 'workshop')),
  price DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  attendance_status TEXT DEFAULT 'booked',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Step 5: Create payments table
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Step 7: Drop all old policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE tablename IN ('sessions', 'bookings', 'payments')) LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
    END LOOP;
END $$;

-- Step 8: SESSIONS policies
CREATE POLICY "Anyone can view sessions" 
  ON sessions FOR SELECT 
  USING (true);

CREATE POLICY "Admins can manage sessions" 
  ON sessions FOR ALL 
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Step 9: BOOKINGS policies
CREATE POLICY "Users view own bookings, admins view all" 
  ON bookings FOR SELECT 
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Users can create bookings" 
  ON bookings FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own, admins update all" 
  ON bookings FOR UPDATE 
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins can delete bookings" 
  ON bookings FOR DELETE 
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Step 10: PAYMENTS policies
CREATE POLICY "Users view own payments, admins view all" 
  ON payments FOR SELECT 
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

CREATE POLICY "Admins manage all payments" 
  ON payments FOR ALL 
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.is_admin = true)
  );

-- Step 11: Verify
SELECT 'TABLES:' as info;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('profiles', 'sessions', 'bookings', 'payments')
ORDER BY table_name;

SELECT 'POLICIES:' as info;
SELECT tablename, policyname FROM pg_policies 
WHERE tablename IN ('sessions', 'bookings', 'payments')
ORDER BY tablename, policyname;

