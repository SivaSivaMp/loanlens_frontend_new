import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { DsaService } from "../api/dsaService";
import type { LeadFilters } from "../api/dsaService";
import type { Lead, LeadStatus } from "../types/company.types";

// ─── Query Keys
export const leadKeys = {
  all: ["leads"] as const,
  list: (filters?: LeadFilters) => ["leads", "list", filters] as const,
  detail: (id: string) => ["leads", "detail", id] as const,
};

// ─── Lead List
export function useLeads(filters?: LeadFilters) {
  return useQuery({
    queryKey: leadKeys.list(filters),
    queryFn: () => DsaService.getLeads(filters),
    staleTime: 30_000,
    placeholderData: (prev) => prev, // keep old data while refetching
  });
}

// ─── Single Lead
export function useLead(leadId: string) {
  return useQuery({
    queryKey: leadKeys.detail(leadId),
    queryFn: () => DsaService.getLead(leadId),
    enabled: !!leadId,
    staleTime: 30_000,
  });
}

// ─── Assign Lead (with optimistic update)
export function useAssignLead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      leadId,
      fieldAgentId,
    }: {
      leadId: string;
      fieldAgentId: string;
    }) => DsaService.assignLead(leadId, fieldAgentId),

    onMutate: async ({ leadId, fieldAgentId }) => {
      await queryClient.cancelQueries({ queryKey: leadKeys.all });

      const snapshot = queryClient.getQueriesData<{ data: Lead[] }>({
        queryKey: leadKeys.all,
      });

      queryClient.setQueriesData<{ data: Lead[]; pagination: unknown }>(
        { queryKey: leadKeys.all },
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((l) =>
              l.id === leadId
                ? {
                    ...l,
                    status: "ASSIGNED" as LeadStatus,
                    fieldAgent: { id: fieldAgentId, fullName: "Assigning…" },
                  }
                : l,
            ),
          };
        },
      );

      return { snapshot };
    },

    // On success — server returned real lead → update detail cache
    onSuccess: (updatedLead) => {
      toast.success(
        `Lead assigned to ${updatedLead.fieldAgent?.fullName ?? "agent"}.`,
      );
      queryClient.setQueryData(leadKeys.detail(updatedLead.id), updatedLead);
      // Refetch list to get accurate server state
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },

    // On error — roll back optimistic update
    onError: (_err, _vars, context) => {
      toast.error("Failed to assign lead. Please try again.");
      if (context?.snapshot) {
        context.snapshot.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
  });
}

// ─── Update Lead Status
export function useUpdateLeadStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, status }: { leadId: string; status: LeadStatus }) =>
      DsaService.updateLeadStatus(leadId, status),
    onSuccess: (updatedLead) => {
      toast.success("Lead status updated.");
      queryClient.setQueryData(leadKeys.detail(updatedLead.id), updatedLead);
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: () => {
      toast.error("Failed to update lead status.");
    },
  });
}

// ─── Save Lead Notes
export function useSaveLeadNotes() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, notes }: { leadId: string; notes: string }) =>
      DsaService.updateLeadNotes(leadId, notes),
    onSuccess: (updatedLead) => {
      toast.success("Note saved.");
      queryClient.setQueryData(leadKeys.detail(updatedLead.id), updatedLead);
    },
    onError: () => {
      toast.error("Failed to save note.");
    },
  });
}

// ─── Create Lead
export function useCreateLead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof DsaService.createLead>[0]) =>
      DsaService.createLead(payload),
    onSuccess: (newLead) => {
      toast.success(
        `Lead created for ${newLead.portalUser?.fullName ?? "new customer"}.`,
      );
      queryClient.invalidateQueries({ queryKey: leadKeys.all });
    },
    onError: () => {
      toast.error("Failed to create lead.");
    },
  });
}
