import { render, screen, fireEvent } from '@testing-library/react';
import { useRouter, usePathname } from 'next/navigation';
import Header from '../Header';

// Mock Next.js navigation hooks
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

// Mock Clerk components
jest.mock('@clerk/nextjs', () => ({
  SignedIn: ({ children }: { children: React.ReactNode }) => <div data-testid="signed-in">{children}</div>,
  UserButton: ({ afterSignOutUrl, appearance }: any) => (
    <button data-testid="user-button" data-after-sign-out-url={afterSignOutUrl}>
      User Button
    </button>
  ),
}));

const mockPush = jest.fn();
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;
const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

beforeEach(() => {
  mockUseRouter.mockReturnValue({
    push: mockPush,
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  });
  mockUsePathname.mockReturnValue('/');
  mockPush.mockClear();
});

describe('Header', () => {
  it('should render the logo and brand name', () => {
    render(<Header />);
    
    expect(screen.getByText('Save Me')).toBeInTheDocument();
  });

  it('should render all navigation items', () => {
    render(<Header />);
    
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Report Issue')).toBeInTheDocument();
    expect(screen.getByText('Issues')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
  });

  it('should render the donate button', () => {
    render(<Header />);
    
    const donateButtons = screen.getAllByText('Donate');
    expect(donateButtons.length).toBeGreaterThan(0);
  });

  it('should navigate when logo is clicked', () => {
    render(<Header />);
    
    const logo = screen.getByText('Save Me');
    fireEvent.click(logo);
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should navigate when nav items are clicked', () => {
    render(<Header />);
    
    const reportButton = screen.getByText('Report Issue');
    fireEvent.click(reportButton);
    
    expect(mockPush).toHaveBeenCalledWith('/report');
  });

  it('should navigate to donate page when donate button is clicked', () => {
    render(<Header />);
    
    const donateButton = screen.getAllByText('Donate')[0];
    fireEvent.click(donateButton);
    
    expect(mockPush).toHaveBeenCalledWith('/donate');
  });

  it('should show active state for current page', () => {
    mockUsePathname.mockReturnValue('/issues');
    
    render(<Header />);
    
    const issuesButton = screen.getByText('Issues');
    expect(issuesButton.closest('button')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('should toggle mobile menu', () => {
    render(<Header />);
    
    const menuButton = screen.getByRole('button', { hidden: true });
    const menuButtons = screen.getAllByRole('button');
    // Find the button with the menu icon (it's the one with p-2 class)
    const mobileMenuButton = menuButtons.find(button => 
      button.className.includes('p-2')
    );
    fireEvent.click(mobileMenuButton!);
    
    // Mobile navigation should be visible
    const mobileNavItems = screen.getAllByText('Home');
    expect(mobileNavItems.length).toBeGreaterThan(1); // Desktop + Mobile
  });

  it('should close mobile menu when navigation item is clicked', () => {
    render(<Header />);
    
    const menuButtons = screen.getAllByRole('button');
    const mobileMenuButton = menuButtons.find(button => 
      button.className.includes('p-2')
    );
    fireEvent.click(mobileMenuButton!);
    
    // Click on a mobile nav item
    const mobileNavItems = screen.getAllByText('Home');
    fireEvent.click(mobileNavItems[1]); // Click the mobile version
    
    expect(mockPush).toHaveBeenCalledWith('/');
  });

  it('should render user button when signed in', () => {
    render(<Header />);
    
    expect(screen.getAllByTestId('user-button')).toHaveLength(2); // Desktop + Mobile
  });

  it('should handle isActivePage correctly for root path', () => {
    mockUsePathname.mockReturnValue('/');
    
    render(<Header />);
    
    const homeButton = screen.getByText('Home');
    expect(homeButton.closest('button')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('should handle isActivePage correctly for non-root paths', () => {
    mockUsePathname.mockReturnValue('/report/new');
    
    render(<Header />);
    
    const reportButton = screen.getByText('Report Issue');
    expect(reportButton.closest('button')).toHaveClass('bg-blue-100', 'text-blue-700');
  });
}); 