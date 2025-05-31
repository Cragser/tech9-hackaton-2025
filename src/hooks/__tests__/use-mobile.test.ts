import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';

// Mock window.matchMedia
const mockMatchMedia = jest.fn();

beforeEach(() => {
  mockMatchMedia.mockClear();
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: mockMatchMedia,
  });
});

describe('useIsMobile', () => {
  it('should return false for desktop width', () => {
    // Mock desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const mockMql = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);
  });

  it('should return true for mobile width', () => {
    // Mock mobile width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 600,
    });

    const mockMql = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });

  it('should update when window is resized', () => {
    // Start with desktop width
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    let changeHandler: () => void;
    const mockMql = {
      matches: false,
      addEventListener: jest.fn((event, handler) => {
        if (event === 'change') {
          changeHandler = handler;
        }
      }),
      removeEventListener: jest.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(false);

    // Simulate resize to mobile
    act(() => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 600,
      });
      changeHandler();
    });

    expect(result.current).toBe(true);
  });

  it('should clean up event listener on unmount', () => {
    const mockMql = {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const { unmount } = renderHook(() => useIsMobile());

    expect(mockMql.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(mockMql.removeEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should handle edge case at breakpoint boundary', () => {
    // Test exactly at the breakpoint (767px)
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const mockMql = {
      matches: true,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    mockMatchMedia.mockReturnValue(mockMql);

    const { result } = renderHook(() => useIsMobile());

    expect(result.current).toBe(true);
  });
}); 