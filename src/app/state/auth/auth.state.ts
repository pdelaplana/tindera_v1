export interface AuthState {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  emailVerified: boolean;
  isAuthenticated: boolean;
  shopIds: string[];
}
