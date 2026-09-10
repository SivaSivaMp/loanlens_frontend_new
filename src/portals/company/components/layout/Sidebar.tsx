import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  GitFork,
  FileText,
  CreditCard,
  BarChart3,
  Bell,
  ChevronDown,
  Sparkles,
  X,
  UserCheck,
} from 'lucide-react'

interface SidebarProps {
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const location = useLocation()
  const isAnalyticsActive = location.pathname.startsWith('/company/analytics')
  const [analyticsExpanded, setAnalyticsExpanded] = useState(isAnalyticsActive)

  const mainNav = [
    { label: 'Dashboard', path: '/company/dashboard', icon: LayoutDashboard },
    { label: 'Banks', path: '/company/banks', icon: Building2 },
    { label: 'Leads', path: '/company/leads', icon: UserCheck, badge: '3' },
    { label: 'Team', path: '/company/team', icon: Users },
    { label: 'Split Rules', path: '/company/split-rules', icon: GitFork },
    { label: 'All Applications', path: '/company/customers', icon: FileText },
    { label: 'Commissions', path: '/company/commissions', icon: CreditCard },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] text-slate-300 flex flex-col z-30 border-r border-slate-800 shadow-2xl">
      {/* Brand */}
      <div className="px-5 py-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4648d4] to-[#6063ee] flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg tracking-tight block leading-tight">LoanLens</span>
              <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block">DSA Portal</span>
            </div>
          </div>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-white p-1 rounded-md" aria-label="Close Sidebar">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Company Badge */}
        <div className="flex items-center justify-between mt-3 px-2.5 py-1.5 rounded-md bg-slate-800/60 border border-slate-700/50">
          <span className="text-xs font-medium text-slate-300 truncate">FinServe Associates</span>
          <span className="bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border border-indigo-500/30">
            FINS-782h3
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1 custom-scrollbar">
        {mainNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onCloseMobile}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 h-11 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border-l-[3px] border-indigo-500 font-semibold shadow-xs'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`
              }
            >
              <Icon className="w-[19px] h-[19px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              {'badge' in item && item.badge && (
                <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          )
        })}

        {/* Analytics Dropdown */}
        <div>
          <button
            onClick={() => setAnalyticsExpanded(!analyticsExpanded)}
            className={`w-full flex items-center justify-between px-3.5 h-11 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
              isAnalyticsActive
                ? 'text-indigo-400 bg-indigo-600/10 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-[19px] h-[19px] shrink-0" />
              <span>Analytics</span>
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${analyticsExpanded ? 'rotate-180 text-indigo-400' : 'text-slate-500'}`} />
          </button>

          {analyticsExpanded && (
            <div className="pl-10 pr-2 py-1 space-y-1">
              <NavLink
                to="/company/analytics/team"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 text-xs rounded-md transition-colors ${
                    isActive ? 'text-white font-semibold bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                Team Performance
              </NavLink>
              <NavLink
                to="/company/analytics/pipeline"
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `block px-3 py-2 text-xs rounded-md transition-colors ${
                    isActive ? 'text-white font-semibold bg-slate-800' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                Pipeline
              </NavLink>
            </div>
          )}
        </div>

        {/* Notifications */}
        <NavLink
          to="/company/notifications"
          onClick={onCloseMobile}
          className={({ isActive }) =>
            `flex items-center justify-between px-3.5 h-11 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-indigo-600/15 text-indigo-400 border-l-[3px] border-indigo-500 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
            }`
          }
        >
          <div className="flex items-center gap-3">
            <Bell className="w-[19px] h-[19px] shrink-0" />
            <span>Notifications</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-rose-500 ring-2 ring-[#0f172a]" />
        </NavLink>
      </nav>

      {/* User Profile */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            R
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-sm font-medium text-white truncate">Ravi Kumar</span>
            <span className="text-[11px] text-slate-400 truncate">Company Admin</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
