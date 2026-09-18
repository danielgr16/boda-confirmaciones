'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GlobalLoginPage from '../login/page';

export default function AdminRootPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated && json.redirectUrl) {
            router.replace(json.redirectUrl);
            return;
          }
        }
      } catch {
        // Continue to login
      } finally {
        setChecking(false);
      }
    }
    checkSession();
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-[#586959] uppercase tracking-widest">
            Accediendo al panel...
          </p>
        </div>
      </div>
    );
  }

  return <GlobalLoginPage />;
}
