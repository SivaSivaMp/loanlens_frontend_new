import React from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarNavItemProps {
  label: string
  path: string
  icon: React.ElementType
  onClick?: () => void
  /** Active link bg + text classes. Defaults to indigo portal style. */
  activeClassName?: string
  /** Inactive link classes. Defaults to slate style. */
  inactiveClassName?: string
  /** Optional badge count shown on the right */
  badge?: string | number
}

/**
 * SidebarNavItem — blocks/molecule
 * A single navigation link row used inside a portal Sidebar.
 * Composes the NavLink primitive with an icon and optional badge.
 */
export const SidebarNavItem: React.FC<SidebarNavItemProps> = ({
  label,
  path,
  icon: Icon,
  onClick,
  activeClassName = 'bg-indigo-600/15 text-indigo-400 border-l-[3px] border-indigo-500 font-semibold shadow-xs',
  inactiveClassName = 'text-slate-400 hover:text-white hover:bg-slate-800/80',
  badge,
}) => {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3.5 h-11 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
          isActive ? activeClassName : inactiveClassName
        }`
      }
    >
      <Icon className="w-[19px] h-[19px] shrink-0" />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="px-1.5 py-0.5 text-[11px] font-bold rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30">
          {badge}
        </span>
      )}
    </NavLink>
  )
}
