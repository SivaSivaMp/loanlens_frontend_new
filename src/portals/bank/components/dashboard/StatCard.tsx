import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtext?: string
  trend?: {
    value: string
    isPositive?: boolean
    period?: string
  }
  icon: LucideIcon
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtext,
  trend,
  icon: Icon,
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-6 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">
          {title}
        </span>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#4648d4]">
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="text-3xl font-bold text-slate-900 tracking-tight mb-1">
        {value}
      </div>

      {trend ? (
        <div
          className={`text-xs font-semibold flex items-center gap-1.5 ${
            trend.isPositive !== false ? 'text-emerald-600' : 'text-rose-600'
          }`}
        >
          {trend.isPositive !== false ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trend.value}</span>
          {trend.period && (
            <span className="text-slate-400 font-normal ml-0.5">
              vs {trend.period}
            </span>
          )}
        </div>
      ) : subtext ? (
        <div className="text-slate-500 text-xs">{subtext}</div>
      ) : null}
    </div>
  )
}
