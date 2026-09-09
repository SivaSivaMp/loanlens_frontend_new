import { useNavigate } from "react-router-dom";
import { usePortalAuthStore } from "@/shared/stores/portalAuthStore";

export default function PortalBrowsePage() {
  const logout = usePortalAuthStore((s) => s.logout);
  const username = usePortalAuthStore((s) => s.user?.fullName);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/portal/login", { replace: true });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Browse Loan Products, welcome {username}
        </h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
      <p className="text-slate-500">Customer product browser</p>
    </div>
  );
}
