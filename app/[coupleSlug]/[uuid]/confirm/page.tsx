'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Check, X, Heart, MessageSquare, ArrowLeft, Ticket } from 'lucide-react';
import type { FullInvitation, Guest } from '@/lib/types';

export default function RsvpPage({
  params,
}: {
  params: Promise<{ coupleSlug: string; uuid: string }>;
}) {
  const { coupleSlug, uuid } = use(params);
  const [data, setData] = useState<FullInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form State
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean | null>>({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Load Data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/${coupleSlug}/invitation/${uuid}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const json: FullInvitation = await res.json();
        setData(json);
        setMessage(json.group.message || '');

        const initialMap: Record<string, boolean | null> = {};
        json.group.guests?.forEach((g) => {
          initialMap[g.name] = g.attendance;
        });
        setAttendanceMap(initialMap);
      } catch (err) {
        console.error('Error loading invitation for RSVP:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [coupleSlug, uuid]);

  const handleAttendanceChange = (guestName: string, value: boolean) => {
    setAttendanceMap((prev) => ({
      ...prev,
      [guestName]: value,
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data?.group?.guests) return;
    setSaving(true);

    try {
      // Save each guest's response
      for (const guest of data.group.guests) {
        const attendance = attendanceMap[guest.name] ?? null;
        await fetch(`/api/${coupleSlug}/confirm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uuid,
            nombre: guest.name,
            tipo: guest.type,
            asistencia: attendance,
            mensaje: message,
          }),
        });
      }

      setSavedSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6E836F', '#9FB99E', '#BCA074', '#FFFFFF'],
      });
    } catch (err) {
      console.error('Error saving confirmation:', err);
      alert('Hubo un problema al guardar la confirmación. Por favor intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 border border-gray-100 text-center">
          <div className="text-4xl mb-4">💌</div>
          <h2 className="font-serif text-2xl text-gray-700 font-bold mb-2">
            Invitación no encontrada
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Por favor verifica el enlace personalizado.
          </p>
        </div>
      </div>
    );
  }

  const { couple, group } = data;
  const guests = group.guests || [];

  return (
    <div className="min-h-screen bg-[#FBF9F5] flex justify-center py-6 px-4">
      <main className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 flex flex-col justify-between">
        <div>
          {/* Back button */}
          <Link
            href={`/${coupleSlug}/${uuid}`}
            className="inline-flex items-center text-xs text-[#6E836F] font-semibold tracking-wider uppercase mb-6 hover:text-[#3F5241] transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Volver a la invitación
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-full bg-[#E8F0E7] flex items-center justify-center mx-auto mb-3 text-[#3F5241]">
              <Heart className="w-6 h-6 fill-[#3F5241]" />
            </div>
            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              CONFIRMACIÓN DE ASISTENCIA
            </p>
            <h1 className="font-cormorant text-3xl font-bold text-[#3F5241]">
              {group.group_name}
            </h1>
            <p className="text-xs text-gray-500 mt-2">
              Indica la asistencia de cada persona para nuestra boda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="space-y-6">
            {/* Guests List */}
            <div className="space-y-3">
              {guests.map((g) => {
                const currentStatus = attendanceMap[g.name];

                return (
                  <div
                    key={g.name}
                    className="p-4 rounded-2xl border border-gray-100 bg-[#FBF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm"
                  >
                    <div>
                      <span className="font-cormorant font-bold text-lg text-[#3F5241] block">
                        {g.name}
                      </span>
                      <span className="text-[10px] uppercase font-semibold tracking-wider text-gray-400">
                        {g.type === 'principal' ? 'Titular' : g.type === 'familiar' ? 'Familia' : 'Acompañante'}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(g.name, true)}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          currentStatus === true
                            ? 'bg-[#3F5241] text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-[#6E836F]'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        Asistirá
                      </button>

                      <button
                        type="button"
                        onClick={() => handleAttendanceChange(g.name, false)}
                        className={`flex-1 sm:flex-initial px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                          currentStatus === false
                            ? 'bg-rose-600 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-rose-300'
                        }`}
                      >
                        <X className="w-3.5 h-3.5" />
                        No asistirá
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Message to Couple */}
            <div className="pt-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3F5241] mb-2 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-[#BCA074]" />
                Dedicatoria o Mensaje para los Novios
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe tus buenos deseos y felicitaciones aquí..."
                rows={3}
                className="w-full p-3.5 rounded-2xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#6E836F] focus:border-transparent bg-[#FBF9F5]"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-4 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#6E836F] transition shadow-lg disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'GUARDAR RESPUESTA'}
            </button>
          </form>

          {/* Success Card */}
          {savedSuccess && (
            <div className="mt-6 p-4 rounded-2xl bg-[#E8F0E7] border border-[#9FB99E]/40 text-center animate-fade-in">
              <p className="font-cormorant font-bold text-lg text-[#3F5241] mb-1">
                ¡Muchas gracias por confirmar!
              </p>
              <p className="text-xs text-[#586959] mb-4">
                Tu respuesta ha sido guardada exitosamente.
              </p>
              <Link
                href={`/${coupleSlug}/view_pass/${uuid}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#3F5241] bg-white px-5 py-2.5 rounded-full shadow-sm hover:shadow transition"
              >
                <Ticket className="w-4 h-4 text-[#BCA074]" />
                Ver mi Pase Virtual
              </Link>
            </div>
          )}
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 pt-4 border-t border-gray-100">
          <p className="text-[11px] text-gray-400">
            Puedes actualizar tu decisión en cualquier momento antes de la fecha límite.
          </p>
        </div>
      </main>
    </div>
  );
}
