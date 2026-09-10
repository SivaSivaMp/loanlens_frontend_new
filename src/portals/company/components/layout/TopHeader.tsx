import React, { useState } from 'react'
import { Search, Bell, Menu, HelpCircle, Settings, Check } from 'lucide-react'

interface TopHeaderProps {
  title?: string
  onOpenMobileMenu?: () => void
}

export const TopHeader: React.FC<TopHeaderProps> = ({ title = 'Dashboard', onOpenMobileMenu }) => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <header className="fixed top-0 right-0 h-16 left-0 md:left-64 bg-white border-b border-slate-200/80 flex justify-between items-center px-4 sm:px-6 lg:px-8 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button onClick={onOpenMobileMenu} className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100" aria-label="Toggle Menu">
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        {/* Search */}
        <div className="relative hidden sm:block w-48 lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads, banks, agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
          />
        </div>
        <button className="sm:hidden p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors" aria-label="Search">
          <Search className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors relative" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Notifications</span>
                <button onClick={() => setShowNotifications(false)} className="text-[11px] font-semibold text-indigo-600 hover:underline flex items-center gap-1">
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              </div>
              <div className="py-2 space-y-2 max-h-72 overflow-y-auto custom-scrollbar">
                <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-100 text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-800">
                    <span>3 Unassigned Leads</span>
                    <span className="text-[10px] text-rose-600 font-bold uppercase">Urgent</span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">Rahul Sharma and 2 others are waiting for field agent assignment.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">10 mins ago</span>
                </div>
                <div className="p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 text-xs transition-colors">
                  <p className="font-semibold text-slate-800">Commission Settled</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">₹1,44,000 disbursed from HDFC Bank partner agreement.</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">2 hours ago</span>
                </div>
                <div className="p-2.5 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 text-xs transition-colors">
                  <p className="font-semibold text-slate-800">Application Approved</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Suresh Pillai's Axis Car loan application was approved!</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">4 hours ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <button className="hidden md:flex p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors" title="Help & Support">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="hidden md:flex p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors" title="Settings">
          <Settings className="w-5 h-5" />
        </button>

        <div className="h-6 w-px bg-slate-200" />

        <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-white cursor-pointer hover:ring-2 hover:ring-indigo-300 transition-all" title="Ravi Kumar (Company Admin)">
          RK
        </div>
      </div>
    </header>
  )
}
