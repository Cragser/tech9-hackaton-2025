'use client';

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchCommunityIssues } from "@/lib/community/api";
import { IssuesSkeleton } from "./IssuesSkeleton";
import Image from "next/image";

export default function CommunityIssues() {
  // Use React Query to fetch data
  const { data: featuredIssues, isLoading, error } = useQuery({
    queryKey: ['communityIssues'],
    queryFn: fetchCommunityIssues
  });

  // Show loading state
  if (isLoading) {
    return <IssuesSkeleton />;
  }

  // Show error state
  if (error || !featuredIssues) {
    return (
      <div className="max-w-4xl mx-auto p-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Issues</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
          Error loading community issues. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Community Issues</h2>
      <div className="grid gap-6">
        {featuredIssues.map((issue) => (
          <Card key={issue.id} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <Image 
                  src={issue.image} 
                  alt={issue.title}
                  width={192}
                  height={128}
                  className="w-full md:w-48 h-32 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">{issue.title}</h3>
                    <Badge 
                      variant={issue.priority === 'High' ? 'destructive' : 'secondary'}
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
                      <span>{issue.comments} comments</span>
                      <Badge variant={issue.status === 'Open' ? 'outline' : 'secondary'}>
                        {issue.status}
                      </Badge>
                    </div>
                    <div className="flex items-center text-xs text-blue-600">
                      <Zap className="w-3 h-3 mr-1" />
                      AI: {issue.aiSummary}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
