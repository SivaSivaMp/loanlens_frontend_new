// src/portals/company/api/dsaService.ts
// Service layer for all Company DSA / DSA portal API calls.
// Uses apiClient (auto-attaches COMPANY_DSA bearer token).
// Pattern mirrors authService.ts — returns typed data, no raw axios responses.

import { apiClient } from "@/shared/api/client";
import { DSA, ANALYTICS, COMMISSIONS } from "@/shared/api/endpoints";
import type {
  CompanyProfile,
  Agent,
  AgentDetail,
  SplitRule,
  Lead,
  LeadStatus,
  Customer,
  LoanApplication,
  Commission,
  CommissionSummary,
  TeamAnalytics,
  PipelineData,
  Page,
} from "../types/company.types";

// ─── Filters & Param types ───────────────────────────────────
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

// ─── Company Profile ─────────────────────────────────────────
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

  // ─── Commission Split Rules ────────────────────────────────
  getSplitRules: async (): Promise<SplitRule[]> => {
    const { data: res } = await apiClient.get(DSA.SPLIT_RULES);
    return res.data;
  },

  updateSplitRule: async (
    ruleId: string,
    agentPercent: number,
  ): Promise<SplitRule> => {
    const { data: res } = await apiClient.patch(DSA.SPLIT_RULE(ruleId), {
      agentPercent,
    });
    return res.data;
  },

  createSplitRule: async (payload: {
    fieldAgentId?: string;
    productId?: string;
    agentPercent: number;
  }): Promise<SplitRule> => {
    const { data: res } = await apiClient.post(DSA.SPLIT_RULES, payload);
    return res.data;
  },

  deleteSplitRule: async (ruleId: string): Promise<void> => {
    await apiClient.delete(DSA.SPLIT_RULE(ruleId));
  },

  // ─── Leads ────────────────────────────────────────────────
  getLeads: async (filters?: LeadFilters): Promise<Page<Lead>> => {
    const { data: res } = await apiClient.get(DSA.LEADS, { params: filters });
    return res.data;
  },

  getLead: async (leadId: string): Promise<Lead> => {
    const { data: res } = await apiClient.get(DSA.LEAD(leadId));
    return res.data;
  },

  assignLead: async (leadId: string, fieldAgentId: string): Promise<Lead> => {
    const { data: res } = await apiClient.patch(DSA.ASSIGN_LEAD(leadId), {
      fieldAgentId,
    });
    return res.data;
  },

  updateLeadStatus: async (
    leadId: string,
    status: LeadStatus,
  ): Promise<Lead> => {
    const { data: res } = await apiClient.patch(
      DSA.UPDATE_LEAD_STATUS(leadId),
      { status },
    );
    return res.data;
  },

  updateLeadNotes: async (
    leadId: string,
    internalNotes: string,
  ): Promise<Lead> => {
    const { data: res } = await apiClient.patch(DSA.LEAD(leadId), {
      internalNotes,
    });
    return res.data;
  },

  createLead: async (payload: {
    loanType: string;
    requiredAmount: number;
    interestedProduct: string;
    customerNote?: string;
    portalUserId?: string;
  }): Promise<Lead> => {
    const { data: res } = await apiClient.post(DSA.LEADS, payload);
    return res.data;
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

  // ─── Applications ─────────────────────────────────────────
  getApplications: async (
    filters?: ApplicationFilters,
  ): Promise<Page<LoanApplication>> => {
    const { data: res } = await apiClient.get(DSA.APPLICATIONS, {
      params: filters,
    });
    return res.data;
  },

  updateApplicationStatus: async (
    appId: string,
    status: string,
  ): Promise<LoanApplication> => {
    const { data: res } = await apiClient.patch(
      DSA.UPDATE_APPLICATION_STATUS(appId),
      { status },
    );
    return res.data;
  },

  // ─── Commissions ──────────────────────────────────────────
  getCommissions: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<Page<Commission>> => {
    const { data: res } = await apiClient.get(COMMISSIONS.LIST, { params });
    return res.data;
  },

  getCommissionSummary: async (): Promise<CommissionSummary> => {
    const { data: res } = await apiClient.get(COMMISSIONS.SUMMARY);
    return res.data;
  },

  // ─── Analytics ────────────────────────────────────────────
  getTeamAnalytics: async (): Promise<TeamAnalytics> => {
    const { data: res } = await apiClient.get(ANALYTICS.COMPANY_TEAM);
    return res.data;
  },

  getPipelineAnalytics: async (): Promise<PipelineData> => {
    const { data: res } = await apiClient.get(ANALYTICS.COMPANY_PIPELINE);
    return res.data;
  },
};
