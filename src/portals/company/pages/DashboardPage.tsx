import { useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { StatKpiCard } from '../components/dashboard/StatKpiCard'
import type { StatKpiItem } from '../components/dashboard/StatKpiCard'
import { CommissionFlow } from '../components/dashboard/CommissionFlow'
import { NewLeadsWidget } from '../components/dashboard/NewLeadsWidget'
import { RecentAppsTable } from '../components/dashboard/RecentAppsTable'
import { AgentLeaderboard } from '../components/dashboard/AgentLeaderboard'
import { PipelineSnapshot } from '../components/dashboard/PipelineSnapshot'
import { useCompanyProfile, useCompanyAgents } from '../hooks/useCompany'
import { useLeads } from '../hooks/useLeads'
import { useCommissionSummary } from '../hooks/useCommissions'
import { SkeletonKpiCard } from '../components/common/SkeletonCard'

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState('August 2026')

  const { data: profile } = useCompanyProfile()
  const { data: agentsPage } = useCompanyAgents({ limit: 50 })
  const { data: unassignedLeads } = useLeads({ status: 'PENDING', limit: 1 })
  const { data: allLeads } = useLeads({ limit: 1 })
  const { data: commissionSummary, isLoading: commLoading } = useCommissionSummary()

  const totalAgents = profile?.teamSummary.totalAgents ?? agentsPage?.pagination.total
  const activeAgents = profile?.teamSummary.activeAgents
  const unassignedCount = unassignedLeads?.pagination.total ?? 0
  const totalLeads = allLeads?.pagination.total

  const grossReceived = commissionSummary?.company
    ? (commissionSummary.company.companyRetained + commissionSummary.company.distributedToAgents)
    : null
  const distributedToAgents = commissionSummary?.company?.distributedToAgents ?? null

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

  const kpis: StatKpiItem[] = [
    {
      id: 'kpi-1',
      label: 'Active Bank Agreements',
      value: '18',
      subtext: '6 banks, 12 NBFCs',
      iconType: 'bank',
      subtextColor: 'default',
    },
    {
      id: 'kpi-2',
      label: 'Total Field Agents',
      value: totalAgents != null ? String(totalAgents) : '—',
      subtext: activeAgents != null ? `${activeAgents} active · ${(totalAgents ?? 0) - activeAgents} inactive` : 'Loading…',
      iconType: 'agents',
      subtextColor: 'default',
    },
    {
      id: 'kpi-3',
      label: 'Leads This Month',
      value: totalLeads != null ? String(totalLeads) : '—',
      subtext: '↑ From customer portal',
      iconType: 'apps',
      subtextColor: 'success',
    },
    {
      id: 'kpi-4',
      label: 'Expected This Month',
      value: distributedToAgents != null ? fmt(distributedToAgents) : '—',
      subtext: grossReceived != null ? `Gross: ${fmt(grossReceived)}` : 'Loading…',
      iconType: 'rupee',
      subtextColor: 'default',
    },
    {
      id: 'kpi-5',
      label: 'Unassigned Leads',
      value: unassignedCount,
      subtext: 'Requires Immediate Action',
      iconType: 'alert',
      isAlert: unassignedCount > 0,
      actionText: 'Review Now',
      actionLink: '/company/leads',
    },
  ]

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      {/* Welcome Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Good morning, {profile?.companyName ?? 'DSA Partner'} 👋
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">Operational dashboard and real-time loan origination pipeline.</p>
        </div>
        <button
          onClick={() => setSelectedMonth(selectedMonth === 'August 2026' ? 'September 2026' : 'August 2026')}
          className="flex items-center gap-2 px-3.5 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-xs text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <Calendar className="w-4 h-4 text-slate-500" />
          <span>{selectedMonth}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* KPI Row */}
      {commLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {[...Array(5)].map((_, i) => <SkeletonKpiCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
          {kpis.map((kpi) => <StatKpiCard key={kpi.id} {...kpi} />)}
        </div>
      )}

      <CommissionFlow />
      <NewLeadsWidget />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <RecentAppsTable />
        </div>
        <div className="lg:col-span-5 space-y-6">
          <AgentLeaderboard />
          <PipelineSnapshot />
        </div>
      </div>
    </div>
  )
}
