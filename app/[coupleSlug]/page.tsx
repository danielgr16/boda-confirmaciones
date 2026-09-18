'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CoupleIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
      <div className="text-center space-y-3">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6E836F] border-t-transparent mx-auto"></div>
        <p className="text-xs font-semibold text-[#586959] uppercase tracking-widest">
          Redirigiendo...
        </p>
      </div>
    </div>
  );
}
