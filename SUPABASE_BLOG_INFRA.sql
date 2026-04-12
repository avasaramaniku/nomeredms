-- 📝 BLOG INFRASTRUCTURE FOR NOMOREDMS
-- Run this in your Supabase SQL Editor to enable professional blogs.

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES creators(id) ON DELETE SET NULL,
    category TEXT DEFAULT 'Site Update',
    thumbnail_url TEXT,
    is_published BOOLEAN DEFAULT TRUE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Realtime for Blog Posts
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'blog_posts') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE blog_posts;
    END IF;
EXCEPTION WHEN OTHERS THEN
    -- Ignore if publication doesn't exist yet
END $$;

-- Disable RLS for now to match current project pattern (security can be hardened later as requested)
ALTER TABLE blog_posts DISABLE ROW LEVEL SECURITY;

-- Insert a Welcome Post
INSERT INTO blog_posts (title, slug, content, excerpt, category, thumbnail_url)
VALUES (
    'Welcome to NOMOREDMS Creator Hub',
    'welcome-to-nomoredms',
    '# Welcome to the future of creator resources\n\nWe are excited to launch the NOMOREDMS Creator Hub. Our mission is to eliminate the friction between creators and their audience. No more "Check your DMs", no more broken links.\n\n## What to expect\n- Instant access to verified resources\n- Direct creator dashboards\n- Real-time updates and trending insights\n\nStay tuned for more updates!',
    'The DM era is officially over. Welcome to a streamlined way to share and discover creator resources.',
    'Announcement',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop'
) ON CONFLICT (slug) DO NOTHING;
