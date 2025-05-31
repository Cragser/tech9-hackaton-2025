"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Loader2, ChevronDown, ChevronUp, Zap, Clock, DollarSign, Settings } from "lucide-react";

// Types for the AI Summary response
interface SolutionItem {
  title: string;
  description: string;
  complexity: 'Low' | 'Medium' | 'High';
  timeEstimate: string;
  costEstimate: string;
}

interface AISummaryResponse {
  summary: string;
  solutions: SolutionItem[];
  totalEstimatedTime: string;
  totalEstimatedCost: string;
}

// Props for the component
interface AISummaryComponentProps {
  issueId: number;
  issueTitle: string;
  issueDescription: string;
  issueCategory?: string;
  issuePriority?: string;
}

export default function AISummaryComponent({
  issueId,
  issueTitle,
  issueDescription,
  issueCategory,
  issuePriority
}: AISummaryComponentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [summaryData, setSummaryData] = useState<AISummaryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Simulate 400ms delay as per workspace rules
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate delay as per workspace rules
      await sleep(400);
      
      // Prepare the issue data for the API
      const issueData = {
        description: `Title: ${issueTitle}\nDescription: ${issueDescription}${issueCategory ? `\nCategory: ${issueCategory}` : ''}${issuePriority ? `\nPriority: ${issuePriority}` : ''}`
      };

      // Call the summarize API endpoint
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(issueData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate summary');
      }

      const data: AISummaryResponse = await response.json();
      setSummaryData(data);
      setIsOpen(true); // Auto-open the dropdown when data is received
    } catch (err) {
      console.error('Error generating AI summary:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="w-full">
      {/* AI Summary Button */}
      <Button
        onClick={handleGenerateSummary}
        disabled={isLoading}
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating AI Summary...
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 mr-2" />
            Generate AI Summary
          </>
        )}
      </Button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* AI Summary Results */}
      {summaryData && (
        <div className="mt-4">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between p-4 h-auto border border-blue-200 bg-blue-50 hover:bg-blue-100"
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-blue-800">AI Analysis</div>
                    <div className="text-sm text-blue-700 max-w-md truncate">
                      {summaryData.summary}
                    </div>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-blue-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-blue-600" />
                )}
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent className="mt-2">
              <Card className="border-blue-200">
                <CardContent className="p-4">
                  {/* Summary Overview */}
                  <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Summary</h4>
                    <p className="text-blue-700">{summaryData.summary}</p>
                  </div>

                  {/* Total Estimates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Total Time</div>
                        <div className="font-semibold">{summaryData.totalEstimatedTime}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gray-600" />
                      <div>
                        <div className="text-sm text-gray-600">Total Cost</div>
                        <div className="font-semibold">{summaryData.totalEstimatedCost}</div>
                      </div>
                    </div>
                  </div>

                  {/* Solutions List */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Proposed Solutions ({summaryData.solutions.length})
                    </h4>
                    <div className="space-y-4">
                      {summaryData.solutions.map((solution, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <h5 className="font-medium text-gray-900">{solution.title}</h5>
                            <Badge
                              variant="outline"
                              className={getComplexityColor(solution.complexity)}
                            >
                              {solution.complexity}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-700 mb-3 text-sm">
                            {solution.description}
                          </p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Time:</span>
                              <span className="font-medium">{solution.timeEstimate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-500" />
                              <span className="text-gray-600">Cost:</span>
                              <span className="font-medium">{solution.costEstimate}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </div>
  );
} 