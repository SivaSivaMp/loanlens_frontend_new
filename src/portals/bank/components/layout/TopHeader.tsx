import React, { useState } from 'react'
import { Search, Bell, Menu } from 'lucide-react'

interface TopHeaderProps {
  title?: string
  onOpenMobileMenu?: () => void
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  title = 'Dashboard',
  onOpenMobileMenu,
}) => {
  const [showNotificationModal, setShowNotificationModal] = useState(false)

  return (
    <header className="fixed top-0 right-0 h-16 left-0 md:left-[240px] bg-white border-b border-slate-200/80 flex justify-between items-center px-4 md:px-8 z-20 shadow-xs">
      <div className="flex items-center gap-3">
        {onOpenMobileMenu && (
          <button
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <button
          onClick={() => alert('Search initiated (Demo)')}
          className="text-slate-500 hover:text-[#4648d4] p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          title="Search"
        >
          <Search className="w-5 h-5" />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotificationModal(!showNotificationModal)}
            className="text-slate-500 hover:text-[#4648d4] p-1.5 rounded-full hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotificationModal && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold uppercase text-slate-500">Notifications</span>
                <span className="text-[11px] font-semibold text-[#4648d4] hover:underline cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="py-2 space-y-2">
                <div className="p-2.5 rounded-lg bg-indigo-50/50 hover:bg-indigo-50 text-xs">
                  <p className="font-semibold text-slate-800">New Product Approval</p>
                  <p className="text-slate-500 text-[11px]">SBI Home Loan rate updated successfully.</p>
                </div>
                <div className="p-2.5 rounded-lg hover:bg-slate-50 text-xs">
                  <p className="font-semibold text-slate-800">DSA Agreement Request</p>
                  <p className="text-slate-500 text-[11px]">FinServe DSA requested partnership agreement.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
