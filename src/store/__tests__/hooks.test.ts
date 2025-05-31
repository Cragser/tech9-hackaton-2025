import { renderHook } from '@testing-library/react';
import { Provider } from 'react-redux';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import { store } from '../store';
import { setSessionToken } from '../slices/authSlice';

// Create a wrapper component for the Provider
const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => 
    React.createElement(Provider, { store }, children);
  return Wrapper;
};

describe('Store Hooks', () => {
  describe('useAppDispatch', () => {
    it('should return a dispatch function', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useAppDispatch(), { wrapper });
      
      expect(typeof result.current).toBe('function');
    });

    it('should be able to dispatch actions', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(() => useAppDispatch(), { wrapper });
      
      const dispatch = result.current;
      
      // This should not throw
      expect(() => {
        dispatch(setSessionToken('test-token'));
      }).not.toThrow();
    });
  });

  describe('useAppSelector', () => {
    it('should return state from the store', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useAppSelector(state => state.auth),
        { wrapper }
      );
      
      expect(result.current).toEqual({
        sessionToken: expect.any(String)
      });
    });

    it('should return specific state values', () => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useAppSelector(state => state.auth.sessionToken),
        { wrapper }
      );
      
      expect(typeof result.current).toBe('string');
    });

    it('should update when state changes', () => {
      const wrapper = createWrapper();
      
      // First, get the dispatch function
      const { result: dispatchResult } = renderHook(() => useAppDispatch(), { wrapper });
      const dispatch = dispatchResult.current;
      
      // Then, get the selector
      const { result: selectorResult } = renderHook(
        () => useAppSelector(state => state.auth.sessionToken),
        { wrapper }
      );
      
      // Dispatch an action to change the state
      dispatch(setSessionToken('new-test-token'));
      
      // The state should have updated
      expect(selectorResult.current).toBe('new-test-token');
    });

    it('should be type-safe', () => {
      const wrapper = createWrapper();
      
      // This should work without TypeScript errors
      const { result } = renderHook(
        () => useAppSelector(state => {
          // TypeScript should know the shape of state
          return {
            hasSession: state.auth.sessionToken !== null,
            authState: state.auth
          };
        }),
        { wrapper }
      );
      
      expect(result.current).toHaveProperty('hasSession');
      expect(result.current).toHaveProperty('authState');
    });
  });
}); 