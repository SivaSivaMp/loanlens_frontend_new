import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ChevronRight,
  BarChart3,
  TrendingUp,
  Edit,
  FileText,
  Clock,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Download,
} from 'lucide-react'

export const ProductDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  return (
    <div className="space-y-6 max-w-[1240px] mx-auto pb-12">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500">
        <button
          onClick={() => navigate('/bank/products')}
          className="hover:text-[#4648d4] transition-colors flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Products</span>
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/bank/products" className="hover:text-[#4648d4] transition-colors">
          Products
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold">SBI Home Loan</span>
      </div>

      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-2 border-b border-slate-200/60">
        <div>
          <div className="flex items-center gap-3 mb-1.5 flex-wrap">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              SBI Home Loan
            </h2>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-[#4648d4] border border-indigo-100">
              HOME LOAN
            </span>
            <div className="flex items-center gap-1.5 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Active</span>
            </div>
          </div>
          <p className="text-xs text-slate-500">
            Product Reference: <span className="font-mono text-slate-700">PRD-SBI-HL-2026</span> · Last updated 3 days ago
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={() => alert('View Rate History modal')}
            className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <BarChart3 className="w-4 h-4 text-slate-500" />
            <span>Rate History</span>
          </button>
          <button
            onClick={() => alert('View Product Analytics')}
            className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-xs transition-colors"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span>View Analytics</span>
          </button>
          <button
            onClick={() => navigate(`/bank/products/${id}/edit`)}
            className="h-9 px-4 inline-flex items-center gap-1.5 rounded-xl bg-[#4648d4] hover:bg-[#3b3dbb] text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Product</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Card 1: Basic Information */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Product Name</p>
                <p className="text-sm font-semibold text-slate-900">SBI Home Loan</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Loan Category</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-[#4648d4]">Home Loan</span>
              </div>
              <div className="md:col-span-2">
                <p className="text-xs text-slate-400 font-medium mb-1">Description</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Competitive home loans tailored for middle-income groups with flexible repayment options and minimal processing fees.
                </p>
              </div>
              <div className="md:col-span-2 pt-2 border-t border-slate-100">
                <p className="text-xs text-slate-400 font-medium mb-2">Product Brochure</p>
                <a
                  href="#download"
                  onClick={(e) => { e.preventDefault(); alert('Downloading brochure: SBI_HomeLoan_2026.pdf') }}
                  className="inline-flex items-center gap-2 px-3.5 py-2 bg-indigo-50/70 hover:bg-indigo-50 border border-indigo-100 text-[#4648d4] text-xs font-semibold rounded-lg transition-colors"
                >
                  <FileText className="w-4 h-4 text-[#4648d4]" />
                  <span>SBI_HomeLoan_2026.pdf</span>
                  <Download className="w-3.5 h-3.5 ml-2 text-indigo-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Card 2: Rate & Amount */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Rate & Amount</h3>
            <div className="flex flex-wrap items-baseline gap-8 mb-6 pb-5 border-b border-slate-100">
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Rate Type</p>
                <p className="text-sm font-semibold text-slate-900">Floating (Repo Linked)</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Base Rate Range</p>
                <p className="text-xl sm:text-2xl font-bold text-[#4648d4]">8.50% – 9.85%</p>
              </div>
            </div>
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Rate Slabs by Loan Amount</p>
              <div className="overflow-x-auto rounded-xl border border-slate-200/80">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 font-bold text-slate-500 border-b border-slate-200/80">
                    <tr>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider">Amount Range</th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider">Interest Rate</th>
                      <th className="px-4 py-3 font-semibold uppercase tracking-wider">Rate Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">Up to ₹30 Lakhs</td>
                      <td className="px-4 py-3 font-bold text-[#4648d4]">8.50%</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">Tier 1 (Prime)</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">₹30 Lakhs – ₹75 Lakhs</td>
                      <td className="px-4 py-3 font-bold text-[#4648d4]">8.75%</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">Tier 2</span></td>
                    </tr>
                    <tr className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 font-medium">Above ₹75 Lakhs</td>
                      <td className="px-4 py-3 font-bold text-[#4648d4]">9.85%</td>
                      <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold">Tier 3</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50/70 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Loan Amount</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">₹5L – ₹5Cr</p>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Tenure</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">60 – 360 mos</p>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Max LTV</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900">80%</p>
              </div>
              <div className="p-3 bg-slate-50/70 rounded-xl">
                <p className="text-[11px] text-slate-400 font-medium mb-1">Property Types</p>
                <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">Residential, Under Const.</p>
              </div>
            </div>
          </div>

          {/* Card 3: Eligibility */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-5">Eligibility Criteria</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div><p className="text-xs text-slate-400 font-medium mb-1">Min Monthly Income</p><p className="text-sm font-bold text-slate-900">₹25,000 / month</p></div>
              <div><p className="text-xs text-slate-400 font-medium mb-1">Age Bracket</p><p className="text-sm font-bold text-slate-900">21 – 60 years</p></div>
              <div>
                <p className="text-xs text-slate-400 font-medium mb-1">Min CIBIL Score</p>
                <div className="inline-flex items-center gap-1.5 mt-0.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm font-bold text-slate-900">700</span>
                </div>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-slate-400 font-medium mb-2">Employment Type</p>
                <div className="flex gap-2">
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Salaried</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Self-Employed</span>
                </div>
              </div>
              <div><p className="text-xs text-slate-400 font-medium mb-1">Min Employment</p><p className="text-xs sm:text-sm font-semibold text-slate-800">2 Years total · 1 Year current</p></div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-6">
          {/* Commission Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">DSA Commission</h3>
            <div className="mb-4">
              <span className="text-3xl font-extrabold text-slate-900">0.50%</span>
              <span className="text-xs text-slate-500 ml-2 font-medium">of disbursed amount</span>
            </div>
            <div className="flex items-center gap-2 mb-5 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <Clock className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Payout Timeline: <strong className="text-slate-800 font-semibold">30 days</strong> post disbursement</span>
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-emerald-800 mb-0.5">Estimated Commission</p>
                  <p className="text-xs text-emerald-700 leading-relaxed">
                    For a ₹50 Lakh loan: <strong className="font-bold text-emerald-900">₹25,000 commission</strong>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-6 shadow-xs">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Required Documents</h3>
            <ul className="space-y-2.5 text-xs">
              {['PAN Card', 'Aadhaar Card', 'Last 3 Months Salary Slips', '6 Months Bank Statement', 'Property Documents (Draft)', 'IT Returns (2 Years)', 'Form 16'].map((doc) => (
                <li key={doc} className="flex items-center gap-2.5 text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-medium">{doc}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-xl border border-slate-800 p-6 shadow-md text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/15 rounded-full blur-3xl -mr-8 -mt-8 pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-4">Quick Stats (This Month)</h3>
              <div className="space-y-3.5 mb-5 divide-y divide-slate-800">
                <div className="flex justify-between items-center pt-1"><span className="text-xs text-slate-400">Impressions</span><span className="text-lg font-bold text-white">1,240</span></div>
                <div className="flex justify-between items-center pt-2"><span className="text-xs text-slate-400">Comparisons</span><span className="text-lg font-bold text-white">89</span></div>
                <div className="flex justify-between items-center pt-2"><span className="text-xs text-slate-400">Applications</span><span className="text-lg font-bold text-white">45</span></div>
              </div>
              <button onClick={() => alert('View Full Analytics')} className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-300 hover:text-white transition-colors">
                <span>View full analytics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
