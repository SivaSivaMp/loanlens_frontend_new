import { useQuery } from "@tanstack/react-query";
import { DsaService } from "../api/dsaService";

export const analyticsKeys = {
  team: ["analytics", "team"] as const,
  pipeline: ["analytics", "pipeline"] as const,
};

export function useTeamAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.team,
    queryFn: DsaService.getTeamAnalytics,
    staleTime: 5 * 60 * 1000, // analytics can be slightly stale
  });
}

export function usePipelineAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.pipeline,
    queryFn: DsaService.getPipelineAnalytics,
    staleTime: 5 * 60 * 1000,
  });
}
