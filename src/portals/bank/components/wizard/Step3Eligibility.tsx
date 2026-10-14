import React from 'react';
import { ArrowLeft, ArrowRight, ShieldCheck, DollarSign, Calendar, Briefcase } from 'lucide-react';
import type { LoanProductFormData, EmploymentType } from '../../types/bank.types';

interface Step3EligibilityProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export const Step3Eligibility: React.FC<Step3EligibilityProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const toggleEmployment = (type: EmploymentType) => {
    const current = data.acceptedEmployment;
    if (current.includes(type)) {
      if (current.length === 1) return; // Keep at least one
      onChange({ acceptedEmployment: current.filter((t) => t !== type) });
    } else {
      onChange({ acceptedEmployment: [...current, type] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.minAge >= data.maxAge) {
      alert('Minimum age must be strictly less than maximum age.');
      return;
    }
    onNext();
  };

  const getCibilQuality = (score: number) => {
    if (score >= 750) return { label: 'Excellent', color: 'text-emerald-600 bg-emerald-50 border-emerald-200' };
    if (score >= 700) return { label: 'Good (Standard)', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    if (score >= 650) return { label: 'Moderate', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'Subprime', color: 'text-rose-600 bg-rose-50 border-rose-200' };
  };

  const cibilBadge = getCibilQuality(data.minCibilScore);

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Borrower Eligibility Criteria
        </h2>
        <p className="text-xs text-slate-500">
          Define underwriting thresholds for automated lead qualification across DSAs.
        </p>
      </div>

      {/* Grid: Income & Age */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Min Monthly Income */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-indigo-500" />
            Minimum Monthly Income (₹) <span className="text-rose-500">*</span>
          </label>
          <input
            type="number"
            required
            min={5000}
            step={1000}
            value={data.minMonthlyIncome}
            onChange={(e) => onChange({ minMonthlyIncome: Number(e.target.value) })}
            placeholder="e.g. 25000"
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
          />
          <p className="text-[11px] text-slate-400">
            Net take-home monthly salary after taxes
          </p>
        </div>

        {/* CIBIL Score Threshold */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Minimum CIBIL Score <span className="text-rose-500">*</span>
            </label>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cibilBadge.color}`}>
              {cibilBadge.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={600}
              max={850}
              step={10}
              value={data.minCibilScore}
              onChange={(e) => onChange({ minCibilScore: Number(e.target.value) })}
              className="flex-1 accent-[#4648d4] h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="w-14 text-center py-1 bg-slate-100 rounded-lg text-xs font-mono font-bold text-slate-900 border border-slate-200">
              {data.minCibilScore}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Recommended baseline is 700+ for prime bank interest rates
          </p>
        </div>
      </div>

      {/* Age Bracket Grid */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-indigo-500" />
          Eligible Age Bracket (Years) <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Minimum Age</span>
            <input
              type="number"
              required
              min={18}
              max={65}
              value={data.minAge}
              onChange={(e) => onChange({ minAge: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          <div>
            <span className="text-[11px] text-slate-400 block mb-1">Maximum Age</span>
            <input
              type="number"
              required
              min={21}
              max={75}
              value={data.maxAge}
              onChange={(e) => onChange({ maxAge: Number(e.target.value) })}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Employment Types & Minimum Experience */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-indigo-500" />
            Accepted Employment Types <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            {[
              { type: 'SALARIED' as EmploymentType, label: 'Salaried' },
              { type: 'SELF_EMPLOYED' as EmploymentType, label: 'Self-Employed' },
            ].map((emp) => {
              const isSelected = data.acceptedEmployment.includes(emp.type);
              return (
                <button
                  key={emp.type}
                  type="button"
                  onClick={() => toggleEmployment(emp.type)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    isSelected
                      ? 'bg-indigo-50 text-[#4648d4] border-indigo-200 shadow-2xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {emp.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Minimum Total Work Experience (Years)
          </label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={data.minEmploymentYears}
            onChange={(e) => onChange({ minEmploymentYears: Number(e.target.value) })}
            className="w-full h-11 px-4 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
          />
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
          <span>Previous: Target Audience</span>
        </button>

        <button
          type="submit"
          className="h-10 px-6 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <span>Next: Rate & Amount</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
