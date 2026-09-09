import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";
import { GuestRoute } from "@/shared/components/GuestRoute";
import { ProtectedRoute } from "@/shared/components/ProtectedRoute";

//b2b auth pages

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import BankRegisterPage from "./pages/auth/BankRegisterPage";
//portal routes
import CompanyRouter from "@/portals/company/CompanyRouter";
import BankRouter from "@/portals/bank/BankRouter";
import AgentRouter from "@/portals/agent/AgentRouter";
import CustomerRouter from "./portals/customer/CustomerRouter";
import DsaRegisterPage from "./pages/auth/DsaRegisterPage";
import AgentRegisterPage from "./pages/auth/AgentRegisterPage";
import VerifyEmailPage from "./pages/auth/VerifyEmailPage";
import EmailVerifiedPage from "./pages/auth/EmailVerifiedPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* B2B auth */}
          <Route
            path="/login"
            element={
              <GuestRoute type="b2b">
                <LoginPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register"
            element={
              <GuestRoute type="b2b">
                <RegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register/bank"
            element={
              <GuestRoute type="b2b">
                <BankRegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register/dsa"
            element={
              <GuestRoute type="b2b">
                <DsaRegisterPage />
              </GuestRoute>
            }
          />
          <Route
            path="/register/agent"
            element={
              <GuestRoute type="b2b">
                <AgentRegisterPage />
              </GuestRoute>
            }
          />

          {/* verify email page */}
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          {/* verified email page */}
          <Route path="/auth/email-verified" element={<EmailVerifiedPage />} />

          {/* forgot password */}
          <Route
            path="/forgot-password"
            element={
              <GuestRoute type="b2b">
                <ForgotPasswordPage />
              </GuestRoute>
            }
          />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/auth/reset-password/:token"
            element={<ResetPasswordPage />}
          />

          {/* B2B portals */}
          <Route
            path="/company/*"
            element={
              <ProtectedRoute allowedRoles={["COMPANY_DSA"]}>
                <CompanyRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bank/*"
            element={
              <ProtectedRoute allowedRoles={["BANK_ADMIN"]}>
                <BankRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agent/*"
            element={
              <ProtectedRoute allowedRoles={["FIELD_AGENT"]}>
                <AgentRouter />
              </ProtectedRoute>
            }
          />

          {/* B2C auth and portals */}
          <Route path="/portal/*" element={<CustomerRouter />} />

          {/*  Root Redirect  */}
          <Route index element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
      {/* Global Toast Notification */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#f1f5f9",
            fontSize: "13px",
            fontFamily: "Inter, sans-serif",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#f1f5f9" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#f1f5f9" } },
        }}
      />
    </ErrorBoundary>
  );
}
