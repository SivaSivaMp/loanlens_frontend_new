import React from 'react'

type AvatarColor = 'indigo' | 'emerald' | 'amber' | 'slate'
type AvatarSize = 'sm' | 'md' | 'lg'

interface AvatarProps {
  initials: string
  color?: AvatarColor
  size?: AvatarSize
  className?: string
  title?: string
}

const colorClasses: Record<AvatarColor, string> = {
  indigo:  'bg-gradient-to-tr from-[#4648d4] to-[#6063ee] text-white',
  emerald: 'bg-emerald-500 text-white',
  amber:   'bg-amber-500 text-white',
  slate:   'bg-slate-600 text-white',
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-9 h-9 text-sm',
  lg: 'w-11 h-11 text-base',
}

/**
 * Avatar — ui/atom
 * Circular user avatar displaying initials. No business logic.
 */
export const Avatar: React.FC<AvatarProps> = ({
  initials,
  color = 'indigo',
  size = 'md',
  className = '',
  title,
}) => {
  return (
    <div
      title={title}
      className={`
        rounded-full flex items-center justify-center font-bold shrink-0 shadow-sm
        ${colorClasses[color]}
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {initials.slice(0, 2).toUpperCase()}
    </div>
  )
}
