"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, MessageCircle, ThumbsUp, AlertTriangle, CheckCircle, Clock, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { useGetIssuesQuery, useLikeIssueMutation, useClaimIssueMutation, setSessionToken } from "@/store/api/issuesApi";
import { transformIssuesForUI, mapUIStatusToDBStatus } from "@/lib/utils/issueTransforms";
import { IssueWithExtras } from "@/types/issue";
import { useSession } from "@clerk/nextjs";
import { useAppDispatch } from "@/store/hooks";
import { setSessionToken as setReduxSessionToken } from "@/store/slices/authSlice";
import { AISummaryComponent } from "../@modules/ai-summary";

export default function IssuesPage() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");

  // Get Clerk session for authentication
  const { session } = useSession();
  const dispatch = useAppDispatch();

  // Set session token for API calls
  useEffect(() => {
    const getToken = async () => {
      if (session) {
        const token = await session.getToken();
        // Set token in both Redux store and API module
        dispatch(setReduxSessionToken(token));
        setSessionToken(token);
      } else {
        dispatch(setReduxSessionToken(null));
        setSessionToken(null);
      }
    };
    getToken();
  }, [session, dispatch]);

  // Fetch issues from Supabase using Redux
  const { data: rawIssues = [], error, isLoading } = useGetIssuesQuery();
  const [likeIssue, { isLoading: isLikingIssue }] = useLikeIssueMutation();
  const [claimIssue] = useClaimIssueMutation();

  // Transform raw Supabase data for UI
  const transformedIssues = useMemo(() => {
    return transformIssuesForUI(rawIssues);
  }, [rawIssues]);

  // Filter and sort issues
  const issues = useMemo(() => {
    let filtered = transformedIssues.filter((issue: IssueWithExtras) =>
      filter === "all" || mapUIStatusToDBStatus(filter) === issue.status
    );

    // Sort issues
    filtered.sort((a: IssueWithExtras, b: IssueWithExtras) => {
      switch (sortBy) {
        case "priority":
          return (b.aiRank || 0) - (a.aiRank || 0);
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "popular":
          return (b.likes || 0) - (a.likes || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [transformedIssues, filter, sortBy]);

  // Handle like issue
  const handleLikeIssue = async (issueId: number) => {
    try {
      console.log('Liking issue:', issueId);
      const result = await likeIssue(issueId).unwrap();
      console.log('Like successful:', result);
      // Success feedback could be added here (toast notification, etc.)
    } catch (error: any) {
      console.error('Failed to like issue:', {
        issueId,
        error,
        errorMessage: error?.error || error?.message || 'Unknown error',
        errorStatus: error?.status
      });
      // Error feedback could be added here (toast notification, etc.)
      // Note: Optimistic update will be reverted automatically on error
    }
  };

  // Handle claim issue
  const handleClaimIssue = async (issueId: number) => {
    try {
      // In a real app, you'd get the current user ID from auth
      const userId = 1; // Mock user ID
      await claimIssue({ id: issueId, userId }).unwrap();
    } catch (error) {
      console.error('Failed to claim issue:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Community Issues
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explore issues reported by your community and help make a difference by claiming and resolving them.
          </p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading issues...</span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading issues</h3>
          <p className="text-gray-600">
            There was a problem loading the community issues. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const filterOptions = [
    { value: "all", label: "All Issues" },
    { value: "open", label: "Open" },
    { value: "claimed", label: "In Progress" },
    { value: "resolved", label: "Resolved" }
  ];

  const sortOptions = [
    { value: "priority", label: "AI Priority" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" }
  ];

  const getUrgencyColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4" />;
      case "claimed": return <User className="w-4 h-4" />;
      case "resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <AlertTriangle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-100 text-blue-800 border-blue-200";
      case "claimed": return "bg-orange-100 text-orange-800 border-orange-200";
      case "resolved": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Community Issues
        </h1>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Explore issues reported by your community and help make a difference by claiming and resolving them.
        </p>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="flex-1">
          <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="filter"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {filterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1">
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort by
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-6">
        {issues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                {issue.photo_url &&
                  <div className="flex-shrink-0 relative w-[80px] h-[80px]">
                    <Image
                      src={issue.photo_url ?? ''}
                      alt="Issue thumbnail"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                }
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                        {issue.title}
                      </CardTitle>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className={getStatusColor(issue.status)}>
                          {getStatusIcon(issue.status)}
                          <span className="ml-1 capitalize">{issue.status}</span>
                        </Badge>
                        <Badge variant="outline" className={getUrgencyColor(issue.priority)}>
                          <span className="capitalize">{issue.priority} Priority</span>
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                          {issue.category}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <div className="text-sm text-gray-500 mb-1">AI Rank</div>
                      <div className={`text-2xl font-bold ${(issue.aiRank || 0) >= 80 ? 'text-red-600' :
                          (issue.aiRank || 0) >= 60 ? 'text-yellow-600' : 'text-green-600'
                        }`}>
                        {issue.aiRank || 0}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-sm text-gray-500 mb-1">Cost</div>
                  <div className={`text-2xl font-bold`}>
                    ${issue.cost || 0}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{issue.description}</p>

        

              {/* Issue Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {issue.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reported {new Date(issue.created_at).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <User className="w-4 h-4 mr-2" />
                  By {issue.reportedBy}
                </div>
                {issue.claimedBy && (
                  <div className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Claimed by {issue.claimedBy}
                  </div>
                )}
              </div>

              {/* AI Analysis Section */}
              <div className="mb-4">
                <AISummaryComponent
                  issueId={issue.id}
                  issueTitle={issue.title}
                  issueDescription={issue.description}
                  issueCategory={issue.category}
                  issuePriority={issue.priority}
                />
              </div>

              {/* Actions and Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleLikeIssue(issue.id)}
                    disabled={isLikingIssue}
                    className="flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLikingIssue ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <ThumbsUp className="w-4 h-4 mr-1" />
                    )}
                    {issue.likes}
                  </button>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {issue.comments || 0}
                  </div>
                </div>

                <div className="space-x-2">
                  {issue.status === "REGISTERED" && (
                    <Button
                      size="sm"
                      variant="default"
                      onClick={() => handleClaimIssue(issue.id)}
                    >
                      Be a hero
                    </Button>
                  )}
                  <Button size="sm" variant="ghost">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {issues.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No issues found</h3>
          <p className="text-gray-600">
            {filter === "all"
              ? "No issues have been reported yet."
              : `No ${filter} issues found.`}
          </p>
        </div>
      )}
    </div>
  );
}
