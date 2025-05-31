import { render } from '@testing-library/react';
import { IssuesSkeleton } from '../IssuesSkeleton';

describe('IssuesSkeleton', () => {
  it('should render without crashing', () => {
    const { container } = render(<IssuesSkeleton />);
    expect(container).toBeDefined();
  });

  it('should render 4 skeleton cards', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for skeleton cards by looking for the card elements
    const cards = container.querySelectorAll('[data-testid="card"], .shadow-lg');
    expect(cards.length).toBe(4);
  });

  it('should have proper structure', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for main container
    const mainContainer = container.querySelector('.max-w-4xl');
    expect(mainContainer).toBeTruthy();
    
    // Check for grid layout
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toBeTruthy();
  });

  it('should have animated elements', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for animate-pulse classes
    const animatedElements = container.querySelectorAll('.animate-pulse');
    expect(animatedElements.length).toBeGreaterThan(0);
  });

  it('should have image placeholders', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for image skeleton elements
    const imageSkeletons = container.querySelectorAll('.w-full.md\\:w-48, .h-32');
    expect(imageSkeletons.length).toBeGreaterThan(0);
  });

  it('should have title skeletons', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for title skeleton elements
    const titleSkeletons = container.querySelectorAll('.h-6');
    expect(titleSkeletons.length).toBeGreaterThan(0);
  });

  it('should have responsive design classes', () => {
    const { container } = render(<IssuesSkeleton />);
    
    // Check for responsive classes
    const responsiveElements = container.querySelectorAll('.md\\:flex-row, .md\\:w-48');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
}); 