import React from 'react'
import { ArrowLeft, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto mb-4 text-[#4648d4] shadow-sm">
        <Sparkles className="w-8 h-8 text-[#4648d4]" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">{title}</h2>
      <p className="text-slate-500 text-sm max-w-md mx-auto mb-6 leading-relaxed">{description}</p>

      <div className="p-6 bg-white border border-slate-200/80 rounded-xl shadow-xs text-left max-w-md mx-auto mb-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-xs font-semibold text-slate-700">Coming Soon</span>
        </div>
        <p className="text-xs text-slate-500">
          This feature is planned for a future sprint and will be available shortly.
        </p>
      </div>

      <Link
        to="/bank/dashboard"
        className="inline-flex items-center gap-2 text-xs font-semibold text-[#4648d4] hover:text-[#3b3dbb] bg-indigo-50 hover:bg-indigo-100/70 px-4 py-2 rounded-lg transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </Link>
    </div>
  )
}
