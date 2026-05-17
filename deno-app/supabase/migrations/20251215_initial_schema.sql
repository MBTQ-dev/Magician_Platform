-- Initial Schema for Magician Platform
-- Created: 2025-12-15
-- Description: Core tables for DeafAuth, FibonRose, and PinkSync modules

-- ============================================================================
-- Profiles Table (DeafAuth)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  is_deaf BOOLEAN DEFAULT false,
  prefer_asl BOOLEAN DEFAULT false,
  bio TEXT,
  location TEXT,
  website TEXT,
  roles TEXT[] DEFAULT ARRAY['user']::TEXT[],
  permissions TEXT[] DEFAULT ARRAY[]::TEXT[],
  fibonrose_score INTEGER DEFAULT 0,
  vr_counselor_id UUID,
  workforce_certified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Contributions Table (FibonRose)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contributions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Accessibility Preferences Table (PinkSync)
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.accessibility_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  prefer_asl BOOLEAN DEFAULT false,
  captions_enabled BOOLEAN DEFAULT true,
  high_contrast BOOLEAN DEFAULT false,
  large_text BOOLEAN DEFAULT false,
  reduced_motion BOOLEAN DEFAULT false,
  screen_reader_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Indexes
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON public.contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_type ON public.contributions(type);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON public.contributions(created_at);

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accessibility_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies - Profiles
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Public profiles viewable"
  ON public.profiles FOR SELECT
  USING (true);

-- RLS Policies - Contributions
CREATE POLICY "Users can read own contributions"
  ON public.contributions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own contributions"
  ON public.contributions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies - Accessibility
CREATE POLICY "Users can read own accessibility"
  ON public.accessibility_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own accessibility"
  ON public.accessibility_preferences FOR ALL
  USING (auth.uid() = user_id);
