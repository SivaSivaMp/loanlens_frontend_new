import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import { usePortalAuthStore } from "@/shared/stores/portalAuthStore";
import type { UserRole } from "@/shared/types/api.types";

interface GuestRouteProps {
  children: React.ReactNode;
  type: "b2b" | "portal";
}

const ROLE_REDIRECT: Record<UserRole, string> = {
  BANK_ADMIN: "/bank/dashboard",
  COMPANY_DSA: "/company/dashboard",
  FIELD_AGENT: "/agent/dashboard",
};

export function GuestRoute({ children, type }: GuestRouteProps) {
  const b2bAuth = useAuthStore();
  const portalAuth = usePortalAuthStore();

  if (type === "portal") {
    if (portalAuth.accessToken && portalAuth.user) {
      return <Navigate to="/portal/browse" replace />;
    }

    return <>{children}</>;
  }

  if (b2bAuth.accessToken && b2bAuth.user) {
    return <Navigate to={ROLE_REDIRECT[b2bAuth.user.role]} replace />;
  }

  return <>{children}</>;
}
