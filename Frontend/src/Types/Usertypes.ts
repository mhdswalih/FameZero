// types.ts
export interface UserProfile {
  _id: string;
  userId: string;
  name: string;
  email: string;
  profilepic: string;
  phone: string;
  address1: string;
  address2: string;
  role: string;
  token: string;
}

// For Redux state that includes persistence fields
export interface PersistedUserProfile extends UserProfile {
  isLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  _persist?: { version: number; rehydrated: boolean };
}