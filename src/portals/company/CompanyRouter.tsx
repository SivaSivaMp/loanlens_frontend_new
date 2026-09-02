import { Route, Routes } from "react-router-dom";
import CompanyDashboardPage from "./pages/DashboardPage";

export default function CompanyRouter() {
  return (
    <Routes>
      <Route path="dashboard" element={<CompanyDashboardPage />} />
      <Route path="*" element={<CompanyDashboardPage />} />
    </Routes>
  );
}
