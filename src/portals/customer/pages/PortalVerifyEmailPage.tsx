import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { PortalAuthService } from '@/shared/api/authService';

/**
 * Customer Portal Email Verification Page
 * Link-based flow — same as B2B but with the B2C blue design.
 * No OTP input. Backend uses PortalEmailVerificationToken (link-based).
 */
export const PortalVerifyEmailPage: React.FC = () => {
  const location = useLocation();
  const email = (location.state as { email?: string })?.email ?? 'your registered email';

  const [resendTimer, setResendTimer] = useState(30);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => setResendTimer((p) => p - 1), 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResend = async () => {
    if (email === 'your registered email') {
      toast.error('Please register again so we know which email to verify.');
      return;
    }

    setIsResending(true);
    try {
      await PortalAuthService.resendVerification(email);
      toast.success('Verification email sent.');
      setResendTimer(30);
    } catch {
      toast.error('Could not resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#f9f9f9] shadow-sm">
        <div className="flex justify-between items-center h-[68px] px-6 max-w-[1200px] mx-auto">
          <Link to="/portal/login" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
            <span className="font-bold text-xl text-[#4648d4]">LoanLens</span>
          </Link>
          <Link to="/portal/login" className="text-xs font-semibold text-[#464554] hover:text-[#4648d4] transition-colors">
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
              <Mail className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Verify your email address</h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              We've sent a verification link to your email address. Click the link to activate your LoanLens account.
            </p>
          </div>
          <div className="z-10 mb-12 text-xs text-white/60">
            Need help? Contact support at <span className="text-white underline">support@loanlens.com</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 min-h-full">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-[#1a1c1c] mb-2">Check your inbox</h2>
              <p className="text-sm text-[#64748b]">
                We sent a verification link to{' '}
                <span className="font-semibold text-[#1a1c1c]">{email}</span>
              </p>
              <p className="text-xs text-[#94a3b8] mt-2 leading-relaxed">
                Click the link in the email to verify your account. The link expires in 24 hours.
              </p>
            </div>

            <div className="border-t border-[#e2e8f0] pt-6 text-center space-y-3">
              <p className="text-xs text-[#64748b]">Didn't receive the email?</p>
              {resendTimer > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] bg-slate-100 px-3 py-1.5 rounded-full">
                  Resend in {resendTimer}s
                </span>
              ) : (
                <button onClick={handleResend} disabled={isResending}
                  className="text-xs font-semibold text-[#4648d4] hover:text-[#3b3db9] underline disabled:opacity-60 inline-flex items-center gap-1.5"
                >
                  {isResending ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Sending...</> : 'Resend verification email'}
                </button>
              )}
              <p className="text-xs text-[#94a3b8]">Also check your spam or junk folder.</p>
            </div>

            <div className="text-center">
              <Link to="/portal/register" className="text-xs font-semibold text-[#64748b] hover:text-[#4648d4] transition-colors">
                Wrong email address? Go back
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalVerifyEmailPage;
