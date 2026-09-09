import type { AxiosError } from "axios";

interface ApiErrorBody {
  error?: { message?: string };
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string {
  const axiosErr = error as AxiosError<ApiErrorBody>;

  // Server responded with a structured error body
  if (axiosErr.response?.data) {
    const data = axiosErr.response.data;
    return data.error?.message ?? data.message ?? fallback;
  }

  // Network error or timeout
  if (axiosErr.message) return axiosErr.message;

  return fallback;
}
