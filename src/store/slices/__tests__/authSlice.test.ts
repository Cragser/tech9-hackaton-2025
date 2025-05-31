import authReducer, { setSessionToken, clearSessionToken } from '../authSlice';

describe('authSlice', () => {
  const initialState = {
    sessionToken: null,
  };

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setSessionToken', () => {
    const token = 'test-session-token-123';
    const actual = authReducer(initialState, setSessionToken(token));
    
    expect(actual.sessionToken).toBe(token);
  });

  it('should handle setSessionToken with null', () => {
    const previousState = {
      sessionToken: 'existing-token',
    };
    
    const actual = authReducer(previousState, setSessionToken(null));
    
    expect(actual.sessionToken).toBeNull();
  });

  it('should handle clearSessionToken', () => {
    const previousState = {
      sessionToken: 'existing-token',
    };
    
    const actual = authReducer(previousState, clearSessionToken());
    
    expect(actual.sessionToken).toBeNull();
  });

  it('should handle multiple actions in sequence', () => {
    let state = authReducer(initialState, setSessionToken('token1'));
    expect(state.sessionToken).toBe('token1');
    
    state = authReducer(state, setSessionToken('token2'));
    expect(state.sessionToken).toBe('token2');
    
    state = authReducer(state, clearSessionToken());
    expect(state.sessionToken).toBeNull();
  });

  it('should maintain immutability', () => {
    const token = 'test-token';
    const newState = authReducer(initialState, setSessionToken(token));
    
    expect(newState).not.toBe(initialState);
    expect(initialState.sessionToken).toBeNull();
    expect(newState.sessionToken).toBe(token);
  });
}); 