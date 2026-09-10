import { DsaService } from "../api/dsaService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

//query keys
export const companyKeys = {
  profile: ["company", "profile"] as const,
  agents: (params?: object) => ["company", "agents", params] as const,
  agent: (id: string) => ["company", "agent", id] as const,
  splitRules: ["company", "split-rules"] as const,
};

//company profile

export function useCompanyProfile() {
  return useQuery({
    queryKey: companyKeys.profile,
    queryFn: DsaService.getCompanyProfile,
    staleTime: 5 * 60 * 1000, // 5 min — profile rarely changes
  });
}

//agent list

export function useCompanyAgents(params?: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  return useQuery({
    queryKey: companyKeys.agents(params),
    queryFn: () => DsaService.getAgents(params),
    staleTime: 30_000,
  });
}

//sing agent

export function useCompanyAgent(agentId: string) {
  return useQuery({
    queryKey: companyKeys.agent(agentId),
    queryFn: () => DsaService.getAgent(agentId),
    enabled: !!agentId,
    staleTime: 30_000,
  });
}

//Deactivate Agent
export function useDeactivateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => DsaService.deactivateAgent(agentId),
    onSuccess: (_, agentId) => {
      toast.success("Agent deactivated.");
      queryClient.invalidateQueries({ queryKey: companyKeys.agents() });
      queryClient.invalidateQueries({ queryKey: companyKeys.agent(agentId) });
    },
    onError: () => {
      toast.error("Failed to deactivate agent.");
    },
  });
}

//Reactivate Agent

export function useReactivateAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (agentId: string) => DsaService.reactivateAgent(agentId),
    onSuccess: (_, agentId) => {
      toast.success("Agent reactivated.");
      queryClient.invalidateQueries({ queryKey: companyKeys.agents() });
      queryClient.invalidateQueries({ queryKey: companyKeys.agent(agentId) });
    },
    onError: () => {
      toast.error("Failed to reactivate agent.");
    },
  });
}
