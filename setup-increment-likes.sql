-- Setup script for increment_likes function
-- Run this in your Supabase SQL Editor if the function doesn't exist

-- First, check if the function exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_proc 
        WHERE proname = 'increment_likes'
    ) THEN
        -- Create the function if it doesn't exist
        EXECUTE '
        CREATE OR REPLACE FUNCTION increment_likes(issue_id bigint)
        RETURNS void AS $func$
        BEGIN
          UPDATE issues 
          SET likes = COALESCE(likes, 0) + 1 
          WHERE id = issue_id;
          
          -- Check if the update affected any rows
          IF NOT FOUND THEN
            RAISE EXCEPTION ''Issue with id % not found'', issue_id;
          END IF;
        END;
        $func$ LANGUAGE plpgsql;
        ';
        
        RAISE NOTICE 'increment_likes function created successfully';
    ELSE
        RAISE NOTICE 'increment_likes function already exists';
    END IF;
END
$$;

-- Test the function (optional)
-- SELECT increment_likes(1); -- Replace 1 with an actual issue ID
