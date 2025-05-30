-- Clerk + Supabase Integration Database Setup
-- Run these commands in your Supabase SQL Editor

-- 1. Create the tasks table with a user_id column that maps to a Clerk user ID
CREATE TABLE tasks(
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  user_id TEXT NOT NULL DEFAULT auth.jwt()->>'sub',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable Row Level Security on the table
ALTER TABLE "tasks" ENABLE ROW LEVEL SECURITY;

-- 3. Create policy for users to view their own tasks
CREATE POLICY "User can view their own tasks"
ON "public"."tasks"
FOR SELECT
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);

-- 4. Create policy for users to insert their own tasks
CREATE POLICY "Users must insert their own tasks"
ON "public"."tasks"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);

-- 5. Create policy for users to update their own tasks
CREATE POLICY "Users can update their own tasks"
ON "public"."tasks"
FOR UPDATE
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
)
WITH CHECK (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);

-- 6. Create policy for users to delete their own tasks
CREATE POLICY "Users can delete their own tasks"
ON "public"."tasks"
FOR DELETE
TO authenticated
USING (
  ((SELECT auth.jwt()->>'sub') = (user_id)::text)
);

-- 7. Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Add an index on user_id for better performance
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Verify the setup
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'tasks';

-- Check policies
SELECT 
  schemaname, 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual 
FROM pg_policies 
WHERE tablename = 'tasks'; 