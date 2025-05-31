-- Test script to verify your database setup
-- Run this in your Supabase SQL Editor to check if everything is set up correctly

-- 1. Check if issues table exists and has the likes column
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'issues' 
    AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check if increment_likes function exists
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name = 'increment_likes' 
    AND routine_schema = 'public';

-- 3. Check sample data in issues table
SELECT 
    id, 
    title, 
    likes,
    created_at
FROM issues 
LIMIT 5;

-- 4. Test the increment_likes function (if it exists)
-- Uncomment the lines below and replace 1 with an actual issue ID
-- SELECT likes FROM issues WHERE id = 1;
-- SELECT increment_likes(1);
-- SELECT likes FROM issues WHERE id = 1;
