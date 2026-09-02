import React, { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import {
  loginSchema,
  type LoginFormData,
} from "@/shared/validations/auth.schemas";
import { AuthService } from "@/shared/api/authService";
import { useAuthStore } from "@/shared/stores/authStore";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import type { UserRole } from "@/shared/types/api.types";
import { AlertCircle, Eye, EyeOff, Info, ArrowRight } from "lucide-react";

/** Maps B2B role → dashboard path */
const ROLE_REDIRECT: Record<UserRole, string> = {
  BANK_ADMIN: "/bank/dashboard",
  COMPANY_DSA: "/company/dashboard",
  FIELD_AGENT: "/agent/dashboard",
};

export const LoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeLogin = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    searchParams.get("error") === "true"
      ? "Session expired. Please sign in again."
      : null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      const result = await AuthService.login(data.email, data.password);
      storeLogin(
        { accessToken: result.accessToken, refreshToken: result.refreshToken },
        result.user,
      );
      toast.success(`Welcome back!`);
      navigate(ROLE_REDIRECT[result.user.role], { replace: true });
    } catch (err) {
      const msg = getApiErrorMessage(err, "Invalid email or password.");
      setServerError(msg);
    }
  };

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-1.5">
          Welcome back
        </h2>
        <p className="text-slate-500 text-sm font-normal">
          Sign in to access your LoanLens B2B account
        </p>
      </div>

      {serverError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-700 text-xs sm:text-sm font-medium leading-relaxed">
            {serverError}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Email */}
        <div>
          <label
            className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider"
            htmlFor="b2b-email"
          >
            Work Email Address
          </label>
          <input
            id="b2b-email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            {...register("email")}
            className={`w-full h-12 px-4 rounded-xl border text-slate-900 text-sm placeholder-slate-400 bg-white transition-all outline-none ${
              errors.email
                ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
            }`}
          />
          {errors.email && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              className="block text-slate-700 font-semibold text-xs uppercase tracking-wider"
              htmlFor="b2b-password"
            >
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-indigo-600 hover:text-indigo-700 text-xs font-semibold transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              id="b2b-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              className={`w-full h-12 px-4 pr-11 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none ${
                errors.password
                  ? "border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100"
                  : "border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
        >
          {isSubmitting ? (
            "Signing in…"
          ) : (
            <>
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-grow h-px bg-slate-200" />
        <span className="px-3 text-slate-400 text-xs uppercase tracking-widest bg-white">
          or
        </span>
        <div className="flex-grow h-px bg-slate-200" />
      </div>

      <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3.5 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
        <p className="text-indigo-950 text-xs leading-relaxed">
          Access is role-based. Banks, companies, and field agents each have a
          dedicated workspace.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 hover:text-indigo-700 font-semibold ml-1"
          >
            Get started
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
