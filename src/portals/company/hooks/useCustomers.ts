import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DsaService } from "../api/dsaService";
import type { CustomerFilters, ApplicationFilters } from "../api/dsaService";

// ─── Query Keys ──────────────────────────────────────────────
export const customerKeys = {
  all: ["customers"] as const,
  list: (filters?: CustomerFilters) => ["customers", "list", filters] as const,
  detail: (id: string) => ["customers", "detail", id] as const,
};

export const applicationKeys = {
  all: ["applications"] as const,
  list: (filters?: ApplicationFilters) =>
    ["applications", "list", filters] as const,
};

// ─── Customer List ────────────────────────────────────────────
export function useCustomers(filters?: CustomerFilters) {
  return useQuery({
    queryKey: customerKeys.list(filters),
    queryFn: () => DsaService.getCustomers(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

// ─── Deactivate Customer ──────────────────────────────────────
export function useDeactivateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      customerId,
      reason,
    }: {
      customerId: string;
      reason: string;
    }) => DsaService.deactivateCustomer(customerId, reason),
    onSuccess: () => {
      toast.success("Customer deactivated.");
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
    onError: () => {
      toast.error("Failed to deactivate customer.");
    },
  });
}

// ─── Reactivate Customer ─────────────────────────────────────
export function useReactivateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (customerId: string) =>
      DsaService.reactivateCustomer(customerId),
    onSuccess: () => {
      toast.success("Customer reactivated.");
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
    onError: () => {
      toast.error("Failed to reactivate customer.");
    },
  });
}

// ─── Application List ─────────────────────────────────────────
export function useApplications(filters?: ApplicationFilters) {
  return useQuery({
    queryKey: applicationKeys.list(filters),
    queryFn: () => DsaService.getApplications(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
