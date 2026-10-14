import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Home,
  Percent,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Send,
} from 'lucide-react';
import type { LoanProductFormData, RateType, RateSlabItem } from '../../types/bank.types';

interface Step4RateAmountProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
  isEdit?: boolean;
  originalRates?: {
    rateMin: number;
    rateMax: number;
    rateSlabs: RateSlabItem[];
  };
  onUpdateAndNotify?: () => void;
  onSaveDraft?: () => void;
  onCancel?: () => void;
}

export const Step4RateAmount: React.FC<Step4RateAmountProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
  isEdit = false,
  originalRates,
  onUpdateAndNotify,
  onSaveDraft,
  onCancel,
}) => {
  // New slab form modal/inline
  const [newSlabLabel, setNewSlabLabel] = useState('');
  const [newSlabRate, setNewSlabRate] = useState<number>(8.50);
  const [showAddSlab, setShowAddSlab] = useState(false);

  // Rate modification tracking in Edit mode
  const isMinRateModified = Boolean(
    isEdit && originalRates && data.rateMin !== originalRates.rateMin
  );
  const isMaxRateModified = Boolean(
    isEdit && originalRates && data.rateMax !== originalRates.rateMax
  );

  // Check if any slab was modified
  const isSlabModified = Boolean(
    isEdit &&
      originalRates &&
      data.rateSlabs.some((slab) => {
        const orig = originalRates.rateSlabs.find((s) => s.id === slab.id || s.label === slab.label);
        return orig && orig.ratePercent !== slab.ratePercent;
      })
  );

  const isRateModified = isMinRateModified || isMaxRateModified || isSlabModified;

  const handleAddSlab = () => {
    if (!newSlabLabel.trim()) return;
    const newSlab: RateSlabItem = {
      id: String(Date.now()),
      minAmount: 0,
      maxAmount: 10000000,
      ratePercent: Number(newSlabRate),
      label: newSlabLabel.trim(),
    };
    onChange({ rateSlabs: [...data.rateSlabs, newSlab] });
    setNewSlabLabel('');
    setShowAddSlab(false);
  };

  const handleUpdateSlabRate = (id: string, newRate: number) => {
    onChange({
      rateSlabs: data.rateSlabs.map((s) =>
        s.id === id ? { ...s, ratePercent: newRate } : s
      ),
    });
  };

  const handleDeleteSlab = (id: string) => {
    onChange({ rateSlabs: data.rateSlabs.filter((s) => s.id !== id) });
  };

  const togglePropertyType = (type: string) => {
    const current = data.propertyTypes || [];
    if (current.includes(type)) {
      onChange({ propertyTypes: current.filter((t) => t !== type) });
    } else {
      onChange({ propertyTypes: [...current, type] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (data.rateMin > data.rateMax) {
      alert('Minimum interest rate cannot exceed maximum interest rate.');
      return;
    }
    if (data.minAmount > data.maxAmount) {
      alert('Minimum loan amount cannot exceed maximum loan amount.');
      return;
    }
    if (data.minTenureMonths > data.maxTenureMonths) {
      alert('Minimum tenure cannot exceed maximum tenure.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          {isEdit ? 'Edit Product Parameters - Rate & Amount' : 'Rate & Amount Configuration'}
        </h2>
        <p className="text-xs text-slate-500">
          Define the financial parameters, interest structures, and slab benchmarks.
        </p>
      </div>

      {/* 1. Rate Type Segmented Toggle */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Interest Rate Type <span className="text-rose-500">*</span>
        </label>
        <div className="inline-flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          {(['FIXED', 'FLOATING', 'BOTH'] as RateType[]).map((type) => {
            const isSelected = data.rateType === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => onChange({ rateType: type })}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-[#4648d4] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Base Interest Rate Range */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700">
          Base Interest Rate Range (%) <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-4 max-w-xl">
          {/* Min Rate Input with Delta Indicator */}
          <div className="relative flex-1">
            <input
              type="number"
              required
              step="0.01"
              min={1}
              max={35}
              value={data.rateMin}
              onChange={(e) => onChange({ rateMin: Number(e.target.value) })}
              placeholder="Min Rate"
              className={`w-full h-11 pl-4 pr-10 rounded-xl bg-white text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                isMinRateModified
                  ? 'border-2 border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/10'
                  : 'border border-slate-200 focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              %
            </span>

            {/* Inline Delta Tag for Min Rate */}
            {isMinRateModified && originalRates && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                {data.rateMin < originalRates.rateMin ? (
                  <ArrowDown className="w-3 h-3 text-amber-700" />
                ) : (
                  <ArrowUp className="w-3 h-3 text-amber-700" />
                )}
                <span>from {originalRates.rateMin.toFixed(2)}%</span>
              </div>
            )}
          </div>

          <span className="text-xs text-slate-400 font-bold uppercase">to</span>

          {/* Max Rate Input */}
          <div className="relative flex-1">
            <input
              type="number"
              required
              step="0.01"
              min={1}
              max={35}
              value={data.rateMax}
              onChange={(e) => onChange({ rateMax: Number(e.target.value) })}
              placeholder="Max Rate"
              className={`w-full h-11 pl-4 pr-10 rounded-xl bg-white text-xs font-bold text-slate-900 focus:outline-none transition-all ${
                isMaxRateModified
                  ? 'border-2 border-amber-500 shadow-[0_0_0_4px_rgba(245,158,11,0.15)] ring-2 ring-amber-500/10'
                  : 'border border-slate-200 focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs'
              }`}
            />
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
              %
            </span>
            {isMaxRateModified && originalRates && (
              <div className="absolute right-9 top-1/2 -translate-y-1/2 flex items-center gap-1 text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[10px] font-bold">
                <span>from {originalRates.rateMax.toFixed(2)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Warning Banner (Stitch 06dbe793 & 96746801) */}
        {isRateModified && originalRates && (
          <div className="mt-3 bg-[#fffbeb] border border-amber-300/80 rounded-xl p-4 flex gap-3 items-start shadow-xs animate-in fade-in duration-200">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900 mb-0.5">
                Rate change will trigger notifications
              </h4>
              <p className="text-xs text-amber-800/90 leading-relaxed">
                Changing this rate from{' '}
                <strong className="font-bold text-amber-950">
                  {originalRates.rateMin.toFixed(2)}%
                </strong>{' '}
                to{' '}
                <strong className="font-bold text-amber-950">
                  {data.rateMin.toFixed(2)}%
                </strong>{' '}
                will send notifications to{' '}
                <strong className="font-bold text-amber-950">12 DSAs</strong> currently holding draft applications.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. Loan Amount & Tenure Ranges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Loan Amount */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Loan Amount Range (₹) <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              required
              step="50000"
              value={data.minAmount}
              onChange={(e) => onChange({ minAmount: Number(e.target.value) })}
              placeholder="Min (e.g. 500000)"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
            <span className="text-slate-400 text-xs font-bold">–</span>
            <input
              type="number"
              required
              step="50000"
              value={data.maxAmount}
              onChange={(e) => onChange({ maxAmount: Number(e.target.value) })}
              placeholder="Max (e.g. 50000000)"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            From ₹{(data.minAmount / 100000).toFixed(1)}L to ₹{(data.maxAmount / 10000000).toFixed(1)}Cr
          </p>
        </div>

        {/* Tenure (months) */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            Tenure Range (Months) <span className="text-rose-500">*</span>
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              required
              min={12}
              max={480}
              value={data.minTenureMonths}
              onChange={(e) => onChange({ minTenureMonths: Number(e.target.value) })}
              placeholder="Min Months"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
            <span className="text-slate-400 text-xs font-bold">–</span>
            <input
              type="number"
              required
              min={12}
              max={480}
              value={data.maxTenureMonths}
              onChange={(e) => onChange({ maxTenureMonths: Number(e.target.value) })}
              placeholder="Max Months"
              className="w-full h-11 px-3.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
            />
          </div>
          <p className="text-[11px] text-slate-400">
            {Math.round(data.minTenureMonths / 12)} years to {Math.round(data.maxTenureMonths / 12)} years repayment term
          </p>
        </div>
      </div>

      {/* 4. Rate Slabs Table (schema_v2.md RateSlab Model) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <label className="block text-xs font-bold text-slate-700">
              Rate Slabs by Loan Amount (optional)
            </label>
            <p className="text-[11px] text-slate-400">
              Configure tiered interest rate margins based on loan ticket size.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddSlab(true)}
            className="text-xs font-bold text-[#4648d4] hover:text-[#3b3dbb] flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Slab</span>
          </button>
        </div>

        {/* Inline Add Slab Form */}
        {showAddSlab && (
          <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 flex flex-wrap items-center gap-3 animate-in fade-in duration-100">
            <input
              type="text"
              placeholder="Tier Label (e.g. ₹75L - ₹1.5Cr)"
              value={newSlabLabel}
              onChange={(e) => setNewSlabLabel(e.target.value)}
              className="flex-1 min-w-[200px] h-9 px-3 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#4648d4]"
            />
            <div className="relative w-28">
              <input
                type="number"
                step="0.01"
                placeholder="Rate %"
                value={newSlabRate}
                onChange={(e) => setNewSlabRate(Number(e.target.value))}
                className="w-full h-9 pl-3 pr-7 text-xs rounded-lg border border-slate-200 bg-white focus:outline-none focus:border-[#4648d4]"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">
                %
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddSlab}
              className="px-3.5 py-2 bg-[#4648d4] text-white text-xs font-bold rounded-lg hover:bg-[#3b3dbb] transition-colors"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddSlab(false)}
              className="px-3 py-2 text-xs text-slate-500 hover:text-slate-800"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Slabs Table */}
        <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 font-bold text-slate-500">
              <tr>
                <th className="px-4 py-3 uppercase tracking-wider">Amount Range Label</th>
                <th className="px-4 py-3 uppercase tracking-wider w-44">Applicable Rate (%)</th>
                <th className="px-4 py-3 w-16 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.rateSlabs.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-slate-400">
                    No custom rate slabs defined. Base rate range applies uniformly.
                  </td>
                </tr>
              ) : (
                data.rateSlabs.map((slab) => {
                  const origSlab = originalRates?.rateSlabs.find(
                    (s) => s.id === slab.id || s.label === slab.label
                  );
                  const isThisSlabModified = Boolean(
                    isEdit && origSlab && origSlab.ratePercent !== slab.ratePercent
                  );

                  return (
                    <tr
                      key={slab.id}
                      className={`hover:bg-slate-50/50 group transition-colors ${
                        isThisSlabModified ? 'bg-amber-50/30' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {slab.label || `₹${slab.minAmount} - ₹${slab.maxAmount}`}
                      </td>
                      <td className="px-4 py-2">
                        {isEdit ? (
                          <div className="relative w-28">
                            <input
                              type="number"
                              step="0.01"
                              value={slab.ratePercent}
                              onChange={(e) =>
                                handleUpdateSlabRate(slab.id, Number(e.target.value))
                              }
                              className={`w-full h-8 px-2.5 rounded-lg text-xs font-bold transition-all ${
                                isThisSlabModified
                                  ? 'border-2 border-amber-400 bg-amber-50/60 text-amber-950 shadow-xs'
                                  : 'border border-slate-200 bg-white text-[#4648d4] focus:border-[#4648d4]'
                              }`}
                            />
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold pointer-events-none">
                              %
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-[#4648d4]">
                            {slab.ratePercent.toFixed(2)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleDeleteSlab(slab.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Delete Slab"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Home Loan Configuration Panel */}
      {data.loanType === 'HOME' && (
        <div className="bg-indigo-50/40 rounded-2xl p-6 border border-indigo-100 relative overflow-hidden space-y-5">
          <div className="flex items-center gap-2 text-indigo-900 font-bold text-sm">
            <Home className="w-4 h-4 text-[#4648d4]" />
            <span>Home Loan Configuration</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Max LTV */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-indigo-500" />
                Maximum Loan-to-Value (LTV %)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={90}
                  value={data.ltvPercent || 80}
                  onChange={(e) => onChange({ ltvPercent: Number(e.target.value) })}
                  placeholder="80"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 shadow-xs"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">
                  %
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Regulatory cap set by RBI is typically 80%–90% based on ticket size
              </p>
            </div>

            {/* Eligible Property Types */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                Eligible Property Types
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {['Residential', 'Under Construction', 'Commercial', 'Plot'].map((prop) => {
                  const isChecked = (data.propertyTypes || []).includes(prop);
                  return (
                    <label
                      key={prop}
                      className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                        isChecked
                          ? 'border-indigo-300 bg-indigo-50/80 text-indigo-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => togglePropertyType(prop)}
                        className="w-4 h-4 text-[#4648d4] rounded border-slate-300 focus:ring-indigo-500"
                      />
                      <span className="text-xs">{prop}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Left Side: Back & Cancel */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={onPrev}
            className="px-4 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
          {isEdit && onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {isEdit && onSaveDraft && (
            <button
              type="button"
              onClick={onSaveDraft}
              className="px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 shadow-xs transition-colors"
            >
              Save Draft
            </button>
          )}

          {/* Stitch 06dbe793 & 96746801: Highlighted Amber "Update & Notify DSAs" Button */}
          {isEdit && isRateModified && onUpdateAndNotify ? (
            <button
              type="button"
              onClick={onUpdateAndNotify}
              className="h-10 px-6 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white text-xs font-bold shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Update & Notify DSAs</span>
            </button>
          ) : (
            <button
              type="submit"
              className="h-10 px-6 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
            >
              <span>Next: Commission</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
