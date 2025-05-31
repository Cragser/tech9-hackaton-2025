import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '@/types/issue';
import { Comment, CreateCommentRequest } from '@/types/comment';
import {
  fetchIssues,
  fetchIssuesWithFilters,
  fetchIssueById,
  createIssue,
  updateIssue,
  deleteIssue,
  likeIssue,
  claimIssue,
  resolveIssue,
} from '@/lib/supabase/issues';
import {
  fetchCommentsByIssueId,
  createComment,
} from '@/lib/supabase/comments';
import type { RootState } from '../store';

// Helper to get session token (will be passed from components)
let currentSessionToken: string | null = null;

export const setSessionToken = (token: string | null) => {
  currentSessionToken = token;
};

export const issuesApi = createApi({
  reducerPath: 'issuesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Issue', 'Comment'],
  endpoints: (builder) => ({
    // Fetch all issues
    getIssues: builder.query<Issue[], void>({
      queryFn: async () => {
        try {
          const data = await fetchIssues(currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Issue'],
    }),

    // Fetch issues with filters
    getFilteredIssues: builder.query<
      Issue[],
      { status?: string; priority?: string; category_id?: number }
    >({
      queryFn: async ({ status, priority, category_id }) => {
        try {
          const data = await fetchIssuesWithFilters(status, priority, category_id, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: ['Issue'],
    }),

    // Fetch single issue by ID
    getIssueById: builder.query<Issue | null, number>({
      queryFn: async (id) => {
        try {
          const data = await fetchIssueById(id, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, id) => [{ type: 'Issue', id }],
    }),

    // Create new issue
    createIssue: builder.mutation<Issue, CreateIssueRequest>({
      queryFn: async (newIssue) => {
        try {
          const data = await createIssue(newIssue, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Issue'],
    }),

    // Update existing issue
    updateIssue: builder.mutation<Issue, UpdateIssueRequest>({
      queryFn: async (updatedIssue) => {
        try {
          const data = await updateIssue(updatedIssue, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Issue', id }, 'Issue'],
    }),

    // Delete issue
    deleteIssue: builder.mutation<void, number>({
      queryFn: async (id) => {
        try {
          await deleteIssue(id, currentSessionToken);
          return { data: undefined };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: ['Issue'],
    }),

    // Like an issue
    likeIssue: builder.mutation<Issue, number>({
      queryFn: async (id) => {
        try {
          console.log('Attempting to like issue:', id, 'with token:', currentSessionToken ? 'present' : 'null');
          const data = await likeIssue(id, currentSessionToken);
          console.log('Like successful, updated issue:', data);
          return { data };
        } catch (error) {
          console.error('Like mutation failed:', error);
          const errorMessage = error instanceof Error ? error.message : String(error);
          return { error: { status: 'FETCH_ERROR', error: errorMessage } };
        }
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        // Optimistic update: immediately update the cache
        const patchResult = dispatch(
          issuesApi.util.updateQueryData('getIssues', undefined, (draft) => {
            const issue = draft.find((issue) => issue.id === id);
            if (issue) {
              issue.likes = (issue.likes || 0) + 1;
            }
          })
        );

        try {
          // Wait for the mutation to complete
          await queryFulfilled;
        } catch {
          // If the mutation fails, revert the optimistic update
          patchResult.undo();
        }
      },
      // Don't invalidate tags to prevent refetching
      invalidatesTags: [],
    }),

    // Claim an issue
    claimIssue: builder.mutation<Issue, { id: number; userId: number }>({
      queryFn: async ({ id, userId }) => {
        try {
          const data = await claimIssue(id, userId, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { id }) => [{ type: 'Issue', id }, 'Issue'],
    }),

    // Resolve an issue
    resolveIssue: builder.mutation<Issue, number>({
      queryFn: async (id) => {
        try {
          const data = await resolveIssue(id, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Issue', id }, 'Issue'],
    }),

    // Fetch comments for an issue
    getCommentsByIssueId: builder.query<Comment[], number>({
      queryFn: async (issueId) => {
        try {
          const data = await fetchCommentsByIssueId(issueId, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      providesTags: (result, error, issueId) => [
        { type: 'Comment', id: `issue-${issueId}` },
        'Comment'
      ],
    }),

    // Create a new comment
    createComment: builder.mutation<Comment, CreateCommentRequest>({
      queryFn: async (newComment) => {
        try {
          const data = await createComment(newComment, currentSessionToken);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, { issue_id }) => [
        { type: 'Comment', id: `issue-${issue_id}` },
        'Comment'
      ],
    }),
  }),
});

export const {
  useGetIssuesQuery,
  useGetFilteredIssuesQuery,
  useGetIssueByIdQuery,
  useCreateIssueMutation,
  useUpdateIssueMutation,
  useDeleteIssueMutation,
  useLikeIssueMutation,
  useClaimIssueMutation,
  useResolveIssueMutation,
  useGetCommentsByIssueIdQuery,
  useCreateCommentMutation,
} = issuesApi;
