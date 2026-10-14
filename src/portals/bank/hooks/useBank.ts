import { useQuery } from "@tanstack/react-query";
import { BankService } from "../api/bankService";

export const bankKeys = {
  profile: ["bank-profile"] as const,
  analyticsProducts: (month?: string) =>
    ["bank-analytics", "products", month] as const,
  analyticsProduct: (id: string) => ["bank-analytics", "product", id] as const,
};

export function useBankProfile() {
  return useQuery({
    queryKey: bankKeys.profile,
    queryFn: BankService.getBankProfile,
    staleTime: 5 * 60 * 1000, // profile is stable
  });
}

export function useBankAnalyticsProducts(month?: string) {
  return useQuery({
    queryKey: bankKeys.analyticsProducts(month),
    queryFn: () => BankService.getAnalyticsProducts(month),
    staleTime: 5 * 60 * 1000,
  });
}
