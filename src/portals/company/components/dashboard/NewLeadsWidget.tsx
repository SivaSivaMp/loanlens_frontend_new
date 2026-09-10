import React, { useState } from 'react'
import { UserPlus, ArrowRight, Clock, Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LeadItem {
  id: string
  name: string
  initials: string
  initialsBg: string
  timeAgo: string
  loanType: string
  amount: string
}

export const NewLeadsWidget: React.FC = () => {
  const [assignModalLead, setAssignModalLead] = useState<LeadItem | null>(null)
  const [selectedAgent, setSelectedAgent] = useState('Priya Menon')
  const [assignedSuccess, setAssignedSuccess] = useState<string | null>(null)

  const leads: LeadItem[] = [
    { id: 'lead-1', name: 'Rahul Sharma', initials: 'RS', initialsBg: 'bg-indigo-600 text-white', timeAgo: '10m ago', loanType: 'HOME LOAN', amount: '₹45,00,000' },
    { id: 'lead-2', name: 'Meera Nair', initials: 'MN', initialsBg: 'bg-amber-500 text-white', timeAgo: '45m ago', loanType: 'PERSONAL LOAN', amount: '₹8,50,000' },
    { id: 'lead-3', name: 'Vinod Kumar', initials: 'VK', initialsBg: 'bg-rose-500 text-white', timeAgo: '2h ago', loanType: 'CAR LOAN', amount: '₹12,00,000' },
  ]

  const agents = ['Priya Menon (Top Performer)', 'Anoop Raj', 'Kavya Srinivasan', 'Sanjay Verma']

  const handleAssign = () => {
    if (!assignModalLead) return
    setAssignedSuccess(`Lead ${assignModalLead.name} successfully assigned to ${selectedAgent}!`)
    setTimeout(() => { setAssignedSuccess(null); setAssignModalLead(null) }, 2000)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden mb-6">
      <div className="px-5 py-3.5 border-b border-rose-100 bg-rose-50/50 flex justify-between items-center">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <span className="p-1 rounded-md bg-rose-100 text-rose-600"><UserPlus className="w-4 h-4" /></span>
          <span>New Lead Requests</span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-rose-200/80 text-rose-800 font-semibold">3 Pending</span>
        </h3>
        <Link to="/company/customers" className="text-xs font-semibold text-rose-600 hover:text-rose-800 flex items-center gap-1 transition-colors">
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
        {leads.map((lead) => (
          <div key={lead.id} className="bg-slate-50/60 hover:bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col justify-between transition-all hover:border-slate-300 hover:shadow-xs group">
            <div>
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-xs ${lead.initialsBg}`}>{lead.initials}</div>
                  <div>
                    <span className="text-sm font-semibold text-slate-900 block leading-tight">{lead.name}</span>
                    <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">{lead.loanType}</span>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium"><Clock className="w-3 h-3" />{lead.timeAgo}</span>
              </div>
              <div className="my-1">
                <span className="text-xs text-slate-500 block">Requested Amount</span>
                <span className="text-lg font-bold text-slate-900 tracking-tight">{lead.amount}</span>
              </div>
            </div>
            <div className="pt-3 mt-2 border-t border-slate-200/60 flex items-center justify-end">
              <button onClick={() => setAssignModalLead(lead)} className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors cursor-pointer py-1 px-2 rounded-md hover:bg-indigo-50">
                Assign Field Agent <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Assign Modal */}
      {assignModalLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start pb-3 border-b border-slate-100">
              <div>
                <h4 className="text-base font-bold text-slate-900">Assign Lead: {assignModalLead.name}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{assignModalLead.loanType} • {assignModalLead.amount}</p>
              </div>
              <button onClick={() => setAssignModalLead(null)} className="text-slate-400 hover:text-slate-600 p-1"><X className="w-5 h-5" /></button>
            </div>

            {assignedSuccess ? (
              <div className="py-6 text-center text-emerald-600 font-semibold flex flex-col items-center gap-2">
                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center"><Check className="w-6 h-6 text-emerald-600" /></div>
                <span>{assignedSuccess}</span>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500 block mb-1.5">Select Available Field Agent</label>
                  <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)} className="w-full text-sm border border-slate-300 rounded-lg p-2.5 bg-slate-50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500">
                    {agents.map((ag) => <option key={ag} value={ag}>{ag}</option>)}
                  </select>
                </div>
                <div className="p-3 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs text-slate-600">
                  <span className="font-semibold text-indigo-900 block mb-1">Auto-Notification via SMS & App</span>
                  The assigned agent will immediately receive lead documents and contact coordinates.
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button onClick={() => setAssignModalLead(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">Cancel</button>
                  <button onClick={handleAssign} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer">Confirm Assignment</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
