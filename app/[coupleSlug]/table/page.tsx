'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { Search, Filter, Users, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';

export default function TableDashboardPage({
  params,
}: {
  params: Promise<{ coupleSlug: string }>;
}) {
  const { coupleSlug } = use(params);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    confirmados: 0,
    rechazados: 0,
    pendientes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'confirmed' | 'declined' | 'pending'>('all');

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch(`/api/${coupleSlug}/table`);
        if (res.ok) {
          const json = await res.json();
          setData(json.list || []);
          setStats(json.stats || { total: 0, confirmados: 0, rechazados: 0, pendientes: 0 });
        }
      } catch (err) {
        console.error('Error loading table data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [coupleSlug]);

  const filteredGroups = data.filter((item) => {
    // Search matching
    const searchLower = search.toLowerCase();
    const groupName = (item.group_name || item.group || item.invitado || '').toLowerCase();
    const hasMatchingGuest = (item.guests || item.familia || item.acompanantes || []).some((g: any) =>
      (g.name || g.invitado || '').toLowerCase().includes(searchLower)
    );
    const matchesSearch = groupName.includes(searchLower) || hasMatchingGuest;

    if (!matchesSearch) return false;

    // Filter matching
    if (filterStatus === 'all') return true;

    const allGuests = item.guests || [];
    if (filterStatus === 'confirmed') {
      return allGuests.some((g: any) => g.attendance === true || g.asistencia === true);
    }
    if (filterStatus === 'declined') {
      return allGuests.some((g: any) => g.attendance === false || g.asistencia === false);
    }
    if (filterStatus === 'pending') {
      return allGuests.some((g: any) => g.attendance === null || g.asistencia === null);
    }

    return true;
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
      {/* Sticky Header with Stats and Filters */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-xl mx-auto p-4">
          <h1 className="font-cormorant text-2xl font-bold text-[#3F5241] text-center mb-3">
            Control de Confirmaciones
          </h1>

          {/* Stats Badges */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="bg-stone-100 p-2.5 rounded-2xl text-center">
              <span className="block text-[10px] uppercase text-stone-500 font-bold tracking-tight">Total</span>
              <span className="font-cormorant font-bold text-xl text-stone-800">{stats.total}</span>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl text-center">
              <span className="block text-[10px] uppercase text-emerald-600 font-bold tracking-tight">Sí</span>
              <span className="font-cormorant font-bold text-xl text-emerald-700">{stats.confirmados}</span>
            </div>
            <div className="bg-rose-50 border border-rose-100 p-2.5 rounded-2xl text-center">
              <span className="block text-[10px] uppercase text-rose-600 font-bold tracking-tight">No</span>
              <span className="font-cormorant font-bold text-xl text-rose-700">{stats.rechazados}</span>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-2.5 rounded-2xl text-center">
              <span className="block text-[10px] uppercase text-amber-600 font-bold tracking-tight">Pend.</span>
              <span className="font-cormorant font-bold text-xl text-amber-700">{stats.pendientes}</span>
            </div>
          </div>

          {/* Search bar & filter pill buttons */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por familia o invitado..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E836F]"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  filterStatus === 'all' ? 'bg-[#3F5241] text-white' : 'bg-gray-100 text-gray-600'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setFilterStatus('confirmed')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  filterStatus === 'confirmed' ? 'bg-emerald-600 text-white' : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                Confirmados
              </button>
              <button
                onClick={() => setFilterStatus('declined')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  filterStatus === 'declined' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-700'
                }`}
              >
                Rechazados
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-3 py-1.5 rounded-full font-semibold transition ${
                  filterStatus === 'pending' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-700'
                }`}
              >
                Pendientes
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guest Groups List */}
      <main className="max-w-xl mx-auto p-4 space-y-4 pb-16">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            No se encontraron invitados con los criterios de búsqueda.
          </div>
        ) : (
          filteredGroups.map((item, idx) => {
            const groupName = item.group_name || item.group || item.invitado || 'Invitado';
            const message = item.message || item.mensaje;
            const rawGuests = item.guests || item.familia || item.acompanantes || [];

            return (
              <div
                key={item.uuid || idx}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-cormorant font-bold text-xl text-gray-800">
                      {groupName}
                    </h3>
                    <p className="text-[10px] font-mono text-gray-400 tracking-wider">
                      UUID: {item.uuid}
                    </p>
                  </div>

                  <Link
                    href={`/${coupleSlug}/${item.uuid}`}
                    target="_blank"
                    className="p-2 rounded-full text-gray-400 hover:text-[#3F5241] hover:bg-gray-50 transition"
                    title="Ver invitación"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>

                {/* Individual Members */}
                <div className="space-y-2 mt-3 pt-3 border-t border-gray-50">
                  {rawGuests.map((g: any, gIdx: number) => {
                    const name = g.name || g.invitado;
                    const status = g.attendance !== undefined ? g.attendance : g.asistencia;

                    return (
                      <div
                        key={gIdx}
                        className="flex items-center justify-between text-xs py-1 px-2.5 rounded-lg bg-[#FBF9F5]"
                      >
                        <span className="font-medium text-gray-700">{name}</span>

                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            status === true
                              ? 'bg-emerald-100 text-emerald-800'
                              : status === false
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {status === true ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Asiste
                            </>
                          ) : status === false ? (
                            <>
                              <XCircle className="w-3 h-3" /> No asiste
                            </>
                          ) : (
                            <>
                              <Clock className="w-3 h-3" /> Pendiente
                            </>
                          )}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Message if present */}
                {message && (
                  <div className="mt-3 pt-3 border-t border-dashed border-gray-100 text-xs italic text-[#586959] bg-[#E8F0E7]/40 p-3 rounded-xl">
                    "{message}"
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
