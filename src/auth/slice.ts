import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  id: string;
  fullName: string;
  username: string;
  role: number;
  shopId: string | null;
  shopName: string | null;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('accessToken'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<{ user: AuthUser; token: string }>) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem('accessToken', action.payload.token);
    },
    setUser(state, action: PayloadAction<AuthUser>) {
      state.user = action.payload;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  },
});

export const { setAuth, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
