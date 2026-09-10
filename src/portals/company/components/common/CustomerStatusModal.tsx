import React, { useState } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

interface CustomerStatusModalProps {
  isOpen: boolean
  onClose: () => void
  customerName: string
  isActive: boolean
  onConfirm: (reason: string) => void
  leadCount?: number
  applicationCount?: number
}

const DEACTIVATION_REASONS = [
  'Customer Request / Withdrawn',
  'Non-Responsive / Follow-up Exhausted',
  'Documentation Issue / Risk Flag',
  'Duplicate Entry / Test Account',
  'Loan Availed Elsewhere / Competition',
  'Other Reason',
]

export const CustomerStatusModal: React.FC<CustomerStatusModalProps> = ({
  isOpen,
  onClose,
  customerName,
  isActive,
  onConfirm,
  leadCount = 1,
  applicationCount = 1,
}) => {
  const [selectedReason, setSelectedReason] = useState(DEACTIVATION_REASONS[0])
  const [customReason, setCustomReason] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalReason =
      selectedReason === 'Other Reason' && customReason.trim() ? customReason.trim() : selectedReason
    onConfirm(finalReason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isActive ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
              {isActive ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isActive ? `Deactivate ${customerName}?` : `Reactivate ${customerName}?`}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isActive ? 'Pause operations across Leads & Applications' : 'Restore full borrower operations'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {isActive ? (
          <form onSubmit={handleSubmit} className="space-y-4 pt-1">
            <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 space-y-1.5">
              <p className="font-semibold text-rose-800">Deactivating will have the following effects:</p>
              <ul className="list-disc list-inside space-y-1 text-rose-700">
                <li>
                  <span className="font-medium">Lead Stage:</span> Field agent assignment and proposal generation will be locked ({leadCount} lead affected).
                </li>
                <li>
                  <span className="font-medium">Application Stage:</span> Ongoing loan applications will be frozen ({applicationCount} application affected).
                </li>
              </ul>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason for Inactivation
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full text-xs font-medium border border-slate-200 rounded-lg p-2.5 bg-white text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
              >
                {DEACTIVATION_REASONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            {selectedReason === 'Other Reason' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Specify Reason
                </label>
                <textarea
                  required
                  rows={2}
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  placeholder="Provide brief context..."
                  className="w-full text-xs border border-slate-200 rounded-lg p-2 text-slate-800 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95">
                Yes, Deactivate Customer
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4 pt-1">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-xs text-emerald-900 space-y-1">
              <p className="font-semibold text-emerald-800">Reactivating will restore:</p>
              <ul className="list-disc list-inside space-y-1 text-emerald-700">
                <li>Ability to assign and reassign field agents in Lead Management.</li>
                <li>Proposal creation and customer communication via portal.</li>
                <li>Progression and processing of loan applications.</li>
              </ul>
            </div>
            <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { onConfirm('Customer reactivated by operations manager'); onClose() }}
                className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all cursor-pointer active:scale-95"
              >
                Yes, Reactivate Customer
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
