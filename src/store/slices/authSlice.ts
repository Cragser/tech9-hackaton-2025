import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  sessionToken: string | null;
}

const initialState: AuthState = {
  sessionToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSessionToken: (state, action: PayloadAction<string | null>) => {
      state.sessionToken = action.payload;
    },
    clearSessionToken: (state) => {
      state.sessionToken = null;
    },
  },
});

export const { setSessionToken, clearSessionToken } = authSlice.actions;
export default authSlice.reducer;
