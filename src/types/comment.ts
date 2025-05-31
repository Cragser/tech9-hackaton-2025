// TypeScript types for the comments table based on Supabase schema
export interface Comment {
  id: number;
  created_at: string;
  content: string;
  author: string;
  issue_id: number;
}

// Request type for creating a new comment
export interface CreateCommentRequest {
  content: string;
  author: string;
  issue_id: number;
}

// API response types
export interface CommentsResponse {
  data: Comment[];
  error: string | null;
}

export interface CreateCommentResponse {
  data: Comment | null;
  error: string | null;
}
