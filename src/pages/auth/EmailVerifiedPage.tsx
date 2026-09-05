import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { AuthService } from '@/shared/api/authService';
import { CheckCircle2, XCircle, Loader2, AlertTriangle, ArrowRight } from 'lucide-react';

type PageState = 'loading' | 'success' | 'expired' | 'already_verified' | 'error'

/**
 * B2B Email Verification Callback Page
 * Route: /auth/email-verified?token=<token>
 *
 * The backend sends a link like:
 *   https://app.loanlens.com/auth/email-verified?token=<token>
 *
 * useRef guard prevents React StrictMode double-invocation from calling
 * the API twice and showing 'already_verified' on the first real click.
 */
export const EmailVerifiedPage: React.FC = () => {
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

    AuthService.verifyEmail(token)
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
    <AuthLayout>
      <div className="text-center py-4">
        {/* ── Loading ── */}
        {state === 'loading' && (
          <div className="animate-in fade-in duration-300 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
            <h2 className="text-slate-900 text-2xl font-bold">Verifying your email…</h2>
            <p className="text-slate-500 text-sm">Please wait while we activate your account.</p>
          </div>
        )}

        {/* ── Success ── */}
        {state === 'success' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold">Email verified!</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Your account is now active. Sign in to start using LoanLens.
              </p>
            </div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              Sign In to LoanLens <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Already Verified ── */}
        {state === 'already_verified' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 mx-auto shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold">Already verified</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                Your email has already been verified. You can sign in directly.
              </p>
            </div>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2"
            >
              Go to Sign In <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Expired ── */}
        {state === 'expired' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 mx-auto shadow-sm">
              <AlertTriangle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold">Link expired</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                This verification link has expired. Verification links are valid for 24 hours.
              </p>
            </div>
            <div className="space-y-3">
              <Link to="/verify-email"
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
                Request a new link <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/login" className="block text-center text-xs text-slate-500 hover:text-indigo-600 font-medium transition-colors">
                Back to Sign In
              </Link>
            </div>
          </div>
        )}

        {/* ── Generic Error ── */}
        {state === 'error' && (
          <div className="animate-in fade-in zoom-in-95 duration-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto shadow-sm">
              <XCircle className="w-9 h-9" />
            </div>
            <div className="space-y-2">
              <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold">Verification failed</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                {!token
                  ? 'No verification token found in the link. Please use the link from your email.'
                  : 'Something went wrong verifying your email. Please try again or contact support.'}
              </p>
            </div>
            <Link to="/login"
              className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
              Back to Sign In <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default EmailVerifiedPage;
