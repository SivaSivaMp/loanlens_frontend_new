//B2B AUTH
export const AUTH = {
  REGISTER: "/auth/register",
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  REFRESH: "/auth/refresh",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
} as const;

//portal Auth

export const PORTAL_AUTH = {
  REGISTER: "/portal/auth/register",
  LOGIN: "/portal/auth/login",
  LOGOUT: "/portal/auth/logout",
  REFRESH: "/portal/auth/refresh",
  VERIFY_EMAIL: "/portal/auth/verify-email",
  RESEND_VERIFICATION: "/portal/auth/resend-verification",
  FORGOT_PASSWORD: "/portal/auth/forgot-password",
  RESET_PASSWORD: "/portal/auth/reset-password",
} as const;
