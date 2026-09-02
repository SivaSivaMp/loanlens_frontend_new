import { Route, Routes } from "react-router-dom";
import BankDashboardPage from "./pages/DashboardPage";

export default function BankRouter() {
  return (
    <Routes>
      <Route path="dashboard" element={<BankDashboardPage />} />
      <Route path="*" element={<BankDashboardPage />} />
    </Routes>
  );
}
