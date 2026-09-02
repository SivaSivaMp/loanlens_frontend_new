import { Route, Routes } from "react-router-dom";
import AgentDashboardPage from "./pages/DashboardPage";

export default function AgentRouter() {
  return (
    <Routes>
      <Route path="dashboard" element={<AgentDashboardPage />} />
      <Route path="*" element={<AgentDashboardPage />} />
    </Routes>
  );
}
