import React from 'react'
import { Building2, Users, TrendingUp, IndianRupee, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface StatKpiItem {
  id: string
  label: string
  value: string | number
  subtext: string
  subtextColor?: 'default' | 'success' | 'danger'
  iconType: 'bank' | 'agents' | 'apps' | 'rupee' | 'alert'
  isAlert?: boolean
  actionText?: string
  actionLink?: string
}

export const StatKpiCard: React.FC<StatKpiItem> = ({
  label, value, subtext, subtextColor = 'default', iconType, isAlert, actionText, actionLink,
}) => {
  const renderIcon = () => {
    switch (iconType) {
      case 'bank': return <Building2 className="w-4 h-4 text-slate-500" />
      case 'agents': return <Users className="w-4 h-4 text-slate-500" />
      case 'apps': return <TrendingUp className="w-4 h-4 text-emerald-600" />
      case 'rupee': return <IndianRupee className="w-4 h-4 text-slate-500" />
      case 'alert': return <AlertCircle className="w-4 h-4 text-rose-600" />
      default: return null
    }
  }

  if (isAlert) {
    return (
      <div className="bg-rose-50/80 rounded-xl p-4 sm:p-5 border border-rose-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
        <div>
          <div className="text-rose-700 font-semibold text-[11px] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            {label}
          </div>
          <div className="text-3xl font-bold text-rose-700 tracking-tight my-2">{value}</div>
        </div>
        {actionText && actionLink && (
          <Link to={actionLink} className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors pt-2 group">
            {actionText}
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="text-slate-500 font-medium text-[11px] uppercase tracking-wider mb-1.5">{label}</div>
        <div className="text-3xl font-bold text-slate-900 tracking-tight my-2">{value}</div>
      </div>
      <div className={`flex items-center gap-1.5 text-xs font-medium pt-2 border-t border-slate-100 ${
        subtextColor === 'success' ? 'text-emerald-600 font-semibold' : subtextColor === 'danger' ? 'text-rose-600' : 'text-slate-500'
      }`}>
        {renderIcon()}
        <span>{subtext}</span>
      </div>
    </div>
  )
}
