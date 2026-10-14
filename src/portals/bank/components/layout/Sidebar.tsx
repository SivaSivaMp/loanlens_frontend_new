import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  CreditCard,
  Building2,
  LineChart,
  ShieldCheck,
  Settings,
  HelpCircle,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '@/shared/stores/authStore'

interface SidebarProps {
  onCloseMobile?: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobile }) => {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const navItems = [
    { label: 'Dashboard', path: '/bank/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/bank/products', icon: Package },
    { label: 'Transactions', path: '/bank/transactions', icon: CreditCard },
    { label: 'Accounts', path: '/bank/accounts', icon: Building2 },
    { label: 'Risk Analysis', path: '/bank/risk-analysis', icon: LineChart },
    { label: 'Compliance', path: '/bank/compliance', icon: ShieldCheck },
    { label: 'Settings', path: '/bank/settings', icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-slate-900 flex flex-col z-30 border-r border-slate-800 text-slate-300">
      {/* Brand Logo & Name */}
      <div className="px-5 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#4648d4] to-[#6063ee] flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="text-white font-bold text-lg tracking-tight flex items-center gap-1">
              LoanLens
            </span>
            <span className="text-[10px] text-indigo-400 font-semibold tracking-wider uppercase block -mt-1">
              Bank Admin
            </span>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1"
          >
            ✕
          </button>
        )}
      </div>

      <div className="h-px bg-white/10 w-full mb-5" />

      {/* Navigation Menu */}
      <nav className="flex-1 px-3 overflow-y-auto">
        <h3 className="text-slate-400 text-[10px] font-bold tracking-[0.12em] mb-3 ml-3 uppercase">
          MAIN MENU
        </h3>
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/bank/dashboard'}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-[#6063ee]/20 text-white font-semibold border-l-2 border-[#c0c1ff]'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={`w-4 h-4 transition-colors ${
                          isActive ? 'text-[#c0c1ff]' : 'text-slate-400'
                        }`}
                      />
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer Profile & Actions */}
      <div className="mt-auto p-4 border-t border-white/10 bg-slate-900/60">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#4648d4] to-[#6063ee] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md">
            BA
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate">Bank Admin</p>
            <p className="text-slate-400 text-[11px] truncate">LoanLens Portal</p>
          </div>
        </div>

        <ul className="space-y-0.5">
          <li>
            <a
              href="#support"
              className="flex items-center gap-3 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:bg-white/5 hover:text-[#c0c1ff] transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Support</span>
            </a>
          </li>
          <li>
            <button
              onClick={() => { logout(); navigate('/login') }}
              className="w-full flex items-center gap-3 px-3 py-1.5 rounded-md text-xs text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 transition-colors text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>
  )
}
