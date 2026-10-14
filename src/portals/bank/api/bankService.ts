// src/portals/bank/api/bankService.ts
// Service layer for all Bank Admin API calls (M02 / M04 / M11).
// Uses apiClient (B2B JWT — BANK_ADMIN role token).

import { apiClient } from "@/shared/api/client";
import { BANK } from "@/shared/api/endpoints";
import type {
  BankProfile,
  BankProduct,
  BankPage,
  ProductFilters,
  ProductRateHistory,
  ProductAnalyticsSummary,
  ProductAnalyticsDetail,
  LoanProductFormData,
  ProductStatus,
} from "../types/bank.types";

// ─── Helper — Build query string
function toParams(obj: Record<string, unknown>) {
  const p = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v != null && v !== "") p.set(k, String(v));
  });
  return p.toString() ? `?${p.toString()}` : "";
}

//  Bank Profile
export const BankService = {
  getBankProfile: async (): Promise<BankProfile> => {
    const { data: res } = await apiClient.get(BANK.PROFILE);
    return res.data;
  },

  updateBankProfile: async (
    payload: Partial<BankProfile>,
  ): Promise<BankProfile> => {
    const { data: res } = await apiClient.patch(BANK.UPDATE_PROFILE, payload);
    return res.data;
  },

  //  M04 Products
  getProducts: async (
    filters?: ProductFilters,
  ): Promise<BankPage<BankProduct>> => {
    const qs = toParams({ ...(filters ?? {}) });
    const { data: res } = await apiClient.get(`${BANK.PRODUCTS}${qs}`);
    return res;
  },

  getProduct: async (id: string): Promise<BankProduct> => {
    const { data: res } = await apiClient.get(BANK.PRODUCT(id));
    return res.data;
  },

  createProduct: async (payload: LoanProductFormData): Promise<BankProduct> => {
    // Map wizard form data → API request shape
    const body = {
      name: payload.name,
      description: payload.description,
      loanType: payload.loanType,
      serviceableStates: payload.isPanIndia
        ? ["PAN_INDIA"]
        : payload.serviceableStates,
      rateType: payload.rateType,
      rateMin: payload.rateMin,
      rateMax: payload.rateMax,
      rateSlabs: payload.rateSlabs,
      minAmount: payload.minAmount,
      maxAmount: payload.maxAmount,
      minTenureMonths: payload.minTenureMonths,
      maxTenureMonths: payload.maxTenureMonths,
      minMonthlyIncome: payload.minMonthlyIncome,
      maxMonthlyIncome: payload.maxMonthlyIncome,
      minAge: payload.minAge,
      maxAge: payload.maxAge,
      acceptedEmployment: payload.acceptedEmployment,
      minEmploymentYears: payload.minEmploymentYears,
      minCibilScore: payload.minCibilScore,
      processingFeePercent: payload.processingFeePercent,
      commissionPercent: payload.commissionPercent,
      commissionPayoutDays: payload.commissionPayoutDays,
      commissionNotes: payload.commissionNotes,
      requiredDocuments: payload.requiredDocuments,
      ltvPercent: payload.ltvPercent,
      propertyTypes: payload.propertyTypes,
      brochureUrl: payload.brochureUrl,
      status: payload.status,
    };
    const { data: res } = await apiClient.post(BANK.CREATE_PRODUCT, body);
    return res.data;
  },

  updateProduct: async (
    id: string,
    payload: Partial<LoanProductFormData>,
  ): Promise<BankProduct> => {
    const { data: res } = await apiClient.patch(
      BANK.UPDATE_PRODUCT(id),
      payload,
    );
    return res.data;
  },

  updateProductStatus: async (
    id: string,
    status: ProductStatus,
  ): Promise<BankProduct> => {
    const { data: res } = await apiClient.patch(BANK.PRODUCT_STATUS(id), {
      status,
    });
    return res.data;
  },

  getRateHistory: async (id: string): Promise<ProductRateHistory[]> => {
    const { data: res } = await apiClient.get(BANK.PRODUCT_RATE_HISTORY(id));
    return res.data;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await apiClient.delete(BANK.PRODUCT(id));
  },

  //  M11 Analytics
  getAnalyticsProducts: async (
    month?: string,
  ): Promise<ProductAnalyticsSummary[]> => {
    const qs = month ? `?month=${month}` : "";
    const { data: res } = await apiClient.get(
      `${BANK.ANALYTICS_PRODUCTS}${qs}`,
    );
    return res.data;
  },

  getAnalyticsProduct: async (id: string): Promise<ProductAnalyticsDetail> => {
    const { data: res } = await apiClient.get(BANK.ANALYTICS_PRODUCT(id));
    return res.data;
  },
};
