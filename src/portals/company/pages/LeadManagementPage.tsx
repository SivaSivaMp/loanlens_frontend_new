import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserPlus,
  Send,
  CheckCircle2,
  Users,
  Search,
  MapPin,
  ArrowRight,
  Plus,
  Check,
  Building2,
  X,
  UserX,
} from "lucide-react";
import { useLeads, useAssignLead, useCreateLead } from "../hooks/useLeads";
import { useCompanyAgents } from "../hooks/useCompany";

import { CustomerStatusModal } from "../components/common/CustomerStatusModal";
import {
  SkeletonTable,
  SkeletonKpiCard,
  QueryError,
} from "../components/common/SkeletonCard";
import type { LoanType } from "@/shared/types/api.types";
import type { LeadStatus } from "../types/company.types";
import { useCustomer } from "../context/CustomerContext";

export const LeadManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const { isCustomerActive, toggleCustomerStatus } = useCustomer();

  const [activeFilter, setActiveFilter] = useState<
    LeadStatus | "ALL" | "INACTIVE"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openAssignLeadId, setOpenAssignLeadId] = useState<string | null>(null);
  const [statusModalCustomer, setStatusModalCustomer] = useState<{
    name: string;
    isActive: boolean;
  } | null>(null);

  // New Lead modal state
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [newLeadName, setNewLeadName] = useState("");
  const [newLeadLocation, setNewLeadLocation] = useState(
    "Bangalore, Karnataka",
  );
  const [newLeadLoanType, setNewLeadLoanType] = useState<LoanType>("HOME");
  const [newLeadAmount, setNewLeadAmount] = useState("3500000");
  const [newLeadProduct, setNewLeadProduct] = useState("HDFC Home Loan");

  // ─── Data ─────────────────────────────────────────────────
  const {
    data: leadsPage,
    isLoading: leadsLoading,
    isError: leadsError,
    refetch: refetchLeads,
  } = useLeads({
    status:
      activeFilter !== "ALL" && activeFilter !== "INACTIVE"
        ? (activeFilter as LeadStatus)
        : undefined,
    search: searchQuery || undefined,
    page,
    limit: 15,
  });

  const { data: agentsPage } = useCompanyAgents({ limit: 50 });
  const agents = agentsPage?.data ?? [];

  const assignLead = useAssignLead();
  const createLead = useCreateLead();

  const leads = leadsPage?.data ?? [];
  const totalPages = leadsPage?.pagination.totalPages ?? 1;

  const fmt = (v: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(v);

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    createLead.mutate(
      {
        loanType: newLeadLoanType,
        requiredAmount: Number(newLeadAmount) || 2500000,
        interestedProduct: newLeadProduct,
        customerNote: `Direct portal inquiry by ${newLeadName} from ${newLeadLocation}.`,
      },
      {
        onSuccess: () => {
          setIsNewLeadModalOpen(false);
          setNewLeadName("");
        },
      },
    );
  };

  // KPI counts from paginated metadata
  const totalLeads = leadsPage?.pagination.total ?? 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Lead Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Overview, qualification, and field agent assignment of incoming
            borrower inquiries.
          </p>
        </div>
        <button
          onClick={() => setIsNewLeadModalOpen(true)}
          className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Lead
        </button>
      </div>

      {/* KPI Cards */}
      {leadsLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonKpiCard key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              filter: "PENDING" as LeadStatus,
              label: "Unassigned",
              icon: <UserPlus className="w-6 h-6" />,
              iconBg: "bg-rose-50 text-rose-600",
              active: "border-rose-400 ring-2 ring-rose-500/20",
              pulse: true,
            },
            {
              filter: "ASSIGNED" as LeadStatus,
              label: "Assigned",
              icon: <Users className="w-6 h-6" />,
              iconBg: "bg-indigo-50 text-indigo-600",
              active: "border-indigo-400 ring-2 ring-indigo-500/20",
            },
            {
              filter: "PROPOSAL_SENT" as LeadStatus,
              label: "Proposal Sent",
              icon: <Send className="w-6 h-6" />,
              iconBg: "bg-blue-50 text-blue-600",
              active: "border-blue-400 ring-2 ring-blue-500/20",
            },
            {
              filter: "CONFIRMED" as LeadStatus,
              label: "Confirmed",
              icon: <CheckCircle2 className="w-6 h-6" />,
              iconBg: "bg-emerald-50 text-emerald-600",
              active: "border-emerald-400 ring-2 ring-emerald-500/20",
            },
          ].map((card) => (
            <div
              key={card.filter}
              onClick={() => {
                setActiveFilter(card.filter);
                setPage(1);
              }}
              className={`bg-white border rounded-xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer ${activeFilter === card.filter ? card.active : "border-slate-200"}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    {card.pulse && (
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                    {card.label}
                  </p>
                  <p className="text-3xl font-bold text-slate-900 mt-2">—</p>
                </div>
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
                >
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Filter & Search */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0 text-sm font-medium">
          {(
            [
              "ALL",
              "PENDING",
              "ASSIGNED",
              "PROPOSAL_SENT",
              "CONFIRMED",
              "CLOSED",
            ] as const
          ).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveFilter(tab);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${activeFilter === tab ? "bg-indigo-50 text-indigo-600 font-bold border border-indigo-200" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"}`}
            >
              {tab === "ALL" ? `All (${totalLeads})` : tab.replace("_", " ")}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, location..."
            className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Leads Table */}
      {leadsError ? (
        <QueryError message="Failed to load leads." onRetry={refetchLeads} />
      ) : leadsLoading ? (
        <SkeletonTable rows={6} cols={7} />
      ) : (
        <>
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-visible">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                    <th className="py-3 px-5">Customer</th>
                    <th className="py-3 px-4">Loan Request</th>
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Assigned To</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-slate-900 divide-y divide-slate-100">
                  {leads.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="py-12 text-center text-slate-400 text-sm"
                      >
                        No leads found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    leads.map((lead) => {
                      const customerName = lead.portalUser?.fullName ?? "—";
                      const location =
                        `${lead.portalUser?.city ?? ""}, ${lead.portalUser?.state ?? ""}`.replace(
                          /^, |, $/,
                          "",
                        );
                      const isCustActive = isCustomerActive(customerName);
                      const isDropdownOpen = openAssignLeadId === lead.id;

                      return (
                        <tr
                          key={lead.id}
                          onClick={() => navigate(`/company/leads/${lead.id}`)}
                          className={`hover:bg-slate-50/80 transition-colors cursor-pointer relative ${!isCustActive ? "opacity-80" : lead.status === "PENDING" ? "bg-rose-50/20" : ""}`}
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
                                {customerName}
                              </span>
                              {!isCustActive && (
                                <span className="bg-rose-50 text-rose-700 border border-rose-200 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3" />
                              {location}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                                {lead.loanType}
                              </span>
                              <span className="font-bold">
                                {fmt(lead.requiredAmount)}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs border border-slate-200">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              {lead.interestedProduct}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-xs text-slate-500">
                            {new Date(lead.createdAt).toLocaleDateString(
                              "en-IN",
                              { day: "2-digit", month: "short" },
                            )}
                          </td>
                          <td className="py-4 px-4 text-xs font-medium">
                            {lead.fieldAgent ? (
                              <span className="text-slate-800">
                                {lead.fieldAgent.fullName}
                              </span>
                            ) : (
                              <span className="text-rose-500 italic">
                                — Unassigned —
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase ${
                                lead.status === "PENDING"
                                  ? "bg-amber-50 text-amber-700 border-amber-200"
                                  : lead.status === "ASSIGNED"
                                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    : lead.status === "PROPOSAL_SENT"
                                      ? "bg-blue-50 text-blue-700 border-blue-200"
                                      : lead.status === "CONFIRMED"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-slate-100 text-slate-600 border-slate-200"
                              }`}
                            >
                              {lead.status.replace("_", " ")}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-right relative">
                            <div className="inline-flex items-center gap-1.5">
                              {isCustActive ? (
                                <>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenAssignLeadId(
                                        isDropdownOpen ? null : lead.id,
                                      );
                                    }}
                                    className="h-8 px-3 rounded-lg border border-indigo-300 text-indigo-600 font-semibold text-xs hover:bg-indigo-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    {lead.fieldAgent ? "Reassign" : "Assign"}{" "}
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setStatusModalCustomer({
                                        name: customerName,
                                        isActive: true,
                                      });
                                    }}
                                    className="h-8 w-8 rounded-lg border border-slate-200 text-slate-400 hover:text-rose-600 hover:border-rose-300 hover:bg-rose-50 transition-colors inline-flex items-center justify-center cursor-pointer"
                                  >
                                    <UserX className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setStatusModalCustomer({
                                      name: customerName,
                                      isActive: false,
                                    });
                                  }}
                                  className="h-8 px-3 rounded-lg border border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 font-semibold text-xs inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                                  Reactivate
                                </button>
                              )}
                            </div>

                            {/* Agent assign dropdown */}
                            {isDropdownOpen && isCustActive && (
                              <div
                                onClick={(e) => e.stopPropagation()}
                                className="absolute right-5 top-full mt-1 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 p-2 text-left animate-in fade-in zoom-in-95 duration-150"
                              >
                                <div className="px-3 py-2 border-b border-slate-100 mb-1 flex justify-between items-center">
                                  <p className="font-bold text-xs text-slate-900">
                                    Assign to Agent
                                  </p>
                                  <button
                                    onClick={() => setOpenAssignLeadId(null)}
                                    className="text-slate-400 hover:text-slate-600"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
                                  {agents.map((agent) => {
                                    const isCurrent =
                                      lead.fieldAgent?.id === agent.id;
                                    return (
                                      <div
                                        key={agent.id}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          assignLead.mutate({
                                            leadId: lead.id,
                                            fieldAgentId: agent.id,
                                          });
                                          setOpenAssignLeadId(null);
                                        }}
                                        className={`flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer group transition-colors ${isCurrent ? "bg-indigo-50/50" : ""}`}
                                      >
                                        <div>
                                          <div className="font-semibold text-xs text-slate-900">
                                            {agent.fullName}
                                          </div>
                                          <div className="text-[10px] text-slate-500">
                                            {agent.stats.applicationsThisMonth}{" "}
                                            apps this month
                                          </div>
                                        </div>
                                        {isCurrent ? (
                                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                                            Assigned
                                          </span>
                                        ) : (
                                          <span className="text-[10px] font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-50 px-2 py-0.5 rounded">
                                            Assign
                                          </span>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between py-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-sm text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="text-sm font-semibold text-slate-600 hover:text-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* New Lead Modal */}
      {isNewLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Create Direct Lead
              </h3>
              <button
                onClick={() => setIsNewLeadModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Customer Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  City / State
                </label>
                <input
                  type="text"
                  required
                  value={newLeadLocation}
                  onChange={(e) => setNewLeadLocation(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Loan Type
                  </label>
                  <select
                    value={newLeadLoanType}
                    onChange={(e) =>
                      setNewLeadLoanType(e.target.value as LoanType)
                    }
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white"
                  >
                    {(
                      [
                        "HOME",
                        "PERSONAL",
                        "BUSINESS",
                        "LAP",
                        "GOLD",
                      ] as LoanType[]
                    ).map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={newLeadAmount}
                    onChange={(e) => setNewLeadAmount(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Target Product
                </label>
                <input
                  type="text"
                  value={newLeadProduct}
                  onChange={(e) => setNewLeadProduct(e.target.value)}
                  className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewLeadModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLead.isPending}
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm disabled:opacity-60"
                >
                  {createLead.isPending ? "Creating…" : "Add Lead"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Status Modal */}
      {statusModalCustomer && (
        <CustomerStatusModal
          isOpen={!!statusModalCustomer}
          onClose={() => setStatusModalCustomer(null)}
          customerName={statusModalCustomer.name}
          isActive={statusModalCustomer.isActive}
          onConfirm={(reason) => {
            toggleCustomerStatus(statusModalCustomer.name, reason);
          }}
        />
      )}
    </div>
  );
};
