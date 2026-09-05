import React, { useState } from 'react';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { resetPasswordSchema, type ResetPasswordFormData } from '@/shared/validations/auth.schemas';
import { AuthService } from '@/shared/api/authService';
import { getApiErrorMessage } from '@/shared/utils/apiError';
import { KeyRound, CheckCircle2, AlertTriangle, ArrowRight, Eye, EyeOff, AlertCircle } from 'lucide-react';

const getStrength = (pass: string) => {
  if (!pass) return { score: 0, label: '', bars: ['bg-slate-200', 'bg-slate-200', 'bg-slate-200'] };
  if (pass.length < 6) return { score: 1, label: 'Weak', bars: ['bg-red-500', 'bg-slate-200', 'bg-slate-200'] };
  if (pass.length < 10 || !/\d/.test(pass)) return { score: 2, label: 'Fair', bars: ['bg-amber-500', 'bg-amber-500', 'bg-slate-200'] };
  return { score: 3, label: 'Strong', bars: ['bg-emerald-500', 'bg-emerald-500', 'bg-emerald-500'] };
};

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const params = useParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') ?? params.token ?? '';

  const [showPassword, setShowPassword] = useState(false);
  const [pageState, setPageState] = useState<'default' | 'success' | 'expired' | 'no_token'>(
    !token ? 'no_token' : 'default'
  );
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({ resolver: zodResolver(resetPasswordSchema) });

  const passwordValue = watch('password', '');
  const strength = getStrength(passwordValue);

  const onSubmit = async (data: ResetPasswordFormData) => {
    setServerError(null);
    try {
      await AuthService.resetPassword(token, data.password);
      toast.success('Password updated successfully!');
      setPageState('success');
    } catch (err) {
      const msg = getApiErrorMessage(err, '');
      // Detect expired/invalid token from backend
      if (msg.toLowerCase().includes('expir') || msg.toLowerCase().includes('invalid')) {
        setPageState('expired');
      } else {
        setServerError(msg || 'Failed to reset password. Please try again.');
      }
    }
  };

  return (
    <AuthLayout>
      {pageState === 'default' && (
        <div>
          <div className="mb-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 mb-4 shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">Set new password</h2>
            <p className="text-slate-500 text-sm leading-relaxed">Your new password must be at least 8 characters long.</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl flex items-start gap-3 mb-4 animate-in fade-in duration-200">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm font-medium">{serverError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register('password')}
                  className={`w-full h-12 px-4 pr-11 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none ${
                    errors.password
                      ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                      : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                  }`}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none p-1">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {passwordValue && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {strength.bars.map((bar, i) => (
                      <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${bar}`} />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-slate-500">{strength.label}</span>
                </div>
              )}
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1.5 uppercase tracking-wider">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Re-enter new password"
                {...register('confirmPassword')}
                className={`w-full h-12 px-4 rounded-xl border text-slate-900 text-sm bg-white transition-all outline-none ${
                  errors.confirmPassword
                    ? 'border-red-400 focus:border-red-400 focus:ring-4 focus:ring-red-100'
                    : 'border-slate-200 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100'
                }`}
              />
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
              {isSubmitting ? 'Resetting…' : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>
      )}

      {pageState === 'success' && (
        <div className="text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mx-auto mb-4 shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">Password reset!</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-8">Your password has been updated. You can now sign in with your new credentials.</p>
          <button onClick={() => navigate('/login')}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
            <span>Sign In to LoanLens</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {(pageState === 'expired' || pageState === 'no_token') && (
        <div className="text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-500 mx-auto mb-4 shadow-sm">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            {pageState === 'no_token' ? 'Invalid reset link' : 'Reset link expired'}
          </h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed mb-6">
            {pageState === 'no_token'
              ? 'This link is invalid. Please request a new password reset.'
              : 'This reset link has expired or already been used. Reset links are valid for 15 minutes.'}
          </p>
          <button onClick={() => navigate('/forgot-password')}
            className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center justify-center gap-2">
            <span>Request New Reset Link</span><ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </AuthLayout>
  );
};

export default ResetPasswordPage;
