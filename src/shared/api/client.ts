import axios from "axios";
import { useAuthStore } from "@/shared/stores/authStore";

/**
 * B2B Axios Client — Bank Admin / Company DSA / Field Agent
 * Uses JWT_ACCESS_SECRET tokens from /auth/* endpoints.
 */

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

const PUBLIC_AUTH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
];

function isPublicAuthRequest(url?: string): boolean {
  return PUBLIC_AUTH_PATHS.some((path) => url?.startsWith(path));
}

//attch B2B auth token to every request if available
apiClient.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

//401 silent refresh interceptor,else logout

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isPublicAuthRequest(original.url)
    ) {
      original._retry = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        );
        const { accessToken, refreshToken: newRefresh } = data.data;
        useAuthStore.getState().updateTokens(accessToken, newRefresh);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch {
        useAuthStore.getState().logout();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);
