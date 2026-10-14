import React from 'react';
import { Check } from 'lucide-react';

export interface StepItem {
  number: number;
  label: string;
}

interface WizardStepperProps {
  currentStep: number;
  onStepClick: (stepNumber: number) => void;
}

export const WIZARD_STEPS: StepItem[] = [
  { number: 1, label: 'Basic Info' },
  { number: 2, label: 'Target Audience' },
  { number: 3, label: 'Eligibility' },
  { number: 4, label: 'Rate & Amount' },
  { number: 5, label: 'Commission' },
  { number: 6, label: 'Review & Docs' },
];

export const WizardStepper: React.FC<WizardStepperProps> = ({
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="bg-white rounded-xl p-5 sm:p-6 shadow-xs border border-slate-200/80 mb-6 overflow-x-auto">
      <div className="flex items-center justify-between min-w-[620px] relative">
        {/* Continuous background track behind the steps */}
        <div className="absolute left-4 right-4 top-4 h-[2px] bg-slate-200 -z-0" />

        {WIZARD_STEPS.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isAccessible = step.number <= currentStep;

          return (
            <React.Fragment key={step.number}>
              <button
                type="button"
                disabled={!isAccessible}
                onClick={() => isAccessible && onStepClick(step.number)}
                className={`relative z-10 flex items-center gap-2.5 bg-white px-2.5 py-1 rounded-full transition-all text-left ${
                  isAccessible ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'
                }`}
              >
                {/* Circle Icon / Number */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-200 ring-4 ring-white ${
                    isCompleted
                      ? 'bg-[#4648d4] text-white shadow-xs'
                      : isActive
                      ? 'bg-[#4648d4] text-white shadow-md shadow-indigo-500/30 ring-4 ring-indigo-100'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4" /> : step.number}
                </div>

                {/* Label */}
                <span
                  className={`text-xs font-semibold whitespace-nowrap hidden sm:inline-block ${
                    isActive
                      ? 'text-[#4648d4]'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </button>

              {/* Connecting progress highlight between steps */}
              {index < WIZARD_STEPS.length - 1 && (
                <div
                  className={`h-[2px] flex-1 transition-colors duration-300 ${
                    currentStep > index + 1 ? 'bg-[#4648d4]' : 'bg-transparent'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
