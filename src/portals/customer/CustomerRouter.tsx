import { Route, Routes, Navigate } from "react-router-dom";
import PortalLoginPage from "./pages/PortalLoginPage";
import PortalRegisterPage from "./pages/PortalRegisterPage";
import PortalVerifyEmailPage from "./pages/PortalVerifyEmailPage";
import PortalEmailVerifiedPage from "./pages/PortalEmailVerifiedPage";
import PortalForgotPasswordPage from "./pages/PortalForgotPasswordPage";
import PortalResetPasswordPage from "./pages/PortalResetPasswordPage";
import { PortalProtectedRoute } from "@/shared/components/PortalProtectedRoute";
import PortalBrowsePage from "./pages/PortalBrowsePage";
import { GuestRoute } from "@/shared/components/GuestRoute";

export default function CustomerRouter() {
  return (
    <Routes>
      {/*  Public Auth  */}
      <Route
        path="login"
        element={
          <GuestRoute type="portal">
            <PortalLoginPage />
          </GuestRoute>
        }
      />
      <Route
        path="register"
        element={
          <GuestRoute type="portal">
            <PortalRegisterPage />
          </GuestRoute>
        }
      />
      <Route
        path="verify-email"
        element={
          <GuestRoute type="portal">
            <PortalVerifyEmailPage />
          </GuestRoute>
        }
      />
      {/* Callback: user clicks link in email → lands here */}
      <Route path="email-verified" element={<PortalEmailVerifiedPage />} />
      <Route
        path="forgot-password"
        element={
          <GuestRoute type="portal">
            <PortalForgotPasswordPage />
          </GuestRoute>
        }
      />
      <Route
        path="reset-password"
        element={<PortalResetPasswordPage />}
      />
      <Route
        path="auth/reset-password/:token"
        element={<PortalResetPasswordPage />}
      />

      {/*  Protected  */}
      <Route
        path="browse"
        element={
          <PortalProtectedRoute>
            <PortalBrowsePage />
          </PortalProtectedRoute>
        }
      />

      {/*  Fallback */}
      <Route index element={<Navigate to="login" replace />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
