import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WizardStepper } from "../components/wizard/WizardStepper";
import { Step1BasicInfo } from "../components/wizard/Step1BasicInfo";
import { Step2Coverage } from "../components/wizard/Step2Coverage";
import { Step3Eligibility } from "../components/wizard/Step3Eligibility";
import { Step4RateAmount } from "../components/wizard/Step4RateAmount";
import { Step5Commission } from "../components/wizard/Step5Commission";
import { Step6ReviewDocuments } from "../components/wizard/Step6ReviewDocuments";
import { initialWizardData } from "../types/bank.types";
import type { LoanProductFormData } from "../types/bank.types";
import { useCreateProduct } from "../hooks/useProducts";

export const CreateProductWizardPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const createProduct = useCreateProduct();

  const initialStepParam = Number(searchParams.get("step"));
  const [currentStep, setCurrentStep] = useState<number>(
    initialStepParam >= 1 && initialStepParam <= 6 ? initialStepParam : 1,
  );

  const [formData, setFormData] =
    useState<LoanProductFormData>(initialWizardData);

  const handleFieldChange = (fields: Partial<LoanProductFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }));
  };

  const goToStep = (stepNumber: number) => {
    setCurrentStep(stepNumber);
    setSearchParams({ step: String(stepNumber) });
  };

  const handlePublish = (asDraft: boolean) => {
    const payload = {
      ...formData,
      status: asDraft ? ("DRAFT" as const) : ("ACTIVE" as const),
    };
    createProduct.mutate(payload, {
      onSuccess: () => navigate("/bank/products"),
    });
  };

  return (
    <div className="max-w-[960px] mx-auto pb-16 space-y-4">
      <WizardStepper currentStep={currentStep} onStepClick={goToStep} />

      <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 shadow-xs border border-slate-200/80">
        {currentStep === 1 && (
          <Step1BasicInfo
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(2)}
            onCancel={() => navigate("/bank/products")}
          />
        )}
        {currentStep === 2 && (
          <Step2Coverage
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(3)}
            onPrev={() => goToStep(1)}
          />
        )}
        {currentStep === 3 && (
          <Step3Eligibility
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(4)}
            onPrev={() => goToStep(2)}
          />
        )}
        {currentStep === 4 && (
          <Step4RateAmount
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(5)}
            onPrev={() => goToStep(3)}
          />
        )}
        {currentStep === 5 && (
          <Step5Commission
            data={formData}
            onChange={handleFieldChange}
            onNext={() => goToStep(6)}
            onPrev={() => goToStep(4)}
          />
        )}
        {currentStep === 6 && (
          <Step6ReviewDocuments
            data={formData}
            onChange={handleFieldChange}
            onPublish={handlePublish}
            onPrev={() => goToStep(5)}
            onJumpToStep={goToStep}
          />
        )}
      </div>
    </div>
  );
};
