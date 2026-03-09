-- 🏢 DEFINITIVE NOMOREDMS DATABASE FIX
-- Goal: Synchronize your Supabase with the latest High-Performance Code.
-- Run this in your Supabase SQL Editor.

-- 1. FIX CREATORS TABLE COLUMNS
-- This handles both old CamelCase and missing columns.

-- Rename followersCount if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='followersCount') THEN
        ALTER TABLE creators RENAME COLUMN "followersCount" TO followers_count;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='followers_count') THEN
        ALTER TABLE creators ADD COLUMN followers_count INT DEFAULT 0;
    END IF;
END $$;

-- Rename displayName if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='displayName') THEN
        ALTER TABLE creators RENAME COLUMN "displayName" TO display_name;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='display_name') THEN
        ALTER TABLE creators ADD COLUMN display_name TEXT;
    END IF;
END $$;

-- Rename profilePic if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='profilePic') THEN
        ALTER TABLE creators RENAME COLUMN "profilePic" TO profile_pic;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='profile_pic') THEN
        ALTER TABLE creators ADD COLUMN profile_pic TEXT;
    END IF;
END $$;

-- Rename isVerified if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='isVerified') THEN
        ALTER TABLE creators RENAME COLUMN "isVerified" TO is_verified;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='is_verified') THEN
        ALTER TABLE creators ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Rename isHidden if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='isHidden') THEN
        ALTER TABLE creators RENAME COLUMN "isHidden" TO is_hidden;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='is_hidden') THEN
        ALTER TABLE creators ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. FIX RESOURCES TABLE COLUMNS

-- Rename creatorId if it exists
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='creatorId') THEN
        ALTER TABLE resources RENAME COLUMN "creatorId" TO creator_id;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='creator_id') THEN
        ALTER TABLE resources ADD COLUMN creator_id UUID REFERENCES creators(id);
    END IF;
END $$;

-- Rename isHidden for resources
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='isHidden') THEN
        ALTER TABLE resources RENAME COLUMN "isHidden" TO is_hidden;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='is_hidden') THEN
        ALTER TABLE resources ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Rename date to created_at (if it was date)
DO $$ 
BEGIN 
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='date') THEN
        ALTER TABLE resources RENAME COLUMN "date" TO created_at;
    END IF;
END $$;


-- 3. ENSURE ALL TABLES EXIST IF COMPLETELY MISSING
CREATE TABLE IF NOT EXISTS creators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    username TEXT NOT NULL,
    display_name TEXT NOT NULL,
    bio TEXT,
    profile_pic TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    niche TEXT,
    followers_count INT DEFAULT 0,
    socials JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID REFERENCES creators(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    tags TEXT[] DEFAULT '{}',
    thumbnail TEXT,
    url TEXT,
    is_hidden BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'live',
    health TEXT DEFAULT 'ok',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. ENABLE REALTIME
ALTER PUBLICATION supabase_realtime ADD TABLE creators;
ALTER PUBLICATION supabase_realtime ADD TABLE resources;

-- 5. RELAX SECURITY FOR TESTING (DISABLE RLS TEMPORARILY)
ALTER TABLE creators DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
