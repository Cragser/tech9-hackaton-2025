// TypeScript types for the issues table based on Supabase schema
export interface Issue {
  id: number;
  created_at: string;
  title: string;
  description: string;
  location: string;
  cost: number;
  category_id: number;
  created_by: string;
  status: string;
  priority: string;
  fixed_by: number | null;
  likes: number;
}

// Extended interface for UI display with additional computed fields
export interface IssueWithExtras extends Issue {
  category?: string;
  reportedBy?: string;
  claimedBy?: string;
  comments?: number;
  upvotes?: number;
  aiSummary?: string;
  aiRank?: number;
}

// API response types
export interface IssuesResponse {
  data: Issue[];
  error: string | null;
}

export interface CreateIssueRequest {
  title: string;
  description: string;
  location: string;
  cost?: number;
  category_id: number;
  created_by: string;
  status?: string;
  priority?: string;
}

export interface UpdateIssueRequest {
  id: number;
  title?: string;
  description?: string;
  location?: string;
  cost?: number;
  category_id?: number;
  status?: string;
  priority?: string;
  fixed_by?: number;
}
