import { Navigate } from 'react-router-dom'
import { usePortalAuthStore } from '@/shared/stores/portalAuthStore'

interface Props {
  children: React.ReactNode
}

/**
 * Guards Customer Portal authenticated routes.
 * Reads from portalAuthStore — NEVER from authStore (different JWT secret).
 * Redirects to /portal/login?error=true if not authenticated.
 */
export function PortalProtectedRoute({ children }: Props) {
  const { user, accessToken } = usePortalAuthStore()

  if (!accessToken || !user) {
    return <Navigate to="/portal/login?error=true" replace />
  }

  return <>{children}</>
}
