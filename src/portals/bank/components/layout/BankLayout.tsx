import React from 'react'
import { useLocation } from 'react-router-dom'
import { PortalShell } from '@/shared/components/sections/PortalShell'
import { Sidebar } from './Sidebar'
import { TopHeader } from './TopHeader'

export const BankLayout: React.FC = () => {
  const location = useLocation()

  const getPageTitle = () => {
    const path = location.pathname
    if (path === '/bank/dashboard' || path === '/bank') return 'Dashboard'
    if (path.startsWith('/bank/products/new')) return 'Create Product'
    if (path.includes('/edit')) return 'Edit Product'
    if (path.startsWith('/bank/products/')) return 'Product Details'
    if (path === '/bank/products') return 'Products Management'
    if (path === '/bank/transactions') return 'Transactions'
    if (path === '/bank/accounts') return 'Accounts Overview'
    if (path === '/bank/risk-analysis') return 'Risk Analysis'
    if (path === '/bank/compliance') return 'Compliance & Audits'
    if (path === '/bank/settings') return 'Bank Settings'
    return 'Bank Admin Portal'
  }

  return (
    <PortalShell
      sidebar={<Sidebar />}
      header={<TopHeader title={getPageTitle()} />}
      mainOffsetClass="md:ml-[240px]"
    />
  )
}
