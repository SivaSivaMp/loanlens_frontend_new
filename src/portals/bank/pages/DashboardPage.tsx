import React, { useState } from 'react'
import {
  Calendar,
  ChevronDown,
  Package,
  Eye,
  FileText,
  Handshake,
  Plus,
} from 'lucide-react'
import { StatCard } from '../components/dashboard/StatCard'
import { RecentRateChanges } from '../components/dashboard/RecentRateChanges'
import { TopPerformingProduct } from '../components/dashboard/TopPerformingProduct'
import { Link } from 'react-router-dom'

export const BankDashboardPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026')
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)

  const months = ['June 2026', 'July 2026', 'August 2026', 'September 2026']

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto pb-12">
      {/* Section 1: Welcome Header & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            Good morning, State Bank of India <span>👋</span>
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Here is what's happening with your loan products and DSA partners today.
          </p>
        </div>

        <div className="relative self-start sm:self-auto">
          <button
            onClick={() => setShowMonthDropdown(!showMonthDropdown)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/80 rounded-xl text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>{selectedMonth}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showMonthDropdown && (
            <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-xl border border-slate-200 p-1.5 z-40 animate-in fade-in duration-100">
              {months.map((m) => (
                <button
                  key={m}
                  onClick={() => { setSelectedMonth(m); setShowMonthDropdown(false) }}
                  className={`w-full text-left px-3 py-2 text-xs rounded-lg font-medium transition-colors ${
                    selectedMonth === m
                      ? 'bg-indigo-50 text-[#4648d4] font-semibold'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Products" value="12" subtext="8 active · 4 inactive" icon={Package} />
        <StatCard title="Impressions" value="1,840" trend={{ value: '14%', isPositive: true, period: 'last month' }} icon={Eye} />
        <StatCard title="Applications" value="47" trend={{ value: '8%', isPositive: true, period: 'last month' }} icon={FileText} />
        <StatCard title="DSA Agreements" value="18" subtext="Companies working with you" icon={Handshake} />
      </div>

      {/* Section 3: Two-Column Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
        <div className="lg:col-span-6">
          <RecentRateChanges />
        </div>

        <div className="lg:col-span-4 space-y-6">
          <TopPerformingProduct />

          <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl p-5 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <span className="text-[10px] font-bold tracking-wider uppercase text-indigo-300">
                Quick Action
              </span>
              <h4 className="text-base font-bold text-white mt-1">Launch New Loan Scheme</h4>
              <p className="text-indigo-200 text-xs mt-1 mb-4 leading-relaxed">
                Publish updated rate matrices directly to all 18 connected DSA channels.
              </p>
              <Link
                to="/bank/products/new"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white text-slate-900 hover:bg-indigo-50 rounded-lg text-xs font-bold shadow-sm transition-all hover:scale-[1.02]"
              >
                <Plus className="w-3.5 h-3.5 text-[#4648d4]" />
                <span>Create Product</span>
              </Link>
            </div>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-white/5 rounded-full blur-xl pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  )
}
