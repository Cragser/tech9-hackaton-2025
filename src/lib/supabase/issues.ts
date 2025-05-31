import { supabase } from './client';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '@/types/issue';

// Fetch all issues from Supabase
export async function fetchIssues(): Promise<Issue[]> {
  const { data, error } = await supabase
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
  category_id?: number
): Promise<Issue[]> {
  let query = supabase
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
export async function fetchIssueById(id: number): Promise<Issue | null> {
  const { data, error } = await supabase
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
export async function createIssue(issue: CreateIssueRequest): Promise<Issue> {
  const { data, error } = await supabase
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
export async function updateIssue(issue: UpdateIssueRequest): Promise<Issue> {
  const { id, ...updateData } = issue;
  
  const { data, error } = await supabase
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
export async function deleteIssue(id: number): Promise<void> {
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting issue:', error);
    throw new Error(error.message);
  }
}

// Increment likes for an issue
export async function likeIssue(id: number): Promise<Issue> {
  const { data, error } = await supabase
    .rpc('increment_likes', { issue_id: id });

  if (error) {
    console.error('Error liking issue:', error);
    throw new Error(error.message);
  }

  // Fetch the updated issue
  return fetchIssueById(id) as Promise<Issue>;
}

// Claim an issue (set fixed_by to current user)
export async function claimIssue(id: number, userId: number): Promise<Issue> {
  return updateIssue({
    id,
    status: 'claimed',
    fixed_by: userId
  });
}

// Resolve an issue
export async function resolveIssue(id: number): Promise<Issue> {
  return updateIssue({
    id,
    status: 'resolved'
  });
}
