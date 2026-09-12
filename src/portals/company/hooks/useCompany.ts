import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DsaService } from "../api/dsaService";

//  Query Keys
export const companyKeys = {
  profile: ["company", "profile"] as const,
  agents: (params?: object) => ["company", "agents", params] as const,
  agent: (id: string) => ["company", "agent", id] as const,
  splitRules: ["company", "split-rules"] as const,
};

//  Company Profile
export function useCompanyProfile() {
  return useQuery({
    queryKey: companyKeys.profile,
    queryFn: DsaService.getCompanyProfile,
    staleTime: 5 * 60 * 1000, // 5 min — profile rarely changes
  });
}

//  Agent List
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

//  Single Agent
export function useCompanyAgent(agentId: string) {
  return useQuery({
    queryKey: companyKeys.agent(agentId),
    queryFn: () => DsaService.getAgent(agentId),
    enabled: !!agentId,
    staleTime: 30_000,
  });
}

//  Invite Agent
export function useInviteAgent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fullName, email }: { fullName: string; email: string }) =>
      DsaService.inviteAgent({ fullName, email }),
    onSuccess: () => {
      toast.success("Invite sent successfully!");
      queryClient.invalidateQueries({ queryKey: companyKeys.agents() });
    },
    onError: () => {
      toast.error("Failed to send invite. Please try again.");
    },
  });
}

//  Deactivate Agent
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

//  Reactivate Agent
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

//  Split Rules
export function useSplitRules() {
  return useQuery({
    queryKey: companyKeys.splitRules,
    queryFn: DsaService.getSplitRules,
    staleTime: 60_000,
  });
}

export function useUpdateSplitRule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      ruleId,
      agentPercent,
    }: {
      ruleId: string;
      agentPercent: number;
    }) => DsaService.updateSplitRule(ruleId, agentPercent),
    onSuccess: () => {
      toast.success("Commission split rule updated.");
      queryClient.invalidateQueries({ queryKey: companyKeys.splitRules });
    },
    onError: () => {
      toast.error("Failed to update split rule.");
    },
  });
}
