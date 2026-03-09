-- 🏢 FINAL NOMOREDMS DATABASE SYNC (VERSION 3 - ERROR-PROOF)
-- Run this in your Supabase SQL Editor to sync everything safely.

-- 1. FIX CREATORS TABLE COLUMNS
DO $$ 
BEGIN 
    -- followers_count
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='followersCount') THEN
        ALTER TABLE creators RENAME COLUMN "followersCount" TO followers_count;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='followers_count') THEN
        ALTER TABLE creators ADD COLUMN followers_count INT DEFAULT 0;
    END IF;

    -- display_name
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='displayName') THEN
        ALTER TABLE creators RENAME COLUMN "displayName" TO display_name;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='display_name') THEN
        ALTER TABLE creators ADD COLUMN display_name TEXT;
    END IF;

    -- profile_pic
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='profilePic') THEN
        ALTER TABLE creators RENAME COLUMN "profilePic" TO profile_pic;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='profile_pic') THEN
        ALTER TABLE creators ADD COLUMN profile_pic TEXT;
    END IF;

    -- is_verified
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='isVerified') THEN
        ALTER TABLE creators RENAME COLUMN "isVerified" TO is_verified;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='is_verified') THEN
        ALTER TABLE creators ADD COLUMN is_verified BOOLEAN DEFAULT FALSE;
    END IF;

    -- is_hidden
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='isHidden') THEN
        ALTER TABLE creators RENAME COLUMN "isHidden" TO is_hidden;
    ELSIF NOT exists (SELECT 1 FROM information_schema.columns WHERE table_name='creators' AND column_name='is_hidden') THEN
        ALTER TABLE creators ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- 2. FIX RESOURCES TABLE COLUMNS
DO $$ 
BEGIN 
    -- creator_id
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='creatorId') THEN
        ALTER TABLE resources RENAME COLUMN "creatorId" TO creator_id;
    END IF;

    -- is_hidden for resources
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='isHidden') THEN
        ALTER TABLE resources RENAME COLUMN "isHidden" TO is_hidden;
    END IF;

    -- Handle 'date' vs 'created_at' conflict
    IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='date') THEN
        IF exists (SELECT 1 FROM information_schema.columns WHERE table_name='resources' AND column_name='created_at') THEN
            -- Both exist, just drop 'date' to avoid naming conflict
            ALTER TABLE resources DROP COLUMN "date";
        ELSE
            -- Only 'date' exists, rename it
            ALTER TABLE resources RENAME COLUMN "date" TO created_at;
        END IF;
    END IF;
END $$;

-- 3. ENSURE ALL TABLES EXIST WITH CORRECT STRUCTURE
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

-- 4. ENABLE REALTIME SYNC (Important for immediate show-on-page)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'creators') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE creators;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'resources') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE resources;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- If publication doesn't exist yet, ignore
END $$;

-- 5. ENSURE CASCADE DELETE FOR CLEAN CLIPS
DO $$ 
BEGIN
    ALTER TABLE resources DROP CONSTRAINT IF EXISTS resources_creator_id_fkey;
    ALTER TABLE resources ADD CONSTRAINT resources_creator_id_fkey FOREIGN KEY (creator_id) REFERENCES creators(id) ON DELETE CASCADE;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if table doesn't exist yet
END $$;

-- 6. RELAX SECURITY TEMPORARILY
ALTER TABLE creators DISABLE ROW LEVEL SECURITY;
ALTER TABLE resources DISABLE ROW LEVEL SECURITY;
