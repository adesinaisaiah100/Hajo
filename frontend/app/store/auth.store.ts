import { create } from "zustand";

export type UserRole = "provider" | "customer" | null;
export type VerificationTier = "TIER_0" | "TIER_1" | "TIER_2" | "TIER_3";

type AuthUser = {
  id?: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  role?: Exclude<UserRole, null>;
  verificationTier?: VerificationTier;
  squadAccountNo?: string;
  isVerified?: boolean;
};

type AuthState = {
  user: AuthUser | null;
  role: UserRole;
  accessToken: string | null;
  setUser: (user: AuthUser | null) => void;
  setRole: (role: UserRole) => void;
  setAccessToken: (accessToken: string | null) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  accessToken: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setAccessToken: (accessToken) => set({ accessToken }),
  reset: () => set({ user: null, role: null, accessToken: null }),
}));