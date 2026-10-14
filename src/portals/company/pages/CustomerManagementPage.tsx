// src/portals/company/pages/CustomerManagementPage.tsx
// Displays all portal-registered customers visible to this DSA.
// Allows activate/deactivate (portal access) and "Convert to Lead".

import React, { useState } from "react";
import {
  Search,
  X,
  UserPlus,
  CheckCircle2,
  AlertTriangle,
  Users,
  UserCheck,
  TrendingUp,
  ExternalLink,
  Shield,
  ShieldOff,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  usePortalCustomers,
  useToggleCustomerStatus,
} from "../hooks/useCustomers";
import { SkeletonTable, QueryError } from "@/shared/components/blocks/SkeletonCard";
import { ConvertToLeadModal } from "../components/common/ConvertToLeadModal";
import type { PortalCustomer } from "../types/company.types";

// ─── Lead Status Badge ────────────────────────────────────────────────────────
const LEAD_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  ASSIGNED: "bg-blue-50 text-blue-700 border-blue-200",
  PROPOSAL_SENT: "bg-violet-50 text-violet-700 border-violet-200",
  CONFIRMED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CLOSED: "bg-slate-50 text-slate-500 border-slate-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

const fmt = (d: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(d));

export const CustomerManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [leadFilter, setLeadFilter] = useState<"ALL" | "HAS_LEAD" | "NO_LEAD">(
    "ALL",
  );

  // Modal state
  const [convertModal, setConvertModal] = useState<{
    portalUserId: string;
    customerName: string;
  } | null>(null);
  const [statusModal, setStatusModal] = useState<{
    customer: PortalCustomer;
    nextState: boolean;
  } | null>(null);
  const [deactivateReason, setDeactivateReason] = useState("");

  const filters = {
    page,
    limit: 5,
    search: search || undefined,

    isActive:
      activeFilter === "ACTIVE"
        ? true
        : activeFilter === "INACTIVE"
          ? false
          : undefined,
  };

  const { data, isLoading, isError, refetch } = usePortalCustomers(filters);
  const toggleStatus = useToggleCustomerStatus();

  const customers = data?.data ?? [];
  const pagination = data?.pagination;

  // KPI totals come from pagination + data scan
  const totalCustomers = pagination?.total ?? 0;
  const activeCount = customers.filter((c) => c.isActive).length;
  const leadCount = customers.filter((c) => c.hasLead).length;

  // Client-side lead filter (since backend doesn't handle this yet)
  const visibleCustomers =
    leadFilter === "HAS_LEAD"
      ? customers.filter((c) => c.hasLead)
      : leadFilter === "NO_LEAD"
        ? customers.filter((c) => !c.hasLead)
        : customers;

  const handleConfirmStatus = () => {
    if (!statusModal) return;
    toggleStatus.mutate(
      { id: statusModal.customer.id, isActive: statusModal.nextState },
      {
        onSuccess: () => {
          setStatusModal(null);
          setDeactivateReason("");
        },
      },
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Customer Management
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Portal-registered customers. Review, activate/deactivate portal
          access, and convert qualified customers into leads.
        </p>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Registered",
            value: totalCustomers,
            icon: Users,
            color: "text-slate-600",
            bg: "bg-slate-100",
          },
          {
            label: "Active Customers",
            value: activeCount,
            icon: UserCheck,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Converted to Lead",
            value: leadCount,
            icon: TrendingUp,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
          },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 shadow-xs"
          >
            <div
              className={`w-11 h-11 rounded-xl ${kpi.bg} flex items-center justify-center shrink-0`}
            >
              <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{kpi.value}</p>
              <p className="text-xs text-slate-500">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status filter */}
          {(["ALL", "ACTIVE", "INACTIVE"] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                setActiveFilter(f);
                setPage(1);
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                activeFilter === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"
              }`}
            >
              {f === "ALL"
                ? "All Customers"
                : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}

          <span className="text-slate-300 text-sm">|</span>

          {/* Lead filter */}
          {(["ALL", "HAS_LEAD", "NO_LEAD"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setLeadFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                leadFilter === f
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {f === "ALL"
                ? "All"
                : f === "HAS_LEAD"
                  ? "Has Lead ✓"
                  : "No Lead Yet"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, email, phone…"
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={8} cols={6} />
      ) : isError ? (
        <QueryError message="Failed to load customers." onRetry={refetch} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Registered</th>
                  <th className="py-3 px-4">Portal Status</th>
                  <th className="py-3 px-4">Lead Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {visibleCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-14 text-center text-slate-500 text-sm"
                    >
                      No customers match your filters.
                    </td>
                  </tr>
                ) : (
                  visibleCustomers.map((customer) => {
                    const initials = customer.fullName
                      .slice(0, 2)
                      .toUpperCase();
                    return (
                      <tr
                        key={customer.id}
                        className={`hover:bg-slate-50/80 transition-colors ${!customer.isActive ? "opacity-70" : ""}`}
                      >
                        {/* Name + Email */}
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-semibold text-slate-900">
                                  {customer.fullName}
                                </span>
                                {!customer.emailVerified && (
                                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                    Unverified
                                  </span>
                                )}
                              </div>
                              <span className="text-[11px] text-slate-500">
                                {customer.email}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Phone */}
                        <td className="py-4 px-4 text-sm text-slate-700">
                          {customer.phone ?? (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>

                        {/* Joined */}
                        <td className="py-4 px-4 text-sm text-slate-500">
                          {fmt(customer.createdAt)}
                        </td>

                        {/* Portal Active/Inactive */}
                        <td className="py-4 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                              customer.isActive
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : "bg-rose-50 text-rose-700 border-rose-200"
                            }`}
                          >
                            {customer.isActive ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <AlertTriangle className="w-3 h-3" />
                            )}
                            {customer.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>

                        {/* Lead Status */}
                        <td className="py-4 px-4">
                          {customer.hasLead ? (
                            <button
                              onClick={() =>
                                navigate("/company/leads", {
                                  state: { highlightLeadId: customer.leadId },
                                })
                              }
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border cursor-pointer hover:ring-1 hover:ring-indigo-300 transition-all ${
                                LEAD_STATUS_COLORS[
                                  customer.leadStatus ?? "PENDING"
                                ] ??
                                "bg-slate-50 text-slate-600 border-slate-200"
                              }`}
                            >
                              <ExternalLink className="w-3 h-3" />
                              Lead ·{" "}
                              {customer.leadStatus?.charAt(0) +
                                (customer.leadStatus?.slice(1).toLowerCase() ??
                                  "")}
                            </button>
                          ) : (
                            <span className="text-[11px] text-slate-400 font-medium">
                              No lead yet
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {/* Convert to Lead — only if no lead yet */}
                            {!customer.hasLead && (
                              <button
                                onClick={() =>
                                  setConvertModal({
                                    portalUserId: customer.id,
                                    customerName: customer.fullName,
                                  })
                                }
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors cursor-pointer"
                              >
                                <UserPlus className="w-3.5 h-3.5" />
                                Convert
                              </button>
                            )}

                            {/* Activate / Deactivate portal access */}
                            <button
                              onClick={() =>
                                setStatusModal({
                                  customer,
                                  nextState: !customer.isActive,
                                })
                              }
                              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border rounded-lg transition-colors cursor-pointer ${
                                customer.isActive
                                  ? "text-rose-600 border-rose-200 hover:bg-rose-50"
                                  : "text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                              }`}
                            >
                              {customer.isActive ? (
                                <>
                                  <ShieldOff className="w-3.5 h-3.5" />
                                  Deactivate
                                </>
                              ) : (
                                <>
                                  <Shield className="w-3.5 h-3.5" />
                                  Reactivate
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages} ·{" "}
                {pagination.total} customers
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="h-8 px-3 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(pagination.totalPages, p + 1))
                  }
                  disabled={pagination.page >= pagination.totalPages}
                  className="h-8 px-3 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Convert to Lead Modal */}
      {convertModal && (
        <ConvertToLeadModal
          portalUserId={convertModal.portalUserId}
          customerName={convertModal.customerName}
          onClose={() => setConvertModal(null)}
        />
      )}

      {/* Activate / Deactivate Confirm Modal */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  !statusModal.nextState
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {statusModal.nextState ? "Reactivate" : "Deactivate"}{" "}
                  {statusModal.customer.fullName}?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {statusModal.nextState
                    ? "The customer will regain access to the portal."
                    : "The customer will be immediately logged out and blocked from the portal."}
                </p>
              </div>
            </div>

            {!statusModal.nextState && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                  Reason (required)
                </label>
                <textarea
                  rows={2}
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Enter reason for deactivation…"
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  setStatusModal(null);
                  setDeactivateReason("");
                }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmStatus}
                disabled={
                  (!statusModal.nextState && !deactivateReason.trim()) ||
                  toggleStatus.isPending
                }
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50 ${
                  !statusModal.nextState
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {toggleStatus.isPending
                  ? "Processing…"
                  : statusModal.nextState
                    ? "Yes, Reactivate"
                    : "Yes, Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
