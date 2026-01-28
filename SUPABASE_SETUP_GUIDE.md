# Supabase Setup Guide for VAL Authentication System

This guide will walk you through setting up Supabase for the VAL authentication and session management system.

## Step 1: Create a Supabase Project

1. Go to **https://supabase.com/**
2. Click **"Start your project"** or **"Sign In"** if you have an account
3. Sign up using your email or GitHub account
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name:** VAL Authentication
   - **Database Password:** Create a strong password (save this!)
   - **Region:** Choose the closest region to your users
   - **Pricing Plan:** Free (perfect for getting started)
6. Click **"Create new project"**
7. Wait 2-3 minutes for your project to be provisioned

---

## Step 2: Get Your Supabase Credentials

1. Once your project is ready, go to **Settings** (gear icon in sidebar)
2. Click **"API"** in the settings menu
3. You'll see two important values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
4. **Copy these values** - you'll need them for your `.env` file

---

## Step 3: Create Database Tables

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New query"**
3. Copy and paste the following SQL schema:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table
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

-- Create bookings table
CREATE TABLE bookings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  attendance_status TEXT DEFAULT 'booked' CHECK (attendance_status IN ('booked', 'attended', 'no-show', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, session_id)
);

-- Create payments table
CREATE TABLE payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_session_id ON bookings(session_id);
CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_sessions_date ON sessions(date);
```

4. Click **"Run"** to execute the SQL
5. You should see "Success. No rows returned" - this is good!

---

## Step 4: Set Up Row Level Security (RLS)

RLS ensures users can only access their own data. Run this SQL:

```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Sessions policies (everyone can view, only admins can modify)
CREATE POLICY "Anyone can view sessions" ON sessions FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert sessions" ON sessions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update sessions" ON sessions FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can delete sessions" ON sessions FOR DELETE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Bookings policies
CREATE POLICY "Users can view their own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON bookings FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can update all bookings" ON bookings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Payments policies
CREATE POLICY "Users can view their own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all payments" ON payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins can create payments" ON payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
```

---

## Step 5: Create Auto-Profile Trigger

This automatically creates a profile when a user signs up:

```sql
-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Step 6: Create Admin User

After you sign up your first user, make them an admin:

```sql
-- Replace 'your-email@example.com' with your actual email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

---

## Step 7: Configure Your .env File

1. In your VAL project root, create a file named `.env`
2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your-long-key-here
```

3. **Save the file**
4. **Restart your development server** (`npm run dev`)

---

## ✅ You're Done!

Your Supabase backend is now fully configured! You can now:
- Sign up new users
- Log in with email/password or Google
- Access user and admin dashboards
- Manage sessions and bookings
- Track payments

---

## Troubleshooting

**"relation does not exist" error:**
- Make sure you ran all SQL queries in Step 3

**"row-level security policy violation" error:**
- Make sure you ran all RLS policies in Step 4

**Google OAuth not working:**
- Double-check your redirect URI matches exactly
- Make sure Google+ API is enabled

**Profile not created on signup:**
- Make sure you ran the trigger function in Step 5

