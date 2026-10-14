import React from 'react'
import { Award, ArrowUpRight, BarChart3, Eye, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export const TopPerformingProduct: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-5 sm:p-6 shadow-xs">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-600" />
          <h3 className="text-base font-bold text-slate-900">Top Performing</h3>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-full uppercase tracking-wider">
          Best Performer
        </span>
      </div>

      <div className="mb-4">
        <Link
          to="/bank/products"
          className="text-lg font-bold text-slate-900 hover:text-[#4648d4] transition-colors block"
        >
          SBI Home Loan
        </Link>
        <p className="text-slate-500 text-xs mt-0.5">1,240 impressions this month</p>
      </div>

      <div className="space-y-3 pt-2 border-t border-slate-100">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Application Conversion</span>
            <span className="font-bold text-slate-800">68%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#4648d4] to-[#6063ee] h-full rounded-full transition-all duration-500"
              style={{ width: '68%' }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
              <Eye className="w-3.5 h-3.5 text-indigo-500" /> Views
            </span>
            <span className="text-base font-bold text-slate-900">1,240</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg">
            <span className="text-[11px] text-slate-500 flex items-center gap-1 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Approved
            </span>
            <span className="text-base font-bold text-slate-900">32</span>
          </div>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
        <Link
          to="/bank/products"
          className="text-xs font-semibold text-[#4648d4] hover:text-[#3b3dbb] flex items-center gap-1 transition-colors"
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Product Analytics</span>
        </Link>
        <Link
          to="/bank/products"
          className="p-1 text-slate-400 hover:text-slate-600 rounded-md transition-colors"
        >
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
