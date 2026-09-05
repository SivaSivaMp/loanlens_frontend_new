import axios from "axios";
import { usePortalAuthStore } from "@/shared/stores/portalAuthStore";

/**
 * Customer Portal Axios Client
 * Uses JWT_PORTAL_ACCESS_SECRET tokens from /portal/auth/* endpoints.
 * Completely separate from apiClient — different store, different redirect.
 */

export const portalClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const PUBLIC_PORTAL_AUTH_PATHS = [
  "/portal/auth/login",
  "/portal/auth/register",
  "/portal/auth/forgot-password",
  "/portal/auth/reset-password",
  "/portal/auth/verify-email",
  "/portal/auth/resend-verification",
];

function isPublicPortalAuthRequest(url?: string): boolean {
  return PUBLIC_PORTAL_AUTH_PATHS.some((path) => url?.startsWith(path));
}

portalClient.interceptors.request.use((config) => {
  const token = usePortalAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

portalClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !original._retry &&
      usePortalAuthStore.getState().refreshToken &&
      !isPublicPortalAuthRequest(original.url)
    ) {
      original._retry = true;
      try {
        const refreshToken = usePortalAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No portal refresh token");

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/portal/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefresh } = data.data;
        usePortalAuthStore.getState().updateTokens(accessToken, newRefresh);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return portalClient(original);
      } catch {
        usePortalAuthStore.getState().logout();
        window.location.href = "/portal/login";
      }
    }

    return Promise.reject(error);
  },
);
