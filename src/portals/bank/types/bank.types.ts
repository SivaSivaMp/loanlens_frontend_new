import type { LoanType } from "@/shared/types/api.types";

//  Re-export form types
export type { LoanType };
export type EmploymentType = "SALARIED" | "SELF_EMPLOYED" | "BOTH";
export type RateType = "FIXED" | "FLOATING" | "BOTH";
export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";
export type BankType = "BANK" | "NBFC" | "HFC";

//  Rate Slab
export interface RateSlabItem {
  id: string;
  minAmount: number;
  maxAmount: number;
  ratePercent: number;
  label?: string;
}

//  Wizard Form Data
export interface LoanProductFormData {
  // Step 1
  name: string;
  loanType: LoanType;
  description: string;
  brochureName?: string;
  brochureUrl?: string;
  // Step 2
  isPanIndia: boolean;
  serviceableStates: string[];
  branchCoverageNotes?: string;
  // Step 3
  minMonthlyIncome: number;
  maxMonthlyIncome?: number;
  minAge: number;
  maxAge: number;
  acceptedEmployment: EmploymentType[];
  minEmploymentYears: number;
  minCibilScore: number;
  // Step 4
  rateType: RateType;
  rateMin: number;
  rateMax: number;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  rateSlabs: RateSlabItem[];
  ltvPercent?: number;
  propertyTypes?: string[];
  // Step 5
  processingFeePercent: number;
  commissionPercent: number;
  commissionPayoutDays: number;
  commissionNotes?: string;
  // Step 6
  requiredDocuments: string[];
  status: ProductStatus;
}

export const initialWizardData: LoanProductFormData = {
  name: "",
  loanType: "HOME",
  description: "",
  brochureName: "",
  brochureUrl: "",
  isPanIndia: true,
  serviceableStates: ["PAN_INDIA"],
  branchCoverageNotes: "",
  minMonthlyIncome: 25000,
  maxMonthlyIncome: undefined,
  minAge: 21,
  maxAge: 60,
  acceptedEmployment: ["SALARIED", "SELF_EMPLOYED"],
  minEmploymentYears: 2,
  minCibilScore: 700,
  rateType: "FLOATING",
  rateMin: 8.5,
  rateMax: 9.85,
  minAmount: 500000,
  maxAmount: 50000000,
  minTenureMonths: 60,
  maxTenureMonths: 360,
  rateSlabs: [
    {
      id: "1",
      minAmount: 0,
      maxAmount: 3000000,
      ratePercent: 8.5,
      label: "Up to ₹30L",
    },
    {
      id: "2",
      minAmount: 3000000,
      maxAmount: 7500000,
      ratePercent: 8.75,
      label: "₹30L–₹75L",
    },
    {
      id: "3",
      minAmount: 7500000,
      maxAmount: 50000000,
      ratePercent: 9.85,
      label: "Above ₹75L",
    },
  ],
  ltvPercent: 80,
  propertyTypes: ["Residential", "Under Construction"],
  processingFeePercent: 0.5,
  commissionPercent: 0.5,
  commissionPayoutDays: 30,
  commissionNotes: "Standard 30-day post-disbursement payout agreement.",
  requiredDocuments: [
    "PAN Card",
    "Aadhaar Card",
    "Last 3 Months Salary Slips",
    "6 Months Bank Statement",
    "Property Documents (Draft)",
    "IT Returns (2 Years)",
    "Form 16",
  ],
  status: "ACTIVE",
};

//  Bank Profile
export interface BankProfile {
  id: string;
  name: string;
  type: BankType;
  logoUrl: string | null;
  gstin: string | null;
  licenceNumber: string | null;
  contactEmail: string;
  contactPhone: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

//  Bank Product
export interface BankProduct {
  id: string;
  name: string;
  bank?: { id: string; name: string; logoUrl: string | null };
  loanType: LoanType;
  status: ProductStatus;
  serviceableStates: string[];
  rateType: RateType;
  rateMin: number;
  rateMax: number;
  rateSlabs: RateSlabItem[];
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
  minMonthlyIncome: number;
  maxMonthlyIncome: number | null;
  minAge: number;
  maxAge: number;
  acceptedEmployment: EmploymentType[];
  minEmploymentYears: number;
  minCibilScore: number;
  processingFeePercent: number;
  commissionPercent: number;
  commissionPayoutDays: number;
  commissionNotes: string | null;
  requiredDocuments: string[];
  ltvPercent: number | null;
  propertyTypes: string[];
  brochureUrl: string | null;
  description: string | null;
  impressions?: number;
  applications?: number;
  createdAt: string;
  updatedAt: string;
}

//  Rate History
export interface ProductRateHistory {
  id: string;
  oldRateMin: number | null;
  oldRateMax: number | null;
  newRateMin: number;
  newRateMax: number;
  changedBy: { id: string; email: string };
  notes: string | null;
  changedAt: string;
}

//  Analytics
export interface ProductAnalyticsSummary {
  product: { id: string; name: string; loanType: LoanType };
  impressions: number;
  comparisons: number;
  applications: number;
  conversionRate: number;
  trend: { impressionsChange: number; applicationsChange: number };
}

export interface ProductAnalyticsDetail {
  product: { id: string; name: string };
  impressions: number;
  comparisons: number;
  applications: number;
  monthlyBreakdown: {
    month: string;
    impressions: number;
    applications: number;
  }[];
  topStates: { state: string; impressions: number }[];
}

//  Paginated response wrapper
export interface BankPage<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

//  Filters
export interface ProductFilters {
  loanType?: LoanType;
  status?: ProductStatus;
  search?: string;
  page?: number;
  limit?: number;
}
