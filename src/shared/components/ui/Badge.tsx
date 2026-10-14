import React from 'react'

type BadgeVariant = 'default' | 'success' | 'danger' | 'warning' | 'indigo'
type BadgeSize = 'sm' | 'xs'

interface BadgeProps {
  label: string
  variant?: BadgeVariant
  size?: BadgeSize
  pulse?: boolean
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default:  'bg-slate-100 text-slate-600 border-slate-200',
  success:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  danger:   'bg-rose-100 text-rose-700 border-rose-200',
  warning:  'bg-amber-100 text-amber-700 border-amber-200',
  indigo:   'bg-indigo-100 text-indigo-700 border-indigo-200',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2.5 py-0.5',
  xs: 'text-[10px] px-2 py-0.5',
}

/**
 * Badge — ui/atom
 * A small status or category label. No business logic.
 */
export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'default',
  size = 'xs',
  pulse = false,
  className = '',
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 font-semibold rounded-full border uppercase tracking-wider
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {pulse && (
        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
          variant === 'danger' ? 'bg-rose-500' : 'bg-current'
        }`} />
      )}
      {label}
    </span>
  )
}
