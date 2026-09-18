'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ShieldCheck,
  Lock,
  User,
  Heart,
  Sparkles,
  ArrowRight,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function GlobalLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [successInfo, setSuccessInfo] = useState<{
    coupleName: string;
    redirectUrl: string;
  } | null>(null);

  // Check if already authenticated globally
  useEffect(() => {
    async function verifySession() {
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
        // Not authenticated
      } finally {
        setCheckingSession(false);
      }
    }
    verifySession();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Por favor ingresa tu usuario o identificador de boda.');
      return;
    }

    if (!password.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessInfo({
          coupleName: data.coupleName || data.user.name || 'Novios',
          redirectUrl: data.redirectUrl,
        });

        setTimeout(() => {
          router.push(data.redirectUrl);
        }, 1200);
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch {
      setError('Error de conexión al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-[#586959] uppercase tracking-widest">
            Comprobando sesión...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Ornaments */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#E8F0E7] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#F5EBE1] rounded-full blur-3xl opacity-50 pointer-events-none"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 sm:p-10 border border-stone-100 text-center relative z-10">
        {/* Success Splash */}
        {successInfo ? (
          <div className="py-8 space-y-4 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-[#E8F0E7] text-[#3F5241] rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Heart className="w-8 h-8 fill-[#3F5241]" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#BCA074]">
                ¡BIENVENIDOS!
              </span>
              <h2 className="font-cormorant text-3xl font-bold text-stone-900">
                {successInfo.coupleName}
              </h2>
              <p className="text-xs text-stone-500">
                Accediendo a su panel de administración...
              </p>
            </div>
            <div className="pt-2">
              <div className="w-8 h-8 border-3 border-[#3F5241] border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          </div>
        ) : (
          <>
            {/* Header Icon */}
            <div className="w-14 h-14 bg-[#E8F0E7] text-[#3F5241] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-[#3F5241]/10">
              <ShieldCheck className="w-7 h-7" />
            </div>

            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] block mb-1">
              ACCESO A NOVIOS & ANFITRIONES
            </span>
            <h1 className="font-cormorant text-3xl font-bold text-[#2C3E2D] mb-2">
              Portal de Administración
            </h1>
            <p className="text-xs text-[#6F7D70] leading-relaxed mb-6">
              Ingresa con las credenciales de tu boda para gestionar invitados, confirmaciones y llegadas.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              {/* Username Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                  Usuario o Identificador de Boda
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Ej. silva-arce o garcia-zentella"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-[#FBF9F5] border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E836F] text-stone-800 transition"
                    autoFocus
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1.5">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-3 rounded-2xl bg-[#FBF9F5] border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E836F] text-stone-800 transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="p-2 text-stone-400 hover:text-stone-600 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer transition"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-xs text-rose-600 mt-2 font-medium bg-rose-50 p-2.5 rounded-xl border border-rose-100">
                    {error}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#2C3E2D] transition shadow-md disabled:opacity-50 mt-2 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Verificando...</span>
                  </>
                ) : (
                  <>
                    <span>INGRESAR AL SISTEMA</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-stone-100 text-center">
              <Link
                href="/"
                className="text-xs text-[#6E836F] hover:underline font-medium"
              >
                ← Volver a la Página Principal
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
