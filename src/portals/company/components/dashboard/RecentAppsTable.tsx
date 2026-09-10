import React from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ApplicationRow {
  id: string
  applicant: string
  initials: string
  initialsBg: string
  bankAndProduct: string
  status: 'APPLIED' | 'PROCESSING' | 'APPROVED' | 'REJECTED'
}

export const RecentAppsTable: React.FC = () => {
  const applications: ApplicationRow[] = [
    { id: 'app-1', applicant: 'Rahul Sharma', initials: 'RS', initialsBg: 'bg-indigo-600 text-white', bankAndProduct: 'SBI Home', status: 'APPLIED' },
    { id: 'app-2', applicant: 'Meera Nair', initials: 'MN', initialsBg: 'bg-amber-600 text-white', bankAndProduct: 'HDFC Personal', status: 'PROCESSING' },
    { id: 'app-3', applicant: 'Suresh Pillai', initials: 'SP', initialsBg: 'bg-emerald-600 text-white', bankAndProduct: 'Axis Car', status: 'APPROVED' },
    { id: 'app-4', applicant: 'Anjali Das', initials: 'AD', initialsBg: 'bg-sky-600 text-white', bankAndProduct: 'ICICI Business', status: 'APPLIED' },
    { id: 'app-5', applicant: 'Vinod Kumar', initials: 'VK', initialsBg: 'bg-rose-600 text-white', bankAndProduct: 'PNB Gold', status: 'REJECTED' },
  ]

  const getStatusBadge = (status: ApplicationRow['status']) => {
    const base = 'inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border'
    switch (status) {
      case 'APPROVED': return <span className={`${base} bg-emerald-500/10 text-emerald-700 border-emerald-500/20`}>APPROVED</span>
      case 'PROCESSING': return <span className={`${base} bg-amber-500/10 text-amber-700 border-amber-500/20`}>PROCESSING</span>
      case 'REJECTED': return <span className={`${base} bg-rose-500/10 text-rose-700 border-rose-500/20`}>REJECTED</span>
      default: return <span className={`${base} bg-indigo-500/10 text-indigo-700 border-indigo-500/20`}>APPLIED</span>
    }
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-200 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 tracking-tight">Recent Applications</h3>
        <Link to="/company/customers" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Applicant</th>
              <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500">Bank & Product</th>
              <th className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-500 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applications.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/70 transition-colors cursor-pointer">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs shrink-0 ${app.initialsBg}`}>{app.initials}</div>
                    <span className="text-sm font-medium text-slate-900 truncate">{app.applicant}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600 font-medium">{app.bankAndProduct}</td>
                <td className="px-4 py-3 text-right">{getStatusBadge(app.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
