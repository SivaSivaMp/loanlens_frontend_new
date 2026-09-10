import React, { useState } from 'react'
import { Search, X, AlertTriangle, ChevronDown } from 'lucide-react'
import { useApplications, useDeactivateCustomer, useReactivateCustomer, useUpdateApplicationStatus } from '../hooks/useCustomers'
import { SkeletonTable, QueryError } from '../components/common/SkeletonCard'
import type { LoanApplication } from '../types/company.types'

type AppStatus = 'APPLIED' | 'PROCESSING' | 'APPROVED' | 'REJECTED'

const STATUS_COLORS: Record<string, string> = {
  APPLIED:    'bg-indigo-50 text-indigo-700 border-indigo-200',
  PROCESSING: 'bg-amber-50 text-amberigo-700 border-amber-200',
  APPROVED:   'bg-emerald-50 text-emerald-700 border-emerald-200',
  REJECTED:   'bg-rose-50 text-rose-700 border-rose-200',
}

const fmt = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

export const AllCustomersPage: React.FC = () => {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null)
  const [drawerStatus, setDrawerStatus] = useState<AppStatus>('APPLIED')
  const [drawerNotes, setDrawerNotes] = useState('')

  // Customer status modal state
  const [custModal, setCustModal] = useState<{
    mode: 'deactivate' | 'reactivate'
    customerId: string
    customerName: string
  } | null>(null)
  const [deactivateReason, setDeactivateReason] = useState('')

  const filters = {
    page,
    limit: 10,
    status: statusFilter !== 'ALL' ? statusFilter : undefined,
    search: searchQuery || undefined,
  }

  const { data, isLoading, isError, refetch } = useApplications(filters)
  const deactivateCustomer = useDeactivateCustomer()
  const reactivateCustomer = useReactivateCustomer()
  const updateApplicationStatus = useUpdateApplicationStatus()

  const apps = data?.data ?? []
  const pagination = data?.pagination

  const openDrawer = (app: LoanApplication) => {
    setSelectedApp(app)
    setDrawerStatus(app.status as AppStatus)
    setDrawerNotes('')
  }

  const handleSaveChanges = () => {
    if (!selectedApp) return
    updateApplicationStatus.mutate(
      { appId: selectedApp.id, status: drawerStatus },
      { onSuccess: () => setSelectedApp(null) }
    )
  }

  const handleConfirmCustModal = () => {
    if (!custModal) return
    if (custModal.mode === 'deactivate') {
      deactivateCustomer.mutate(
        { customerId: custModal.customerId, reason: deactivateReason },
        {
          onSuccess: () => {
            setCustModal(null)
            setDeactivateReason('')
            setSelectedApp(null)
          },
        }
      )
    } else {
      reactivateCustomer.mutate(custModal.customerId, {
        onSuccess: () => {
          setCustModal(null)
          setSelectedApp(null)
        },
      })
    }
  }

  return (
    <div className="space-y-6 pb-12 relative">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">All Applications Registry</h1>
        <p className="text-sm text-slate-500 mt-1">Comprehensive tracker for every customer's loan application across all assigned field agents.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          {['ALL', 'APPLIED', 'PROCESSING', 'APPROVED', 'REJECTED'].map((f) => (
            <button
              key={f}
              onClick={() => { setStatusFilter(f); setPage(1) }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                statusFilter === f
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
              }`}
            >
              {f === 'ALL' ? `All (${pagination?.total ?? '…'})` : f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            placeholder="Search customer, bank, agent..."
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <SkeletonTable rows={6} cols={6} />
      ) : isError ? (
        <QueryError message="Failed to load applications." onRetry={refetch} />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase text-slate-500 tracking-wider">
                  <th className="py-3 px-5">Customer</th>
                  <th className="py-3 px-4">Bank &amp; Product</th>
                  <th className="py-3 px-4">Loan Amount</th>
                  <th className="py-3 px-4">EMI / Month</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assigned Agent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 text-sm">
                      No applications match your criteria.
                    </td>
                  </tr>
                ) : (
                  apps.map((app) => {
                    const initials = app.customer.fullName.slice(0, 2).toUpperCase()
                    return (
                      <tr
                        key={app.id}
                        onClick={() => openDrawer(app)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${!app.customer.isActive ? 'opacity-75' : ''}`}
                      >
                        <td className="py-4 px-5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-sm font-semibold text-slate-900">{app.customer.fullName}</span>
                                {!app.customer.isActive && (
                                  <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] font-bold text-slate-500 uppercase">{app.loanType}</span>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-700 font-medium">
                          <span className="font-semibold text-slate-800">{app.bank.bankName}</span>
                          <span className="text-slate-400 mx-1">&middot;</span>
                          {app.product.productName}
                        </td>
                        <td className="py-4 px-4 text-sm font-bold text-slate-900">{fmt(app.loanAmountRequested)}</td>
                        <td className="py-4 px-4 text-sm text-slate-700">{fmt(app.emi)}/mo</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${STATUS_COLORS[app.status] ?? 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                            {app.status.charAt(0) + app.status.slice(1).toLowerCase()}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-sm text-slate-700 font-medium">{app.fieldAgent.fullName}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages} &middot; {pagination.total} applications
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={pagination.page <= 1}
                  className="h-8 px-3 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  disabled={pagination.page >= pagination.totalPages}
                  className="h-8 px-3 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Slide-over Drawer */}
      {selectedApp && (
        <>
          <div className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-xs" onClick={() => setSelectedApp(null)} />
          <div className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white shadow-2xl z-40 flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-slate-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {selectedApp.customer.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{selectedApp.customer.fullName}</p>
                  <p className="text-xs text-slate-500">{selectedApp.product.productName}</p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-5 space-y-5">
              {/* Inactive Warning */}
              {!selectedApp.customer.isActive && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3.5 text-xs text-rose-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Customer Inactive:</span> Application is frozen. Reactivate the customer profile to resume processing.
                  </div>
                </div>
              )}

              {/* Application Details */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Application Details</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Bank',           value: selectedApp.bank.bankName },
                    { label: 'Product',        value: selectedApp.product.productName },
                    { label: 'Loan Amount',    value: fmt(selectedApp.loanAmountRequested) },
                    { label: 'EMI / Month',    value: `${fmt(selectedApp.emi)}/mo` },
                    { label: 'Loan Type',      value: selectedApp.loanType },
                    { label: 'Assigned Agent', value: selectedApp.fieldAgent.fullName },
                  ].map((d) => (
                    <div key={d.label} className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                      <span className="text-[10px] text-slate-400 uppercase font-semibold tracking-wider block mb-0.5">{d.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{d.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Update Application Status</h3>
                <div className="relative">
                  <select
                    value={drawerStatus}
                    onChange={(e) => setDrawerStatus(e.target.value as AppStatus)}
                    disabled={!selectedApp.customer.isActive}
                    className="w-full appearance-none pl-3 pr-8 py-2.5 text-sm font-medium border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                  >
                    <option value="APPLIED">Applied</option>
                    <option value="PROCESSING">Processing</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Internal Notes */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-2">Internal Notes</h3>
                <textarea
                  rows={3}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  placeholder="Add notes for this application..."
                  disabled={!selectedApp.customer.isActive}
                  className="w-full text-sm border border-slate-200 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none bg-slate-50/50 disabled:bg-slate-100 disabled:cursor-not-allowed disabled:text-slate-400"
                />
              </div>

              {/* Commission Breakdown */}
              <div>
                <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-3">Commission Breakdown</h3>
                <div className="space-y-2.5">
                  {[
                    { label: 'Gross Bank Commission (est.)', value: '\u20b924,000' },
                    { label: 'Agent Earning (80%)',          value: '\u20b919,200', highlight: true },
                    { label: 'Company Retained (20%)',       value: '\u20b94,800' },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className={`flex justify-between items-center p-2.5 rounded-lg border text-xs font-medium ${
                        row.highlight ? 'bg-indigo-50 border-indigo-100 text-indigo-800' : 'bg-slate-50 border-slate-100 text-slate-700'
                      }`}
                    >
                      <span>{row.label}</span>
                      <span className="font-bold">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Customer Status Toggle */}
              <div className="pt-2 border-t border-slate-100">
                <button
                  onClick={() =>
                    setCustModal({
                      mode: selectedApp.customer.isActive ? 'deactivate' : 'reactivate',
                      customerId: selectedApp.customer.id,
                      customerName: selectedApp.customer.fullName,
                    })
                  }
                  className={`w-full h-9 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                    selectedApp.customer.isActive
                      ? 'text-rose-600 border-rose-200 hover:bg-rose-50'
                      : 'text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                  }`}
                >
                  {selectedApp.customer.isActive ? 'Deactivate Customer Profile' : 'Reactivate Customer Profile'}
                </button>
              </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 p-4 bg-white border-t border-slate-200">
              <button
                onClick={handleSaveChanges}
                disabled={!selectedApp.customer.isActive || updateApplicationStatus.isPending}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                {updateApplicationStatus.isPending ? 'Saving\u2026' : 'Save Changes'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Customer Status Confirm Modal */}
      {custModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-sm w-full p-6 space-y-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${custModal.mode === 'deactivate' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">
                  {custModal.mode === 'deactivate' ? 'Deactivate' : 'Reactivate'} {custModal.customerName}?
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  {custModal.mode === 'deactivate'
                    ? 'The customer profile will be frozen and applications paused.'
                    : 'The customer profile will be restored and applications can resume.'}
                </p>
              </div>
            </div>

            {custModal.mode === 'deactivate' && (
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Reason (required)</label>
                <textarea
                  rows={2}
                  value={deactivateReason}
                  onChange={(e) => setDeactivateReason(e.target.value)}
                  placeholder="Enter reason for deactivation..."
                  className="w-full text-sm border border-slate-200 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => { setCustModal(null); setDeactivateReason('') }}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmCustModal}
                disabled={
                  (custModal.mode === 'deactivate' && !deactivateReason.trim()) ||
                  deactivateCustomer.isPending ||
                  reactivateCustomer.isPending
                }
                className={`px-4 py-2 text-xs font-semibold text-white rounded-lg cursor-pointer disabled:opacity-50 ${
                  custModal.mode === 'deactivate' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {deactivateCustomer.isPending || reactivateCustomer.isPending
                  ? 'Processing\u2026'
                  : custModal.mode === 'deactivate'
                  ? 'Yes, Deactivate'
                  : 'Yes, Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
