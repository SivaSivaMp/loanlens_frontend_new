import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/shared/components/layout/AuthLayout';
import { Landmark, Briefcase, UserCheck, ChevronRight } from 'lucide-react';

const roles = [
  {
    id: 'bank',
    title: 'Bank or NBFC',
    description: 'List your loan products and reach 300+ DSAs across India.',
    icon: Landmark,
    bgColor: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    hoverBorder: 'hover:border-indigo-600 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100',
    path: '/register/bank',
  },
  {
    id: 'dsa',
    title: 'DSA Company',
    description: 'Manage your team of field agents, payouts, and bank agreements.',
    icon: Briefcase,
    bgColor: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100',
    path: '/register/dsa',
  },
  {
    id: 'field-agent',
    title: 'Field Agent',
    description: 'Find the best matched loans for your customers instantly.',
    icon: UserCheck,
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-600',
    hoverBorder: 'hover:border-amber-500 focus:border-amber-500 focus:ring-4 focus:ring-amber-100',
    path: '/register/agent',
  },
];

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout>
      <div className="mb-8">
        <h2 className="text-slate-900 text-2xl sm:text-3xl font-bold tracking-tight mb-1.5">
          Create your account
        </h2>
        <p className="text-slate-500 text-sm font-normal">
          Select how you'll use LoanLens to get started
        </p>
      </div>

      <div className="space-y-3.5">
        {roles.map((role) => {
          const Icon = role.icon;
          return (
            <button
              key={role.id}
              onClick={() => navigate(role.path)}
              className={`w-full bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left transition-all duration-200 shadow-sm hover:shadow-md group focus:outline-none ${role.hoverBorder}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl ${role.bgColor} flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className={`w-6 h-6 ${role.iconColor}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 text-base mb-0.5">{role.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-snug">{role.description}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-700 transition-colors flex-shrink-0 ml-2" />
            </button>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <p className="text-slate-500 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-semibold ml-1">
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage;
