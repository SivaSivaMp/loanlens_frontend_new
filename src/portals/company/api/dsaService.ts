import { apiClient } from "@/shared/api/client";
import { DSA } from "@/shared/api/endpoints";
import type {
  Agent,
  AgentDetail,
  CompanyProfile,
  Customer,
  Lead,
  LeadStatus,
  LoanApplication,
  Page,
} from "../types/company.types";

export interface LeadFilters {
  status?: LeadStatus;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CustomerFilters {
  status?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface ApplicationFilters {
  status?: string;
  page?: number;
  limit?: number;
  search?: string;
}

export const DsaService = {
  getCompanyProfile: async (): Promise<CompanyProfile> => {
    const { data: res } = await apiClient.get(DSA.COMPANY_PROFILE);
    return res.data;
  },

  updateCompanyProfile: async (
    updates: Partial<CompanyProfile>,
  ): Promise<CompanyProfile> => {
    const { data: res } = await apiClient.patch(
      DSA.UPDATE_COMPANY_PROFILE,
      updates,
    );
    return res.data;
  },

  // ─── Agents ───────────────────────────────────────────────
  getAgents: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<Page<Agent>> => {
    const { data: res } = await apiClient.get(DSA.AGENTS, { params });
    return res.data;
  },

  getAgent: async (agentId: string): Promise<AgentDetail> => {
    const { data: res } = await apiClient.get(DSA.AGENT(agentId));
    return res.data;
  },

  inviteAgent: async (payload: {
    fullName: string;
    email: string;
  }): Promise<{ message: string }> => {
    const { data: res } = await apiClient.post(DSA.INVITE_AGENT, payload);
    return res.data;
  },

  deactivateAgent: async (agentId: string): Promise<void> => {
    await apiClient.patch(DSA.DEACTIVATE_AGENT(agentId));
  },

  reactivateAgent: async (agentId: string): Promise<void> => {
    await apiClient.patch(DSA.REACTIVATE_AGENT(agentId));
  },

  // ─── Customers ────────────────────────────────────────────
  getCustomers: async (filters?: CustomerFilters): Promise<Page<Customer>> => {
    const { data: res } = await apiClient.get(DSA.CUSTOMERS, {
      params: filters,
    });
    return res.data;
  },

  deactivateCustomer: async (
    customerId: string,
    reason: string,
  ): Promise<void> => {
    await apiClient.patch(DSA.DEACTIVATE_CUSTOMER(customerId), { reason });
  },

  reactivateCustomer: async (customerId: string): Promise<void> => {
    await apiClient.patch(DSA.REACTIVATE_CUSTOMER(customerId));
  },

  //Applcation
  getApplications: async (
    filters?: ApplicationFilters,
  ): Promise<Page<LoanApplication>> => {
    const { data: res } = await apiClient.get(DSA.APPLICATIONS, {
      params: filters,
    });
    return res.data;
  },
};
