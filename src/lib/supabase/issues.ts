import { supabase } from '../../../app/ssr/client';
import { createClient } from '@supabase/supabase-js';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '@/types/issue';

// Create authenticated Supabase client for client-side operations
export function createAuthenticatedSupabaseClient(sessionToken?: string | null) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    sessionToken ? {
      global: {
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      },
    } : undefined
  );
}

// Fetch all issues from Supabase
export async function fetchIssues(sessionToken?: string | null): Promise<Issue[]> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { data, error } = await client
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching issues:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Fetch issues with filters
export async function fetchIssuesWithFilters(
  status?: string,
  priority?: string,
  category_id?: number,
  sessionToken?: string | null
): Promise<Issue[]> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  let query = client
    .from('issues')
    .select('*');

  if (status && status !== 'all') {
    query = query.eq('status', status);
  }

  if (priority && priority !== 'all') {
    query = query.eq('priority', priority);
  }

  if (category_id) {
    query = query.eq('category_id', category_id);
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching filtered issues:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Fetch a single issue by ID
export async function fetchIssueById(id: number, sessionToken?: string | null): Promise<Issue | null> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { data, error } = await client
    .from('issues')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching issue:', error);
    throw new Error(error.message);
  }

  return data;
}

// Create a new issue
export async function createIssue(issue: CreateIssueRequest, sessionToken?: string | null): Promise<Issue> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { data, error } = await client
    .from('issues')
    .insert([{
      ...issue,
      status: issue.status || 'open',
      priority: issue.priority || 'medium',
      likes: 0
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating issue:', error);
    throw new Error(error.message);
  }

  return data;
}

// Update an existing issue
export async function updateIssue(issue: UpdateIssueRequest, sessionToken?: string | null): Promise<Issue> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;
  const { id, ...updateData } = issue;

  const { data, error } = await client
    .from('issues')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating issue:', error);
    throw new Error(error.message);
  }

  return data;
}

// Delete an issue
export async function deleteIssue(id: number, sessionToken?: string | null): Promise<void> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { error } = await client
    .from('issues')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting issue:', error);
    throw new Error(error.message);
  }
}

// Increment likes for an issue
export async function likeIssue(id: number, sessionToken?: string | null): Promise<Issue> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  // First, try using the RPC function
  const { data: rpcData, error: rpcError } = await client
    .rpc('increment_likes', { issue_id: id });

  if (rpcError) {
    console.warn('RPC increment_likes failed, trying direct update:', rpcError);

    // Fallback: Direct update approach
    // First get the current issue
    const currentIssue = await fetchIssueById(id, sessionToken);
    if (!currentIssue) {
      throw new Error(`Issue with id ${id} not found`);
    }

    // Update the likes count directly
    const { data: updateData, error: updateError } = await client
      .from('issues')
      .update({ likes: (currentIssue.likes || 0) + 1 })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating likes directly:', updateError);
      throw new Error(updateError.message || 'Failed to update likes');
    }

    return updateData;
  }

  // If RPC succeeded, fetch the updated issue
  return fetchIssueById(id, sessionToken) as Promise<Issue>;
}

// Claim an issue (set fixed_by to current user)
export async function claimIssue(id: number, userId: number, sessionToken?: string | null): Promise<Issue> {
  return updateIssue({
    id,
    status: 'claimed',
    fixed_by: userId
  }, sessionToken);
}

// Resolve an issue
export async function resolveIssue(id: number, sessionToken?: string | null): Promise<Issue> {
  return updateIssue({
    id,
    status: 'resolved'
  }, sessionToken);
}
