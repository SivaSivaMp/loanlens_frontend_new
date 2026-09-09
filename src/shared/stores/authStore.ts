import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserRole } from "@/shared/types/api.types";

interface AuthUser {
  id: string;

  email: string;
  role: UserRole;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user: AuthUser,
  ) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}
/**
 * B2B Auth Store — Bank Admin, Company DSA, Field Agent
 * Uses JWT_ACCESS_SECRET tokens from /auth/* endpoints.
 *
 */

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      login: (tokens, user) => {
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          user,
        });
      },
      logout: () => {
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },
      updateTokens: (accessToken, refreshToken) => {
        set({
          accessToken,
          refreshToken,
        });
      },
    }),
    { name: "loanlens-auth" },
  ),
);
