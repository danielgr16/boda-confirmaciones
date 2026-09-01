'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { 
  Play, 
  Pause, 
  Copy, 
  Check, 
  MapPin, 
  Gift, 
  Sparkles, 
  Church, 
  Wine, 
  Utensils, 
  Disc3, 
  Heart,
  Volume2,
  Ticket
} from 'lucide-react';
import type { FullInvitation } from '@/lib/types';

export default function InvitationPage({
  params,
}: {
  params: Promise<{ coupleSlug: string; uuid: string }>;
}) {
  const { coupleSlug, uuid } = use(params);
  const [data, setData] = useState<FullInvitation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Countdown State
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Clipboard Toast State
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

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
        console.error('Error loading invitation:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [coupleSlug, uuid]);

  // Setup Audio
  useEffect(() => {
    if (data?.couple?.config?.musicUrl) {
      const audioElement = new Audio(data.couple.config.musicUrl);
      audioElement.loop = true;
      setAudio(audioElement);

      return () => {
        audioElement.pause();
      };
    }
  }, [data]);

  const toggleMusic = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  };

  // Setup Countdown
  useEffect(() => {
    if (!data?.couple?.event_date) return;

    const target = new Date(data.couple.event_date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = target - now;

      if (distance <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [data]);

  const handleCopy = (accountNum: string) => {
    navigator.clipboard.writeText(accountNum.replace(/\s+/g, ''));
    setCopiedAccount(accountNum);
    setTimeout(() => setCopiedAccount(null), 2500);
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
            Por favor verifica el enlace personalizado con los novios.
          </p>
        </div>
      </div>
    );
  }

  const { couple, group } = data;
  const config = couple.config || {};

  // Count reserved seats
  const reservedSeats = group.guests && group.guests.length > 0 ? group.guests.length : 1;

  // Format Date display
  const eventDateObj = new Date(couple.event_date);
  const dayName = eventDateObj.toLocaleDateString('es-MX', { weekday: 'long' });
  const dayNumber = eventDateObj.getDate();
  const monthName = eventDateObj.toLocaleDateString('es-MX', { month: 'long' });
  const yearNumber = eventDateObj.getFullYear();

  return (
    <div className="min-h-screen flex justify-center py-0 sm:py-8 bg-[#ECE7E1]">
      <main className="w-full max-w-md bg-[#FBF9F5] min-h-screen shadow-2xl overflow-hidden relative linen-texture pb-16">
        
        {/* Botanical Top Corners */}
        <div className="absolute top-0 left-0 w-36 pointer-events-none opacity-85 z-10">
          <img src="/img/top-left.webp" alt="Hojas" className="w-full h-auto object-contain" />
        </div>
        <div className="absolute top-0 right-0 w-36 pointer-events-none opacity-85 z-10">
          <img src="/img/top-right.webp" alt="Hojas" className="w-full h-auto object-contain" />
        </div>

        {/* SECTION 1: HEADER & VERSE */}
        <header className="pt-14 px-6 text-center relative z-20">
          {couple.bible_verse && (
            <div className="max-w-xs mx-auto mb-8 px-3">
              <p className="font-cormorant italic text-sm sm:text-base text-[#3F5241] leading-relaxed">
                {couple.bible_verse}
              </p>
              {couple.bible_citation && (
                <span className="block font-cormorant font-semibold tracking-widest text-xs uppercase text-[#BCA074] mt-2">
                  — {couple.bible_citation} —
                </span>
              )}
            </div>
          )}

          {/* Monogram */}
          <div className="flex items-center justify-center gap-4 my-6">
            <span className="font-cormorant text-5xl sm:text-6xl text-[#3F5241] font-light tracking-tight">
              {couple.bride_name.charAt(0)}
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#3F5241]/50 to-transparent"></div>
            <span className="font-cormorant text-5xl sm:text-6xl text-[#3F5241] font-light tracking-tight">
              {couple.groom_name.charAt(0)}
            </span>
          </div>

          <p className="text-[10px] tracking-[0.35em] uppercase font-semibold text-[#586959]">
            NUESTRA BODA
          </p>

          <div className="flex justify-center items-center my-3 opacity-60">
            <Heart className="w-4 h-4 text-[#6E836F] fill-[#6E836F]" />
          </div>
        </header>

        {/* SECTION 2: COVER PHOTO */}
        <section className="relative px-5 my-6">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
            <img
              src={config.photos?.cover || '/img/cover.webp'}
              alt={`${couple.bride_name} & ${couple.groom_name}`}
              className="w-full h-[360px] sm:h-[400px] object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10"></div>
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <p className="font-cormorant italic text-white/90 text-sm tracking-widest drop-shadow-md">
                {dayNumber} . {monthName} . {yearNumber}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 3: INVITATION TEXT & PARENTS */}
        <section className="px-6 text-center my-8">
          <p className="font-cormorant uppercase tracking-[0.18em] text-xs text-[#586959] max-w-xs mx-auto leading-relaxed">
            Con la bendición de Dios y el amor de nuestros padres, los invitamos a celebrar nuestra unión matrimonial
          </p>

          <div className="watercolor-divider max-w-xs mx-auto my-6">
            <span className="px-3 text-[#BCA074] text-xs">❦</span>
          </div>

          {/* Parents Grid */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center my-6">
            <div className="p-3 bg-white/70 rounded-xl border border-[#E8F0E7] shadow-sm">
              <h3 className="text-[9px] uppercase tracking-widest font-bold text-[#6E836F] mb-2">
                Padres de la Novia
              </h3>
              <p className="font-cormorant font-medium text-sm text-[#3F5241] leading-snug">
                {config.parents?.brideFather || 'Padre de la Novia'}
              </p>
              <p className="font-cormorant font-medium text-sm text-[#3F5241] leading-snug">
                {config.parents?.brideMother || 'Madre de la Novia'}
              </p>
            </div>

            <div className="p-3 bg-white/70 rounded-xl border border-[#E8F0E7] shadow-sm">
              <h3 className="text-[9px] uppercase tracking-widest font-bold text-[#6E836F] mb-2">
                Padres del Novio
              </h3>
              <p className="font-cormorant font-medium text-sm text-[#3F5241] leading-snug">
                {config.parents?.groomFather || 'Padre del Novio'}
              </p>
              <p className="font-cormorant font-medium text-sm text-[#3F5241] leading-snug">
                {config.parents?.groomMother || 'Madre del Novio'}
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 4: COUPLE NAMES */}
        <section className="text-center px-4 my-8 relative">
          <div className="py-2">
            <h1 className="font-script text-6xl sm:text-7xl text-[#3F5241] tracking-wide leading-tight">
              {couple.bride_name.split(' ')[0]}
            </h1>
            <div className="font-cormorant italic text-2xl text-[#BCA074] my-1 font-light">&</div>
            <h1 className="font-script text-6xl sm:text-7xl text-[#3F5241] tracking-wide leading-tight">
              {couple.groom_name.split(' ')[0]}
            </h1>
          </div>

          <p className="text-[10px] tracking-[0.25em] uppercase font-medium text-[#7E8E7F] mt-5">
            TENEMOS EL HONOR DE INVITARLE A NUESTRA BODA
          </p>
        </section>

        {/* SECTION 5: DATE & COUNTDOWN */}
        <section className="px-6 my-10">
          <div className="card-elegant p-6 text-center max-w-sm mx-auto bg-gradient-to-b from-white to-[#F9F7F2]">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#6E836F] mb-3">
              {monthName}
            </p>

            <div className="flex items-center justify-center gap-6 my-2">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#586959]">
                {dayName}
              </span>
              <span className="font-cormorant font-bold text-5xl sm:text-6xl text-[#3F5241] leading-none">
                {dayNumber}
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#586959]">
                {yearNumber}
              </span>
            </div>

            <p className="text-xs font-cormorant italic text-[#6E836F] mt-2">
              {eventDateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} • {couple.ceremony_address?.split(',')[1] || 'Culiacán Rosales, Sinaloa'}
            </p>

            <div className="watercolor-divider my-5">
              <span className="px-3 text-[#BCA074] text-xs">❖</span>
            </div>

            {/* Countdown Clock */}
            <p className="text-[10px] tracking-widest uppercase font-bold text-[#7E8E7F] mb-3">
              TIEMPO RESTANTE PARA EL GRAN DÍA
            </p>

            <div className="grid grid-cols-4 gap-2 text-center pt-1">
              <div className="bg-[#E8F0E7]/80 p-2.5 rounded-xl border border-[#9FB99E]/30">
                <span className="font-cormorant font-bold text-2xl text-[#3F5241] block">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#586959] font-medium">
                  Días
                </span>
              </div>
              <div className="bg-[#E8F0E7]/80 p-2.5 rounded-xl border border-[#9FB99E]/30">
                <span className="font-cormorant font-bold text-2xl text-[#3F5241] block">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#586959] font-medium">
                  Horas
                </span>
              </div>
              <div className="bg-[#E8F0E7]/80 p-2.5 rounded-xl border border-[#9FB99E]/30">
                <span className="font-cormorant font-bold text-2xl text-[#3F5241] block">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#586959] font-medium">
                  Min
                </span>
              </div>
              <div className="bg-[#E8F0E7]/80 p-2.5 rounded-xl border border-[#9FB99E]/30">
                <span className="font-cormorant font-bold text-2xl text-[#3F5241] block">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#586959] font-medium">
                  Seg
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: LOCATIONS */}
        <section className="px-6 my-10 space-y-6">
          {/* Ceremony */}
          <div className="card-elegant p-6 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#E8F0E7] flex items-center justify-center mx-auto mb-3 text-[#3F5241]">
              <Church className="w-6 h-6" />
            </div>

            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] block mb-1">
              2:30 PM
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              Ceremonia Religiosa
            </h3>
            <p className="font-sans text-xs text-[#586959] leading-relaxed mb-4 px-2">
              {couple.ceremony_address}
            </p>

            {couple.ceremony_maps_url && (
              <a
                href={couple.ceremony_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-sage"
              >
                <MapPin className="w-3.5 h-3.5" />
                VER UBICACIÓN
              </a>
            )}
          </div>

          {/* Reception */}
          <div className="card-elegant p-6 text-center max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#E8F0E7] flex items-center justify-center mx-auto mb-3 text-[#3F5241]">
              <Wine className="w-6 h-6" />
            </div>

            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] block mb-1">
              {couple.reception_time || '5:00 PM'}
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              Recepción
            </h3>
            <p className="font-sans text-xs text-[#586959] leading-relaxed mb-4 px-2">
              {couple.reception_address}
            </p>

            {couple.reception_maps_url && (
              <a
                href={couple.reception_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-sage"
              >
                <MapPin className="w-3.5 h-3.5" />
                VER UBICACIÓN
              </a>
            )}
          </div>
        </section>

        {/* SECTION 7: ITINERARY */}
        <section className="my-12 px-5">
          <div className="rounded-3xl p-6 sm:p-8 bg-sage-wash border border-[#9FB99E]/40 shadow-lg relative overflow-hidden">
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#3F5241] mb-1">
                CRONOGRAMA
              </p>
              <h2 className="font-cormorant text-3xl font-bold text-[#3F5241]">
                Itinerario del Evento
              </h2>
            </div>

            <div className="relative pl-12 space-y-6">
              <div className="timeline-line"></div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  ⛪
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">2:30 PM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Ceremonia Religiosa</h4>
                  <p className="text-[11px] text-[#586959]">Unión sagrada ante Dios</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🍸
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">5:00 PM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Recepción & Bienvenida</h4>
                  <p className="text-[11px] text-[#586959]">Llegada al salón y cóctel</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  ✨
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">6:30 PM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Entrada de los Novios</h4>
                  <p className="text-[11px] text-[#586959]">Gran bienvenida a los recién casados</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🍽️
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">7:30 PM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Banquete & Brindis</h4>
                  <p className="text-[11px] text-[#586959]">Cena en honor a la pareja</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🪩
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">8:30 PM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Fiesta & Baile</h4>
                  <p className="text-[11px] text-[#586959]">Celebración en la pista</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border-2 border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  💫
                </div>
                <div className="pl-1">
                  <span className="text-[11px] font-bold tracking-wider text-[#3F5241] block">2:00 AM</span>
                  <h4 className="font-cormorant font-bold text-lg text-[#3F5241] leading-tight">Despedida</h4>
                  <p className="text-[11px] text-[#586959]">Agradecimiento y cierre</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8: RESERVED SEATS & PASS */}
        <section className="px-6 my-10 text-center">
          <div className="card-elegant p-6 max-w-sm mx-auto border-2 border-[#9FB99E]/40 bg-white">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#EFE4D2] flex items-center justify-center text-[#BCA074] mb-3">
              <Ticket className="w-5 h-5" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#7E8E7F] mb-1">
              PASE DIGITAL
            </p>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-1">
              {group.group_name}
            </h3>

            <div className="inline-block bg-[#E8F0E7] px-4 py-1.5 rounded-full my-3 border border-[#9FB99E]/30">
              <span className="text-xs font-semibold text-[#3F5241] tracking-wide">
                {reservedSeats} {reservedSeats === 1 ? 'Lugar Reservado' : 'Lugares Reservados'}
              </span>
            </div>

            <p className="text-xs text-[#586959] mb-5 px-4">
              Para ingresar al evento, presenta tu pase virtual con código QR personalizado.
            </p>

            <Link
              href={`/${coupleSlug}/view_pass/${uuid}`}
              className="btn-primary-sage w-full max-w-xs"
            >
              <Ticket className="w-4 h-4" />
              VER MI PASE VIRTUAL
            </Link>

            {/* Special Links for Guards / Couple */}
            {group.is_guard && (
              <Link
                href={`/${coupleSlug}/checkout_list`}
                className="btn-outline-sage mt-3 block w-full"
              >
                Lista de Acceso (Guardias)
              </Link>
            )}
            {group.is_couple && (
              <Link
                href={`/${coupleSlug}/table`}
                className="btn-outline-sage mt-2 block w-full"
              >
                Panel de Confirmaciones
              </Link>
            )}
          </div>
        </section>

        {/* SECTION 9: DRESS CODE */}
        <section className="px-6 my-10 text-center">
          <div className="card-elegant p-6 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#FAF5ED] border border-[#BCA074]/30 flex items-center justify-center mx-auto mb-3">
              <img src="/img/dresscode.svg" alt="Dress Code" className="w-6 h-6 object-contain opacity-80" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              DRESS CODE
            </p>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              {config.dressCode?.type || 'Formal'}
            </h3>
            <p className="text-xs text-[#586959] leading-relaxed max-w-xs mx-auto">
              {config.dressCode?.description || 'Agradecemos a todos nuestros invitados vestir con atuendo formal.'}
            </p>

            {config.dressCode?.restrictedColors && (
              <div className="mt-4 p-3 bg-[#E8F0E7]/60 rounded-xl border border-[#9FB99E]/30 text-xs text-[#3F5241]">
                <span className="font-semibold block mb-0.5">Nota importante:</span>
                {config.dressCode.restrictedColors}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 10: GIFT REGISTRY & TRANSFERS */}
        <section className="px-6 my-10 text-center">
          <div className="card-elegant p-6 max-w-sm mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#E8F0E7] flex items-center justify-center mx-auto mb-3 text-[#3F5241]">
              <Gift className="w-6 h-6" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              SUGERENCIA DE REGALOS
            </p>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              Mesa de Regalos
            </h3>
            <p className="text-xs text-[#586959] leading-relaxed mb-6">
              Su presencia es nuestro mejor regalo. Si desean hacernos un presente, ponemos a su disposición las siguientes opciones:
            </p>

            {/* Registry Buttons */}
            {config.registryLinks && config.registryLinks.length > 0 && (
              <div className="space-y-3 mb-6">
                {config.registryLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-sage w-full py-3"
                  >
                    🎁 {link.title}
                  </a>
                ))}
              </div>
            )}

            {/* Bank Accounts */}
            {config.bankAccounts && config.bankAccounts.length > 0 && (
              <>
                <div className="watercolor-divider my-5">
                  <span className="px-3 text-[#BCA074] text-xs">O TRANSFERENCIA BANCARIA</span>
                </div>

                <div className="space-y-3 text-left">
                  {config.bankAccounts.map((account, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 bg-[#FBF9F5] rounded-xl border border-[#9FB99E]/30 flex items-center justify-between"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#6E836F] block">
                          {account.bank} • {account.holder}
                        </span>
                        <span className="font-mono text-xs font-bold text-[#3F5241] tracking-wider select-all">
                          {account.accountNumber}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCopy(account.accountNumber)}
                        className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-lg border transition ${
                          copiedAccount === account.accountNumber
                            ? 'bg-[#3F5241] text-white border-[#3F5241]'
                            : 'bg-white border-[#9FB99E] text-[#3F5241] hover:bg-[#3F5241] hover:text-white'
                        }`}
                      >
                        {copiedAccount === account.accountNumber ? '¡Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Envelopes Notice */}
            <div className="mt-6 p-4 bg-[#FAF5ED] rounded-xl border border-[#BCA074]/30">
              <div className="flex items-center justify-center gap-2 mb-1 text-[#BCA074] font-semibold text-xs">
                <span>✉️</span>
                <span>Lluvia de Sobres</span>
              </div>
              <p className="text-[11px] text-[#586959]">
                También contaremos con un buzón para sobres el día del evento.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION 11: ADULTS ONLY */}
        {config.adultsOnly && (
          <section className="px-6 my-10 text-center">
            <div className="card-elegant p-6 max-w-sm mx-auto bg-gradient-to-b from-white to-[#E8F0E7]/30">
              <div className="w-10 h-10 rounded-full bg-[#E8F0E7] flex items-center justify-center mx-auto mb-3 text-[#3F5241] text-lg">
                ✨
              </div>

              <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
                EVENTO EXCLUSIVO
              </p>
              <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
                Solo Adultos
              </h3>
              <p className="text-xs text-[#586959] leading-relaxed px-2">
                {config.adultsOnlyMessage ||
                  'Amamos a sus pequeños, pero para que todos podamos disfrutar plenamente de esta celebración, nuestra boda será un evento exclusivamente para adultos.'}
              </p>
            </div>
          </section>
        )}

        {/* SECTION 12: PHOTO GALLERY */}
        <section className="px-6 my-12 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#6E836F] mb-1">
            NUESTROS MOMENTOS
          </p>
          <h3 className="font-cormorant text-3xl font-bold text-[#3F5241] mb-6">
            Galería de Fotos
          </h3>

          <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {(config.photos?.album || ['/img/album-1.webp', '/img/album-2.webp', '/img/album-3.webp', '/img/album-4.webp']).map(
              (imgSrc, idx) => (
                <div key={idx} className="rounded-xl overflow-hidden shadow-md border-2 border-white">
                  <img
                    src={imgSrc}
                    alt={`Recuerdo ${idx + 1}`}
                    className="w-full h-36 object-cover hover:scale-105 transition duration-300"
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* SECTION 13: RSVP CONFIRMATION */}
        <section className="px-6 my-12 text-center">
          <div className="card-elegant p-7 max-w-sm mx-auto border-2 border-[#6E836F]/40 bg-gradient-to-b from-white to-[#F7F9F6]">
            <div className="w-12 h-12 rounded-full bg-[#3F5241] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <Heart className="w-5 h-5 fill-white" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              CONFIRMACIÓN
            </p>
            <h3 className="font-cormorant text-3xl font-bold text-[#3F5241] mb-2">
              ¿Nos acompañas?
            </h3>

            <p className="text-xs text-[#586959] leading-relaxed mb-6">
              Agradecemos confirmar su asistencia a más tardar el:<br />
              <strong className="font-bold text-[#3F5241] text-sm block mt-1">
                {couple.rsvp_deadline
                  ? new Date(couple.rsvp_deadline).toLocaleDateString('es-MX', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })
                  : '16 de Octubre de 2026'}
              </strong>
            </p>

            <Link
              href={`/${coupleSlug}/${uuid}/confirm`}
              className="btn-primary-sage w-full py-3.5 text-sm"
            >
              CONFIRMAR ASISTENCIA
            </Link>

            {/* Contacts */}
            {config.contacts && (
              <div className="mt-8 pt-6 border-t border-[#9FB99E]/30 text-xs text-[#586959]">
                <span className="text-[10px] uppercase font-bold text-[#6E836F] tracking-widest block mb-2">
                  CONTACTOS PARA DUDAS
                </span>
                <div className="flex justify-center gap-6 mt-1">
                  {config.contacts.groom && (
                    <div>
                      <span className="font-semibold text-[#3F5241] block">
                        {config.contacts.groom.name}
                      </span>
                      <a href={`tel:${config.contacts.groom.phone}`} className="text-[#7E8E7F] hover:text-[#6E836F] transition">
                        {config.contacts.groom.phone}
                      </a>
                    </div>
                  )}
                  {config.contacts.bride && (
                    <>
                      <div className="w-[1px] h-8 bg-[#9FB99E]/50"></div>
                      <div>
                        <span className="font-semibold text-[#3F5241] block">
                          {config.contacts.bride.name}
                        </span>
                        <a href={`tel:${config.contacts.bride.phone}`} className="text-[#7E8E7F] hover:text-[#6E836F] transition">
                          {config.contacts.bride.phone}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 14: FOOTER */}
        <footer className="text-center pt-8 px-6 pb-12 relative">
          <div className="max-w-xs mx-auto mb-6">
            <p className="font-script text-4xl sm:text-5xl text-[#3F5241] mb-2">
              ¡Esperamos verte pronto!
            </p>
            <p className="font-cormorant italic text-sm text-[#586959]">
              {couple.bride_name.split(' ')[0]} & {couple.groom_name.split(' ')[0]}
            </p>
          </div>

          <div className="w-full rounded-2xl overflow-hidden shadow-lg border-2 border-white max-w-sm mx-auto mb-6">
            <img src={config.photos?.end || '/img/end.webp'} alt="Foto Final" className="w-full h-48 object-cover" />
          </div>

          <div className="max-w-xs mx-auto text-center">
            <p className="font-cormorant italic text-xs text-[#7E8E7F]">
              “Las muchas aguas no podrán apagar el amor, ni lo ahogarán los ríos.”
            </p>
            <span className="font-cormorant text-[11px] uppercase tracking-widest text-[#BCA074] font-bold block mt-1">
              — Cantares 8:7 —
            </span>
          </div>
        </footer>

        {/* FLOATING MUSIC BUTTON */}
        {config.musicUrl && (
          <button
            onClick={toggleMusic}
            className={`music-float-btn ${isPlaying ? '' : 'music-pulse'}`}
            aria-label="Reproducir música de fondo"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
          </button>
        )}

        {/* CLIPBOARD COPIED TOAST */}
        <div
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 bg-[#3F5241] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl transition-opacity duration-300 pointer-events-none z-50 ${
            copiedAccount ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ✓ Copiado al portapapeles
        </div>
      </main>
    </div>
  );
}
