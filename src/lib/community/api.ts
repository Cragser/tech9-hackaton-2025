import { z } from 'zod';

// Define the Issue schema using Zod for type validation
export const IssueSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  location: z.string(),
  priority: z.enum(['Low', 'Medium', 'High']),
  status: z.enum(['Open', 'In Progress', 'Resolved']),
  comments: z.number(),
  aiSummary: z.string()
});

// Create a type from the schema
export type CommunityIssue = z.infer<typeof IssueSchema>;

// Mock data for community issues
const MOCK_ISSUES: CommunityIssue[] = [
  {
    id: '1',
    title: 'Broken Street Light',
    description: 'Street light at the corner of Maple and Oak has been out for two weeks, creating a safety hazard.',
    image: 'https://images.unsplash.com/photo-1610085927744-7217728267a6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c3RyZWV0JTIwbGlnaHR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    location: 'Maple Street & Oak Avenue',
    priority: 'High',
    status: 'Open',
    comments: 7,
    aiSummary: 'Urgent safety issue'
  },
  {
    id: '2',
    title: 'Pothole Damage',
    description: 'Large pothole on Main Street causing damage to vehicles. Multiple complaints from residents.',
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cG90aG9sZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
    location: 'Main Street, near Central Park',
    priority: 'Medium',
    status: 'In Progress',
    comments: 12,
    aiSummary: 'Infrastructure repair needed'
  },
  {
    id: '3',
    title: 'Park Bench Repair',
    description: 'Several benches in Community Park are damaged and need repair. Some have exposed nails.',
    image: 'https://images.unsplash.com/photo-1617688893819-7eed2edce8c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8YnJva2VuJTIwYmVuY2h8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    location: 'Community Park, East Section',
    priority: 'Low',
    status: 'Open',
    comments: 3,
    aiSummary: 'Public facility maintenance'
  },
  {
    id: '4',
    title: 'Graffiti Removal',
    description: 'Graffiti on the wall of the community center needs to be removed. Inappropriate content.',
    image: 'https://images.unsplash.com/photo-1607246749106-0a2b287f7245?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JhZmZpdGl8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
    location: 'Downtown Community Center',
    priority: 'Medium',
    status: 'Open',
    comments: 5,
    aiSummary: 'Aesthetic improvement'
  }
];

/**
 * Fetches community issues from the API
 * @returns Promise containing an array of community issues
 */
export async function fetchCommunityIssues(): Promise<CommunityIssue[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real app, this would be an API call to Supabase or another backend
  return MOCK_ISSUES;
}
