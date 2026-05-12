import type { AppRootState } from '@/store';

export const selectAuth = (state: AppRootState) => state.auth;
export const selectUser = (state: AppRootState) => state.auth.user;
