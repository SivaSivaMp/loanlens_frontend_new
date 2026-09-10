import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronRight,
  MapPin,
  Building2,
  CheckCircle2,
  Send,
  Search,
  Check,
  ShieldAlert,
  Save,
  AlertTriangle,
  UserX,
} from "lucide-react";

import { useCompanyAgents } from "../hooks/useCompany";

import { CustomerStatusModal } from "../components/common/CustomerStatusModal";
import { SkeletonTable, QueryError } from "../components/common/SkeletonCard";
import type { LeadTimeline } from "../types/company.types";
import { useCustomer } from "../context/CustomerContext";
import { useAssignLead, useLead, useSaveLeadNotes } from "../hooks/useLeads";

export const LeadDetailPage: React.FC = () => {
  const { leadId } = useParams<{ leadId: string }>();
  const { isCustomerActive, toggleCustomerStatus } = useCustomer();

  const { data: lead, isLoading, isError, refetch } = useLead(leadId!);
  const { data: agentsPage } = useCompanyAgents({ limit: 50 });
  const agents = agentsPage?.data ?? [];

  const assignLead = useAssignLead();
  const saveNotes = useSaveLeadNotes();

  const [internalNotes, setInternalNotes] = useState("");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [agentSearch, setAgentSearch] = useState("");
  const [agentPage, setAgentPage] = useState(1);
  const AGENTS_PER_PAGE = 3;

  // Sync notes from API data
  const notesValue = internalNotes || lead?.internalNotes || "";

  const isCustActive = lead
    ? isCustomerActive(lead.portalUser?.fullName ?? "")
    : true;
  const customerName = lead?.portalUser?.fullName ?? "—";
  const location = lead
    ? `${lead.portalUser?.city ?? ""}, ${lead.portalUser?.state ?? ""}`.replace(
        /^, |, $/,
        "",
      )
    : "—";

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

  const filteredAgents = useMemo(
    () =>
      agents.filter((a) =>
        a.fullName.toLowerCase().includes(agentSearch.toLowerCase()),
      ),
    [agents, agentSearch],
  );
  const totalAgentPages =
    Math.ceil(filteredAgents.length / AGENTS_PER_PAGE) || 1;
  const paginatedAgents = filteredAgents.slice(
    (agentPage - 1) * AGENTS_PER_PAGE,
    agentPage * AGENTS_PER_PAGE,
  );

  const timelineIcon = (type: LeadTimeline["type"]) => {
    const base =
      "w-7 h-7 rounded-full flex items-center justify-center shrink-0";
    switch (type) {
      case "ASSIGNMENT":
        return (
          <div className={`${base} bg-indigo-100 text-indigo-600`}>
            <Send className="w-3.5 h-3.5" />
          </div>
        );
      case "STATUS_CHANGE":
        return (
          <div className={`${base} bg-rose-100 text-rose-600`}>
            <AlertTriangle className="w-3.5 h-3.5" />
          </div>
        );
      case "PROPOSAL":
        return (
          <div className={`${base} bg-blue-100 text-blue-600`}>
            <Building2 className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className={`${base} bg-slate-100 text-slate-500`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  if (isLoading) return <SkeletonTable rows={8} cols={2} />;
  if (isError)
    return (
      <QueryError message="Failed to load lead details." onRetry={refetch} />
    );
  if (!lead) return null;

  return (
    <div className="space-y-6 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <Link
          to="/company/leads"
          className="hover:text-indigo-600 transition-colors font-medium"
        >
          Leads
        </Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-slate-900 font-semibold">{customerName}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* Customer Profile Card */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <h2 className="text-slate-900 font-bold text-base">
                Customer Profile
              </h2>
              <div className="flex items-center gap-2">
                <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-indigo-200">
                  From Customer Portal
                </span>
                {isCustActive ? (
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" /> Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => setIsStatusModalOpen(true)}
                    className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Reactivate
                  </button>
                )}
              </div>
            </div>

            {!isCustActive && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5 mb-4">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-rose-800">
                    Customer Profile Inactive:
                  </span>{" "}
                  Assignment and proposal generation paused. Reactivate to
                  resume operations.
                </div>
              </div>
            )}

            <div className="mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-slate-900 text-2xl font-bold leading-tight">
                  {customerName}
                </h1>
                {!isCustActive && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
                    Inactive
                  </span>
                )}
                {isCustActive && lead.status === "PENDING" && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                    Unassigned
                  </span>
                )}
                {isCustActive && lead.fieldAgent && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Assigned → {lead.fieldAgent.fullName}
                  </span>
                )}
              </div>
              <p className="text-slate-500 text-sm flex items-center gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {location}
              </p>
            </div>

            <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-5 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
              <p className="text-slate-500 text-xs italic">
                No direct phone or email shown — borrower contact authorized
                only via customer portal proposal system.
              </p>
            </div>

            {/* Loan Request */}
            <div className="border-t border-slate-100 pt-5">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                Loan Request
              </h3>
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-slate-100 text-slate-800 text-xs font-bold px-2.5 py-1 rounded border border-slate-200">
                  {lead.loanType}
                </span>
                <span className="text-slate-900 text-xl font-bold">
                  {fmt(lead.requiredAmount)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block mb-0.5">
                    Product Interested In
                  </span>
                  <span className="font-semibold text-slate-900">
                    {lead.interestedProduct}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                  <span className="text-slate-400 text-xs block mb-0.5">
                    Employment
                  </span>
                  <span className="font-semibold text-slate-900">
                    {lead.portalUser?.employmentType?.replace("_", " ") ?? "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* Financial Snapshot */}
            <div className="border-t border-slate-100 pt-5 mt-4">
              <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3">
                Financial Profile Snapshot
              </h3>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                  <span className="text-slate-400 text-xs block mb-1">
                    Monthly Income
                  </span>
                  <span className="font-bold text-slate-900">
                    {fmt(lead.portalUser?.monthlyIncome ?? 0)}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                  <span className="text-slate-400 text-xs block mb-1">
                    CIBIL Score
                  </span>
                  <span
                    className={`font-bold text-lg ${(lead.portalUser?.cibilScore ?? 0) >= 750 ? "text-emerald-600" : "text-amber-600"}`}
                  >
                    {lead.portalUser?.cibilScore ?? "—"}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 text-center">
                  <span className="text-slate-400 text-xs block mb-1">
                    Existing EMI
                  </span>
                  <span className="font-bold text-slate-900">
                    {fmt(lead.portalUser?.existingEmi ?? 0)}/mo
                  </span>
                </div>
              </div>
            </div>

            {lead.customerNote && (
              <div className="border-t border-slate-100 pt-5 mt-4">
                <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
                  Customer Note
                </h3>
                <p className="text-sm text-slate-700 italic bg-indigo-50/40 border border-indigo-100 rounded-lg p-3">
                  "{lead.customerNote}"
                </p>
              </div>
            )}
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-3">
              Internal Notes
            </h3>
            <textarea
              rows={4}
              value={notesValue}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Add internal notes about this lead..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none bg-slate-50/50"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={() =>
                  saveNotes.mutate({ leadId: lead.id, notes: notesValue })
                }
                disabled={saveNotes.isPending}
                className={`h-9 px-4 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer ${saveNotes.isSuccess ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"} disabled:opacity-60`}
              >
                {saveNotes.isSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Saved!
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />{" "}
                    {saveNotes.isPending ? "Saving…" : "Save Note"}
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Lead Timeline
            </h3>
            <div className="space-y-4">
              {(lead.timeline ?? []).map((event) => (
                <div key={event.id} className="flex gap-3">
                  {timelineIcon(event.type)}
                  <div className="flex-1 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                    <p className="text-sm font-semibold text-slate-900">
                      {event.title}
                    </p>
                    {event.description && (
                      <p className="text-xs text-slate-500 mt-0.5">
                        {event.description}
                      </p>
                    )}
                    <p className="text-[11px] text-slate-400 mt-1">
                      {event.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column — Agent Assignment */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-xs border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-1">
              Assign Field Agent
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an available agent to handle this lead.
            </p>

            <div className="relative mb-3">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={agentSearch}
                onChange={(e) => {
                  setAgentSearch(e.target.value);
                  setAgentPage(1);
                }}
                placeholder="Search by name..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="space-y-2">
              {paginatedAgents.map((agent) => {
                const isCurrent = lead.fieldAgent?.id === agent.id;
                return (
                  <div
                    key={agent.id}
                    onClick={() => {
                      if (!isCustActive) {
                        return;
                      }
                      assignLead.mutate({
                        leadId: lead.id,
                        fieldAgentId: agent.id,
                      });
                    }}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${isCurrent ? "border-indigo-300 bg-indigo-50/60" : "border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30"} ${!isCustActive ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {agent.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-semibold text-slate-900 truncate block">
                        {agent.fullName}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        {agent.stats.applicationsThisMonth} apps this month
                      </span>
                    </div>
                    {isCurrent ? (
                      <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded shrink-0">
                        Current
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-2 py-0.5 rounded shrink-0">
                        Assign →
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {totalAgentPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setAgentPage((p) => Math.max(1, p - 1))}
                  disabled={agentPage === 1}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-40 px-2 py-1"
                >
                  ← Prev
                </button>
                <span className="text-xs text-slate-500">
                  Page {agentPage} of {totalAgentPages}
                </span>
                <button
                  onClick={() =>
                    setAgentPage((p) => Math.min(totalAgentPages, p + 1))
                  }
                  disabled={agentPage === totalAgentPages}
                  className="text-xs font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-40 px-2 py-1"
                >
                  Next →
                </button>
              </div>
            )}

            {assignLead.isPending && (
              <p className="text-xs text-center text-indigo-600 font-medium mt-3 animate-pulse">
                Assigning agent…
              </p>
            )}
          </div>
        </div>
      </div>

      <CustomerStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        customerName={customerName}
        isActive={isCustActive}
        onConfirm={(reason) => {
          toggleCustomerStatus(customerName, reason);
        }}
      />
    </div>
  );
};
