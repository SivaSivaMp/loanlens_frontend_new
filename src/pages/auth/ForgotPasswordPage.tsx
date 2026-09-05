import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/shared/validations/auth.schemas';
import { AuthService } from '@/shared/api/authService';
import { getApiErrorMessage } from '@/shared/utils/apiError';
import { KeyRound, MailCheck, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({ resolver: zodResolver(forgotPasswordSchema) });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setServerError(null);
    try {
      await AuthService.forgotPassword(data.email);
      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (err) {
      // Still show success to prevent email enumeration — but surface network errors
      const msg = getApiErrorMessage(err, '');
      if (msg && msg.toLowerCase().includes('network')) {
        setServerError('Network error. Please check your connection and try again.');
      } else {
        // Always show success screen (security best practice)
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
      }
    }
  };

  return (
    <AuthLayout>
      {!isSubmitted ? (
        <div>
          <div className="mb-6">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </Link>
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">Forgot password?</h2>
            <p className="text-slate-500 text-sm leading-relaxed">
              Enter your registered work email and we'll send you a secure link to reset it.
            </p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 mb-4 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider" htmlFor="forgot-email">
                Work Email Address
              </label>
              <input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@company.com"
                {...register('email')}
                className={`w-full h-12 px-4 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none ${
                  errors.email
                    ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                }`}
              />
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.email.message}
                </p>
              )}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 disabled:opacity-70">
              {isSubmitting ? 'Sending…' : <><span>Send Reset Instructions</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      ) : (
        <div className="text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm">
            <MailCheck className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">Check your email</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
            We sent password reset instructions to <span className="font-semibold text-slate-800">{submittedEmail}</span>
          </p>
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-left text-xs text-slate-600 space-y-2 mb-6">
            <div className="flex items-center gap-2 font-semibold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Reset link valid for 15 minutes
            </div>
            <p className="leading-relaxed">Also check your spam or junk folder if you don't see it.</p>
          </div>
          <Link to="/login"
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
            Back to Sign In
          </Link>
          <div className="mt-6 text-xs text-slate-500">
            Wrong email?{' '}
            <button onClick={() => { setIsSubmitted(false); setServerError(null); }}
              className="text-indigo-600 font-semibold hover:underline">
              Try another address
            </button>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
