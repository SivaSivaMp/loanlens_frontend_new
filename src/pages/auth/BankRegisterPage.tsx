import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import {
  bankRegisterSchema,
  type BankRegisterFormData,
} from "@/shared/validations/auth.schemas";
import { AuthService } from "@/shared/api/authService";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import {
  Landmark,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  EyeOff,
  Eye,
} from "lucide-react";

const inputBase =
  "w-full h-12 px-4 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none";
const inputOk =
  "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100";
const inputErr =
  "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {message}
    </p>
  ) : null;

export const BankRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BankRegisterFormData>({
    resolver: zodResolver(bankRegisterSchema),
    defaultValues: { type: "BANK" },
  });

  const onSubmit = async (data: BankRegisterFormData) => {
    setServerError(null);
    try {
      await AuthService.register({
        email: data.email,
        password: data.password,
        role: "BANK_ADMIN",
        name: data.name,
        type: data.type,

        contactPhone: data.contactPhone,
        gstin: data.gstin || undefined,
        licenceNumber: data.licenceNumber || undefined,
        websiteUrl: data.websiteUrl || undefined,
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to role selection
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-2xl font-bold tracking-tight">
              Bank / NBFC Partner
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              Institution Account Registration
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
            Bank / Financial Institution Name *
          </label>
          <input
            type="text"
            placeholder="e.g. State Bank of India"
            {...register("name")}
            className={`${inputBase} ${errors.name ? inputErr : inputOk}`}
          />
          <FieldError message={errors.name?.message} />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Institution Type *
          </label>
          <select
            {...register("type")}
            className={`${inputBase} ${errors.type ? inputErr : inputOk}`}
          >
            <option value="BANK">Bank</option>
            <option value="NBFC">NBFC</option>
            <option value="HFC">HFC</option>
          </select>
          <FieldError message={errors.type?.message} />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Email Address *
          </label>
          <input
            type="email"
            autoComplete="email"
            placeholder="officer@bank.com"
            {...register("email")}
            className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
          />
          <FieldError message={errors.email?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Contact Phone *
            </label>
            <input
              type="tel"
              placeholder="9876543210"
              {...register("contactPhone")}
              className={`${inputBase} ${errors.contactPhone ? inputErr : inputOk}`}
            />
            <FieldError message={errors.contactPhone?.message} />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              GSTIN
            </label>
            <input
              type="text"
              placeholder="27AAAAA0000A1Z5"
              {...register("gstin")}
              className={`${inputBase} font-mono ${errors.gstin ? inputErr : inputOk}`}
            />
            <FieldError message={errors.gstin?.message} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Licence Number
            </label>
            <input
              type="text"
              placeholder="RBI/NBFC/2026/001"
              {...register("licenceNumber")}
              className={`${inputBase} ${errors.licenceNumber ? inputErr : inputOk}`}
            />
            <FieldError message={errors.licenceNumber?.message} />
          </div>
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Website URL
            </label>
            <input
              type="url"
              placeholder="https://www.bank.com"
              {...register("websiteUrl")}
              className={`${inputBase} ${errors.websiteUrl ? inputErr : inputOk}`}
            />
            <FieldError message={errors.websiteUrl?.message} />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Password *
          </label>
          <div className="relative h-12">
            <input
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Minimum 8 characters"
              {...register("password")}
              className={`${inputBase} ${errors.password ? inputErr : inputOk}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1a1c1c] transition-colors cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          <FieldError message={errors.password?.message} />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Confirm Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter your password"
            {...register("confirmPassword")}
            className={`${inputBase} ${errors.confirmPassword ? inputErr : inputOk}`}
          />
          <FieldError message={errors.confirmPassword?.message} />
        </div>

        {/*<div>
          <div className="flex items-start gap-2.5 pt-1">
            <input id="bank-terms" type="checkbox" {...register('agreeTerms')}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
            <label htmlFor="bank-terms" className="text-xs text-slate-600 leading-relaxed">
              I agree to the <a href="#" className="text-indigo-600 underline font-medium">Terms of Service</a> and confirm I am authorized to register on behalf of the institution.
            </label>
          </div>
          <FieldError message={errors.agreeTerms?.message} />
        </div>*/}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 mt-3 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            "Registering…"
          ) : (
            <>
              <span>Continue to Verification</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        Institutional verification is completed within 2 business hours.
      </div>
    </AuthLayout>
  );
};

export default BankRegisterPage;
