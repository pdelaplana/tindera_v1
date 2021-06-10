import { AuthState } from './auth.state';

export const getEmail = (state: AuthState) => state.email;
export const getDisplayName = (state: AuthState) => state.displayName;
export const getEmailVerified = (state: AuthState) => state.emailVerified;
