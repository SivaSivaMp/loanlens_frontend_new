import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import {
  dsaRegisterSchema,
  type DsaRegisterFormData,
} from "@/shared/validations/auth.schemas";
import { AuthService } from "@/shared/api/authService";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import {
  Briefcase,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Building2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const inputBase =
  "w-full h-12 px-4 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none";
const inputOk =
  "border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100";
const inputErr =
  "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {message}
    </p>
  ) : null;

export const DsaRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DsaRegisterFormData>({
    resolver: zodResolver(dsaRegisterSchema),
  });

  const onSubmit = async (data: DsaRegisterFormData) => {
    setServerError(null);
    try {
      await AuthService.register({
        email: data.email,
        password: data.password,
        role: "COMPANY_DSA",
        companyName: data.companyName,
        companyCode: data.companyCode,
        gstin: data.gstin || undefined,
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
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to role selection
        </Link>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-slate-900 text-2xl font-bold tracking-tight">
              DSA Company Partner
            </h2>
            <p className="text-slate-500 text-xs font-medium">
              Direct Selling Agent Agency Account
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
            Registered Company / Firm Name *
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="e.g. Apex Financial Consultants LLP"
              {...register("companyName")}
              className={`${inputBase} ${errors.companyName ? inputErr : inputOk}`}
            />
            <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <FieldError message={errors.companyName?.message} />
        </div>

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Company Code *
          </label>
          <input
            type="text"
            placeholder="APEX_DSA"
            {...register("companyCode")}
            className={`${inputBase} font-mono ${errors.companyCode ? inputErr : inputOk}`}
          />
          <FieldError message={errors.companyCode?.message} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
              Login Email *
            </label>
            <input
              type="email"
              autoComplete="email"
              placeholder="contact@apexfin.in"
              {...register("email")}
              className={`${inputBase} ${errors.email ? inputErr : inputOk}`}
            />
            <FieldError message={errors.email?.message} />
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

        <div>
          <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">
            Account Password *
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

        {/* <div>
          <div className="flex items-start gap-2.5 pt-1">
            <input id="terms-dsa" type="checkbox" {...register('agreeTerms')}
              className="w-4 h-4 mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
            <label htmlFor="terms-dsa" className="text-xs text-slate-600 leading-relaxed">
              I accept the <a href="#" className="text-emerald-600 underline font-medium">DSA Partner Terms</a> & Master Service Agreement.
            </label>
          </div>
          <FieldError message={errors.agreeTerms?.message} />
        </div> */}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-emerald-600/20 mt-3 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            "Registering…"
          ) : (
            <>
              <span>Register DSA Account</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
        <CheckCircle className="w-4 h-4 text-emerald-600" />
        Unlock bank rate engines & team management instantly.
      </div>
    </AuthLayout>
  );
};

export default DsaRegisterPage;
