import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { PortalAuthService } from '@/shared/api/authService';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

type PageState = 'loading' | 'success' | 'expired' | 'already_verified' | 'error'

/**
 * Customer Portal Email Verification Callback Page
 * Route: /portal/email-verified?token=<token>
 *
 * Backend sends:
 *   https://app.loanlens.com/portal/email-verified?token=<token>
 *
 * Calls GET /portal/auth/verify-email?token=<token> on mount.
 *
 * useRef guard prevents React StrictMode double-invocation from calling
 * the API twice (which would set emailVerified=true on first call and
 * show 'already_verified' on the second).
 */
export const PortalEmailVerifiedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? '';
  const [state, setState] = useState<PageState>('loading');

  // Guard: only call the API once even in React StrictMode
  const calledRef = useRef(false);

  useEffect(() => {
    if (calledRef.current) return;
    calledRef.current = true;

    if (!token) {
      setState('error');
      return;
    }

    PortalAuthService.verifyEmail(token)
      .then((status) => {
        if (status === 'already_verified') setState('already_verified');
        else setState('success');
      })
      .catch((err) => {
        const msg: string = err?.response?.data?.error?.message ?? err?.message ?? '';
        if (msg.toLowerCase().includes('expir') || msg.toLowerCase().includes('invalid')) {
          setState('expired');
        } else {
          setState('error');
        }
      });
  }, [token]);

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#f9f9f9] shadow-sm">
        <div className="flex justify-between items-center h-[68px] px-6 max-w-[1200px] mx-auto">
          <Link to="/portal/login" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
            <span className="font-bold text-xl text-[#4648d4]">LoanLens</span>
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row mt-[68px] min-h-[calc(100vh-68px)]">
        {/* Left accent bar */}
        <div className="hidden md:block w-1/2 bg-[#4648d4] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="flex flex-col justify-center h-full p-12 lg:p-24 z-10 relative text-white">
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Account Activation</h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              One last step to unlock your personalised loan marketplace.
            </p>
          </div>
        </div>

        {/* Right content panel */}
        <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-6 md:p-12 min-h-full">
          <div className="w-full max-w-md text-center py-4">

            {state === 'loading' && (
              <div className="animate-in fade-in duration-300 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#4648d4]/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-8 h-8 text-[#4648d4] animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-[#1a1c1c]">Verifying your email…</h2>
                <p className="text-sm text-[#64748b]">Please wait while we activate your account.</p>
              </div>
            )}

            {state === 'success' && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">Email verified!</h2>
                  <p className="text-sm text-[#64748b] max-w-xs mx-auto leading-relaxed">
                    Your account is active. Start exploring loan products right away.
                  </p>
                </div>
                <button onClick={() => navigate('/portal/login', { replace: true })}
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Sign In to LoanLens <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {state === 'already_verified' && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mx-auto shadow-md">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">Already verified</h2>
                  <p className="text-sm text-[#64748b] max-w-xs mx-auto leading-relaxed">
                    Your email is already verified. Sign in to continue.
                  </p>
                </div>
                <button onClick={() => navigate('/portal/login', { replace: true })}
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer">
                  Go to Sign In <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {state === 'expired' && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 mx-auto shadow-md">
                  <AlertTriangle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">Link expired</h2>
                  <p className="text-sm text-[#64748b] max-w-xs mx-auto leading-relaxed">
                    This verification link has expired. Request a new one below.
                  </p>
                </div>
                <div className="space-y-3">
                  <Link to="/portal/verify-email"
                    className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
                    Request a new link <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link to="/portal/login" className="block text-center text-xs text-[#64748b] hover:text-[#4648d4] font-medium transition-colors">
                    Back to Sign In
                  </Link>
                </div>
              </div>
            )}

            {state === 'error' && (
              <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-red-500 mx-auto shadow-md">
                  <XCircle className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-[#1a1c1c]">Verification failed</h2>
                  <p className="text-sm text-[#64748b] max-w-xs mx-auto leading-relaxed">
                    {!token
                      ? 'No token found in this link. Please use the link from your email.'
                      : 'Something went wrong. Please try again or contact support@loanlens.com.'}
                  </p>
                </div>
                <Link to="/portal/login"
                  className="w-full h-12 bg-[#4648d4] hover:bg-[#3b3db9] text-white font-semibold rounded-lg shadow-md transition-all flex items-center justify-center gap-2">
                  Back to Sign In <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalEmailVerifiedPage;
