import React from 'react'
import { ArrowRight } from 'lucide-react'

export const CommissionFlow: React.FC = () => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Commission Flow Breakdown</h3>
      <span className="text-xs text-indigo-600 font-medium hover:underline cursor-pointer">View Split Configuration →</span>
    </div>

    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
      {/* Step 1 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-indigo-50/70 rounded-xl border border-indigo-100/80 text-center">
        <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">Gross Received from Banks</span>
        <span className="text-xl sm:text-2xl font-bold text-slate-900">₹2,70,000</span>
        <span className="text-[11px] text-slate-400 mt-0.5">Across 18 Active Banks</span>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <ArrowRight className="w-5 h-5 text-indigo-400" />
      </div>

      {/* Step 2 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-amber-50/70 rounded-xl border border-amber-100/80 text-center">
        <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
          Company Retained <span className="text-amber-700 normal-case font-bold">(20%)</span>
        </span>
        <span className="text-xl sm:text-2xl font-bold text-slate-900">₹54,000</span>
        <span className="text-[11px] text-amber-700/80 mt-0.5">Operating Margin</span>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <ArrowRight className="w-5 h-5 text-emerald-400" />
      </div>

      {/* Step 3 */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 bg-emerald-50/70 rounded-xl border border-emerald-100/80 text-center">
        <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mb-1">
          Distributed to Agents <span className="text-emerald-700 normal-case font-bold">(80%)</span>
        </span>
        <span className="text-xl sm:text-2xl font-bold text-emerald-600">₹2,16,000</span>
        <span className="text-[11px] text-emerald-700/80 mt-0.5">7 Field Agents Paid</span>
      </div>
    </div>
  </div>
)
