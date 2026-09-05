import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  portalForgotPasswordSchema,
  type PortalForgotPasswordFormData,
} from "@/shared/validations/auth.schemas";
import { KeyRound, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { PortalAuthService } from "@/shared/api/authService";

export const PortalForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortalForgotPasswordFormData>({
    resolver: zodResolver(portalForgotPasswordSchema),
  });

  const onSubmit = async (data: PortalForgotPasswordFormData) => {
    await PortalAuthService.forgotPassword(data.email);
    setSubmittedEmail(data.email);
    setIsSent(true);
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
              <KeyRound className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              Reset your password
            </h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              Enter your account email and we'll send you a reset link.
            </p>
          </div>
          <div className="z-10 mb-12 text-xs text-white/60">
            Remembered your password?{" "}
            <Link
              to="/portal/login"
              className="text-white font-semibold underline"
            >
              Sign in now
            </Link>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 min-h-full">
          <div className="w-full max-w-md space-y-8">
            {!isSent ? (
              <>
                <div>
                  <h2 className="text-2xl font-bold text-[#1a1c1c] mb-2">
                    Forgot Password?
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    Enter the email address associated with your LoanLens
                    account.
                  </p>
                </div>
                <form
                  className="space-y-6"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <div className="space-y-2">
                    <label
                      className="block text-xs font-semibold text-[#464554]"
                      htmlFor="portal-forgot-email"
                    >
                      Email Address
                    </label>
                    <input
                      id="portal-forgot-email"
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={`w-full px-4 h-12 border rounded-lg bg-white text-[#1a1c1c] placeholder-[#64748b] text-sm outline-none transition-all ${
                        errors.email
                          ? "border-red-400 focus:ring-3 focus:ring-red-200"
                          : "border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20"
                      }`}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />{" "}
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white text-xs font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Reset Link
                        <span className="material-symbols-outlined text-[18px]">
                          arrow_forward
                        </span>
                      </>
                    )}
                  </button>
                  <div className="text-center">
                    <Link
                      to="/portal/login"
                      className="text-xs font-semibold text-[#64748b] hover:text-[#1a1c1c] transition-colors inline-flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
                    </Link>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-6 py-6 animate-in fade-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">
                    Reset Link Sent!
                  </h2>
                  <p className="text-sm text-[#64748b]">
                    We've sent a password reset link to{" "}
                    <span className="font-semibold text-[#1a1c1c]">
                      {submittedEmail}
                    </span>
                    . Please check your inbox.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/portal/login")}
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white text-xs font-semibold rounded-lg shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  Back to Sign In
                  <span className="material-symbols-outlined text-[18px]">
                    arrow_forward
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalForgotPasswordPage;
