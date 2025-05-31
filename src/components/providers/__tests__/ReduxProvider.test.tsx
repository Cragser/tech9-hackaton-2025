import { render } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { ReduxProvider } from '../ReduxProvider';
import { RootState } from '@/store/store';

// Create a test component that uses Redux
const TestComponent = () => {
  const sessionToken = useSelector((state: RootState) => state.auth.sessionToken);
  return <div data-testid="session-token">{sessionToken || 'null'}</div>;
};

describe('ReduxProvider', () => {
  it('should render children without crashing', () => {
    const { container } = render(
      <ReduxProvider>
        <div data-testid="child">Test Child</div>
      </ReduxProvider>
    );
    
    expect(container.querySelector('[data-testid="child"]')).toBeTruthy();
  });

  it('should provide Redux store to children', () => {
    const { getByTestId } = render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );
    
    const sessionTokenElement = getByTestId('session-token');
    expect(sessionTokenElement.textContent).toBe('null');
  });

  it('should allow access to store state', () => {
    const { getByTestId } = render(
      <ReduxProvider>
        <TestComponent />
      </ReduxProvider>
    );
    
    const sessionTokenElement = getByTestId('session-token');
    expect(sessionTokenElement).toBeTruthy();
  });

  it('should render multiple children', () => {
    const { container } = render(
      <ReduxProvider>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <TestComponent />
      </ReduxProvider>
    );
    
    expect(container.querySelector('[data-testid="child1"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="child2"]')).toBeTruthy();
    expect(container.querySelector('[data-testid="session-token"]')).toBeTruthy();
  });

  it('should maintain store state consistency', () => {
    const MultipleComponents = () => (
      <>
        <TestComponent />
        <TestComponent />
      </>
    );

    const { container } = render(
      <ReduxProvider>
        <MultipleComponents />
      </ReduxProvider>
    );
    
    const sessionTokenElements = container.querySelectorAll('[data-testid="session-token"]');
    expect(sessionTokenElements).toHaveLength(2);
    
    // Both components should have the same state
    expect(sessionTokenElements[0].textContent).toBe(sessionTokenElements[1].textContent);
  });
}); 