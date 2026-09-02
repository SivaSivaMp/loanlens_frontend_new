import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ErrorBoundary } from "@/shared/components/ErrorBoundary";

//b2b auth pages

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import BankRegisterPage from "./pages/auth/BankRegisterPage";
//portal routes
import CompanyRouter from "@/portals/company/CompanyRouter";
import BankRouter from "@/portals/bank/BankRouter";
import AgentRouter from "@/portals/agent/AgentRouter";

export default function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register/bank" element={<BankRegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
          <Route path="/company/*" element={<CompanyRouter />} />
          <Route path="/bank/*" element={<BankRouter />} />
          <Route path="/agent/*" element={<AgentRouter />} />
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
