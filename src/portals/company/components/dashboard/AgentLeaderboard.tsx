import React from 'react'
import { Trophy, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export const AgentLeaderboard: React.FC = () => {
  const leaders = [
    { rank: 1, name: 'Priya Menon', appsCount: 12, percentage: 85, barColor: 'bg-indigo-600', badgeColor: 'bg-amber-100 text-amber-700 border-amber-300' },
    { rank: 2, name: 'Anoop Raj', appsCount: 9, percentage: 65, barColor: 'bg-indigo-500', badgeColor: 'bg-slate-100 text-slate-700 border-slate-300' },
    { rank: 3, name: 'Kavya Srinivasan', appsCount: 6, percentage: 40, barColor: 'bg-indigo-400', badgeColor: 'bg-orange-100 text-orange-700 border-orange-300' },
  ]

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Agent Leaderboard</span>
        </h3>
        <Link to="/company/team" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
          View Team <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="space-y-4">
        {leaders.map((agent) => (
          <div key={agent.rank} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border shadow-2xs ${agent.badgeColor}`}>
              {agent.rank}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span className="font-semibold text-slate-900 truncate">{agent.name}</span>
                <span className="text-slate-500 font-medium ml-2 shrink-0">{agent.appsCount} Apps</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className={`h-2 rounded-full transition-all duration-500 ${agent.barColor}`} style={{ width: `${agent.percentage}%` }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
