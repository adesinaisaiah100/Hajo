import { create } from "zustand";

export type UserRole = "provider" | "customer" | null;

type AuthUser = {
  id?: string;
  fullName?: string;
  phone?: string;
  role?: Exclude<UserRole, null>;
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