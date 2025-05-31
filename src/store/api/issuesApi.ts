import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Issue, CreateIssueRequest, UpdateIssueRequest } from '@/types/issue';
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

export const issuesApi = createApi({
  reducerPath: 'issuesApi',
  baseQuery: fakeBaseQuery(),
  tagTypes: ['Issue'],
  endpoints: (builder) => ({
    // Fetch all issues
    getIssues: builder.query<Issue[], void>({
      queryFn: async () => {
        try {
          const data = await fetchIssues();
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
          const data = await fetchIssuesWithFilters(status, priority, category_id);
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
          const data = await fetchIssueById(id);
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
          const data = await createIssue(newIssue);
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
          const data = await updateIssue(updatedIssue);
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
          await deleteIssue(id);
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
          const data = await likeIssue(id);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Issue', id }, 'Issue'],
    }),

    // Claim an issue
    claimIssue: builder.mutation<Issue, { id: number; userId: number }>({
      queryFn: async ({ id, userId }) => {
        try {
          const data = await claimIssue(id, userId);
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
          const data = await resolveIssue(id);
          return { data };
        } catch (error) {
          return { error: { status: 'FETCH_ERROR', error: String(error) } };
        }
      },
      invalidatesTags: (result, error, id) => [{ type: 'Issue', id }, 'Issue'],
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
} = issuesApi;
