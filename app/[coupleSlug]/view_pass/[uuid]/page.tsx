'use client';

import React, { useState, useEffect, useRef, use } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ArrowLeft, Sparkles, Calendar, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import type { FullInvitation } from '@/lib/types';

export default function ViewPassPage({
  params,
}: {
  params: Promise<{ coupleSlug: string; uuid: string }>;
}) {
  const { coupleSlug, uuid } = use(params);
  const [data, setData] = useState<FullInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 3D Card interactive tilt
  const cardRef = useRef<HTMLDivElement>(null);
  const [styleTransform, setStyleTransform] = useState('');
  const [shineOpacity, setShineOpacity] = useState(0);
  const [shineBackground, setShineBackground] = useState('');

  // Fetch Invitation Data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch(`/api/${coupleSlug}/invitation/${uuid}`);
        if (!res.ok) {
          setError(true);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error('Error loading pass data:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [coupleSlug, uuid]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (centerY - y) / 25;
    const rotateY = (x - centerX) / 25;

    setStyleTransform(`perspective(2000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`);
    setShineOpacity(1);
    setShineBackground(`radial-gradient(circle at ${(x / rect.width) * 100}% ${(y / rect.height) * 100}%, rgba(255, 255, 255, 0.4) 0%, rgba(200, 200, 200, 0.15) 50%, transparent 80%)`);
  };

  const handleMouseLeave = () => {
    setStyleTransform('perspective(2000px) rotateX(0deg) rotateY(0deg)');
    setShineOpacity(0);
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
            Pase no encontrado
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Por favor verifica el enlace proporcionado.
          </p>
        </div>
      </div>
    );
  }

  const { couple, group } = data;
  const confirmedGuests = (group.guests || []).filter((g) => g.attendance === true);

  const eventDate = new Date(couple.event_date);
  const formattedDate = eventDate.toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const arrivalUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/${coupleSlug}/arrival/${uuid}` 
    : `https://boda.app/${coupleSlug}/arrival/${uuid}`;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="max-w-sm w-full rounded-3xl shadow-2xl overflow-hidden flex flex-col relative transition-transform duration-150 ease-out bg-white"
        style={{
          transform: styleTransform,
          border: '5px solid transparent',
          background: 'linear-gradient(#fdfcfb, #fdfcfb) padding-box, linear-gradient(45deg, #71706e, #e5e4e2, #ffffff, #d3d3d3, #71706e) border-box',
        }}
      >
        {/* Ticket Cutout Side Circles */}
        <div className="absolute top-[20%] -left-4 w-8 h-8 bg-slate-100 rounded-full z-20 shadow-inner"></div>
        <div className="absolute top-[20%] -right-4 w-8 h-8 bg-slate-100 rounded-full z-20 shadow-inner"></div>

        {/* Ticket Header */}
        <div className="bg-stone-50/80 p-6 text-center border-b-2 border-dashed border-gray-200 relative">
          <span className="font-cormorant text-xs uppercase tracking-[0.3em] font-bold text-stone-500 block">
            PASE DE ACCESO
          </span>
          <h1 className="font-cormorant text-3xl font-bold text-[#3F5241] italic mt-1">
            {couple.bride_name.split(' ')[0]} & {couple.groom_name.split(' ')[0]}
          </h1>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest font-semibold mt-1">
            {group.group_name}
          </p>
        </div>

        {/* Ticket Body */}
        <div className="p-8 flex-grow flex flex-col items-center text-center">
          {/* Confirmed Guests */}
          <div className="mb-6 w-full">
            <p className="text-[10px] text-stone-400 uppercase tracking-widest mb-3 font-bold">
              Invitados Confirmados
            </p>
            <div className="space-y-1.5">
              {confirmedGuests.length > 0 ? (
                confirmedGuests.map((g, idx) => (
                  <div
                    key={idx}
                    className="font-cormorant text-xl font-medium text-stone-700 italic border-b border-stone-100 pb-1 flex items-center justify-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6E836F]" />
                    <span>{g.name}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-rose-400 italic">
                  Sin confirmaciones registradas aún
                </p>
              )}
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 w-full text-xs">
            <div className="text-center border-r border-gray-100">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Fecha</p>
              <p className="text-gray-800 font-semibold">{formattedDate}</p>
              <p className="text-gray-500">{couple.reception_time || '2:30 PM'}</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1 font-bold">Mesa</p>
              <p className="text-gray-800 font-semibold">Asignada</p>
              <p className="text-gray-500">En Entrada</p>
            </div>
          </div>

          {/* Dynamic QR Code */}
          <div className="p-4 bg-white border-2 border-stone-100 rounded-2xl shadow-inner my-2">
            <QRCodeSVG
              value={arrivalUrl}
              size={130}
              level="M"
              className="opacity-90"
            />
          </div>
          <p className="text-[9px] text-gray-400 mt-2 font-mono tracking-wider">{group.uuid}</p>
        </div>

        {/* Footer */}
        <div className="bg-stone-800 p-4 text-center">
          <p className="text-stone-300 text-[9px] uppercase tracking-[0.2em] font-medium leading-relaxed">
            Presentar este pase al llegar al evento.<br />
            <span className="font-bold text-white">Válido exclusivamente para las personas listadas.</span>
          </p>
        </div>

        {/* Dynamic Hologram Shine */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-30"
          style={{
            opacity: shineOpacity,
            background: shineBackground,
            mixBlendMode: 'overlay',
          }}
        ></div>
      </div>

      {/* Back to Invitation */}
      <Link
        href={`/${coupleSlug}/${uuid}`}
        className="mt-8 text-stone-500 text-xs uppercase tracking-widest hover:text-stone-800 transition-colors flex items-center gap-1.5"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Volver a la invitación
      </Link>
    </div>
  );
}
