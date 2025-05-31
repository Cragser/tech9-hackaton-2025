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
  console.log('Creating comment with data:', comment);
  console.log('Using session token:', sessionToken ? 'present' : 'null');

  const client = sessionToken ? createAuthenticatedSupabaseClient(sessionToken) : supabase;

  // First, let's test if we can access the table at all
  try {
    const { data: testData, error: testError } = await client
      .from('comments')
      .select('count')
      .limit(1);

    console.log('Table access test:', { testData, testError });
  } catch (testErr) {
    console.error('Cannot access comments table:', testErr);
  }

  // Now try the insert
  const { data, error } = await client
    .from('comments')
    .insert([comment])
    .select()
    .single();

  console.log('Insert result:', { data, error });
  console.log('Error type:', typeof error);
  console.log('Error constructor:', error?.constructor?.name);
  console.log('Error keys:', error ? Object.keys(error) : 'no error');

  if (error) {
    console.error('Supabase error creating comment:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    console.error('Error details:', error.details);
    console.error('Error hint:', error.hint);
    console.error('Full error object:', JSON.stringify(error, null, 2));

    // Try to get more specific error info
    const errorMessage = error.message || error.error_description || error.msg || 'Unknown error occurred';
    throw new Error(`Supabase error: ${errorMessage}`);
  }

  console.log('Comment created successfully:', data);
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
