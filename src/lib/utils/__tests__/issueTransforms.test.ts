import {
  transformIssueForUI,
  transformIssuesForUI,
  mapUIStatusToDBStatus,
  mapUIPriorityToDBPriority,
} from '../issueTransforms';
import { Issue } from '@/types/issue';

// Mock Math.random for consistent testing
const mockMath = Object.create(global.Math);
mockMath.random = () => 0.5;
global.Math = mockMath;

describe('issueTransforms', () => {
  const mockIssue: Issue = {
    id: 1,
    title: 'Test Issue',
    description: 'Test description',
    priority: 'high',
    status: 'open',
    category_id: 1,
    location: 'Test Location',
    cost: 1500,
    likes: 10,
    created_at: '2024-01-01T00:00:00Z',
    created_by: 'user123',
    fixed_by: null,
    photo_url: 'https://example.com/image.jpg',
  };

  describe('transformIssueForUI', () => {
    it('should transform issue with all required fields', () => {
      const result = transformIssueForUI(mockIssue);

      expect(result).toMatchObject({
        ...mockIssue,
        category: 'Infrastructure',
        reportedBy: 'user123',
        claimedBy: undefined,
        comments: expect.any(Number),
        upvotes: 10,
        aiSummary: expect.any(String),
        aiRank: expect.any(Number),
      });
    });

    it('should generate correct category for different category_ids', () => {
      const testCases = [
        { category_id: 1, expected: 'Infrastructure' },
        { category_id: 2, expected: 'Safety' },
        { category_id: 3, expected: 'Environment' },
        { category_id: 4, expected: 'Transportation' },
        { category_id: 5, expected: 'Public Services' },
        { category_id: 6, expected: 'Recreation' },
        { category_id: 7, expected: 'Housing' },
        { category_id: 8, expected: 'Other' },
        { category_id: 999, expected: 'Other' },
      ];

      testCases.forEach(({ category_id, expected }) => {
        const issue = { ...mockIssue, category_id };
        const result = transformIssueForUI(issue);
        expect(result.category).toBe(expected);
      });
    });

    it('should handle fixed_by field correctly', () => {
      const fixedIssue = { ...mockIssue, fixed_by: 123 };
      const result = transformIssueForUI(fixedIssue);
      expect(result.claimedBy).toBe('User 123');
    });

    it('should generate AI summary based on priority', () => {
      const highPriorityIssue = { ...mockIssue, priority: 'high' as const };
      const mediumPriorityIssue = { ...mockIssue, priority: 'medium' as const };
      const lowPriorityIssue = { ...mockIssue, priority: 'low' as const };

      const highResult = transformIssueForUI(highPriorityIssue);
      const mediumResult = transformIssueForUI(mediumPriorityIssue);
      const lowResult = transformIssueForUI(lowPriorityIssue);

      expect(highResult.aiSummary).toContain('Critical');
      expect(mediumResult.aiSummary).toContain('Important');
      expect(lowResult.aiSummary).toContain('Standard');
    });

    it('should calculate AI rank correctly for high priority issue', () => {
      const highPriorityIssue = { ...mockIssue, priority: 'high' as const, likes: 10, cost: 1500 };
      const result = transformIssueForUI(highPriorityIssue);
      
      // Base: 50 + High priority: 30 + Likes: 20 + Cost: 15 = 115, capped at 100
      expect(result.aiRank).toBe(100);
    });

    it('should calculate AI rank correctly for low priority issue', () => {
      const lowPriorityIssue = { ...mockIssue, priority: 'low' as const, likes: 0, cost: 50 };
      const result = transformIssueForUI(lowPriorityIssue);
      
      // Base: 50 + Low priority: 5 + Likes: 0 + Cost: 0 (50 is not > 100) = 55
      expect(result.aiRank).toBe(55);
    });

    it('should include high community interest in summary for popular issues', () => {
      const popularIssue = { ...mockIssue, likes: 10 };
      const result = transformIssueForUI(popularIssue);
      expect(result.aiSummary).toContain('High community interest');
    });

    it('should not include community interest for unpopular issues', () => {
      const unpopularIssue = { ...mockIssue, likes: 3 };
      const result = transformIssueForUI(unpopularIssue);
      expect(result.aiSummary).not.toContain('High community interest');
    });

    it('should handle cost thresholds correctly', () => {
      const lowCostIssue = { ...mockIssue, cost: 50, priority: 'low' as const, likes: 0 };
      const mediumCostIssue = { ...mockIssue, cost: 200, priority: 'low' as const, likes: 0 };
      const highCostIssue = { ...mockIssue, cost: 600, priority: 'low' as const, likes: 0 };
      const veryHighCostIssue = { ...mockIssue, cost: 1200, priority: 'low' as const, likes: 0 };

      const lowResult = transformIssueForUI(lowCostIssue);
      const mediumResult = transformIssueForUI(mediumCostIssue);
      const highResult = transformIssueForUI(highCostIssue);
      const veryHighResult = transformIssueForUI(veryHighCostIssue);

      // Base: 50 + Low priority: 5
      expect(lowResult.aiRank).toBe(55); // No cost bonus (50 <= 100)
      expect(mediumResult.aiRank).toBe(60); // +5 cost bonus (200 > 100)
      expect(highResult.aiRank).toBe(65); // +10 cost bonus (600 > 500)
      expect(veryHighResult.aiRank).toBe(70); // +15 cost bonus (1200 > 1000)
    });
  });

  describe('transformIssuesForUI', () => {
    it('should transform array of issues', () => {
      const issues = [mockIssue, { ...mockIssue, id: 2, title: 'Second Issue' }];
      const result = transformIssuesForUI(issues);

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('category');
      expect(result[1]).toHaveProperty('category');
    });

    it('should handle empty array', () => {
      const result = transformIssuesForUI([]);
      expect(result).toEqual([]);
    });
  });

  describe('mapUIStatusToDBStatus', () => {
    it('should map UI statuses to database statuses correctly', () => {
      const testCases = [
        { ui: 'all', db: 'all' },
        { ui: 'open', db: 'open' },
        { ui: 'claimed', db: 'claimed' },
        { ui: 'in_progress', db: 'claimed' },
        { ui: 'resolved', db: 'resolved' },
        { ui: 'closed', db: 'resolved' },
        { ui: 'unknown', db: 'unknown' },
      ];

      testCases.forEach(({ ui, db }) => {
        expect(mapUIStatusToDBStatus(ui)).toBe(db);
      });
    });
  });

  describe('mapUIPriorityToDBPriority', () => {
    it('should map UI priorities to database priorities correctly', () => {
      const testCases = [
        { ui: 'all', db: 'all' },
        { ui: 'low', db: 'low' },
        { ui: 'medium', db: 'medium' },
        { ui: 'high', db: 'high' },
        { ui: 'urgent', db: 'high' },
        { ui: 'unknown', db: 'unknown' },
      ];

      testCases.forEach(({ ui, db }) => {
        expect(mapUIPriorityToDBPriority(ui)).toBe(db);
      });
    });
  });
}); 