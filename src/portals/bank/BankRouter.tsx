import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";
import { BankLayout } from "./components/layout/BankLayout";
import { ProductsPage } from "./pages/ProductsPage";
import { CreateProductWizardPage } from "./pages/CreateProductWizardPage";
import { ProductDetailPage } from "./pages/ProductDetailPage";
import { EditProductPage } from "./pages/EditProductPage";
import { PlaceholderPage } from "./pages/PlaceholderPage";
import { BankDashboardPage } from "./pages/DashboardPage";

export default function BankRouter() {
  return (
    <ProtectedRoute allowedRoles={["BANK_ADMIN"]}>
      <Routes>
        <Route element={<BankLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<BankDashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<CreateProductWizardPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route
            path="transactions"
            element={
              <PlaceholderPage
                title="Transaction History"
                description="Review daily disbursements, processing fees, and commission settlements with partner DSAs."
              />
            }
          />
          <Route
            path="accounts"
            element={
              <PlaceholderPage
                title="Accounts & DSA Partners"
                description="Overview of connected financial intermediaries, DSAs, and institutional borrower records."
              />
            }
          />
          <Route
            path="risk-analysis"
            element={
              <PlaceholderPage
                title="Risk Analysis & Portfolio Health"
                description="Automated risk analytics, FOIR stress metrics, and portfolio risk evaluation."
              />
            }
          />
          <Route
            path="compliance"
            element={
              <PlaceholderPage
                title="Compliance & Audit Logs"
                description="Regulatory adherence metrics, documentation verifications, and audit logging."
              />
            }
          />
          <Route
            path="settings"
            element={
              <PlaceholderPage
                title="Bank Profile & System Settings"
                description="Manage your bank representative credentials, notification rules, and API integration keys."
              />
            }
          />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  );
}
