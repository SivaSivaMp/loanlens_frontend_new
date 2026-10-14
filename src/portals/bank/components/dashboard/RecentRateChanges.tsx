import React from 'react'
import { Home, User, Car, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface RateChangeItem {
  id: string
  name: string
  category: 'Home' | 'Personal' | 'Car' | 'Business'
  currentRate: string
  previousRate: string
  icon: React.ElementType
}

const defaultRateChanges: RateChangeItem[] = [
  { id: '1', name: 'SBI Home Loan', category: 'Home', currentRate: '8.50%', previousRate: '8.75%', icon: Home },
  { id: '2', name: 'Personal Loan', category: 'Personal', currentRate: '10.25%', previousRate: '10.50%', icon: User },
  { id: '3', name: 'Car Loan', category: 'Car', currentRate: '9.10%', previousRate: '9.25%', icon: Car },
]

export const RecentRateChanges: React.FC = () => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl shadow-xs overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-bold text-slate-900">
          Recent Rate Changes
        </h3>
        <Link
          to="/bank/products"
          className="text-xs font-semibold text-[#4648d4] hover:text-[#3b3dbb] flex items-center gap-1 hover:underline transition-colors"
        >
          <span>View all</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {defaultRateChanges.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-50/80 flex items-center justify-center text-[#4648d4] shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <Link
                    to="/bank/products"
                    className="font-semibold text-sm text-slate-900 hover:text-[#4648d4] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <div>
                    <span className="inline-block text-[10px] px-2 py-0.5 bg-slate-100 rounded text-slate-600 uppercase font-bold tracking-wider mt-0.5">
                      {item.category}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{item.currentRate}</p>
                <p className="text-xs text-slate-400 line-through">{item.previousRate}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
