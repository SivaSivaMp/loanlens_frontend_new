import React from 'react';
import { AlertTriangle, ArrowRight, X } from 'lucide-react';

interface RateChangeConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  oldRate?: number;
  newRate?: number;
  targetLabel?: string;
  dsaCount?: number;
}

export const RateChangeConfirmModal: React.FC<RateChangeConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  oldRate = 8.75,
  newRate = 8.25,
  targetLabel = 'minimum base rate',
  dsaCount = 12,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Modal Card */}
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200/80 transform scale-100 transition-all animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
          title="Close modal"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center pt-8">
          {/* Glowing Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#fffbeb] mb-6 ring-8 ring-[#fef3c7]">
            <AlertTriangle className="w-8 h-8 text-[#d97706]" />
          </div>

          {/* Title & Description */}
          <h3 className="text-xl font-bold text-slate-900 mb-2.5">
            Confirm Rate Change
          </h3>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            You're changing the <span className="font-bold text-slate-800">{targetLabel}</span>. This will immediately notify{' '}
            <strong className="text-slate-900 font-bold">{dsaCount} DSAs</strong> who have matched customers or active draft applications. Do you want to proceed?
          </p>

          {/* Visual Delta Box */}
          <div className="flex items-center justify-center gap-6 bg-slate-50 py-4 px-6 rounded-xl border border-slate-200/80 mb-8">
            <div className="text-rose-500 font-bold text-lg line-through opacity-75">
              {oldRate.toFixed(2)}%
            </div>
            <div className="w-8 h-8 rounded-full bg-white shadow-xs border border-slate-200/60 flex items-center justify-center text-slate-400">
              <ArrowRight className="w-4 h-4" />
            </div>
            <div className="text-emerald-600 font-extrabold text-xl">
              {newRate.toFixed(2)}%
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-11 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 font-bold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 h-11 rounded-xl bg-[#f59e0b] hover:bg-[#d97706] text-white font-bold text-xs transition-all shadow-md shadow-amber-500/20 focus:ring-4 focus:ring-amber-500/20"
            >
              Yes, Update Rate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
