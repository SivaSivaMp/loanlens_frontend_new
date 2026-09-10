// src/portals/company/pages/AgentDetailPage.tsx
import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Mail,
  Phone,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  IndianRupee,
  Search,
  X,
} from 'lucide-react'
import { useCompanyAgent, useDeactivateAgent, useReactivateAgent, useUpdateSplitRule } from '../hooks/useCompany'
import { SkeletonTable, QueryError } from '../components/common/SkeletonCard'

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtINR = (n: number) =>
  n >= 100000
    ? `\u20b9${(n / 100000).toFixed(1)}L`
    : `\u20b9${n.toLocaleString('en-IN')}`

type AppStatus = 'APPLIED' | 'PROCESSING' | 'APPROVED' | 'REJECTED'

interface RecentApp {
  id: string
  customerName: string
  bank: string
  product: string
  amount: number
  status: AppStatus
  date: string
}

const statusConfig: Record<AppStatus, { label: string; cls: string }> = {
  APPLIED:    { label: 'Applied',    cls: 'bg-blue-100 text-blue-700' },
  PROCESSING: { label: 'Processing', cls: 'bg-amber-100 text-amber-700' },
  APPROVED:   { label: 'Approved',   cls: 'bg-emerald-100 text-emerald-700' },
  REJECTED:   { label: 'Rejected',   cls: 'bg-rose-100 text-rose-700' },
}

const AppStatusBadge: React.FC<{ status: AppStatus }> = ({ status }) => {
  const cfg = statusConfig[status]
  return (
    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${cfg.cls}`}>
      {cfg.label}
    </span>
  )
}

// ─── SVG Donut ────────────────────────────────────────────────────────────────
const DonutChart: React.FC<{ agentPct: number }> = ({ agentPct }) => {
  const r = 40
  const circ = 2 * Math.PI * r
  const agentDash = (agentPct / 100) * circ
  const companyDash = circ - agentDash
  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e0e7ff" strokeWidth="16" />
      <circle
        cx="50" cy="50" r={r}
        fill="none"
        stroke="#4f46e5"
        strokeWidth="16"
        strokeDasharray={`${agentDash} ${companyDash}`}
        strokeDashoffset={circ / 4}
        strokeLinecap="round"
      />
      <text x="50" y="47" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1e1b4b">{agentPct}%</text>
      <text x="50" y="60" textAnchor="middle" fontSize="7" fill="#6b7280">Agent</text>
    </svg>
  )
}

// ─── Static recent apps (phase 2 will use real endpoint) ──────────────────────
const FALLBACK_APPS: RecentApp[] = [
  { id: 'r1', customerName: 'Rahul Sharma',    bank: 'SBI',   product: 'Home Loan',     amount: 4800000, status: 'APPROVED',   date: 'Sep 01, 2026' },
  { id: 'r2', customerName: 'Preethi Rao',     bank: 'HDFC',  product: 'Personal Loan', amount: 800000,  status: 'PROCESSING', date: 'Sep 03, 2026' },
  { id: 'r3', customerName: 'Mohan Lal',       bank: 'Axis',  product: 'Car Loan',      amount: 700000,  status: 'APPLIED',    date: 'Sep 05, 2026' },
  { id: 'r4', customerName: 'Sushma Verma',    bank: 'ICICI', product: 'Business Loan', amount: 2500000, status: 'REJECTED',   date: 'Aug 28, 2026' },
  { id: 'r5', customerName: 'Kiran Babu',      bank: 'PNB',   product: 'Gold Loan',     amount: 350000,  status: 'APPROVED',   date: 'Aug 25, 2026' },
]

// ══════════════════════════════════════════════════════════════════════════════
export default function AgentDetailPage() {
  const { agentId } = useParams<{ agentId: string }>()
  const navigate = useNavigate()

  const { data: agent, isLoading, isError, refetch } = useCompanyAgent(agentId!)
  const deactivateAgent = useDeactivateAgent()
  const reactivateAgent = useReactivateAgent()
  const updateSplitRule = useUpdateSplitRule()

  const [splitPercent, setSplitPercent] = useState<number | null>(null)
  const [showDeactivateModal, setShowDeactivateModal] = useState(false)

  // Initialise splitPercent once agent data arrives
  const resolvedSplitPercent = splitPercent ?? (agent?.splitRule?.agentPercent ?? 80)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] p-6 space-y-6">
        <SkeletonTable rows={6} cols={5} />
      </div>
    )
  }

  if (isError || !agent) {
    return (
      <div className="min-h-screen bg-[#fcf8ff] p-6">
        <QueryError message="Failed to load agent details." onRetry={refetch} />
      </div>
    )
  }

  const last4 = agent.bankAccountNumber
    ? agent.bankAccountNumber.slice(-4)
    : '????'

  const handleDeactivateConfirm = () => {
    deactivateAgent.mutate(agent.id)
    setShowDeactivateModal(false)
  }

  const handleReactivate = () => {
    reactivateAgent.mutate(agent.id)
  }

  const handleSaveSplit = () => {
    updateSplitRule.mutate({ ruleId: 'default', agentPercent: resolvedSplitPercent })
  }

  return (
    <div className="min-h-screen bg-[#fcf8ff] p-6 space-y-6">
      {/* Back nav */}
      <div>
        <button
          onClick={() => navigate('/company/team')}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Team Management
        </button>
      </div>

      {/* ── Profile Header ─────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-5">
          <div
            className={`w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl border-2 shrink-0 ${
              agent.isActive ? 'bg-indigo-600 border-indigo-100' : 'bg-slate-400 border-slate-200 opacity-60'
            }`}
          >
            {agent.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">{agent.fullName}</h1>
              {agent.isActive ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500">Field Agent</p>
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <a href={`mailto:${agent.email}`} className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-indigo-600 transition-colors">
                <Mail className="w-3.5 h-3.5" />
                {agent.email}
              </a>
              {agent.phone && (
                <span className="flex items-center gap-1.5 text-xs text-slate-600">
                  <Phone className="w-3.5 h-3.5" />
                  {agent.phone}
                </span>
              )}
            </div>
          </div>
          {/* Status action */}
          <div>
            {agent.isActive ? (
              <button
                onClick={() => setShowDeactivateModal(true)}
                disabled={deactivateAgent.isPending}
                className="px-4 py-2 text-xs font-semibold text-rose-600 border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {deactivateAgent.isPending ? 'Processing\u2026' : 'Deactivate Agent'}
              </button>
            ) : (
              <button
                onClick={handleReactivate}
                disabled={reactivateAgent.isPending}
                className="px-4 py-2 text-xs font-semibold text-emerald-600 border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                {reactivateAgent.isPending ? 'Processing\u2026' : 'Reactivate Agent'}
              </button>
            )}
          </div>
        </div>

        {/* KYC Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <Shield className="w-4 h-4 text-indigo-500" />
            KYC Verified
          </div>
          <span className="w-px h-4 bg-slate-200" />
          <span className="text-xs text-slate-500 font-mono">
            Bank A/C: <span className="text-slate-700 font-semibold">&bull;&bull;&bull;&bull;&nbsp;{last4}</span>
          </span>
          <span className="w-px h-4 bg-slate-200" />
          <span className="text-xs text-slate-500 font-mono">
            IFSC: <span className="text-slate-700 font-semibold">{agent.ifscCode ?? 'N/A'}</span>
          </span>
          <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">&#10003; Bank Verified</span>
        </div>
      </div>

      {/* ── 4 Stats Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Searches This Month',    value: agent.stats.searchesThisMonth,           icon: Search,      color: 'indigo',  isText: false },
          { label: 'Applications This Month',value: agent.stats.applicationsThisMonth,        icon: TrendingUp,  color: 'sky',     isText: false },
          { label: 'Customers Added',        value: agent.stats.applicationsThisMonth,        icon: Users,       color: 'violet',  isText: false },
          { label: 'Commission Expected',    value: fmtINR(agent.stats.expectedCommissionThisMonth), icon: IndianRupee, color: 'emerald', isText: true },
        ].map(({ label, value, icon: Icon, color, isText }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-100`}>
              <Icon className={`w-4 h-4 text-${color}-600`} />
            </div>
            <div>
              <p className={`${isText ? 'text-xl' : 'text-2xl'} font-bold text-slate-900`}>{value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Recent Applications ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Recent Applications</h2>
          <p className="text-xs text-slate-500 mt-0.5">Last 5 loan applications handled by this agent</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Bank &amp; Product</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Amount</th>
                <th className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {FALLBACK_APPS.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-medium text-slate-800">{app.customerName}</td>
                  <td className="px-4 py-3.5 text-slate-600">
                    <span className="font-semibold text-slate-700">{app.bank}</span>
                    <span className="text-slate-400 mx-1">&middot;</span>
                    {app.product}
                  </td>
                  <td className="px-4 py-3.5 text-right font-semibold text-slate-800">{fmtINR(app.amount)}</td>
                  <td className="px-4 py-3.5 text-center">
                    <AppStatusBadge status={app.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right text-xs text-slate-500">{app.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Commission Summary ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h2 className="text-base font-bold text-slate-900 mb-1">Commission Summary</h2>
        <p className="text-xs text-slate-500 mb-6">Adjust the agent's commission split using the slider below.</p>

        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Donut */}
          <div className="flex flex-col items-center gap-3">
            <DonutChart agentPct={resolvedSplitPercent} />
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block" />
                Agent {resolvedSplitPercent}%
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-indigo-200 inline-block" />
                Company {100 - resolvedSplitPercent}%
              </span>
            </div>
          </div>

          {/* Slider + breakdown */}
          <div className="flex-1 w-full space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-600 mb-2">
                <span>Agent Share</span>
                <span className="text-indigo-600">{resolvedSplitPercent}%</span>
              </div>
              <input
                type="range"
                min={50} max={95} step={1}
                value={resolvedSplitPercent}
                onChange={(e) => setSplitPercent(Number(e.target.value))}
                className="w-full h-2 rounded-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>50% (min)</span>
                <span>95% (max)</span>
              </div>
            </div>

            {/* Breakdown */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-indigo-50 rounded-xl p-4 space-y-1">
                <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Agent Earnings</p>
                <p className="text-xl font-bold text-indigo-800">
                  {fmtINR(Math.round(agent.commissionSummary.expectedTotal * resolvedSplitPercent / 100))}
                </p>
                <p className="text-xs text-indigo-500">{resolvedSplitPercent}% of pool</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 space-y-1">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Company Share</p>
                <p className="text-xl font-bold text-slate-700">
                  {fmtINR(Math.round(agent.commissionSummary.expectedTotal * (100 - resolvedSplitPercent) / 100))}
                </p>
                <p className="text-xs text-slate-400">{100 - resolvedSplitPercent}% of pool</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-xl p-3">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              Changes to commission split apply to future disbursements only.
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSaveSplit}
                disabled={updateSplitRule.isPending}
                className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg shadow-sm cursor-pointer transition-colors"
              >
                {updateSplitRule.isPending ? 'Saving\u2026' : 'Save Split'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ══ DEACTIVATE CONFIRM MODAL ══════════════════════════════════════════════ */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Deactivate {agent.fullName}?</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Field Agent</p>
                </div>
              </div>
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-800 space-y-1.5">
              <p className="font-semibold">Deactivating this agent will:</p>
              <ul className="list-disc list-inside space-y-1 text-rose-700">
                <li>Immediately revoke portal access for {agent.fullName}.</li>
                <li>Remove them from the lead assignment queue.</li>
                <li>Freeze active leads pending reassignment.</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                onClick={() => setShowDeactivateModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateConfirm}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Yes, Deactivate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
