import React from 'react'

type IconBoxVariant = 'indigo' | 'rose' | 'emerald' | 'amber' | 'slate'
type IconBoxSize = 'sm' | 'md' | 'lg'
type IconBoxRounded = 'lg' | 'xl' | 'full'

interface IconBoxProps {
  icon: React.ElementType
  variant?: IconBoxVariant
  size?: IconBoxSize
  rounded?: IconBoxRounded
  className?: string
}

const variantClasses: Record<IconBoxVariant, string> = {
  indigo:  'bg-indigo-50 text-indigo-600',
  rose:    'bg-rose-50 text-rose-600',
  emerald: 'bg-emerald-50 text-emerald-600',
  amber:   'bg-amber-50 text-amber-600',
  slate:   'bg-slate-100 text-slate-600',
}

const sizeClasses: Record<IconBoxSize, { box: string; icon: string }> = {
  sm: { box: 'w-8 h-8',  icon: 'w-4 h-4' },
  md: { box: 'w-10 h-10', icon: 'w-5 h-5' },
  lg: { box: 'w-12 h-12', icon: 'w-6 h-6' },
}

const roundedClasses: Record<IconBoxRounded, string> = {
  lg:   'rounded-lg',
  xl:   'rounded-xl',
  full: 'rounded-full',
}

/**
 * IconBox — ui/atom
 * A colored square/circle container for a Lucide icon. No business logic.
 */
export const IconBox: React.FC<IconBoxProps> = ({
  icon: Icon,
  variant = 'indigo',
  size = 'md',
  rounded = 'lg',
  className = '',
}) => {
  const { box, icon } = sizeClasses[size]
  return (
    <div
      className={`
        flex items-center justify-center shrink-0
        ${variantClasses[variant]}
        ${box}
        ${roundedClasses[rounded]}
        ${className}
      `}
    >
      <Icon className={icon} />
    </div>
  )
}
