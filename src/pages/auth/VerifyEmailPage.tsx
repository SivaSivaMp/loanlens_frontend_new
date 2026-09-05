import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthLayout } from "@/shared/components/layout/AuthLayout";
import { Mail, RefreshCw, ArrowLeft } from "lucide-react";
import { AuthService } from "@/shared/api/authService";
import toast from "react-hot-toast";

/**
 * B2B Email Verification Page
 *
 * Flow: User registers → backend sends verification LINK to email
 *       → user clicks link in email → backend verifies token
 *       → this page just shows "check your inbox" confirmation.
 *
 * The actual verification happens server-side when the user clicks
 * the link. The link hits GET /auth/verify-email?token=<token>.
 *
 * This page does NOT have an OTP input — that was a Stitch design
 * prototype error. Backend uses EmailVerificationToken (link-based).
 */
export const VerifyEmailPage: React.FC = () => {
  const location = useLocation();
  // Email passed via navigation state from registration pages
  const email =
    (location.state as { email?: string })?.email ?? "your registered email";

  const [resendTimer, setResendTimer] = useState(45);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(
      () => setResendTimer((prev) => prev - 1),
      1000,
    );
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    setIsResending(true);
    try {
      await AuthService.resendVerification(email);
      toast.success("Verification email resent!");
      setResendTimer(45);
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  const formatTimer = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  return (
    <AuthLayout>
      {/* Icon */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mx-auto mb-4 shadow-sm">
          <Mail className="w-8 h-8" />
        </div>
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Check your email
        </h2>
        <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
          We sent a verification link to{" "}
          <span className="font-semibold text-slate-800">{email}</span>
        </p>
        <p className="text-slate-400 text-xs max-w-xs mx-auto mt-2 leading-relaxed">
          Click the link in the email to verify your account. The link expires
          in 24 hours.
        </p>
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 pt-6 mt-2 text-center">
        <p className="text-xs text-slate-500 mb-3">Didn't receive the email?</p>

        {resendTimer > 0 ? (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-full">
            Resend available in {formatTimer(resendTimer)}
          </span>
        ) : (
          <button
            onClick={handleResend}
            disabled={isResending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 underline disabled:opacity-60"
          >
            {isResending ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...
              </>
            ) : (
              "Click here to resend verification email"
            )}
          </button>
        )}

        <p className="text-xs text-slate-400 mt-3">
          Also check your spam or junk folder.
        </p>
      </div>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Wrong email address? Go back
        </Link>
      </div>
    </AuthLayout>
  );
};

export default VerifyEmailPage;
