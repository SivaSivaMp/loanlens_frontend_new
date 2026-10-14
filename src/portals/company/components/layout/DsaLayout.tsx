import React from 'react'
import { useLocation } from 'react-router-dom'
import { PortalShell } from '@/shared/components/sections/PortalShell'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

export const DsaLayout: React.FC = () => {
  const location = useLocation()

  const getPageTitle = () => {
    const p = location.pathname
    if (p === '/company/dashboard') return 'Operational Dashboard'
    if (p === '/company/banks') return 'Banks & Agreements'
    if (p === '/company/leads') return 'Lead Management'
    if (p.startsWith('/company/leads/')) return 'Lead Detail'
    if (p === '/company/team') return 'Team Management'
    if (p.startsWith('/company/team/') || p.startsWith('/company/agents/')) return 'Agent Detail'
    if (p === '/company/split-rules') return 'Commission Split Rules'
    if (p === '/company/portal-customers') return 'Customer Management'
    if (p === '/company/applications' || p === '/company/customers') return 'All Applications'
    if (p === '/company/commissions') return 'Commission Tracker'
    if (p === '/company/analytics/team') return 'Team Performance Analytics'
    if (p === '/company/analytics/pipeline') return 'Customer Pipeline Analytics'
    if (p === '/company/notifications') return 'Notifications Center'
    if (p === '/company/settings') return 'Company Profile & Settings'
    return 'DSA Partner Portal'
  }

  return (
    <PortalShell
      sidebar={<Sidebar />}
      header={<TopHeader title={getPageTitle()} />}
      mainOffsetClass="md:ml-64"
    />
  )
}
