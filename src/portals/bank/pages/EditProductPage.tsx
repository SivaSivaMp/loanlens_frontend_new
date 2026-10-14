import React, { useState, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom'
import { ChevronRight, ArrowLeft } from 'lucide-react'
import { WizardStepper } from '../components/wizard/WizardStepper'
import { Step1BasicInfo } from '../components/wizard/Step1BasicInfo'
import { Step2Coverage } from '../components/wizard/Step2Coverage'
import { Step3Eligibility } from '../components/wizard/Step3Eligibility'
import { Step4RateAmount } from '../components/wizard/Step4RateAmount'
import { Step5Commission } from '../components/wizard/Step5Commission'
import { Step6ReviewDocuments } from '../components/wizard/Step6ReviewDocuments'
import { RateChangeConfirmModal } from '../components/modals/RateChangeConfirmModal'
import type { LoanProductFormData } from '../types/bank.types'

const sbiHomeLoanInitial: LoanProductFormData = {
  name: 'SBI Home Loan - Regular',
  loanType: 'HOME',
  description:
    'SBI Regular Home Loan offers competitive interest rates starting from 8.50% p.a. for purchase, construction, and renovation of residential properties with up to 30 years repayment tenure.',
  brochureUrl: 'SBI_HomeLoan_2026.pdf',
  isPanIndia: true,
  serviceableStates: ['PAN_INDIA'],
  minMonthlyIncome: 25000,
  maxMonthlyIncome: undefined,
  minAge: 21,
  maxAge: 60,
  minCibilScore: 700,
  acceptedEmployment: ['SALARIED', 'SELF_EMPLOYED'],
  minEmploymentYears: 2,
  rateType: 'FLOATING',
  rateMin: 8.5,
  rateMax: 9.85,
  minAmount: 500000,
  maxAmount: 50000000,
  minTenureMonths: 60,
  maxTenureMonths: 360,
  ltvPercent: 80,
  propertyTypes: ['Residential', 'Under Construction', 'Commercial'],
  rateSlabs: [
    { id: '1', minAmount: 0, maxAmount: 3000000, ratePercent: 8.5, label: 'Up to ₹30L' },
    { id: '2', minAmount: 3000000, maxAmount: 7500000, ratePercent: 8.75, label: '₹30L – ₹75L' },
    { id: '3', minAmount: 7500000, maxAmount: 50000000, ratePercent: 9.85, label: 'Above ₹75L' },
  ],
  commissionPercent: 0.5,
  commissionPayoutDays: 30,
  processingFeePercent: 0.35,
  commissionNotes: '0.50% flat payout on disbursement within 30 days.',
  requiredDocuments: [
    'PAN Card',
    'Aadhaar Card',
    'Last 3 Months Salary Slips',
    '6 Months Bank Statement',
    'Property Documents (Draft)',
    'IT Returns (2 Years)',
    'Form 16',
  ],
  status: 'ACTIVE',
}

export const EditProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const originalProduct = useMemo<LoanProductFormData>(() => ({ ...sbiHomeLoanInitial }), [])
  const [formData, setFormData] = useState<LoanProductFormData>(sbiHomeLoanInitial)

  const initialStepParam = Number(searchParams.get('step'))
  const [currentStep, setCurrentStep] = useState<number>(
    initialStepParam >= 1 && initialStepParam <= 6 ? initialStepParam : 1
  )

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)

  const handleFieldChange = (fields: Partial<LoanProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber)
    const newParams = new URLSearchParams(searchParams)
    newParams.set('step', String(stepNumber))
    setSearchParams(newParams)
  }

  const handleSaveDraft = () => {
    alert(`Draft updates saved for "${formData.name}". Rate changes are not yet published to DSAs.`)
  }

  const handleConfirmRateUpdate = () => {
    setIsConfirmModalOpen(false)
    alert(
      `✓ Rate change confirmed!\nNew minimum base rate of ${formData.rateMin.toFixed(2)}% applied.\nNotifications dispatched to 12 DSAs.`
    )
    navigate(id ? `/bank/products/${id}` : '/bank/products')
  }

  const handlePublishAll = (asDraft: boolean) => {
    alert(
      asDraft
        ? `Product "${formData.name}" saved as draft.`
        : `Product "${formData.name}" changes successfully published live!`
    )
    navigate(id ? `/bank/products/${id}` : '/bank/products')
  }

  return (
    <div className="max-w-[960px] mx-auto pb-16 space-y-4">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Link
            to={id ? `/bank/products/${id}` : '/bank/products'}
            className="flex items-center gap-1 hover:text-[#4648d4] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Product</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-700 font-bold">{formData.name}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[#4648d4] font-bold">Edit</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-3 py-1 rounded-full">
            Step {currentStep} of 6
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
            LIVE PRODUCT
          </span>
        </div>
      </div>

      <WizardStepper currentStep={currentStep} onStepClick={goToStep} />

      <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-slate-200/80">
        {currentStep === 1 && (
          <Step1BasicInfo
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(2)}
            onCancel={() => navigate(id ? `/bank/products/${id}` : '/bank/products')}
          />
        )}
        {currentStep === 2 && (
          <Step2Coverage data={formData} onChange={handleFieldChange} onNext={() => goToStep(3)} onPrev={() => goToStep(1)} />
        )}
        {currentStep === 3 && (
          <Step3Eligibility data={formData} onChange={handleFieldChange} onNext={() => goToStep(4)} onPrev={() => goToStep(2)} />
        )}
        {currentStep === 4 && (
          <Step4RateAmount
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(5)}
            onPrev={() => goToStep(3)}
            isEdit={true}
            originalRates={{ rateMin: originalProduct.rateMin, rateMax: originalProduct.rateMax, rateSlabs: originalProduct.rateSlabs ?? [] }}
            onUpdateAndNotify={() => setIsConfirmModalOpen(true)}
            onSaveDraft={handleSaveDraft}
            onCancel={() => navigate(id ? `/bank/products/${id}` : '/bank/products')}
          />
        )}
        {currentStep === 5 && (
          <Step5Commission data={formData} onChange={handleFieldChange} onNext={() => goToStep(6)} onPrev={() => goToStep(4)} />
        )}
        {currentStep === 6 && (
          <Step6ReviewDocuments
            data={formData}
            onChange={handleFieldChange}
            onPublish={handlePublishAll}
            onPrev={() => goToStep(5)}
            onJumpToStep={goToStep}
          />
        )}
      </div>

      <RateChangeConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmRateUpdate}
        oldRate={originalProduct.rateMin}
        newRate={formData.rateMin}
        targetLabel="minimum base rate"
        dsaCount={12}
      />
    </div>
  )
}
