'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Search, Lock, ShieldCheck, CheckCircle2, XCircle, Clock, UserCheck } from 'lucide-react';

export default function CheckoutListPage({
  params,
}: {
  params: Promise<{ coupleSlug: string }>;
}) {
  const { coupleSlug } = use(params);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    llegaron: 0,
    no_llegaron: 0,
    pendientes: 0,
  });
  const [loading, setLoading] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [checkingPassword, setCheckingPassword] = useState(false);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [updatingGuest, setUpdatingGuest] = useState<string | null>(null);

  // Load Data
  const loadData = async () => {
    try {
      const res = await fetch(`/api/${coupleSlug}/checkout-list`);
      if (res.ok) {
        const json = await res.json();
        setData(json.list || []);
        setStats(json.stats || { total: 0, llegaron: 0, no_llegaron: 0, pendientes: 0 });
      }
    } catch (err) {
      console.error('Error loading checkout list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [coupleSlug]);

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

  const handleArrivalToggle = async (uuid: string, guest: any, newArrived: boolean) => {
    const guestName = guest.name || guest.invitado;
    setUpdatingGuest(guestName);

    try {
      const res = await fetch(`/api/${coupleSlug}/arrival/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uuid,
          nombre: guestName,
          tipo: guest.type || (guest.familia ? 'familiar' : 'principal'),
          llegada: newArrived,
        }),
      });

      if (res.ok) {
        await loadData();
      }
    } catch (err) {
      console.error('Error updating arrival:', err);
    } finally {
      setUpdatingGuest(null);
    }
  };

  const filteredGroups = data.filter((item) => {
    const searchLower = search.toLowerCase();
    const groupName = (item.group_name || item.group || item.invitado || '').toLowerCase();
    const hasMatchingGuest = (item.guests || item.familia || item.acompanantes || []).some((g: any) =>
      (g.name || g.invitado || '').toLowerCase().includes(searchLower)
    );
    return groupName.includes(searchLower) || hasMatchingGuest;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {!isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 text-center">
            <div className="w-14 h-14 bg-[#E8F0E7] text-[#3F5241] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h2 className="font-cormorant text-2xl font-bold text-gray-800 mb-1">
              Lista de Acceso
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Ingresa la contraseña de guardias / recepción para ver la lista de llegadas.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
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
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
            <div className="max-w-xl mx-auto p-4">
              <div className="flex items-center justify-between mb-3">
                <h1 className="font-cormorant text-2xl font-bold text-[#3F5241]">
                  Control de Llegadas en Vivo
                </h1>
                <span className="text-[10px] uppercase font-bold bg-[#E8F0E7] text-[#3F5241] px-2.5 py-1 rounded-full">
                  Recepción Activa
                </span>
              </div>

              {/* Arrival Stats */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-stone-100 p-2.5 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase text-stone-500 font-bold tracking-tight">Total</span>
                  <span className="font-cormorant font-bold text-xl text-stone-800">{stats.total}</span>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase text-emerald-600 font-bold tracking-tight">Llegaron</span>
                  <span className="font-cormorant font-bold text-xl text-emerald-700">{stats.llegaron}</span>
                </div>
                <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-2xl text-center">
                  <span className="block text-[10px] uppercase text-amber-600 font-bold tracking-tight">Faltan</span>
                  <span className="font-cormorant font-bold text-xl text-amber-700">{stats.total - stats.llegaron}</span>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar asistente en puerta..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E836F]"
                />
              </div>
            </div>
          </div>

          {/* List */}
          <main className="max-w-xl mx-auto p-4 space-y-4 pb-16">
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                No se encontraron invitados.
              </div>
            ) : (
              filteredGroups.map((item, idx) => {
                const groupName = item.group_name || item.group || item.invitado || 'Invitado';
                const rawGuests = item.guests || item.familia || item.acompanantes || [];

                return (
                  <div
                    key={item.uuid || idx}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-cormorant font-bold text-xl text-gray-800">
                        {groupName}
                      </h3>
                      <Link
                        href={`/${coupleSlug}/arrival/${item.uuid}`}
                        className="text-xs text-[#6E836F] font-semibold hover:underline"
                      >
                        Abrir QR/Check-in
                      </Link>
                    </div>

                    <div className="space-y-2 mt-2 pt-2 border-t border-gray-50">
                      {rawGuests.map((g: any, gIdx: number) => {
                        const name = g.name || g.invitado;
                        const isArrived = (g.arrived !== undefined ? g.arrived : g.llegada) === true;
                        const isUpdating = updatingGuest === name;

                        return (
                          <div
                            key={gIdx}
                            className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-[#FBF9F5]"
                          >
                            <span className="font-medium text-gray-800">{name}</span>

                            <div className="flex gap-1.5">
                              <button
                                onClick={() => handleArrivalToggle(item.uuid, g, true)}
                                disabled={isUpdating}
                                className={`px-2.5 py-1 rounded-full font-bold transition flex items-center gap-1 ${
                                  isArrived
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'bg-white text-gray-400 border border-gray-200 hover:border-emerald-500'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" />
                                {isArrived ? 'En el evento' : 'Check-in'}
                              </button>

                              {isArrived && (
                                <button
                                  onClick={() => handleArrivalToggle(item.uuid, g, false)}
                                  disabled={isUpdating}
                                  className="px-2 py-1 rounded-full bg-gray-100 text-gray-500 text-[10px] hover:bg-rose-50 hover:text-rose-600 transition"
                                  title="Desmarcar llegada"
                                >
                                  Deshacer
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </main>
        </>
      )}
    </div>
  );
}
