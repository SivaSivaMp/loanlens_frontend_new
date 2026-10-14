import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'

interface PortalShellProps {
  /** The portal-specific Sidebar component (rendered as desktop + mobile drawer) */
  sidebar: React.ReactNode
  /** The fixed top header component */
  header: React.ReactNode
  /**
   * Tailwind class(es) that offset the main content area on md+ to clear the
   * fixed sidebar. e.g. 'md:ml-[240px]' (bank) or 'md:ml-64' (company/256px).
   * Defaults to 'md:ml-64'.
   */
  mainOffsetClass?: string
}

/**
 * PortalShell — sections/organism
 * Shared layout shell used by all portal layouts (Bank, Company, Agent, etc.).
 * Handles the desktop sidebar, mobile drawer overlay, top header, and main
 * content area. Each portal passes its own Sidebar and Header components.
 */
export const PortalShell: React.FC<PortalShellProps> = ({
  sidebar,
  header,
  mainOffsetClass = 'md:ml-64',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-slate-900 flex antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        {sidebar}
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50">
            {React.isValidElement(sidebar)
              ? React.cloneElement(sidebar as React.ReactElement<{ onCloseMobile?: () => void }>, {
                  onCloseMobile: () => setMobileMenuOpen(false),
                })
              : sidebar}
          </div>
        </div>
      )}

      {/* Main Content Area — offset by mainOffsetClass to clear the fixed sidebar on md+ */}
      <div className={`flex-1 flex flex-col min-h-screen ${mainOffsetClass}`}>
        {/* Mobile header — inject hamburger handler */}
        <div className="md:hidden">
          {React.isValidElement(header)
            ? React.cloneElement(header as React.ReactElement<{ onOpenMobileMenu?: () => void }>, {
                onOpenMobileMenu: () => setMobileMenuOpen(true),
              })
            : header}
        </div>
        {/* Desktop header */}
        <div className="hidden md:block">
          {header}
        </div>
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
