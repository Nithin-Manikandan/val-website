-- ============================================
-- VAL Database Fix Script
-- Use this if you get "relation already exists" errors
-- ============================================

-- Option 1: Drop existing tables and recreate (CAREFUL - this deletes all data!)
-- Uncomment the lines below if you want to start fresh

-- DROP TABLE IF EXISTS payments CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS sessions CASCADE;
-- DROP TABLE IF EXISTS profiles CASCADE;

-- ============================================
-- Option 2: Check what tables exist
-- Run this query first to see what's already created:
-- ============================================

SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- ============================================
-- Option 3: Create tables only if they don't exist
-- This is the SAFE option - run this!
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      full_name TEXT,
      role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create sessions table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'sessions') THEN
    CREATE TABLE sessions (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      date DATE NOT NULL,
      time TIME NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('group', 'one-on-one', 'extended')),
      price DECIMAL(10, 2) NOT NULL,
      capacity INTEGER DEFAULT 10,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create bookings table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'bookings') THEN
    CREATE TABLE bookings (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
      attendance_status TEXT DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'no-show', 'cancelled')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, session_id)
    );
  END IF;
END $$;

-- Create payments table (only if it doesn't exist)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'payments') THEN
    CREATE TABLE payments (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
      session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;

-- Create indexes (only if they don't exist)
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_session_id ON bookings(session_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON sessions(date);

-- ============================================
-- Verify tables were created
-- ============================================

SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
  AND table_name IN ('profiles', 'sessions', 'bookings', 'payments')
ORDER BY table_name;

