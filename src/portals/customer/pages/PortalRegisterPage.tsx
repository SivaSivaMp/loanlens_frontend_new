import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  portalRegisterSchema,
  type PortalRegisterFormData,
} from "@/shared/validations/auth.schemas";
import { PortalAuthService } from "@/shared/api/authService";
import { getApiErrorMessage } from "@/shared/utils/apiError";
import { Eye, EyeOff, Check, AlertCircle } from "lucide-react";

const FieldError = ({ message }: { message?: string }) =>
  message ? (
    <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {message}
    </p>
  ) : null;

export const PortalRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<PortalRegisterFormData>({
    resolver: zodResolver(portalRegisterSchema),
  });

  const passwordValue = watch("password", "");
  const confirmPasswordValue = watch("confirmPassword", "");
  const passwordsMatch =
    passwordValue.length > 0 && passwordValue === confirmPasswordValue;

  const onSubmit = async (data: PortalRegisterFormData) => {
    setServerError(null);
    try {
      await PortalAuthService.register({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });
      toast.success(
        "Account created! Check your inbox for a verification link.",
      );
      navigate("/portal/verify-email", { state: { email: data.email } });
    } catch (err) {
      setServerError(
        getApiErrorMessage(err, "Registration failed. Please try again."),
      );
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      <nav className="fixed top-0 w-full bg-[#f9f9f9] shadow-sm z-40">
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
          <div className="flex items-center gap-4">
            <Link
              to="/portal/login"
              className="text-xs font-semibold text-[#4648d4] hover:opacity-90"
            >
              Sign In
            </Link>
            <Link
              to="/portal/register"
              className="bg-[#4648d4] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-[68px] flex flex-col md:flex-row min-h-[calc(100vh-68px)]">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#4648d4] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="z-10 mt-12">
            <span className="material-symbols-outlined text-[64px] opacity-40 mb-6">
              format_quote
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Your loan journey starts here.
            </h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              Get personalised proposals from certified advisors. Compare 50+
              products. Track in real time.
            </p>
          </div>
          <div className="z-10 mb-12">
            <ul className="space-y-4">
              {[
                "No credit score impact",
                "No spam calls",
                "100% free service",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm font-medium"
                >
                  <span className="bg-white/20 p-1 rounded-full">
                    <Check className="w-3.5 h-3.5 text-white" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 overflow-y-auto">
          <div className="w-full max-w-md space-y-6 py-6">
            <div className="space-y-2">
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1c1c]">
                Create your account
              </h2>
              <p className="text-sm text-[#64748b]">
                Already have an account?{" "}
                <Link
                  to="/portal/login"
                  className="text-[#4648d4] hover:underline font-semibold inline-flex items-center"
                >
                  Sign in
                  <span className="material-symbols-outlined text-[14px] ml-1">
                    arrow_forward
                  </span>
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{serverError}</p>
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={handleSubmit(onSubmit)}
              noValidate
            >
              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Rahul Sharma"
                  autoComplete="name"
                  {...register("fullName")}
                  className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.fullName ? "border-red-400 focus:ring-3 focus:ring-red-200" : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"}`}
                />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">
                  Phone Number
                </label>
                <div
                  className={`flex h-12 rounded-lg border transition-all bg-white overflow-hidden ${errors.phone ? "border-red-400" : "border-[#e2e8f0] focus-within:border-[#4648d4] focus-within:ring-3 focus-within:ring-[#4648d4]/20"}`}
                >
                  <span className="flex items-center justify-center px-4 bg-[#f3f3f4] text-[#464554] text-sm border-r border-[#e2e8f0] select-none font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    autoComplete="tel"
                    {...register("phone")}
                    className="flex-1 px-4 border-none focus:ring-0 outline-none text-sm text-[#1a1c1c] bg-transparent"
                  />
                </div>
                <FieldError message={errors.phone?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="rahul@email.com"
                  autoComplete="email"
                  {...register("email")}
                  className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.email ? "border-red-400 focus:ring-3 focus:ring-red-200" : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"}`}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">
                  Password
                </label>
                <div className="relative h-12">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    {...register("password")}
                    className={`w-full h-full px-4 pr-12 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.password ? "border-red-400 focus:ring-3 focus:ring-red-200" : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"}`}
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
                <label className="block text-xs font-semibold text-[#464554] mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  autoComplete="new-password"
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
                <FieldError message={errors.confirmPassword?.message} />
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input
                    id="portal-terms"
                    type="checkbox"
                    {...register("agreeTerms")}
                    className="w-4 h-4 mt-0.5 rounded border-[#e2e8f0] text-[#4648d4] focus:ring-[#4648d4] bg-white cursor-pointer"
                  />
                  <label
                    htmlFor="portal-terms"
                    className="text-xs text-[#464554] cursor-pointer leading-relaxed"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-[#4648d4] hover:underline font-medium"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-[#4648d4] hover:underline font-medium"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>
                <FieldError message={errors.agreeTerms?.message} />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#4648d4] hover:bg-[#3b3db9] shadow-md disabled:opacity-70"
              >
                {isSubmitting ? (
                  "Creating account…"
                ) : (
                  <>
                    Create Account
                    <span className="material-symbols-outlined text-[18px]">
                      arrow_forward
                    </span>
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#e2e8f0]" />
                <span className="text-xs text-[#94a3b8] font-medium">or</span>
                <div className="flex-1 h-px bg-[#e2e8f0]" />
              </div>

              {/* Google Sign-Up */}
              <a
                href={`${import.meta.env.VITE_API_URL}/portal/auth/google`}
                className="w-full flex items-center justify-center gap-3 h-12 border border-[#e2e8f0] rounded-lg text-sm font-semibold text-[#1a1c1c] bg-white hover:bg-slate-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </a>
            </form>

          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalRegisterPage;
