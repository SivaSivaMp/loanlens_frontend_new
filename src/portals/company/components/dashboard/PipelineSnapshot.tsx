import React from 'react'
import { ChevronRight, Filter } from 'lucide-react'
import { Link } from 'react-router-dom'

interface Stage {
  name: string
  count: number
  highlight?: 'danger' | 'primary'
}

export const PipelineSnapshot: React.FC = () => {
  const stages: Stage[] = [
    { name: 'NEW', count: 4 },
    { name: 'LOGIN', count: 5 },
    { name: 'WIP', count: 3 },
    { name: 'QUERY', count: 1 },
    { name: 'APPROVED', count: 8 },
    { name: 'REJECTED', count: 2, highlight: 'danger' },
    { name: 'DISBURSED', count: 10 },
    { name: 'PARTIAL', count: 2 },
    { name: 'HOLD', count: 0 },
    { name: 'CLOSED', count: 12, highlight: 'primary' },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-500" />
          <span>Pipeline Snapshot</span>
        </h3>
        <Link to="/company/analytics/pipeline" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
          Detailed Flow →
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.name}>
            <div className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
              stage.highlight === 'danger'
                ? 'bg-rose-50 text-rose-700 border-b-2 border-rose-500 font-bold'
                : stage.highlight === 'primary'
                ? 'bg-indigo-50 text-indigo-800 border-b-2 border-indigo-600 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200/80'
            }`}>
              <span>{stage.name}</span>
              <span className="opacity-80 ml-1 font-mono">({stage.count})</span>
            </div>
            {idx < stages.length - 1 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}
