# Troubleshooting Like Button Issues

## Problem
Getting `Error liking issue: {}` when clicking the like button.

## Possible Causes & Solutions

### 1. Database Function Missing
**Most Likely Cause**: The `increment_likes` function doesn't exist in your Supabase database.

**Solution**: Run the setup script in your Supabase SQL Editor:
```sql
-- Copy and paste the content from setup-increment-likes.sql
```

### 2. Database Schema Issues
**Check**: Ensure your `issues` table has a `likes` column.

**Solution**: Run this in Supabase SQL Editor:
```sql
-- Add likes column if it doesn't exist
ALTER TABLE issues ADD COLUMN IF NOT EXISTS likes INTEGER DEFAULT 0;
```

### 3. Authentication Issues
**Check**: Verify that Clerk session tokens are being passed correctly.

**Debug**: Look for these console logs:
- "Attempting to like issue: [ID] with token: present/null"
- Check if session token is being set properly

### 4. Row Level Security (RLS)
**Check**: If you have RLS enabled on the `issues` table, make sure your policies allow updates.

**Solution**: Temporarily disable RLS to test:
```sql
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;
```

### 5. Issue ID Not Found
**Check**: Ensure the issue ID exists in the database.

**Debug**: The improved error handling will now show "Issue with id [ID] not found" if this is the case.

## Debugging Steps

### Step 1: Check Database Setup
Run `test-database-setup.sql` in your Supabase SQL Editor to verify:
- Issues table exists with likes column
- increment_likes function exists
- Sample data is present

### Step 2: Check Console Logs
With the improved error handling, you should now see detailed logs:
- "Liking issue: [ID]"
- "Attempting to like issue: [ID] with token: present/null"
- Either "Like successful: [result]" or detailed error information

### Step 3: Test Direct Database Access
Try updating likes directly in Supabase:
```sql
UPDATE issues SET likes = likes + 1 WHERE id = 1;
```

### Step 4: Test the Function
If the function exists, test it directly:
```sql
SELECT increment_likes(1); -- Replace 1 with actual issue ID
```

## Updated Implementation Features

### Enhanced Error Handling
- Fallback to direct update if RPC function fails
- Detailed error logging with issue ID and error details
- User-friendly error alerts

### Better Debugging
- Console logs at each step
- Session token presence verification
- Detailed error information in console

### Graceful Degradation
- If `increment_likes` function doesn't exist, falls back to direct update
- Handles missing issues gracefully
- Provides clear error messages

## Quick Fix
If you want to bypass the RPC function entirely, you can modify the `likeIssue` function to always use direct updates:

```typescript
// In src/lib/supabase/issues.ts, replace the likeIssue function with:
export async function likeIssue(id: number, sessionToken?: string | null): Promise<Issue> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  // Get current issue
  const currentIssue = await fetchIssueById(id, sessionToken);
  if (!currentIssue) {
    throw new Error(`Issue with id ${id} not found`);
  }

  // Update likes directly
  const { data, error } = await client
    .from('issues')
    .update({ likes: (currentIssue.likes || 0) + 1 })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || 'Failed to update likes');
  }

  return data;
}
```

## Next Steps
1. Run the database setup scripts
2. Test the like button again
3. Check console logs for detailed error information
4. If still having issues, share the detailed console logs for further debugging
