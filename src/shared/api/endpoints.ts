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

export const DSA = {
  // Company profile
  COMPANY_PROFILE: "/dsa/company/profile",
  UPDATE_COMPANY_PROFILE: "/dsa/company/profile",

  // Agent management
  AGENTS: "/dsa/agents",
  AGENT: (id: string) => `/dsa/agents/${id}`,
  INVITE_AGENT: "/dsa/agents/invite",
  DEACTIVATE_AGENT: (id: string) => `/dsa/agents/${id}/deactivate`,
  REACTIVATE_AGENT: (id: string) => `/dsa/agents/${id}/reactivate`,

  // Commission split rules
  SPLIT_RULES: "/dsa/split-rules",
  SPLIT_RULE: (id: string) => `/dsa/split-rules/${id}`,

  // Leads visible to company DSA (M13)
  LEADS: "/dsa/leads",
  LEAD: (id: string) => `/dsa/leads/${id}`,
  ASSIGN_LEAD: (id: string) => `/dsa/leads/${id}/assign`,
  UPDATE_LEAD_STATUS: (id: string) => `/dsa/leads/${id}/status`,

  // Customers & Applications visible to company DSA (M08)
  CUSTOMERS: "/agent/customers",
  CUSTOMER: (id: string) => `/agent/customers/${id}`,
  DEACTIVATE_CUSTOMER: (id: string) => `/agent/customers/${id}/deactivate`,
  REACTIVATE_CUSTOMER: (id: string) => `/agent/customers/${id}/reactivate`,
  APPLICATIONS: "/agent/applications",
  APPLICATION: (id: string) => `/agent/applications/${id}`,
  UPDATE_APPLICATION_STATUS: (id: string) => `/agent/applications/${id}/status`,
} as const;
// ─── Analytics ───────────────────────────────────────────────
export const ANALYTICS = {
  COMPANY_TEAM: "/analytics/company/team",
  COMPANY_PIPELINE: "/analytics/company/pipeline",
  AGENT_OVERVIEW: "/analytics/agent/overview",
} as const;

// ─── Commissions (M09) ───────────────────────────────────────
export const COMMISSIONS = {
  LIST: "/commissions",
  SUMMARY: "/commissions/summary",
  DETAIL: (id: string) => `/commissions/${id}`,
};
