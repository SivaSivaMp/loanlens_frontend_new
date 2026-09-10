import { Navigate, Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { CustomerProvider } from "./context/CustomerContext";
import { DsaLayout } from "./components/layout/DsaLayout";
import DashboardPage from "./pages/DashboardPage";
import { LeadManagementPage } from "./pages/LeadManagementPage";
import { LeadDetailPage } from "./pages/LeadDetailPage";
import { TeamManagementPage } from "./pages/TeamManagementPage";
import AgentDetailPage from "./pages/AgentDetailPage";
import { AllCustomersPage } from "./pages/AllCustomersPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";

export default function CompanyRouter() {
  return (
    <ProtectedRoute allowedRoles={["COMPANY_DSA"]}>
      <CustomerProvider>
        <Routes>
          <Route element={<DsaLayout />}>
            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* Leads */}
            <Route path="leads" element={<LeadManagementPage />} />
            <Route path="leads/:leadId" element={<LeadDetailPage />} />

            {/* Team */}
            <Route path="team" element={<TeamManagementPage />} />
            <Route path="team/:agentId" element={<AgentDetailPage />} />
            <Route path="agents/:agentId" element={<AgentDetailPage />} />

            {/* Applications / Customers */}
            <Route path="customers" element={<AllCustomersPage />} />
            <Route path="applications" element={<AllCustomersPage />} />

            {/* Placeholder routes — designs not yet built */}
            <Route
              path="banks"
              element={
                <PlaceholderPage
                  title="Banks & Active Agreements"
                  description="Manage partner bank and NBFC contracts, active payouts, product tiers, and SLA documents. Full page coming in the next sprint."
                />
              }
            />
            <Route
              path="split-rules"
              element={
                <PlaceholderPage
                  title="Commission Split Rules"
                  description="Configure multi-tier commission splits, company margin retention thresholds, and volume incentives."
                />
              }
            />
            <Route
              path="commissions"
              element={
                <PlaceholderPage
                  title="Commission Tracker & Disbursements"
                  description="Real-time audit log of gross commission receivables, agent payouts, and monthly revenue reconciliation."
                />
              }
            />
            <Route
              path="analytics/team"
              element={
                <PlaceholderPage
                  title="Team Performance Analytics"
                  description="In-depth analytics on agent closing rates, turnaround times, and customer satisfaction ratings."
                />
              }
            />
            <Route
              path="analytics/pipeline"
              element={
                <PlaceholderPage
                  title="Customer Pipeline Analytics"
                  description="Funnel conversions from lead qualification to sanction, disbursement, and settlement."
                />
              }
            />
            <Route
              path="notifications"
              element={
                <PlaceholderPage
                  title="Notifications Center"
                  description="Alerts on new unassigned leads, lender rate updates, and commission payout settlements."
                />
              }
            />
            <Route
              path="settings"
              element={
                <PlaceholderPage
                  title="Company Profile & Settings"
                  description="Manage your DSA legal entity information, bank payout details, and security preferences."
                />
              }
            />

            {/* Root redirect */}
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>
        </Routes>
      </CustomerProvider>
    </ProtectedRoute>
  );
}
