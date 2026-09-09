import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { portalLoginSchema, type PortalLoginFormData } from '@/shared/validations/auth.schemas';
import { PortalAuthService } from '@/shared/api/authService';
import { usePortalAuthStore } from '@/shared/stores/portalAuthStore';
import { getApiErrorMessage } from '@/shared/utils/apiError';
import { Eye, EyeOff, AlertCircle, Star } from 'lucide-react';

export const PortalLoginPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const storeLogin = usePortalAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(
    searchParams.get('error') === 'true' ? 'Session expired. Please sign in again.' : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PortalLoginFormData>({ resolver: zodResolver(portalLoginSchema) });

  const onSubmit = async (data: PortalLoginFormData) => {
    setServerError(null);
    try {
      const result = await PortalAuthService.login(data.email, data.password);
      storeLogin(
        { accessToken: result.accessToken, refreshToken: result.refreshToken },
        result.user,
      );
      toast.success(`Welcome back, ${result.user.fullName.split(' ')[0]}!`);
      navigate('/portal/browse', { replace: true });
    } catch (err) {
      setServerError(getApiErrorMessage(err, 'Invalid email or password.'));
    }
  };

  return (
    <div className="bg-[#f9f9f9] text-[#1a1c1c] antialiased min-h-screen flex flex-col font-['Inter',sans-serif]">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-40 bg-[#f9f9f9] shadow-sm transition-all duration-200">
        <div className="flex justify-between items-center h-[68px] px-6 max-w-[1200px] mx-auto">
          <Link to="/portal/login" className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4648d4]" style={{ fontVariationSettings: "'FILL' 1" }}>lens</span>
            <span className="font-bold text-xl text-[#4648d4]">LoanLens</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/portal/login" className="text-sm font-medium text-[#464554] hover:text-[#4648d4] transition-colors">Sign In</Link>
            <Link to="/portal/register" className="bg-[#4648d4] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:opacity-90 shadow-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="flex-grow flex flex-col md:flex-row mt-[68px] min-h-[calc(100vh-68px)]">
        {/* Left Panel */}
        <div className="hidden md:flex flex-col w-1/2 bg-[#4648d4] p-12 lg:p-24 relative overflow-hidden text-white shadow-inner">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c0c1ff] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white">Welcome back.</h1>
              <p className="text-base lg:text-lg text-white/80 max-w-md leading-relaxed">
                Check your proposals, track your loan, and schedule a call with your advisor.
              </p>
            </div>
            <div className="bg-white text-[#1a1c1c] rounded-xl p-6 mt-8 max-w-md shadow-lg border border-[#e2e8f0]">
              <div className="flex items-center gap-1 mb-3 text-amber-500">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
              </div>
              <p className="text-sm text-[#1a1c1c] mb-4 leading-relaxed">
                "Found a home loan at 8.50% when my bank was offering 9.25%. Saved ₹6L over the tenure!"
              </p>
              <p className="text-xs text-[#64748b] font-medium">— Rahul S., Bangalore</p>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-6 md:p-12 lg:p-24 min-h-full relative z-10">
          <div className="w-full max-w-md space-y-8">
            <div>
              <h2 className="text-2xl lg:text-3xl font-bold text-[#1a1c1c] mb-2">Sign in to your account</h2>
              <Link to="/portal/register" className="text-sm text-[#4648d4] hover:text-[#6063ee] transition-colors inline-flex items-center font-medium group">
                New to LoanLens? Create a free account
                <span className="material-symbols-outlined text-[18px] ml-1 group-hover:translate-x-1 transition-transform">arrow_right_alt</span>
              </Link>
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3.5 rounded-xl text-sm flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Authentication Failed</p>
                  <p className="text-xs text-red-600 mt-0.5">{serverError}</p>
                </div>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-[#464554]" htmlFor="portal-email">Email Address</label>
                <input
                  id="portal-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  {...register('email')}
                  className={`w-full px-4 h-12 border rounded-lg bg-white text-[#1a1c1c] placeholder-[#64748b] text-sm outline-none transition-all ${
                    errors.email
                      ? 'border-red-400 focus:ring-3 focus:ring-red-200'
                      : 'border-[#e2e8f0] focus:ring-3 focus:ring-[#4648d4]/20 focus:border-[#4648d4]'
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[#464554]" htmlFor="portal-password">Password</label>
                  <Link to="/portal/forgot-password" className="text-xs font-semibold text-[#4648d4] hover:text-[#6063ee] transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="portal-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    {...register('password')}
                    className={`w-full px-4 pr-12 h-12 border rounded-lg bg-white text-[#1a1c1c] placeholder-[#64748b] text-sm outline-none transition-all ${
                      errors.password
                        ? 'border-red-400 focus:ring-3 focus:ring-red-200'
                        : 'border-[#e2e8f0] focus:ring-3 focus:ring-[#4648d4]/20 focus:border-[#4648d4]'
                    }`}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#1a1c1c] transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" /> {errors.password.message}
                  </p>
                )}
              </div>

              <button type="submit" disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 h-12 rounded-lg shadow-sm text-sm font-semibold text-white bg-[#4648d4] hover:bg-[#3b3db9] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4648d4] transition-all group cursor-pointer disabled:opacity-70">
                {isSubmitting ? 'Signing in…' : (
                  <>Sign In<span className="material-symbols-outlined text-[20px] group-hover:translate-x-1 transition-transform">arrow_forward</span></>
                )}
              </button>

              {/* Divider */}
              <div className="flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-[#e2e8f0]" />
                <span className="text-xs text-[#94a3b8] font-medium">or</span>
                <div className="flex-1 h-px bg-[#e2e8f0]" />
              </div>

              {/* Google Sign-In */}
              <a
                href={`${import.meta.env.VITE_API_URL}/portal/auth/google`}
                className="w-full flex items-center justify-center gap-3 h-12 border border-[#e2e8f0] rounded-lg text-sm font-semibold text-[#1a1c1c] bg-white hover:bg-slate-50 transition-colors"
              >
                {/* Google G logo (inline SVG — no extra package needed) */}
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

export default PortalLoginPage;

