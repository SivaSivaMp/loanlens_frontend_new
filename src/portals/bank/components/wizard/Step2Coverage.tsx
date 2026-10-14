import React from 'react';
import { MapPin, Globe, Check, ArrowLeft, ArrowRight } from 'lucide-react';
import type { LoanProductFormData } from '../../types/bank.types';

interface Step2CoverageProps {
  data: LoanProductFormData;
  onChange: (fields: Partial<LoanProductFormData>) => void;
  onNext: () => void;
  onPrev: () => void;
}

const INDIAN_STATES = [
  'Kerala',
  'Karnataka',
  'Maharashtra',
  'Tamil Nadu',
  'Telangana',
  'Andhra Pradesh',
  'Delhi NCR',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Odisha',
  'Goa',
];

export const Step2Coverage: React.FC<Step2CoverageProps> = ({
  data,
  onChange,
  onNext,
  onPrev,
}) => {
  const toggleState = (state: string) => {
    if (data.isPanIndia) return;
    const current = data.serviceableStates.filter((s) => s !== 'PAN_INDIA');
    if (current.includes(state)) {
      onChange({ serviceableStates: current.filter((s) => s !== state) });
    } else {
      onChange({ serviceableStates: [...current, state] });
    }
  };

  const handlePanIndiaToggle = (isPan: boolean) => {
    onChange({
      isPanIndia: isPan,
      serviceableStates: isPan ? ['PAN_INDIA'] : ['Kerala', 'Karnataka'],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.isPanIndia && data.serviceableStates.length === 0) {
      alert('Please select at least one serviceable state.');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-1">
          Target Audience & Geographic Coverage
        </h2>
        <p className="text-xs text-slate-500">
          Specify which states and regional DSA networks can distribute this scheme.
        </p>
      </div>

      {/* PAN India vs State Specific Toggle */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-[#4648d4]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                PAN-India Availability
              </h4>
              <p className="text-[11px] text-slate-500">
                Make this product accessible across all 28 states and union territories.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handlePanIndiaToggle(true)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                data.isPanIndia
                  ? 'bg-[#4648d4] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              All India
            </button>
            <button
              type="button"
              onClick={() => handlePanIndiaToggle(false)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                !data.isPanIndia
                  ? 'bg-[#4648d4] text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              Select States
            </button>
          </div>
        </div>

        {/* State Selection Chips (shown if not PAN-India) */}
        {!data.isPanIndia && (
          <div className="mt-5 pt-5 border-t border-slate-200/80 space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                Select Serviceable States ({data.serviceableStates.length} selected)
              </label>
              <button
                type="button"
                onClick={() => onChange({ serviceableStates: [...INDIAN_STATES] })}
                className="text-[11px] font-semibold text-[#4648d4] hover:underline"
              >
                Select All
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {INDIAN_STATES.map((state) => {
                const isSelected = data.serviceableStates.includes(state);
                return (
                  <button
                    key={state}
                    type="button"
                    onClick={() => toggleState(state)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-indigo-50 text-[#4648d4] border border-indigo-200 font-semibold shadow-2xs'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{state}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Regional Branch Hub Notes */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Regional Processing Hubs / Branch Notes (optional)
        </label>
        <textarea
          rows={3}
          value={data.branchCoverageNotes || ''}
          onChange={(e) => onChange({ branchCoverageNotes: e.target.value })}
          placeholder="e.g. Applicable only through branches with RACPC approval centers..."
          className="w-full p-3.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#4648d4] focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-400 transition-all resize-none shadow-xs"
        />
      </div>

      {/* Footer Navigation */}
      <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Previous: Basic Info</span>
        </button>

        <button
          type="submit"
          className="h-10 px-6 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 hover:shadow-lg transition-all flex items-center gap-1.5"
        >
          <span>Next: Eligibility</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </form>
  );
};
