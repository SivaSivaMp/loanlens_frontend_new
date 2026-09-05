import React, { useState } from "react";
import { useSearchParams, Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  portalResetPasswordSchema,
  type PortalResetPasswordFormData,
} from "@/shared/validations/auth.schemas";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Check,
  AlertCircle,
} from "lucide-react";
import { PortalAuthService } from "@/shared/api/authService";

const getStrength = (pass: string) => {
  if (!pass) return { bars: [false, false, false, false], label: "" };
  return {
    bars: [
      pass.length >= 4,
      pass.length >= 8,
      pass.length >= 10 && /[A-Z]/.test(pass),
      pass.length >= 12 && /[0-9]/.test(pass),
    ],
    label:
      pass.length < 8
        ? "Weak strength"
        : pass.length < 12
          ? "Medium strength"
          : "Strong password",
  };
};

export const PortalResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const token = searchParams.get("token") ?? params.token ?? "";
  const stateParam = searchParams.get("state");

  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(stateParam === "success");
  const [serverError, setServerError] = useState<string | null>(null);
  const isExpired = stateParam === "expired";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PortalResetPasswordFormData>({
    resolver: zodResolver(portalResetPasswordSchema),
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const passwordsMatch =
    passwordValue.length > 0 && passwordValue === confirmPasswordValue;
  const strength = getStrength(passwordValue);

  const onSubmit = async (_data: PortalResetPasswordFormData) => {
    setServerError(null);

    if (!token) {
      setServerError("Reset token is missing. Please use the link from your email.");
      return;
    }

    try {
      await PortalAuthService.resetPassword(token, _data.password);
      setIsSuccess(true);
    } catch (err) {
      setServerError(
        getApiErrorMessage(err, "Password reset failed. Please request a new link."),
      );
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      <nav className="fixed top-0 w-full z-40 bg-[#f9f9f9] shadow-sm">
        <div className="flex justify-between items-center h-[68px] px-6 max-w-[1200px] mx-auto">
          <Link to="/portal/login" className="flex items-center gap-2">
            <span
              className="material-symbols-outlined text-[#4648d4]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              lens
            </span>
            <span className="font-bold text-xl text-[#4648d4]">LoanLens</span>
          </Link>
          <Link
            to="/portal/login"
            className="text-xs font-semibold text-[#464554] hover:text-[#4648d4] transition-colors"
          >
            Back to Sign In
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row mt-[68px] min-h-[calc(100vh-68px)]">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#4648d4] p-12 lg:p-24 relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="z-10 mt-12">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 backdrop-blur-md">
              <Lock className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Create new password
            </h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              Your new password must be different from previously used
              passwords.
            </p>
          </div>
          <div className="z-10 mb-12 text-xs text-white/60">
            Need help? Contact{" "}
            <span className="text-white underline">support@loanlens.com</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 min-h-full">
          <div className="w-full max-w-md space-y-8">
            {isExpired ? (
              <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-md">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">
                    Reset Link Expired
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    This password reset link has expired. Please request a new
                    one.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/portal/forgot-password")}
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Request New Reset Link
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            ) : isSuccess ? (
              <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">
                    Password Reset Complete!
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    Your password has been updated. You can now sign in.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/portal/login")}
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Sign In Now
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-[#1a1c1c] mb-2">
                    Set New Password
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    Please enter and confirm your new password below.
                  </p>
                </div>
                {serverError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 animate-in fade-in duration-200">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm font-medium">{serverError}</p>
                  </div>
                )}
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  {/* New Password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#464554] mb-2">
                      New Password
                    </label>
                    <div className="relative h-12">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...register("password")}
                        className={`w-full h-full px-4 pr-12 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${
                          errors.password
                            ? "border-red-400 focus:ring-3 focus:ring-red-200"
                            : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"
                        }`}
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
                    {passwordValue.length > 0 && (
                      <div className="mt-2 space-y-1">
                        <div className="flex gap-1">
                          {strength.bars.map((active, i) => (
                            <div
                              key={i}
                              className={`h-1 flex-1 rounded-full transition-colors ${active ? (i >= 2 ? "bg-emerald-500" : "bg-amber-500") : "bg-slate-200"}`}
                            />
                          ))}
                        </div>
                        <p className="text-[11px] text-[#64748b]">
                          {strength.label}
                        </p>
                      </div>
                    )}
                    {errors.password && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#464554] mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...register("confirmPassword")}
                      className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${
                        errors.confirmPassword
                          ? "border-red-400 focus:ring-3 focus:ring-red-200"
                          : confirmPasswordValue && passwordsMatch
                            ? "border-emerald-500 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-200"
                            : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"
                      }`}
                    />
                    {confirmPasswordValue &&
                      passwordsMatch &&
                      !errors.confirmPassword && (
                        <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 font-medium">
                          <Check className="w-3.5 h-3.5" /> Passwords match
                        </p>
                      )}
                    {errors.confirmPassword && (
                      <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#4648d4] hover:bg-[#3b3db9] shadow-md disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      "Resetting..."
                    ) : (
                      <>
                        Reset Password
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalResetPasswordPage;
