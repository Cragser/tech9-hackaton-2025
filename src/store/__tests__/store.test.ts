import { configureStore } from '@reduxjs/toolkit';
import { store, RootState, AppDispatch } from '../store';
import { issuesApi } from '../api/issuesApi';
import authReducer from '../slices/authSlice';

describe('Store Configuration', () => {
  it('should have the correct initial state structure', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty('auth');
    expect(state).toHaveProperty('issuesApi');
  });

  it('should have auth slice in initial state', () => {
    const state = store.getState();
    
    expect(state.auth).toEqual({
      sessionToken: null,
    });
  });

  it('should include issues API reducer', () => {
    const state = store.getState();
    
    expect(state).toHaveProperty(issuesApi.reducerPath);
  });

  it('should have correct TypeScript types', () => {
    // Test that types are exported correctly
    const state: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;
    
    expect(typeof state).toBe('object');
    expect(typeof dispatch).toBe('function');
  });

  it('should be able to create a new store instance', () => {
    const newStore = configureStore({
      reducer: {
        auth: authReducer,
        [issuesApi.reducerPath]: issuesApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(issuesApi.middleware),
    });

    expect(newStore.getState()).toEqual(store.getState());
  });
}); 