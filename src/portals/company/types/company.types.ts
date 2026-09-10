import type { LoanType, ApplicationStatus } from "@/shared/types/api.types";

// ─── Company Profile ─────────────────────────────────────────
export interface CompanyProfile {
  id: string;
  companyName: string;
  gstin: string;
  companyCode: string;
  isActive: boolean;
  teamSummary: {
    totalAgents: number;
    activeAgents: number;
    inactiveAgents: number;
  };
  createdAt: string;
}

// ─── Field Agent ─────────────────────────────────────────────
export interface AgentStats {
  searchesThisMonth: number;
  applicationsThisMonth: number;
  expectedCommissionThisMonth: number;
}

export interface Agent {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  joinedAt: string;
  stats: AgentStats;
}

export interface AgentDetail extends Agent {
  bankAccountNumber: string;
  ifscCode: string;
  splitRule: {
    agentPercent: number;
    isDefault: boolean;
  };
  commissionSummary: {
    expectedTotal: number;
    paidTotal: number;
  };
}

// ─── Commission Split Rules ───────────────────────────────────
export interface SplitRule {
  id: string;
  fieldAgentId: string | null;
  fieldAgentName: string | null;
  productId: string | null;
  productName: string | null;
  agentPercent: number;
  isDefault: boolean;
  effectiveFrom: string;
}

// ─── Leads (M13) ─────────────────────────────────────────────
export type LeadStatus =
  | "PENDING"
  | "ASSIGNED"
  | "PROPOSAL_SENT"
  | "CONFIRMED"
  | "CLOSED"
  | "REJECTED";
export type EmploymentType =
  | "SALARIED"
  | "SELF_EMPLOYED_PROFESSIONAL"
  | "SELF_EMPLOYED_BUSINESS";

export interface LeadTimeline {
  id: string;
  type: "INFO" | "ASSIGNMENT" | "STATUS_CHANGE" | "PROPOSAL";
  title: string;
  description?: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  status: LeadStatus;
  loanType: LoanType;
  requiredAmount: number;
  interestedProduct: string;
  customerNote?: string;
  internalNotes?: string;
  createdAt: string;
  portalUser: {
    id: string;
    fullName: string;
    city: string;
    state: string;
    monthlyIncome: number;
    employmentType: EmploymentType;
    cibilScore: number;
    existingEmi: number;
  };
  fieldAgent?: {
    id: string;
    fullName: string;
  } | null;
  timeline: LeadTimeline[];
}

// ─── Customers & Applications (M08) ──────────────────────────
export interface Customer {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  isActive: boolean;
  deactivationReason?: string;
  fieldAgent: {
    id: string;
    fullName: string;
  };
  createdAt: string;
}

export interface LoanApplication {
  id: string;
  status: ApplicationStatus;
  loanType: LoanType;
  bank: {
    id: string;
    bankName: string;
  };
  product: {
    id: string;
    productName: string;
    interestRate: number;
  };
  loanAmountRequested: number;
  tenure: number;
  emi: number;
  customer: Customer;
  fieldAgent: {
    id: string;
    fullName: string;
  };
  commission?: {
    status: string;
    agentEarning: number;
    companyEarning: number;
  };
  createdAt: string;
}

// ─── Commissions (M09) ───────────────────────────────────────
export type CommissionStatus =
  | "EXPECTED"
  | "RECEIVED"
  | "PAID_TO_AGENT"
  | "ON_HOLD";

export interface Commission {
  id: string;
  status: CommissionStatus;
  grossAmount: number;
  agentEarning: number;
  companyEarning: number;
  splitRuleApplied: { agentPercent: number };
  tdsAmount: number | null;
  bank: { bankName: string };
  product: { productName: string };
  fieldAgent: { id: string; fullName: string };
  application: { id: string };
  createdAt: string;
}

export interface CommissionSummary {
  fieldAgent?: {
    expectedTotal: number;
    paidTotal: number;
    byProduct: Array<{ productName: string; totalEarning: number }>;
  };
  company?: {
    companyRetained: number;
    distributedToAgents: number;
    byAgent: Array<{ agentId: string; agentName: string; earning: number }>;
  };
}

// ─── Analytics ───────────────────────────────────────────────
export interface AgentPerformanceRow {
  agent: { id: string; fullName: string };
  searchesThisMonth: number;
  applicationsThisMonth: number;
  conversionRate: number;
  expectedCommission: number;
}

export interface TeamAnalytics {
  agents: AgentPerformanceRow[];
  periodStart: string;
  periodEnd: string;
}

export interface PipelineStage {
  stage: string;
  count: number;
  totalAmount: number;
}

export interface PipelineData {
  stages: PipelineStage[];
  generatedAt: string;
}

// ─── Paginated list wrapper ───────────────────────────────────
export interface Page<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
