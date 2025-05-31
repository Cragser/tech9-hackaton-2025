import { Card, CardContent } from "@/components/ui/card";

/**
 * Loading skeleton for community issues
 * Displays placeholder UI while issues are being fetched
 */
export function IssuesSkeleton() {
  // Create an array of 4 items to render skeleton cards
  const skeletonItems = Array(4).fill(null);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="h-10 w-64 bg-gray-200 rounded-md mx-auto mb-8 animate-pulse" />
      <div className="grid gap-6">
        {skeletonItems.map((_, index) => (
          <Card key={index} className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image skeleton */}
                <div className="w-full md:w-48 h-32 bg-gray-200 rounded-lg animate-pulse" />
                
                <div className="flex-1">
                  {/* Title skeleton */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="h-6 w-3/4 bg-gray-200 rounded-md animate-pulse" />
                    <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse ml-2" />
                  </div>
                  
                  {/* Description skeleton */}
                  <div className="h-4 w-full bg-gray-200 rounded-md mb-2 animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-200 rounded-md mb-3 animate-pulse" />
                  
                  {/* Location skeleton */}
                  <div className="flex items-center mb-3">
                    <div className="h-4 w-1/3 bg-gray-200 rounded-md animate-pulse" />
                  </div>
                  
                  {/* Footer skeleton */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-4 w-24 bg-gray-200 rounded-md animate-pulse" />
                      <div className="h-5 w-16 bg-gray-200 rounded-full animate-pulse" />
                    </div>
                    <div className="h-4 w-32 bg-gray-200 rounded-md animate-pulse" />
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
