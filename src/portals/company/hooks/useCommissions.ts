// src/portals/company/hooks/useCommissions.ts
// React Query hooks for Commission data (M09).

import { useQuery } from '@tanstack/react-query'
import { DsaService } from '../api/dsaService'

export const commissionKeys = {
  all: ['commissions'] as const,
  list: (params?: object) => ['commissions', 'list', params] as const,
  summary: ['commissions', 'summary'] as const,
}

export function useCommissions(params?: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: commissionKeys.list(params),
    queryFn: () => DsaService.getCommissions(params),
    staleTime: 60_000,
    placeholderData: (prev) => prev,
  })
}

export function useCommissionSummary() {
  return useQuery({
    queryKey: commissionKeys.summary,
    queryFn: DsaService.getCommissionSummary,
    staleTime: 60_000,
  })
}
