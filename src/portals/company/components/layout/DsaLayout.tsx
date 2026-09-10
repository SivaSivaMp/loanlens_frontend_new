import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopHeader } from "./TopHeader";

export const DsaLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const getPageTitle = () => {
    const p = location.pathname;
    if (p === "/company/dashboard") return "Operational Dashboard";
    if (p === "/company/banks") return "Banks & Agreements";
    if (p === "/company/leads") return "Lead Management";
    if (p.startsWith("/company/leads/")) return "Lead Detail";
    if (p === "/company/team") return "Team Management";
    if (p.startsWith("/company/team/") || p.startsWith("/company/agents/"))
      return "Agent Detail";
    if (p === "/company/split-rules") return "Commission Split Rules";
    if (p === "/company/customers" || p === "/company/applications")
      return "All Applications";
    if (p === "/company/commissions") return "Commission Tracker";
    if (p === "/company/analytics/team") return "Team Performance Analytics";
    if (p === "/company/analytics/pipeline")
      return "Customer Pipeline Analytics";
    if (p === "/company/notifications") return "Notifications Center";
    if (p === "/company/settings") return "Company Profile & Settings";
    return "DSA Partner Portal";
  };

  return (
    <div className="min-h-screen bg-[#fcf8ff] text-slate-900 flex antialiased">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative z-50">
            <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
        <TopHeader
          title={getPageTitle()}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />
        <main className="flex-1 mt-16 p-4 sm:p-6 lg:p-8 max-w-[1280px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
