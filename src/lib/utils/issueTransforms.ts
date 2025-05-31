import { Issue, IssueWithExtras } from '@/types/issue';

// Mock AI ranking algorithm - in a real app this would come from your AI service
function calculateAIRank(issue: Issue): number {
  let rank = 50; // Base rank
  
  // Priority weighting
  if (issue.priority === 'high') rank += 30;
  else if (issue.priority === 'medium') rank += 15;
  else if (issue.priority === 'low') rank += 5;
  
  // Likes weighting
  rank += Math.min(issue.likes * 2, 20);
  
  // Cost consideration (higher cost = higher priority)
  if (issue.cost > 1000) rank += 15;
  else if (issue.cost > 500) rank += 10;
  else if (issue.cost > 100) rank += 5;
  
  // Age consideration (newer issues get slight boost)
  const daysSinceCreated = Math.floor(
    (Date.now() - new Date(issue.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );
  if (daysSinceCreated <= 1) rank += 10;
  else if (daysSinceCreated <= 7) rank += 5;
  
  return Math.min(Math.max(rank, 0), 100);
}

// Generate AI summary based on issue data
function generateAISummary(issue: Issue): string {
  const priorityText = issue.priority === 'high' ? 'Critical' : 
                      issue.priority === 'medium' ? 'Important' : 'Standard';
  
  const categoryText = getCategoryName(issue.category_id);
  
  const urgencyText = issue.priority === 'high' ? 'requiring immediate attention' :
                     issue.priority === 'medium' ? 'needing prompt resolution' :
                     'for community improvement';
  
  return `${priorityText} ${categoryText.toLowerCase()} issue ${urgencyText}. ${
    issue.likes > 5 ? 'High community interest.' : ''
  }`.trim();
}

// Mock category mapping - in a real app this would come from a categories table
function getCategoryName(categoryId: number): string {
  const categories: Record<number, string> = {
    1: 'Infrastructure',
    2: 'Safety',
    3: 'Environment',
    4: 'Transportation',
    5: 'Public Services',
    6: 'Recreation',
    7: 'Housing',
    8: 'Other'
  };
  
  return categories[categoryId] || 'Other';
}

// Transform Supabase issue to UI-friendly format
export function transformIssueForUI(issue: Issue): IssueWithExtras {
  return {
    ...issue,
    category: getCategoryName(issue.category_id),
    reportedBy: issue.created_by,
    claimedBy: issue.fixed_by ? `User ${issue.fixed_by}` : null,
    comments: Math.floor(Math.random() * 10) + 1, // Mock comment count
    upvotes: issue.likes,
    aiSummary: generateAISummary(issue),
    aiRank: calculateAIRank(issue),
  };
}

// Transform array of issues
export function transformIssuesForUI(issues: Issue[]): IssueWithExtras[] {
  return issues.map(transformIssueForUI);
}

// Map UI status to database status
export function mapUIStatusToDBStatus(uiStatus: string): string {
  const statusMap: Record<string, string> = {
    'all': 'all',
    'open': 'open',
    'claimed': 'claimed',
    'in_progress': 'claimed',
    'resolved': 'resolved',
    'closed': 'resolved'
  };
  
  return statusMap[uiStatus] || uiStatus;
}

// Map UI priority to database priority
export function mapUIPriorityToDBPriority(uiPriority: string): string {
  const priorityMap: Record<string, string> = {
    'all': 'all',
    'low': 'low',
    'medium': 'medium',
    'high': 'high',
    'urgent': 'high'
  };
  
  return priorityMap[uiPriority] || uiPriority;
}
