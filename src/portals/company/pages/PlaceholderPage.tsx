import React from 'react'
import { Layers } from 'lucide-react'
import { Link } from 'react-router-dom'

interface PlaceholderPageProps {
  title: string
  description: string
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description }) => (
  <div className="h-full min-h-[calc(100vh-10rem)] flex flex-col justify-center animate-in fade-in duration-200">
    <div className="w-full min-h-[420px] border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-white/60 backdrop-blur-xs p-6 sm:p-12 shadow-2xs">
      <div className="text-center flex flex-col items-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5 shadow-xs">
          <Layers className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">{title}</h2>
        <p className="text-sm text-slate-500 leading-relaxed mb-6">{description}</p>
        <Link
          to="/company/dashboard"
          className="h-11 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all flex items-center gap-2"
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  </div>
)
