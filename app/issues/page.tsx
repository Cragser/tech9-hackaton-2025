"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, MapPin, Calendar, MessageCircle, ThumbsUp, CheckCircle, Clock, User, Zap } from "lucide-react";

export default function IssuesPage() {
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("priority");

  // Mock data matching the database schema
  const issues = [
    {
      id: 1,
      created_at: "2024-01-15T10:30:00Z",
      title: "Large pothole on Main Street",
      description: "Deep pothole causing damage to vehicles. Located near the intersection with Oak Avenue.",
      location: "Main Street & Oak Avenue",
      cost: 500,
      category_id: 1,
      created_by: "sarah_johnson",
      status: "Open",
      priority: "High",
      fixed_by: null,
      likes: 12,
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
      aiSummary: "Critical road hazard requiring immediate attention",
      comments: 8
    },
    {
      id: 2,
      created_at: "2024-01-14T14:20:00Z",
      title: "Broken playground equipment",
      description: "Swing set has broken chains, potential safety hazard for children.",
      location: "Central Park",
      cost: 200,
      category_id: 2,
      created_by: "mike_chen",
      status: "In Progress",
      priority: "Medium",
      fixed_by: 5,
      likes: 9,
      image: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=200&fit=crop",
      aiSummary: "Child safety concern in recreational area",
      comments: 5
    },
    {
      id: 3,
      created_at: "2024-01-12T09:15:00Z",
      title: "Graffiti on community center wall",
      description: "Large graffiti covering the east wall of the community center building.",
      location: "Community Center",
      cost: 150,
      category_id: 3,
      created_by: "lisa_wong",
      status: "Resolved",
      priority: "Low",
      fixed_by: 3,
      likes: 6,
      image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=200&fit=crop",
      aiSummary: "Aesthetic improvement for community building",
      comments: 3
    },
    {
      id: 4,
      created_at: "2024-01-13T18:45:00Z",
      title: "Broken streetlight",
      description: "Streetlight not working on Elm Street, creating dark area at night.",
      location: "Elm Street",
      cost: 300,
      category_id: 2,
      created_by: "tom_wilson",
      status: "Open",
      priority: "Medium",
      fixed_by: null,
      likes: 7,
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&h=200&fit=crop",
      aiSummary: "Safety concern affecting nighttime visibility",
      comments: 4
    }
  ];

  const filterOptions = [
    { value: "all", label: "All Issues" },
    { value: "Open", label: "Open" },
    { value: "In Progress", label: "In Progress" },
    { value: "Resolved", label: "Resolved" }
  ];

  const sortOptions = [
    { value: "priority", label: "Priority" },
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "secondary";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open": return <Clock className="w-4 h-4" />;
      case "In Progress": return <User className="w-4 h-4" />;
      case "Resolved": return <CheckCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
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
      <div className="grid gap-6">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img 
                  src={issue.image} 
                  alt={issue.title}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{issue.title}</h3>
                    <Badge 
                      variant={getPriorityColor(issue.priority)}
                      className="ml-2"
                    >
                      {issue.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{issue.description}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <MapPin className="w-4 h-4 mr-1" />
                    {issue.location}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {issue.likes}
                      </div>
                      <span>{issue.comments} comments</span>
                      <Badge variant={issue.status === 'Open' ? 'outline' : 'secondary'}>
                        {getStatusIcon(issue.status)}
                        <span className="ml-1">{issue.status}</span>
                      </Badge>
                      {issue.cost && (
                        <span className="font-medium text-green-600">
                          ${issue.cost}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <Zap className="w-3 h-3 mr-1" />
                      AI: {issue.aiSummary}
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex gap-2 mt-4">
                    {issue.status === "Open" && (
                      <Button size="sm" variant="outline">
                        Claim Issue
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </div>
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