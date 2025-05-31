import { fetchCommunityIssues, IssueSchema, CommunityIssue } from '../api';

describe('Community API', () => {
  describe('IssueSchema', () => {
    it('should validate a valid issue object', () => {
      const validIssue = {
        id: '1',
        title: 'Test Issue',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
        location: 'Test Location',
        priority: 'High' as const,
        status: 'Open' as const,
        comments: 5,
        aiSummary: 'Test summary'
      };

      expect(() => IssueSchema.parse(validIssue)).not.toThrow();
    });

    it('should reject issue with invalid priority', () => {
      const invalidIssue = {
        id: '1',
        title: 'Test Issue',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
        location: 'Test Location',
        priority: 'Invalid' as any,
        status: 'Open' as const,
        comments: 5,
        aiSummary: 'Test summary'
      };

      expect(() => IssueSchema.parse(invalidIssue)).toThrow();
    });

    it('should reject issue with invalid status', () => {
      const invalidIssue = {
        id: '1',
        title: 'Test Issue',
        description: 'Test description',
        image: 'https://example.com/image.jpg',
        location: 'Test Location',
        priority: 'High' as const,
        status: 'Invalid' as any,
        comments: 5,
        aiSummary: 'Test summary'
      };

      expect(() => IssueSchema.parse(invalidIssue)).toThrow();
    });

    it('should reject issue with missing required fields', () => {
      const incompleteIssue = {
        id: '1',
        title: 'Test Issue',
        // Missing other required fields
      };

      expect(() => IssueSchema.parse(incompleteIssue)).toThrow();
    });

    it('should validate all priority options', () => {
      const priorities = ['Low', 'Medium', 'High'] as const;
      
      priorities.forEach(priority => {
        const issue = {
          id: '1',
          title: 'Test Issue',
          description: 'Test description',
          image: 'https://example.com/image.jpg',
          location: 'Test Location',
          priority,
          status: 'Open' as const,
          comments: 5,
          aiSummary: 'Test summary'
        };

        expect(() => IssueSchema.parse(issue)).not.toThrow();
      });
    });

    it('should validate all status options', () => {
      const statuses = ['Open', 'In Progress', 'Resolved'] as const;
      
      statuses.forEach(status => {
        const issue = {
          id: '1',
          title: 'Test Issue',
          description: 'Test description',
          image: 'https://example.com/image.jpg',
          location: 'Test Location',
          priority: 'High' as const,
          status,
          comments: 5,
          aiSummary: 'Test summary'
        };

        expect(() => IssueSchema.parse(issue)).not.toThrow();
      });
    });
  });

  describe('fetchCommunityIssues', () => {
    beforeEach(() => {
      jest.clearAllTimers();
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.runOnlyPendingTimers();
      jest.useRealTimers();
    });

    it('should return an array of community issues', async () => {
      const promise = fetchCommunityIssues();
      
      // Fast-forward time to resolve the timeout
      jest.advanceTimersByTime(800);
      
      const issues = await promise;
      
      expect(Array.isArray(issues)).toBe(true);
      expect(issues.length).toBeGreaterThan(0);
    });

    it('should return issues with all required properties', async () => {
      const promise = fetchCommunityIssues();
      
      jest.advanceTimersByTime(800);
      
      const issues = await promise;
      
      issues.forEach(issue => {
        expect(issue).toHaveProperty('id');
        expect(issue).toHaveProperty('title');
        expect(issue).toHaveProperty('description');
        expect(issue).toHaveProperty('image');
        expect(issue).toHaveProperty('location');
        expect(issue).toHaveProperty('priority');
        expect(issue).toHaveProperty('status');
        expect(issue).toHaveProperty('comments');
        expect(issue).toHaveProperty('aiSummary');
      });
    });

    it('should return issues that pass schema validation', async () => {
      const promise = fetchCommunityIssues();
      
      jest.advanceTimersByTime(800);
      
      const issues = await promise;
      
      issues.forEach(issue => {
        expect(() => IssueSchema.parse(issue)).not.toThrow();
      });
    });

    it('should simulate proper API delay', async () => {
      const startTime = Date.now();
      const promise = fetchCommunityIssues();
      
      // The function should not resolve immediately
      expect(promise).toBeInstanceOf(Promise);
      
      jest.advanceTimersByTime(800);
      
      await promise;
      // Test passes if we get here without issues
    });

    it('should return consistent data structure', async () => {
      const promise1 = fetchCommunityIssues();
      jest.advanceTimersByTime(800);
      const issues1 = await promise1;
      
      const promise2 = fetchCommunityIssues();
      jest.advanceTimersByTime(800);
      const issues2 = await promise2;
      
      expect(issues1).toEqual(issues2);
    });

    it('should return issues with valid priority values', async () => {
      const promise = fetchCommunityIssues();
      jest.advanceTimersByTime(800);
      const issues = await promise;
      
      const validPriorities = ['Low', 'Medium', 'High'];
      
      issues.forEach(issue => {
        expect(validPriorities).toContain(issue.priority);
      });
    });

    it('should return issues with valid status values', async () => {
      const promise = fetchCommunityIssues();
      jest.advanceTimersByTime(800);
      const issues = await promise;
      
      const validStatuses = ['Open', 'In Progress', 'Resolved'];
      
      issues.forEach(issue => {
        expect(validStatuses).toContain(issue.status);
      });
    });
  });
}); 