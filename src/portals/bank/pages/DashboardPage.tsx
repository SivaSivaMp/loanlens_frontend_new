import { useAuthStore } from "@/shared/stores/authStore";
import { useNavigate } from "react-router-dom";

export default function BankDashboardPage() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bank Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Bank Dashboard</h1>
      <p className="text-slate-500 mt-2">Bank Admin portal.</p>
    </div>
  );
}
