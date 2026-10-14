import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Percent, Clock, Lightbulb, Calculator } from 'lucide-react';
import type { LoanProductFormData } from '../../types/bank.types';

interface Step5CommissionProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step5Commission: React.FC<Step5CommissionProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  // Commission simulator amount
  const [simulatedLoanAmount, setSimulatedLoanAmount] = useState<number>(5000000); // 50L default

  const estimatedEarnings = Math.round(
    (simulatedLoanAmount * data.commissionPercent) / 100
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.commissionPercent <= 0) {
      alert('Please specify a positive DSA commission rate.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          DSA Commission & Processing Fees
        </h2>
        <p className="text-xs text-slate-500">
          Establish the gross payout rate and operational settlement rules for DSA partners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gross Commission % */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Percent className="w-3.5 h-3.5 text-indigo-500" />
            Gross DSA Commission (% of Disbursed Amount) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              step="0.05"
              min={0.1}
              max={10}
              value={data.commissionPercent}
              onChange={(e) =>
                onChange({ commissionPercent: Number(e.target.value) })
              }
              placeholder="0.50"
              className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              %
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Base rate paid to the DSA company before internal field agent split rules
          </p>
        </div>

        {/* Payout Timeline */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            Payout Timeline (Days Post Disbursement) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <input
              type="number"
              required
              min={1}
              max={90}
              value={data.commissionPayoutDays}
              onChange={(e) =>
                onChange({ commissionPayoutDays: Number(e.target.value) })
              }
              placeholder="30"
              className="w-full h-11 pl-4 pr-14 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">
              days
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Standard SLA for bank invoice clearance and bank transfer
          </p>
        </div>

        {/* Processing Fee % */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Borrower Processing Fee (%)
          </label>
          <div className="relative">
            <input
              type="number"
              step="0.05"
              min={0}
              max={5}
              value={data.processingFeePercent}
              onChange={(e) =>
                onChange({ processingFeePercent: Number(e.target.value) })
              }
              placeholder="0.50"
              className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              %
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            One-time administrative processing fee charged to the borrower
          </p>
        </div>

        {/* Commission Notes */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Commission SLA & Policy Notes
          </label>
          <input
            type="text"
            value={data.commissionNotes || ''}
            onChange={(e) => onChange({ commissionNotes: e.target.value })}
            placeholder="e.g. Applicable on net disbursed principal amount..."
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
          />
        </div>
      </div>

      {/* Live Commission Simulator Card */}
      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm mb-4">
          <Calculator className="w-4 h-4 text-emerald-700" />
          <span>Interactive Commission Payout Simulator</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
              <span>Simulate Loan Disbursed Amount:</span>
              <span className="font-mono text-[#4648d4] font-bold">
                ₹{(simulatedLoanAmount / 100000).toFixed(0)} Lakhs
              </span>
            </div>
            <input
              type="range"
              min={500000}
              max={20000000}
              step={500000}
              value={simulatedLoanAmount}
              onChange={(e) => setSimulatedLoanAmount(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-emerald-200/60 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>₹5L</span>
              <span>₹1 Cr</span>
              <span>₹2 Cr</span>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-emerald-100 flex items-start gap-3 shadow-2xs">
            <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-0.5">
                Estimated Gross DSA Commission
              </p>
              <p className="text-xl font-bold text-emerald-700">
                ₹{estimatedEarnings.toLocaleString('en-IN')}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Paid within {data.commissionPayoutDays} days of loan disbursement.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Rate & Amount</span>
        </button>

        <button
          type="submit"
          className="h-10 px-6 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <span>Next: Review & Documents</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
