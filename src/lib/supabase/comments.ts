import { supabase } from '../../../app/ssr/client';
import { createClient } from '@supabase/supabase-js';
import { Comment, CreateCommentRequest } from '@/types/comment';

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

// Fetch comments for a specific issue
export async function fetchCommentsByIssueId(issueId: number, sessionToken?: string | null): Promise<Comment[]> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { data, error } = await client
    .from('comments')
    .select('*')
    .eq('issue_id', issueId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    throw new Error(error.message);
  }

  return data || [];
}

// Create a new comment
export async function createComment(comment: CreateCommentRequest, sessionToken?: string | null): Promise<Comment> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { data, error } = await client
    .from('comments')
    .insert([comment])
    .select()
    .single();

  if (error) {
    console.error('Error creating comment:', error);
    throw new Error(error.message || 'Failed to create comment');
  }

  return data;
}

// Delete a comment (optional - for future use)
export async function deleteComment(id: number, sessionToken?: string | null): Promise<void> {
  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  const { error } = await client
    .from('comments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting comment:', error);
    throw new Error(error.message);
  }
}
