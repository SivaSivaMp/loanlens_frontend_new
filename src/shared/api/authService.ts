import { apiClient } from "./client";
import { portalClient } from "./portalClient";
import { AUTH, PORTAL_AUTH } from "./endpoints";
import type { UserRole } from "@/shared/types/api.types";

//return types
export interface LoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
  };
}

export interface PortalLoginResult {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    Fullname: string;
  };
}

export type EmailVerifyStatus =
  | "success"
  | "failed"
  | "expired"
  | "already_verified";

//b2b auth service
export const AuthService = {
  register: async (data: {
    email: string;
    password: string;
    role: UserRole;
    [key: string]: unknown;
  }) => {
    const { data: res } = await apiClient.post(AUTH.REGISTER, data);
    return res.data;
  },
  login: async (data: {
    email: string;
    password: string;
  }): Promise<LoginResult> => {
    const { data: res } = await apiClient.post(AUTH.LOGIN, data);
    return res.data;
  },
  logout: async () => {
    await apiClient.post(AUTH.LOGOUT);
  },
  verifyEmail: async (token: string): Promise<EmailVerifyStatus> => {
    const { data: res } = await apiClient.post(AUTH.VERIFY_EMAIL, { token });
    return res.data?.status ?? "success";
  },
  resendVerification: async (email: string) => {
    const { data: res } = await apiClient.post(AUTH.RESEND_VERIFICATION, {
      email,
    });
    return res;
  },
  forgotPassword: async (email: string) => {
    const { data: res } = await apiClient.post(AUTH.FORGOT_PASSWORD, { email });
    return res;
  },
  resetPassword: async (data: { token: string; newPassword: string }) => {
    const { data: res } = await apiClient.post(AUTH.RESET_PASSWORD, data);
    return res;
  },
};
export const PortalAuthService = {
  register: async (data: {
    fullName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    const { data: res } = await portalClient.post(PORTAL_AUTH.REGISTER, data);
    return res.data;
  },

  login: async (
    email: string,
    password: string,
  ): Promise<PortalLoginResult> => {
    const { data: res } = await portalClient.post(PORTAL_AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  },

  logout: async () => {
    await portalClient.post(PORTAL_AUTH.LOGOUT);
  },

  /**
   * Called from the portal email-verified callback page.
   * Backend: GET /portal/auth/verify-email?token=<token>
   */
  verifyEmail: async (token: string): Promise<EmailVerifyStatus> => {
    const { data: res } = await portalClient.get(PORTAL_AUTH.VERIFY_EMAIL, {
      params: { token },
    });
    return res.data?.status ?? "success";
  },

  resendVerification: async (email: string) => {
    const { data: res } = await portalClient.post(
      PORTAL_AUTH.RESEND_VERIFICATION,
      { email },
    );
    return res;
  },

  forgotPassword: async (email: string) => {
    const { data: res } = await portalClient.post(PORTAL_AUTH.FORGOT_PASSWORD, {
      email,
    });
    return res;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const { data: res } = await portalClient.post(PORTAL_AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    });
    return res;
  },
};
