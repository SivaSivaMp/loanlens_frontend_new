import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { portalRegisterSchema, type PortalRegisterFormData } from '@/shared/validations/auth.schemas';
import { PortalAuthService } from '@/shared/api/authService';
import { getApiErrorMessage } from '@/shared/utils/apiError';
import { Eye, EyeOff, Check, AlertCircle } from 'lucide-react';

const getStrength = (pass: string) => {
  if (!pass) return { bars: [false, false, false, false], label: '' };
  return {
    bars: [pass.length >= 4, pass.length >= 8, pass.length >= 10 && /[A-Z]/.test(pass), pass.length >= 12 && /[0-9]/.test(pass)],
    label: pass.length < 8 ? 'Weak strength' : pass.length < 12 ? 'Medium strength' : 'Strong password',
  };
};

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
  } = useForm<PortalRegisterFormData>({ resolver: zodResolver(portalRegisterSchema) });

  const passwordValue = watch('password', '');
  const confirmPasswordValue = watch('confirmPassword', '');
  const passwordsMatch = passwordValue.length > 0 && passwordValue === confirmPasswordValue;
  const strength = getStrength(passwordValue);

  const onSubmit = async (data: PortalRegisterFormData) => {
    setServerError(null);
    try {
      await PortalAuthService.register({
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        password: data.password,
      });
      toast.success('Account created! Check your inbox for a verification link.');
      navigate('/portal/verify-email', { state: { email: data.email } });
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Registration failed. Please try again.'));
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      <nav className="fixed top-0 w-full bg-[#f9f9f9] shadow-sm z-40">
        <div className="flex justify-between items-center h-[68px] px-6 max-w-[1200px] mx-auto">
          <Link to="/portal/login" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
            <span className="font-bold text-xl text-[#4648d4]">LoanLens</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/portal/login" className="text-xs font-semibold text-[#4648d4] hover:opacity-90">Sign In</Link>
            <Link to="/portal/register" className="bg-[#4648d4] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow pt-[68px] flex flex-col md:flex-row min-h-[calc(100vh-68px)]">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col justify-between w-1/2 bg-[#4648d4] p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="z-10 mt-12">
            <span className="material-symbols-outlined text-[64px] opacity-40 mb-6">format_quote</span>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">Your loan journey starts here.</h1>
            <p className="text-base text-white/80 max-w-md leading-relaxed">
              Get personalised proposals from certified advisors. Compare 50+ products. Track in real time.
            </p>
          </div>
          <div className="z-10 mb-12">
            <ul className="space-y-4">
              {['No credit score impact', 'No spam calls', '100% free service'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm font-medium">
                  <span className="bg-white/20 p-1 rounded-full"><Check className="w-3.5 h-3.5 text-white" /></span>
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
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1c1c]">Create your account</h2>
              <p className="text-sm text-[#64748b]">
                Already have an account?{' '}
                <Link to="/portal/login" className="text-[#4648d4] hover:underline font-semibold inline-flex items-center">
                  Sign in<span className="material-symbols-outlined text-[14px] ml-1">arrow_forward</span>
                </Link>
              </p>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{serverError}</p>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">Full Name</label>
                <input type="text" placeholder="Rahul Sharma" autoComplete="name" {...register('fullName')}
                  className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.fullName ? 'border-red-400 focus:ring-3 focus:ring-red-200' : 'border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20'}`}
                />
                <FieldError message={errors.fullName?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">Phone Number</label>
                <div className={`flex h-12 rounded-lg border transition-all bg-white overflow-hidden ${errors.phone ? 'border-red-400' : 'border-[#e2e8f0] focus-within:border-[#4648d4] focus-within:ring-3 focus-within:ring-[#4648d4]/20'}`}>
                  <span className="flex items-center justify-center px-4 bg-[#f3f3f4] text-[#464554] text-sm border-r border-[#e2e8f0] select-none font-medium">+91</span>
                  <input type="tel" placeholder="9876543210" autoComplete="tel" {...register('phone')}
                    className="flex-1 px-4 border-none focus:ring-0 outline-none text-sm text-[#1a1c1c] bg-transparent" />
                </div>
                <FieldError message={errors.phone?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">Email Address</label>
                <input type="email" placeholder="rahul@email.com" autoComplete="email" {...register('email')}
                  className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.email ? 'border-red-400 focus:ring-3 focus:ring-red-200' : 'border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20'}`}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">Password</label>
                <div className="relative h-12">
                  <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" autoComplete="new-password" {...register('password')}
                    className={`w-full h-full px-4 pr-12 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${errors.password ? 'border-red-400 focus:ring-3 focus:ring-red-200' : 'border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20'}`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1a1c1c] transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {passwordValue.length > 0 && (
                  <div className="mt-2 space-y-1">
                    <div className="flex gap-1">
                      {strength.bars.map((active, i) => (
                        <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${active ? (i >= 2 ? 'bg-emerald-500' : 'bg-amber-500') : 'bg-slate-200'}`} />
                      ))}
                    </div>
                    <p className="text-[11px] text-[#64748b]">{strength.label}</p>
                  </div>
                )}
                <FieldError message={errors.password?.message} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#464554] mb-2">Confirm Password</label>
                <input type="password" placeholder="••••••••" autoComplete="new-password" {...register('confirmPassword')}
                  className={`w-full h-12 px-4 rounded-lg border transition-all outline-none text-sm text-[#1a1c1c] bg-white ${
                    errors.confirmPassword ? 'border-red-400 focus:ring-3 focus:ring-red-200'
                      : confirmPasswordValue && passwordsMatch ? 'border-emerald-500 focus:border-emerald-500 focus:ring-3 focus:ring-emerald-200'
                        : 'border-[#e2e8f0] focus:border-[#4648d4] focus:ring-3 focus:ring-[#4648d4]/20'
                  }`}
                />
                {confirmPasswordValue && passwordsMatch && !errors.confirmPassword && (
                  <p className="text-xs text-emerald-600 flex items-center gap-1 mt-1.5 font-medium">
                    <Check className="w-3.5 h-3.5" /> Passwords match
                  </p>
                )}
                <FieldError message={errors.confirmPassword?.message} />
              </div>

              <div>
                <div className="flex items-start gap-3">
                  <input id="portal-terms" type="checkbox" {...register('agreeTerms')}
                    className="w-4 h-4 mt-0.5 rounded border-[#e2e8f0] text-[#4648d4] focus:ring-[#4648d4] bg-white cursor-pointer" />
                  <label htmlFor="portal-terms" className="text-xs text-[#464554] cursor-pointer leading-relaxed">
                    I agree to the <a href="#" className="text-[#4648d4] hover:underline font-medium">Terms of Service</a> and <a href="#" className="text-[#4648d4] hover:underline font-medium">Privacy Policy</a>
                  </label>
                </div>
                <FieldError message={errors.agreeTerms?.message} />
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full h-12 text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#4648d4] hover:bg-[#3b3db9] shadow-md disabled:opacity-70">
                {isSubmitting ? 'Creating account…' : <>Create Account<span className="material-symbols-outlined text-[18px]">arrow_forward</span></>}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PortalRegisterPage;
