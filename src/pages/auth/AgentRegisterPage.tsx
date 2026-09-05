import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import {
  agentRegisterSchema,
  type AgentRegisterFormData,
} from "@/shared/validations/auth.schemas";
import { AuthService } from "@/shared/api/authService";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import {
  UserCheck,
  ArrowLeft,
  ArrowRight,
  Smartphone,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";

const inputBase =
  "w-full h-12 px-4 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none";
const inputOk =
  "border-slate-200 focus:border-amber-500 focus:ring-4 focus:ring-amber-100";
const inputErr =
  "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {message}
    </p>
  ) : null;

export const AgentRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AgentRegisterFormData>({
    resolver: zodResolver(agentRegisterSchema),
  });

  const onSubmit = async (data: AgentRegisterFormData) => {
    setServerError(null);
    try {
      await AuthService.register({
        email: data.email,
        password: data.password,
        role: "FIELD_AGENT",
        companyCode: data.companyCode,
        fullName: data.fullName,
        phone: data.phone,
        pan: data.pan || undefined,
        bankAccountNumber: data.bankAccountNumber || undefined,
        ifscCode: data.ifscCode || undefined,
      });
      toast.success(
        "Account created! Check your inbox for a verification link.",
      );
      navigate("/verify-email", { state: { email: data.email } });
    } catch (err) {
      setServerError(
        getApiErrorMessage(err, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <AuthLayout>
      <div className="mb-6">
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-amber-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to role selection
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-2xl font-bold tracking-tight">
              Field Agent Account
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              Loan Discovery & Submission Portal
            </p>
          </div>
        </div>
      </div>

      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 mb-4 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-sm font-medium">{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Select Your Associated DSA Company
          </label>
          <input
            type="text"
            placeholder="Company code from your DSA, e.g. APEX_DSA"
            {...register("companyCode")}
            className={`${inputBase} font-mono ${errors.companyCode ? inputErr : inputOk}`}
          />
          <FieldError message={errors.companyCode?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="e.g. Rahul Sharma"
              {...register("fullName")}
              className={`${inputBase} ${errors.fullName ? inputErr : inputOk}`}
            />
            <FieldError message={errors.fullName?.message} />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Phone
            </label>
            <div className="relative">
              <input
                type="tel"
                placeholder="9876543210"
                {...register("phone")}
                className={`${inputBase} ${errors.phone ? inputErr : inputOk}`}
              />
              <Smartphone className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <FieldError message={errors.phone?.message} />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Email Address
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="agent@company.com"
            {...register("email")}
            className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              PAN
            </label>
            <input
              type="text"
              placeholder="ABCDE1234F"
              {...register("pan")}
              className={`${inputBase} font-mono ${errors.pan ? inputErr : inputOk}`}
            />
            <FieldError message={errors.pan?.message} />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Account No.
            </label>
            <input
              type="text"
              placeholder="1234567890"
              {...register("bankAccountNumber")}
              className={`${inputBase} ${errors.bankAccountNumber ? inputErr : inputOk}`}
            />
            <FieldError message={errors.bankAccountNumber?.message} />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              IFSC
            </label>
            <input
              type="text"
              placeholder="HDFC0001234"
              {...register("ifscCode")}
              className={`${inputBase} font-mono ${errors.ifscCode ? inputErr : inputOk}`}
            />
            <FieldError message={errors.ifscCode?.message} />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Minimum 8 characters"
            {...register("password")}
            className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
          />
          <FieldError message={errors.password?.message} />
        </div>

        {/* <div>
          <div className="flex items-start gap-2.5 pt-1">
            <input id="terms-agent" type="checkbox" {...register('agreeTerms')}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
            <label htmlFor="terms-agent" className="text-xs text-slate-600 leading-relaxed">
              I accept the <a href="#" className="text-amber-600 underline font-medium">Agent Conduct Policy</a> & LoanLens terms.
            </label>
          </div>
          <FieldError message={errors.agreeTerms?.message} />
        </div> */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-amber-500/20 mt-3 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            "Creating Account…"
          ) : (
            <>
              <span>Create Agent Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-amber-600" />
        Connect with customers and compare 50+ bank rules on mobile.
      </div>
    </AuthLayout>
  );
};

export default AgentRegisterPage;
