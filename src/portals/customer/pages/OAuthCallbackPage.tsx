import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePortalAuthStore } from '@/shared/stores/portalAuthStore';
import { Loader2 } from 'lucide-react';

/**
 * Landing page at /portal/oauth-callback
 *
 * After the backend Google OAuth flow completes, it redirects to:
 *   /portal/oauth-callback#accessToken=...&refreshToken=...&userId=...&email=...&fullName=...
 *
 * This page reads the tokens from the URL fragment (hash), stores them in
 * Zustand, and then navigates to /portal/browse.
 *
 * Using the URL fragment (#) is intentional — hash values are never sent to
 * any server, so tokens don't appear in access logs.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const storeLogin = usePortalAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);
  const processed = useRef(false);

  useEffect(() => {
    // Guard against React StrictMode double-invocation
    if (processed.current) return;
    processed.current = true;

    const hash = window.location.hash.slice(1); // remove the leading '#'
    if (!hash) {
      setError('No credentials found. Please try signing in again.');
      return;
    }

    const params = new URLSearchParams(hash);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    const userId = params.get('userId');
    const email = params.get('email');
    const fullName = params.get('fullName');

    if (!accessToken || !refreshToken || !userId || !email || !fullName) {
      setError('Incomplete credentials received. Please try signing in again.');
      return;
    }

    // Store in Zustand (persisted to localStorage)
    storeLogin(
      { accessToken, refreshToken },
      { id: userId, email, fullName },
    );

    // Clean the hash from the URL before navigating so tokens aren't visible
    window.history.replaceState(null, '', window.location.pathname);

    // Small delay to let the store hydrate before navigating
    setTimeout(() => navigate('/portal/browse', { replace: true }), 100);
  }, [navigate, storeLogin]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
        <div className="text-center max-w-sm px-4">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-500 text-2xl">✕</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign-in Failed</h2>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <a
            href="/portal/login"
            className="inline-block bg-[#4648d4] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90"
          >
            Back to Login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9]">
      <div className="text-center">
        <Loader2 className="w-10 h-10 text-[#4648d4] animate-spin mx-auto mb-4" />
        <p className="text-slate-600 font-medium">Signing you in with Google…</p>
      </div>
    </div>
  );
}
