import React from 'react';
import { Shield, Sparkles, CheckCircle2 } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

/**
 * B2B Auth Layout — dark split-panel design (exact from Stitch B2B_Auth).
 * Left: dark indigo panel with glassmorphism demo card.
 * Right: white panel that renders children (form content).
 */
export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-['Inter',sans-serif] text-slate-900 overflow-x-hidden">
      {/* Left Panel — Desktop only */}
      <div className="hidden lg:flex flex-col w-[45%] bg-gradient-to-b from-[#0f172a] via-[#16153c] to-[#1e1b4b] relative overflow-hidden p-10 justify-between select-none">
        {/* Ambient Glow Blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-600/15 rounded-full blur-[140px] pointer-events-none" />
        {/* Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Logo */}
        <div className="z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-white font-bold text-xl tracking-tight leading-none">
              Loan<span className="text-indigo-400">Lens</span>
            </span>
            <span className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
              DSA Intelligence Platform
            </span>
          </div>
        </div>

        {/* Center Demo Card */}
        <div className="z-10 max-w-md mx-auto w-full my-auto py-8">
          <div className="glass-card rounded-2xl p-6 shadow-2xl backdrop-blur-xl mb-8 border border-white/10 relative overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Best Matches for Your Customer
              </h3>
              <span className="text-[11px] text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full font-medium border border-indigo-400/30">
                AI Match Active
              </span>
            </div>
            <div className="space-y-3.5">
              {[
                { abbr: 'SBI', color: 'bg-blue-600', name: 'SBI - Home Loan', sub: 'ROI 8.40% · Max 90% LTV', match: '96% Match', emi: '₹41,800/mo', matchColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                { abbr: 'HDFC', color: 'bg-red-600', name: 'HDFC - Personal Loan', sub: 'Instant Approval · 24 hrs', match: '91% Match', emi: '₹12,400/mo', matchColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30' },
                { abbr: 'ICICI', color: 'bg-amber-600', name: 'ICICI - Business Loan', sub: 'Collateral-Free', match: '87% Match', emi: '₹85,200/mo', matchColor: 'bg-indigo-500/20 text-indigo-200 border-indigo-400/30' },
              ].map((row) => (
                <div key={row.abbr} className="flex items-center justify-between bg-white/5 p-2.5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg ${row.color} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>{row.abbr}</div>
                    <div>
                      <div className="text-white text-xs font-semibold">{row.name}</div>
                      <div className="text-slate-400 text-[11px]">{row.sub}</div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-0.5">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${row.matchColor}`}>{row.match}</span>
                    <span className="text-white text-xs font-semibold">{row.emi}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-white text-3xl font-bold leading-tight tracking-tight">
            The smartest way to find loans for your customers.
          </h1>
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">
            Join 300+ DSAs and 24+ partner banks accelerating approval workflows with LoanLens.
          </p>
        </div>

        {/* Footer */}
        <div className="z-10 flex items-center justify-between text-slate-400 text-xs border-t border-white/10 pt-4">
          <span>© 2026 LoanLens Inc. All rights reserved.</span>
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-indigo-400" /> 256-bit Encrypted
          </span>
        </div>
      </div>

      {/* Right Panel — Form Content */}
      <div className="w-full lg:w-[55%] bg-white flex flex-col justify-center items-center p-6 sm:p-12 relative min-h-screen">
        {/* Mobile Logo */}
        <div className="lg:hidden w-full max-w-[420px] mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-slate-900 font-bold text-lg tracking-tight">
              Loan<span className="text-indigo-600">Lens</span>
            </span>
          </div>
          <span className="text-xs text-indigo-600 font-medium bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
            B2B Workspace
          </span>
        </div>
        {/* Page Content */}
        <div className="w-full max-w-[420px] mx-auto my-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
