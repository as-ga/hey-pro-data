-- HeyProData Supabase Database Setup
-- Run this script in your Supabase SQL Editor

-- ============================================
-- PROFILES TABLE
-- ============================================

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  legal_first_name TEXT NOT NULL,
  legal_surname TEXT NOT NULL,
  alias_first_name TEXT,
  alias_surname TEXT,
  phone TEXT,
  profile_photo_url TEXT,
  banner_url TEXT,
  bio TEXT,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  is_profile_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ============================================
-- INDEXES
-- ============================================

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically set is_profile_complete
CREATE OR REPLACE FUNCTION update_profile_completeness()
RETURNS TRIGGER AS $$
BEGIN
  NEW.is_profile_complete := (
    NEW.legal_first_name IS NOT NULL AND NEW.legal_first_name != '' AND
    NEW.legal_surname IS NOT NULL AND NEW.legal_surname != '' AND
    NEW.phone IS NOT NULL AND NEW.phone != '' AND
    NEW.profile_photo_url IS NOT NULL AND NEW.profile_photo_url != ''
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update profile completeness on insert/update
DROP TRIGGER IF EXISTS set_profile_completeness ON profiles;
CREATE TRIGGER set_profile_completeness
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_profile_completeness();

-- ============================================
-- STORAGE BUCKETS (for file uploads)
-- ============================================

-- Create storage buckets for profile photos, resumes, etc.
-- Note: You need to create these manually in Supabase Dashboard → Storage
-- or use the Supabase API

-- Bucket names to create:
-- 1. profile-photos (for profile pictures)
-- 2. resumes (for resume uploads)
-- 3. portfolios (for portfolio files)

-- ============================================
-- VERIFICATION
-- ============================================

-- Verify the setup
SELECT 
  'Profiles table created' as status,
  COUNT(*) as profile_count
FROM profiles;

-- Check RLS policies
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

-- ============================================
-- COMPLETE
-- ============================================

-- Setup complete!
-- Next steps:
-- 1. Configure Google OAuth in Supabase Dashboard
-- 2. Create storage buckets if needed
-- 3. Test authentication flows
