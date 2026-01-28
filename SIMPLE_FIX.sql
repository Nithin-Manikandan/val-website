-- ============================================
-- Simple Database Fix - Run this in Supabase SQL Editor
-- ============================================

-- First, let's check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'sessions', 'bookings', 'payments')
ORDER BY table_name;

-- Add is_admin column to profiles
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create sessions table (simple version)
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME NOT NULL,
  type TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  attendance_status TEXT DEFAULT 'booked',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending',
  payment_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies for sessions (everyone can read)
DROP POLICY IF EXISTS "Enable read access for all users" ON sessions;
CREATE POLICY "Enable read access for all users" 
  ON sessions FOR SELECT 
  TO authenticated, anon
  USING (true);

-- Admin can do everything with sessions
DROP POLICY IF EXISTS "Enable all for admins" ON sessions;
CREATE POLICY "Enable all for admins" 
  ON sessions FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Bookings: users can see their own, admins can see all
DROP POLICY IF EXISTS "Users can view own bookings" ON bookings;
CREATE POLICY "Users can view own bookings" 
  ON bookings FOR SELECT 
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Users can create own bookings" ON bookings;
CREATE POLICY "Users can create own bookings" 
  ON bookings FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can update bookings" ON bookings;
CREATE POLICY "Admins can update bookings" 
  ON bookings FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Payments: users can see their own, admins can manage all
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
CREATE POLICY "Users can view own payments" 
  ON payments FOR SELECT 
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

DROP POLICY IF EXISTS "Admins can manage payments" ON payments;
CREATE POLICY "Admins can manage payments" 
  ON payments FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Verify tables were created
SELECT table_name, 
       (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as columns
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'sessions', 'bookings', 'payments')
ORDER BY table_name;

