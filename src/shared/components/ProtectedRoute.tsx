import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/shared/stores/authStore";
import type { UserRole } from "@/shared/types/api.types";

interface Props {
  children?: React.ReactNode;
  allowedRoles?: UserRole[];
}

/**
 * Guards B2B portal routes.
 * Reads from authStore (NOT portalAuthStore).
 * Redirects to /login if unauthenticated.
 * Redirects to /unauthorized if role is not in allowedRoles.
 */

export function ProtectedRoute({ children, allowedRoles }: Props) {
  const { user, accessToken } = useAuthStore();
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
