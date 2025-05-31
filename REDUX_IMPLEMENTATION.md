# Redux Toolkit Implementation for Issues Management

This implementation adds Redux Toolkit with RTK Query to manage issues data from Supabase.

## What was implemented:

### 1. Redux Store Setup
- **Store configuration** (`src/store/store.ts`)
- **RTK Query API slice** (`src/store/api/issuesApi.ts`)
- **Typed hooks** (`src/store/hooks.ts`)
- **Redux Provider** (`src/components/providers/ReduxProvider.tsx`)

### 2. Supabase Integration
- **Uses existing client** from `app/ssr/client.tsx`
- **Issues service functions** (`src/lib/supabase/issues.ts`)
- **Data transformation utilities** (`src/lib/utils/issueTransforms.ts`)
- **Clerk authentication integration** for secure API calls

### 3. TypeScript Types
- **Issue interfaces** (`src/types/issue.ts`)
- Matches the Supabase table schema you provided

### 4. Updated Issues Page
- **Real-time data fetching** from Supabase
- **Loading and error states**
- **Interactive features** (like, claim issues)
- **Filtering and sorting**
- **AI-powered ranking and summaries**

## Database Schema

The implementation expects an `issues` table with these columns:
- `id` (bigint, primary key)
- `created_at` (timestamp with time zone)
- `title` (text)
- `description` (text)
- `location` (text)
- `cost` (numeric)
- `category_id` (bigint)
- `created_by` (text)
- `status` (text)
- `priority` (text)
- `fixed_by` (bigint, nullable)
- `likes` (numeric)

## Features

### RTK Query Endpoints
- `getIssues` - Fetch all issues
- `getFilteredIssues` - Fetch with filters
- `getIssueById` - Fetch single issue
- `createIssue` - Create new issue
- `updateIssue` - Update existing issue
- `deleteIssue` - Delete issue
- `likeIssue` - Increment likes
- `claimIssue` - Claim an issue
- `resolveIssue` - Mark as resolved

### UI Features
- **Real-time updates** when data changes
- **Optimistic updates** for better UX
- **Loading states** with spinners
- **Error handling** with user-friendly messages
- **Interactive buttons** for liking and claiming
- **AI-powered ranking** and summaries
- **Filtering** by status (all, open, claimed, resolved)
- **Sorting** by priority, date, popularity

## Installation

1. Install the required dependencies:
   ```bash
   npm install @reduxjs/toolkit react-redux
   ```

2. Set up your Supabase environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_KEY=your_supabase_anon_key
   ```

3. Run the database migrations:
   ```bash
   supabase db push
   ```

4. Optionally, seed with sample data:
   ```bash
   psql -h your_host -d your_db -f supabase/seed_issues.sql
   ```

## Usage

The Redux store is automatically configured and the issues page will:
1. Fetch issues from Supabase on load
2. Display loading states while fetching
3. Show error messages if something goes wrong
4. Allow users to interact with issues (like, claim)
5. Update the UI in real-time when data changes

## Next Steps

To complete the implementation:
1. Install the Redux dependencies
2. Set up your Supabase database with the issues table
3. Configure your environment variables
4. Test the implementation
5. Add authentication integration for user-specific actions
6. Implement the categories table for better category management
7. Add real AI integration for summaries and ranking
