// src/portals/company/components/common/ConvertToLeadModal.tsx
// Modal to convert a portal customer to a lead for this DSA company.

import React, { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { useCreateLead } from "../../hooks/useLeads";
import { useQueryClient } from "@tanstack/react-query";
import { portalCustomerKeys } from "../../hooks/useCustomers";

const LOAN_TYPES = [
  { value: "HOME",     label: "Home Loan" },
  { value: "PERSONAL", label: "Personal Loan" },
  { value: "CAR",      label: "Car Loan" },
  { value: "BUSINESS", label: "Business Loan" },
  { value: "GOLD",     label: "Gold Loan" },
  { value: "EDUCATION",label: "Education Loan" },
];

interface Props {
  portalUserId: string;
  customerName: string;
  onClose: () => void;
}

export const ConvertToLeadModal: React.FC<Props> = ({
  portalUserId,
  customerName,
  onClose,
}) => {
  const [loanType, setLoanType]           = useState("HOME");
  const [requiredAmount, setRequiredAmount] = useState("");
  const [note, setNote]                   = useState("");

  const queryClient = useQueryClient();
  const createLead  = useCreateLead();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(requiredAmount);
    if (!amount || amount <= 0) return;

    createLead.mutate(
      {
        portalUserId,
        loanType,
        requiredAmount: amount,
        customerNote: note || undefined,
        interestedProduct: "",
      },
      {
        onSuccess: () => {
          // Refresh the customers list so the "Lead ✓" badge appears
          queryClient.invalidateQueries({ queryKey: portalCustomerKeys.all });
          onClose();
        },
      },
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Convert to Lead</h3>
              <p className="text-xs text-slate-500">{customerName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Loan Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Loan Type <span className="text-rose-500">*</span>
            </label>
            <select
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {LOAN_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Required Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Required Amount (₹) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              value={requiredAmount}
              onChange={(e) => setRequiredAmount(e.target.value)}
              placeholder="e.g. 2500000"
              min={1}
              className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Initial Note <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g. Customer called in asking about home loan rates..."
              className="w-full text-sm border border-slate-200 rounded-lg p-3 text-slate-700 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none bg-slate-50/50"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!requiredAmount || parseFloat(requiredAmount) <= 0 || createLead.isPending}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              {createLead.isPending ? "Creating…" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
