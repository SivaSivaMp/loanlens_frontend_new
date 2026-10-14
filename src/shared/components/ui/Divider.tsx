import React from 'react'

interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

/**
 * Divider — ui/atom
 * A thin separator line. No business logic.
 */
export const Divider: React.FC<DividerProps> = ({
  orientation = 'horizontal',
  className = '',
}) => {
  if (orientation === 'vertical') {
    return <div className={`h-6 w-px bg-slate-200 ${className}`} />
  }
  return <div className={`w-full h-px bg-slate-200 ${className}`} />
}
