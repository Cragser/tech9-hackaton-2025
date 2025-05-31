"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, MessageCircle, ThumbsUp, AlertTriangle, CheckCircle, Clock, User } from "lucide-react";

export default function IssuesPage() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");

  // Mock data for demonstration
  const issues = [
    {
      id: 1,
      title: "Large pothole on Main Street",
      description: "Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue.",
      category: "Infrastructure",
      location: "Main Street & Oak Avenue",
      urgency: "high",
      status: "open",
      aiSummary: "Critical road hazard requiring immediate attention. High traffic area with vehicle damage reports.",
      aiRank: 95,
      reportedBy: "Sarah Johnson",
      createdAt: "2024-01-15",
      comments: 8,
      upvotes: 12,
      claimedBy: null
    },
    {
      id: 2,
      title: "Broken playground equipment",
      description: "Swing set has broken chains, potential safety hazard for children.",
      category: "Safety",
      location: "Central Park",
      urgency: "medium",
      status: "claimed",
      aiSummary: "Child safety concern in popular recreational area. Requires equipment inspection and repair.",
      aiRank: 78,
      reportedBy: "Mike Chen",
      createdAt: "2024-01-14",
      comments: 5,
      upvotes: 9,
      claimedBy: "Alex Rodriguez"
    },
    {
      id: 3,
      title: "Graffiti on community center wall",
      description: "Large graffiti covering the east wall of the community center building.",
      category: "Environment",
      location: "Community Center",
      urgency: "low",
      status: "resolved",
      aiSummary: "Aesthetic improvement needed for community building. Non-urgent maintenance task.",
      aiRank: 45,
      reportedBy: "Lisa Wong",
      createdAt: "2024-01-12",
      comments: 3,
      upvotes: 6,
      claimedBy: "David Kim"
    },
    {
      id: 4,
      title: "Broken streetlight",
      description: "Streetlight not working on Elm Street, creating dark area at night.",
      category: "Safety",
      location: "Elm Street",
      urgency: "medium",
      status: "open",
      aiSummary: "Safety concern affecting pedestrian visibility during nighttime hours.",
      aiRank: 82,
      reportedBy: "Tom Wilson",
      createdAt: "2024-01-13",
      comments: 4,
      upvotes: 7,
      claimedBy: null
    }
  ];

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
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

  const filteredIssues = issues.filter(issue => 
    filter === "all" || issue.status === filter
  );

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
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
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
                    <Badge variant="outline" className={getUrgencyColor(issue.urgency)}>
                      <span className="capitalize">{issue.urgency} Priority</span>
                    </Badge>
                    <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                      {issue.category}
                    </Badge>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-sm text-gray-500 mb-1">AI Rank</div>
                  <div className={`text-2xl font-bold ${
                    issue.aiRank >= 80 ? 'text-red-600' :
                    issue.aiRank >= 60 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {issue.aiRank}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">{issue.description}</p>
              
              {/* AI Summary */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">AI</span>
                  </div>
                  <span className="text-sm font-medium text-blue-800">AI Summary</span>
                </div>
                <p className="text-sm text-blue-700">{issue.aiSummary}</p>
              </div>

              {/* Issue Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {issue.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reported {new Date(issue.createdAt).toLocaleDateString()}
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

              {/* Actions and Stats */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    {issue.upvotes}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {issue.comments}
                  </div>
                </div>
                
                <div className="space-x-2">
                  {issue.status === "open" && (
                    <Button size="sm" variant="outline">
                      Claim Issue
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

      {filteredIssues.length === 0 && (
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