import { create } from "zustand";
import { persist } from "zustand/middleware";

interface PortalAuthUser {
  id: string;
  email: string;
  fullName: string;
}

interface PortalAuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: PortalAuthUser | null;
  login: (
    tokens: { accessToken: string; refreshToken: string },
    user: PortalAuthUser,
  ) => void;
  logout: () => void;
  updateTokens: (accessToken: string, refreshToken: string) => void;
}
/**
 * Customer Portal Auth Store — PortalUser only
 * Uses JWT_PORTAL_ACCESS_SECRET tokens from /portal/auth/* endpoints.
 *
 */

export const usePortalAuthStore = create<PortalAuthState>()(
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
        set({ accessToken: null, refreshToken: null, user: null });
      },
      updateTokens: (accessToken, refreshToken) => {
        set({ accessToken, refreshToken });
      },
    }),
    { name: "loanlens-portal-auth" },
  ),
);
