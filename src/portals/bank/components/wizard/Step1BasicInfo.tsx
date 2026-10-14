import React, { useState } from 'react';
import {
  Home,
  User,
  Car,
  Briefcase,
  Coins,
  Building,
  UploadCloud,
  CheckCircle2,
  FileCheck,
} from 'lucide-react';
import type { LoanProductFormData, LoanType } from '../../types/bank.types';

interface Step1BasicInfoProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

const loanTypeOptions: { type: LoanType; label: string; icon: React.ElementType }[] = [
  { type: 'HOME', label: 'Home Loan', icon: Home },
  { type: 'PERSONAL', label: 'Personal Loan', icon: User },
  { type: 'CAR', label: 'Car Loan', icon: Car },
  { type: 'BUSINESS', label: 'Business Loan', icon: Briefcase },
  { type: 'GOLD', label: 'Gold Loan', icon: Coins },
  { type: 'LAP', label: 'Loan Against Property', icon: Building },
];

export const Step1BasicInfo: React.FC<Step1BasicInfoProps> = ({
  data,
  onChange,
  onNext,
  onCancel,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.name.trim()) {
      setError('Please provide a product name.');
      return;
    }
    setError(null);
    onNext();
  };

  const handleFileUpload = (file: File) => {
    if (file && file.type === 'application/pdf') {
      onChange({
        brochureName: file.name,
        brochureUrl: URL.createObjectURL(file),
      });
    } else {
      alert('Please upload a PDF document (max 10MB).');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Basic Information
        </h2>
        <p className="text-xs text-slate-500">
          Start with the fundamentals and branding of your loan scheme.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
          {error}
        </div>
      )}

      {/* 1. Product Name */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Product Name <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          value={data.name}
          onChange={(e) => {
            setError(null);
            onChange({ name: e.target.value });
          }}
          placeholder="e.g. SBI Home Loan — Advantage Rate"
          className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all shadow-xs"
        />
      </div>

      {/* 2. Loan Type Selector Grid */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Loan Category <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {loanTypeOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = data.loanType === opt.type;

            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => onChange({ loanType: opt.type })}
                className={`flex flex-col p-4 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'border-[#4648d4] bg-indigo-50/50 shadow-xs ring-2 ring-indigo-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#4648d4] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-[#4648d4]" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold ${
                    isSelected ? 'text-[#4648d4]' : 'text-slate-800'
                  }`}
                >
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Product Description */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="block text-xs font-bold text-slate-700">
            Product Description
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {data.description.length} / 500
          </span>
        </div>
        <textarea
          rows={4}
          maxLength={500}
          value={data.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Detail the target customer segment, key advantages, and repayment flexibility..."
          className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all resize-none shadow-xs"
        />
      </div>

      {/* 4. Brochure Upload */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Product Brochure (optional PDF)
        </label>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={() => setDragActive(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragActive(false);
            if (e.dataTransfer.files?.[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative bg-slate-50/50 ${
            dragActive
              ? 'border-[#4648d4] bg-indigo-50/30'
              : data.brochureName
              ? 'border-emerald-300 bg-emerald-50/30'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleFileUpload(e.target.files[0]);
              }
            }}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
          />
          {data.brochureName ? (
            <div className="flex items-center gap-2 text-emerald-700">
              <FileCheck className="w-8 h-8 text-emerald-600" />
              <div className="text-left">
                <p className="text-xs font-bold">{data.brochureName}</p>
                <p className="text-[11px] text-emerald-600">Brochure ready to attach</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#4648d4] mb-2 shadow-xs">
                <UploadCloud className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-800 mb-0.5">
                Drop PDF brochure here or click to browse
              </p>
              <p className="text-[11px] text-slate-400">
                PDF format only, maximum 10MB
              </p>
            </>
          )}
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onCancel}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="h-10 px-6 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-2"
        >
          <span>Next: Target Audience</span>
          <span>→</span>
        </button>
      </div>
    </form>
  );
};
