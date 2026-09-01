'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Lock, CheckCircle, XCircle, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import type { FullInvitation, Guest } from '@/lib/types';

export default function ArrivalPage({
  params,
}: {
  params: Promise<{ coupleSlug: string; uuid: string }>;
}) {
  const { coupleSlug, uuid } = use(params);
  const [data, setData] = useState<FullInvitation | null>(null);
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [checkingPassword, setCheckingPassword] = useState(false);

  // Guests State
  const [guests, setGuests] = useState<Guest[]>([]);
  const [updatingGuest, setUpdatingGuest] = useState<string | null>(null);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/${coupleSlug}/invitation/${uuid}`);
        if (res.ok) {
          const json: FullInvitation = await res.json();
          setData(json);
          // Only show guests who confirmed attendance
          const confirmed = (json.group.guests || []).filter((g) => g.attendance === true);
          setGuests(confirmed.length > 0 ? confirmed : json.group.guests || []);
        }
      } catch (err) {
        console.error('Error loading arrival data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [coupleSlug, uuid]);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckingPassword(true);
    setAuthError('');

    try {
      const res = await fetch(`/api/${coupleSlug}/arrival/check-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        setAuthError('Contraseña incorrecta');
      }
    } catch (err) {
      setAuthError('Error de conexión');
    } finally {
      setCheckingPassword(false);
    }
  };

  const handleArrivalToggle = async (guest: Guest, newArrived: boolean) => {
    setUpdatingGuest(guest.name);
    try {
      const res = await fetch(`/api/${coupleSlug}/arrival/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid,
          nombre: guest.name,
          tipo: guest.type,
          llegada: newArrived,
        }),
      });

      if (res.ok) {
        setGuests((prev) =>
          prev.map((g) => (g.name === guest.name ? { ...g, arrived: newArrived } : g))
        );
      }
    } catch (err) {
      console.error('Error updating arrival:', err);
    } finally {
      setUpdatingGuest(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {!isAuthenticated ? (
        // Password Gate
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
          <div className="w-14 h-14 bg-[#E8F0E7] text-[#3F5241] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>

          <h2 className="font-cormorant text-2xl font-bold text-gray-800 mb-1">
            Control de Acceso
          </h2>
          <p className="text-xs text-gray-500 mb-6">
            Ingresa la clave de acceso de recepción o guardia para registrar la llegada.
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de acceso"
                className="w-full p-3.5 rounded-2xl border border-gray-200 text-center font-mono text-base focus:outline-none focus:ring-2 focus:ring-[#6E836F] bg-[#FBF9F5]"
                required
              />
              {authError && (
                <p className="text-xs text-rose-500 mt-2 font-medium">{authError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={checkingPassword}
              className="w-full py-3.5 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#6E836F] transition shadow-md disabled:opacity-50"
            >
              {checkingPassword ? 'Verificando...' : 'ACCEDER'}
            </button>
          </form>
        </div>
      ) : (
        // Check-in List
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#6E836F] block">
                RECEPCIÓN / REGISTRO
              </span>
              <h2 className="font-cormorant text-2xl font-bold text-[#3F5241]">
                {data?.group?.group_name || 'Invitado'}
              </h2>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#E8F0E7] flex items-center justify-center text-[#3F5241]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          <p className="text-xs text-gray-500 mb-4">
            Toca el estado de cada persona para confirmar o cancelar su llegada al evento:
          </p>

          <div className="space-y-3 mb-6">
            {guests.map((guest) => {
              const isArrived = guest.arrived === true;
              const isUpdating = updatingGuest === guest.name;

              return (
                <div
                  key={guest.name}
                  className="p-4 rounded-2xl border border-gray-100 bg-[#FBF9F5] flex items-center justify-between gap-3 shadow-sm"
                >
                  <div>
                    <span className="font-cormorant font-bold text-lg text-gray-800 block">
                      {guest.name}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-gray-400">
                      {guest.type === 'principal' ? 'Titular' : guest.type === 'familiar' ? 'Familia' : 'Acompañante'}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleArrivalToggle(guest, true)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                        isArrived
                          ? 'bg-emerald-600 text-white shadow'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-emerald-500'
                      }`}
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Llegó
                    </button>

                    <button
                      onClick={() => handleArrivalToggle(guest, false)}
                      disabled={isUpdating}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center gap-1 ${
                        guest.arrived === false
                          ? 'bg-rose-600 text-white shadow'
                          : 'bg-white text-gray-500 border border-gray-200 hover:border-rose-400'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      No
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-xs">
            <Link
              href={`/${coupleSlug}/checkout_list`}
              className="text-[#6E836F] font-semibold hover:underline"
            >
              ← Ver lista completa de accesos
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
