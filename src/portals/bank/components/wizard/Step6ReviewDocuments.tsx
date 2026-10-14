import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Plus,
  FileText,
  ShieldCheck,
  Percent,
  MapPin,
  Send,
  Save,
} from 'lucide-react';
import type { LoanProductFormData } from '../../types/bank.types';

interface Step6ReviewDocumentsProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onPublish: (asDraft: boolean) => void;
  onPrev: () => void;
  onJumpToStep: (stepNumber: number) => void;
}

const COMMON_DOCUMENTS = [
  'PAN Card',
  'Aadhaar Card',
  'Last 3 Months Salary Slips',
  '6 Months Bank Statement',
  'Property Documents (Draft)',
  'IT Returns (2 Years)',
  'Form 16',
  'Processing Fee Cheque',
  'Business Registration Certificate',
];

export const Step6ReviewDocuments: React.FC<Step6ReviewDocumentsProps> = ({
  data,
  onChange,
  onPublish,
  onPrev,
  onJumpToStep,
}) => {
  const [customDocInput, setCustomDocInput] = useState('');

  const toggleDocument = (doc: string) => {
    if (data.requiredDocuments.includes(doc)) {
      onChange({
        requiredDocuments: data.requiredDocuments.filter((d) => d !== doc),
      });
    } else {
      onChange({ requiredDocuments: [...data.requiredDocuments, doc] });
    }
  };

  const handleAddCustomDoc = () => {
    if (!customDocInput.trim()) return;
    if (!data.requiredDocuments.includes(customDocInput.trim())) {
      onChange({
        requiredDocuments: [...data.requiredDocuments, customDocInput.trim()],
      });
    }
    setCustomDocInput('');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Required Documents & Final Review
        </h2>
        <p className="text-xs text-slate-500">
          Confirm compliance requirements and verify all parameters before publishing to DSA channels.
        </p>
      </div>

      {/* 1. Required Documents Checklist */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <FileText className="w-4 h-4 text-indigo-500" />
          Required Borrower Documents Checklist
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
          {COMMON_DOCUMENTS.map((doc) => {
            const isChecked = data.requiredDocuments.includes(doc);
            return (
              <button
                key={doc}
                type="button"
                onClick={() => toggleDocument(doc)}
                className={`p-3 rounded-xl border text-xs font-medium text-left flex items-center gap-2.5 transition-all ${
                  isChecked
                    ? 'border-indigo-200 bg-indigo-50/60 text-indigo-900 font-semibold'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-[#4648d4] border-[#4648d4] text-white'
                      : 'border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className="truncate">{doc}</span>
              </button>
            );
          })}
        </div>

        {/* Add custom document input */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="text"
            placeholder="Add custom required document (e.g. Rent Agreement)..."
            value={customDocInput}
            onChange={(e) => setCustomDocInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddCustomDoc();
              }
            }}
            className="flex-1 h-9 px-3.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#4648d4]"
          />
          <button
            type="button"
            onClick={handleAddCustomDoc}
            className="h-9 px-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add</span>
          </button>
        </div>
      </div>

      {/* 2. Comprehensive Review Cards */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          Configuration Summary
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Summary Box: Basic Info & Coverage */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-indigo-500" /> Basic Info & Coverage
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(1)}
                className="text-[11px] text-[#4648d4] font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Product Name</span>
                <span className="font-semibold text-slate-800">{data.name || 'Untitled'}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Loan Type</span>
                <span className="font-semibold text-slate-800">{data.loanType}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[11px]">Serviceable States</span>
                <span className="font-semibold text-slate-800">
                  {data.isPanIndia ? 'PAN-India (All States)' : data.serviceableStates.join(', ')}
                </span>
              </div>
            </div>
          </div>

          {/* Summary Box: Eligibility */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Eligibility Criteria
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(3)}
                className="text-[11px] text-[#4648d4] font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Min Monthly Income</span>
                <span className="font-semibold text-slate-800">
                  ₹{data.minMonthlyIncome.toLocaleString('en-IN')}/mo
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Min CIBIL Score</span>
                <span className="font-semibold text-slate-800">{data.minCibilScore}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Age Range</span>
                <span className="font-semibold text-slate-800">{data.minAge} – {data.maxAge} years</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Min Experience</span>
                <span className="font-semibold text-slate-800">{data.minEmploymentYears} years</span>
              </div>
            </div>
          </div>

          {/* Summary Box: Rates & Amount */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-indigo-500" /> Rates & Tenure
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(4)}
                className="text-[11px] text-[#4648d4] font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Interest Rate Range</span>
                <span className="font-bold text-[#4648d4]">
                  {data.rateMin.toFixed(2)}% – {data.rateMax.toFixed(2)}% ({data.rateType})
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Loan Amount</span>
                <span className="font-semibold text-slate-800">
                  ₹{(data.minAmount / 100000).toFixed(1)}L – ₹{(data.maxAmount / 10000000).toFixed(1)}Cr
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tenure Range</span>
                <span className="font-semibold text-slate-800">
                  {data.minTenureMonths} – {data.maxTenureMonths} mos
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Rate Slabs Count</span>
                <span className="font-semibold text-slate-800">
                  {data.rateSlabs.length} slabs configured
                </span>
              </div>
            </div>
          </div>

          {/* Summary Box: Commission & Fees */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" /> DSA Commission & Fees
              </span>
              <button
                type="button"
                onClick={() => onJumpToStep(5)}
                className="text-[11px] text-[#4648d4] font-semibold hover:underline"
              >
                Edit
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">DSA Commission</span>
                <span className="font-bold text-emerald-700">
                  {data.commissionPercent.toFixed(2)}% of disbursed
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Payout Timeline</span>
                <span className="font-semibold text-slate-800">{data.commissionPayoutDays} days</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Borrower Fee</span>
                <span className="font-semibold text-slate-800">{data.processingFeePercent.toFixed(2)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Publishing Actions */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Commission</span>
        </button>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => onPublish(true)}
            className="flex-1 sm:flex-none h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4 text-slate-500" />
            <span>Save as Draft</span>
          </button>

          <button
            type="button"
            onClick={() => onPublish(false)}
            className="flex-1 sm:flex-none h-11 px-7 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>Publish Product</span>
          </button>
        </div>
      </div>
    </div>
  );
};
