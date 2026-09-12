import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  UserPlus,
  Copy,
  Check,
  X,
  ChevronDown,
  Mail,
  AlertTriangle,
  Shield,
} from "lucide-react";
import {
  useCompanyAgents,
  useInviteAgent,
  useDeactivateAgent,
  useReactivateAgent,
} from "../hooks/useCompany";
import { SkeletonTable, QueryError } from "../components/common/SkeletonCard";
import type { Agent } from "../types/company.types";

export const TeamManagementPage: React.FC = () => {
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");
  const [codeCopied, setCodeCopied] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteSent, setInviteSent] = useState(false);
  const [toggleModal, setToggleModal] = useState<{ agent: Agent } | null>(null);

  const { data, isLoading, isError, refetch } = useCompanyAgents({
    page,
    limit: 20,
  });
  const inviteAgent = useInviteAgent();
  const deactivateAgent = useDeactivateAgent();
  const reactivateAgent = useReactivateAgent();

  const agents = data?.data ?? [];
  const pagination = data?.pagination;

  const copyCode = () => {
    navigator.clipboard.writeText("FINS-7823").catch(() => {});
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleToggleStatus = () => {
    if (!toggleModal) return;
    const { agent } = toggleModal;
    if (agent.isActive) {
      deactivateAgent.mutate(agent.id);
    } else {
      reactivateAgent.mutate(agent.id);
    }
    setToggleModal(null);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    inviteAgent.mutate(
      { fullName: inviteName, email: inviteEmail },
      {
        onSuccess: () => {
          setInviteSent(true);
          setTimeout(() => {
            setIsInviteOpen(false);
            setInviteEmail("");
            setInviteName("");
            setInviteSent(false);
          }, 1800);
        },
      },
    );
  };

  const filteredAgents = agents.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      a.fullName.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q);
    const matchesStatus =
      statusFilter === "ALL"
        ? true
        : statusFilter === "ACTIVE"
          ? a.isActive
          : !a.isActive;
    return matchesSearch && matchesStatus;
  });

  const activeCount = agents.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Team Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your field agent roster, track performance, and invite new
            members.
          </p>
        </div>
        <button
          onClick={() => setIsInviteOpen(true)}
          className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <UserPlus className="w-4 h-4" /> Invite Agent
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Total Agents
          </p>
          <p className="text-3xl font-bold text-slate-900">
            {pagination?.total ?? agents.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Active
          </p>
          <p className="text-3xl font-bold text-emerald-600">{activeCount}</p>
        </div>
        <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-xs">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            Company Invite Code
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="font-mono font-bold text-indigo-700 text-lg tracking-widest">
              FINS-7823
            </span>
            <button
              onClick={copyCode}
              className="p-1.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors cursor-pointer"
            >
              {codeCopied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Agents use this code during registration
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
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
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as typeof statusFilter);
              setPage(1);
            }}
            className="appearance-none pl-3 pr-8 py-2 text-sm font-medium border border-slate-200 rounded-lg bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>
          <ChevronDown className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {isLoading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : isError ? (
        <QueryError message="Failed to load agents." onRetry={refetch} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-5">Agent</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Active Leads</th>
                  <th className="py-3 px-4">Conv. Rate</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAgents.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-slate-500 text-sm"
                    >
                      No agents match your search.
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map((agent) => (
                    <tr
                      key={agent.id}
                      onClick={() => navigate(`/company/team/${agent.id}`)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${!agent.isActive ? "opacity-70" : ""}`}
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                            {agent.fullName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-sm text-slate-900">
                              {agent.fullName}
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {agent.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-bold text-slate-400">
                          —
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm font-semibold text-slate-900">
                        {agent.stats.applicationsThisMonth}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm font-bold text-slate-400">
                          —
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        {agent.isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/company/team/${agent.id}`);
                            }}
                            className="h-8 px-3 text-xs font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
                          >
                            View Detail
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setToggleModal({ agent });
                            }}
                            disabled={
                              deactivateAgent.isPending ||
                              reactivateAgent.isPending
                            }
                            className={`h-8 px-3 text-xs font-semibold rounded-lg border transition-colors cursor-pointer disabled:opacity-50 ${agent.isActive ? "text-rose-600 border-rose-200 hover:bg-rose-50" : "text-emerald-700 border-emerald-300 hover:bg-emerald-50"}`}
                          >
                            {deactivateAgent.isPending ||
                            reactivateAgent.isPending
                              ? "Processing…"
                              : agent.isActive
                                ? "Deactivate"
                                : "Reactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages} &middot;{" "}
                {pagination.total} agents
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

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900">
                Invite Field Agent
              </h3>
              <button
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {inviteSent ? (
              <div className="py-8 flex flex-col items-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <Check className="w-7 h-7 text-emerald-600" />
                </div>
                <p className="font-semibold text-slate-900">Invite Sent!</p>
                <p className="text-sm text-slate-500">
                  Email with company code sent to <strong>{inviteEmail}</strong>
                  .
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendInvite} className="space-y-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Agent Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Menon"
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="agent@email.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50/60 border border-indigo-100 rounded-xl">
                  <Mail className="w-4 h-4 text-indigo-500 shrink-0" />
                  <p className="text-[11px] text-indigo-700">
                    Email includes company code{" "}
                    <span className="font-mono font-bold">FINS-7823</span> +
                    registration instructions.
                  </p>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsInviteOpen(false)}
                    className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={inviteAgent.isPending}
                    className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg shadow-sm cursor-pointer"
                  >
                    {inviteAgent.isPending ? "Sending\u2026" : "Send Invite"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Toggle Status Confirmation Modal */}
      {toggleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 animate-in zoom-in-95 duration-150 space-y-4">
            <div className="flex items-start gap-3">
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                  toggleModal.agent.isActive
                    ? "bg-rose-100 text-rose-600"
                    : "bg-emerald-100 text-emerald-600"
                }`}
              >
                {toggleModal.agent.isActive ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {toggleModal.agent.isActive ? "Deactivate" : "Reactivate"}{" "}
                  {toggleModal.agent.fullName}?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {toggleModal.agent.isActive
                    ? "This agent will lose login access and cannot be assigned new leads."
                    : "This agent will regain access and can be assigned leads again."}
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setToggleModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleStatus}
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer ${
                  toggleModal.agent.isActive
                    ? "bg-rose-600 hover:bg-rose-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                Yes, {toggleModal.agent.isActive ? "Deactivate" : "Reactivate"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
