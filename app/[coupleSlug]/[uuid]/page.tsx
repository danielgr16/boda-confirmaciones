'use client';

import React, { useState, useEffect, use, useRef } from 'react';
import Link from 'next/link';
import { 
  Play, 
  Pause, 
  Copy, 
  Check, 
  MapPin, 
  Gift, 
  Sparkles, 
  Heart,
  Ticket,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2
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

  // Carousel & Modal Lightbox State
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [modalPhoto, setModalPhoto] = useState<string | null>(null);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

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

  // Carousel touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = (photosLength: number) => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 45) {
      // Swiped Left -> Next
      setActivePhotoIndex((prev) => (prev + 1) % photosLength);
    } else if (diff < -45) {
      // Swiped Right -> Prev
      setActivePhotoIndex((prev) => (prev - 1 + photosLength) % photosLength);
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-3 border-[#6E836F] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-4">
        <div className="max-w-sm w-full bg-white rounded-3xl shadow-xl p-8 border border-[#E8F0E7] text-center">
          <div className="text-4xl mb-3">💌</div>
          <h2 className="font-cormorant text-2xl text-[#3F5241] font-bold mb-2">
            Invitación no encontrada
          </h2>
          <p className="text-xs text-gray-500">
            Por favor verifica el enlace personalizado con los novios.
          </p>
        </div>
      </div>
    );
  }

  const { couple, group } = data;
  const config = couple.config || {};
  const albumPhotos = config.photos?.album || ['/img/album-1.webp', '/img/album-2.webp', '/img/album-3.webp', '/img/album-4.webp'];

  // Count reserved seats
  const reservedSeats = group.guests && group.guests.length > 0 ? group.guests.length : 1;

  // Format Date display
  const eventDateObj = new Date(couple.event_date);
  const dayName = eventDateObj.toLocaleDateString('es-MX', { weekday: 'long' });
  const dayNumber = eventDateObj.getDate();
  const monthName = eventDateObj.toLocaleDateString('es-MX', { month: 'long' });
  const yearNumber = eventDateObj.getFullYear();

  return (
    <div className="min-h-screen flex justify-center py-0 sm:py-8 bg-[#E2DDD5] text-[#2C3E2D]">
      <main className="w-full max-w-md bg-[#FAF8F5] min-h-screen shadow-2xl overflow-hidden relative linen-texture pb-20 select-none">
        
        {/* Botanical Eucalyptus Top Draped Branches */}
        <div className="absolute top-0 left-0 w-36 pointer-events-none opacity-80 z-10">
          <img src="/img/top-left.webp" alt="" className="w-full h-auto object-contain" />
        </div>
        <div className="absolute top-0 right-0 w-36 pointer-events-none opacity-80 z-10">
          <img src="/img/top-right.webp" alt="" className="w-full h-auto object-contain" />
        </div>

        {/* 1. TOP VERSE & MONOGRAM */}
        <header className="pt-16 px-6 text-center relative z-20">
          {couple.bible_verse && (
            <div className="max-w-xs mx-auto mb-8 px-2">
              <p className="font-serif italic text-xs tracking-wider text-[#586959] leading-relaxed uppercase">
                {couple.bible_verse}
              </p>
              {couple.bible_citation && (
                <span className="block font-cormorant font-semibold tracking-[0.25em] text-[11px] uppercase text-[#BCA074] mt-2">
                  — {couple.bible_citation} —
                </span>
              )}
            </div>
          )}

          {/* Clean Roman Monogram */}
          <div className="flex items-center justify-center gap-4 my-6">
            <span className="font-cormorant text-5xl sm:text-6xl text-[#3F5241] font-normal tracking-wider">
              {couple.bride_name.charAt(0)}
            </span>
            <div className="w-px h-10 bg-[#6E836F]/40"></div>
            <span className="font-cormorant text-5xl sm:text-6xl text-[#3F5241] font-normal tracking-wider">
              {couple.groom_name.charAt(0)}
            </span>
          </div>

          <p className="text-[10px] tracking-[0.35em] uppercase font-bold text-[#6E836F] mt-2">
            NUESTRA BODA
          </p>

          <div className="flex justify-center items-center my-3 opacity-60">
            <Heart className="w-3.5 h-3.5 text-[#6E836F] fill-[#6E836F]" />
          </div>
        </header>

        {/* 2. COVER PHOTO INTEGRATED WITH TORN PAPER EDGE */}
        <section className="relative w-full my-6 overflow-hidden">
          <div className="relative w-full h-80 sm:h-96">
            <img
              src={config.photos?.cover || '/img/silva-arce/IMG_8472.webp'}
              alt={`${couple.bride_name} & ${couple.groom_name}`}
              className="w-full h-full object-cover object-center"
            />
            {/* Top subtle fade gradient */}
            <div className="absolute top-0 inset-x-0 h-12 bg-gradient-to-b from-[#FAF8F5] to-transparent"></div>
            {/* Bottom torn paper effect */}
            <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-[#FAF8F5] via-[#FAF8F5]/80 to-transparent"></div>
          </div>
        </section>

        {/* 3. INVITATION MESSAGE & PARENTS (CLEAN TYPOGRAPHY, NO HEAVY CARDS) */}
        <section className="px-6 text-center my-8">
          <p className="font-cormorant uppercase tracking-[0.2em] text-xs text-[#586959] max-w-xs mx-auto leading-relaxed">
            Con gran alegría y corazones agradecidos, junto a nuestros padres, los invitamos a celebrar nuestra unión en matrimonio.
          </p>

          <div className="watercolor-divider max-w-xs mx-auto my-6">
            <span className="px-2 text-[#BCA074] text-xs">❦</span>
          </div>

          {/* Parents 2-Column Minimalist Typography */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto text-center my-6">
            <div>
              <h3 className="text-[9px] uppercase tracking-widest font-bold text-[#6E836F] mb-1.5">
                Padres de la Novia
              </h3>
              <p className="font-cormorant font-medium text-xs text-[#3F5241] leading-snug">
                {config.parents?.brideFather || 'Padre de la Novia'}
              </p>
              <p className="font-cormorant font-medium text-xs text-[#3F5241] leading-snug">
                {config.parents?.brideMother || 'Madre de la Novia'}
              </p>
            </div>

            <div>
              <h3 className="text-[9px] uppercase tracking-widest font-bold text-[#6E836F] mb-1.5">
                Padres del Novio
              </h3>
              <p className="font-cormorant font-medium text-xs text-[#3F5241] leading-snug">
                {config.parents?.groomFather || 'Padre del Novio'}
              </p>
              <p className="font-cormorant font-medium text-xs text-[#3F5241] leading-snug">
                {config.parents?.groomMother || 'Madre del Novio'}
              </p>
            </div>
          </div>
        </section>

        {/* 4. COUPLE NAMES (CALLIGRAPHY SCRIPT) */}
        <section className="text-center px-4 my-10 relative">
          <div className="py-2">
            <h1 className="font-script text-6xl sm:text-7xl text-[#3F5241] tracking-wide leading-none">
              {couple.bride_name.split(' ')[0]}
            </h1>
            <div className="font-cormorant italic text-2xl text-[#BCA074] my-2 font-light">&</div>
            <h1 className="font-script text-6xl sm:text-7xl text-[#3F5241] tracking-wide leading-none">
              {couple.groom_name.split(' ')[0]}
            </h1>
          </div>

          <p className="text-[10px] tracking-[0.28em] uppercase font-bold text-[#7E8E7F] mt-6">
            TENEMOS EL HONOR DE INVITARLE A NUESTRA BODA
          </p>
        </section>

        {/* 5. MINIMALIST CALENDAR & LIVE COUNTDOWN */}
        <section className="px-6 my-10 text-center">
          <div className="max-w-xs mx-auto">
            <p className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#6E836F] mb-3">
              {monthName}
            </p>

            <div className="flex items-center justify-center gap-4 py-2 border-y border-[#6E836F]/25">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#586959] w-24 text-right">
                {dayName}
              </span>
              <span className="font-cormorant font-bold text-5xl text-[#3F5241] leading-none px-2">
                {dayNumber}
              </span>
              <span className="text-xs uppercase tracking-widest font-semibold text-[#586959] w-24 text-left">
                {yearNumber}
              </span>
            </div>

            <p className="text-xs font-cormorant italic text-[#6E836F] mt-3">
              {eventDateObj.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })} • Culiacán Rosales, Sinaloa
            </p>

            {/* Countdown timer */}
            <div className="grid grid-cols-4 gap-2 pt-6 text-center">
              <div className="bg-[#E8F0E7]/60 py-2 px-1 rounded-xl border border-[#9FB99E]/25">
                <span className="font-cormorant font-bold text-xl text-[#3F5241] block leading-none">
                  {timeLeft.days}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#586959] font-semibold">
                  Días
                </span>
              </div>
              <div className="bg-[#E8F0E7]/60 py-2 px-1 rounded-xl border border-[#9FB99E]/25">
                <span className="font-cormorant font-bold text-xl text-[#3F5241] block leading-none">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#586959] font-semibold">
                  Horas
                </span>
              </div>
              <div className="bg-[#E8F0E7]/60 py-2 px-1 rounded-xl border border-[#9FB99E]/25">
                <span className="font-cormorant font-bold text-xl text-[#3F5241] block leading-none">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#586959] font-semibold">
                  Min
                </span>
              </div>
              <div className="bg-[#E8F0E7]/60 py-2 px-1 rounded-xl border border-[#9FB99E]/25">
                <span className="font-cormorant font-bold text-xl text-[#3F5241] block leading-none">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[8px] uppercase tracking-wider text-[#586959] font-semibold">
                  Seg
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. CEREMONY & RECEPTION (MINIMALIST CLEAN TYPOGRAPHY) */}
        <section className="px-6 my-12 text-center space-y-8">
          {/* Ceremony */}
          <div className="max-w-xs mx-auto">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] block mb-1">
              2:30 PM
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-1 uppercase tracking-wider">
              Ceremonia Religiosa
            </h3>
            <p className="text-xs text-[#586959] leading-relaxed mb-4 px-2">
              {couple.ceremony_address}
            </p>

            {couple.ceremony_maps_url && (
              <a
                href={couple.ceremony_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-sage"
              >
                <MapPin className="w-3.5 h-3.5" />
                VER UBICACIÓN
              </a>
            )}
          </div>

          <div className="watercolor-divider max-w-xs mx-auto">
            <span className="px-2 text-[#BCA074] text-xs">❦</span>
          </div>

          {/* Reception */}
          <div className="max-w-xs mx-auto">
            <span className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] block mb-1">
              {couple.reception_time || '5:00 PM'}
            </span>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-1 uppercase tracking-wider">
              Recepción
            </h3>
            <p className="text-xs text-[#586959] leading-relaxed mb-4 px-2">
              {couple.reception_address}
            </p>

            {couple.reception_maps_url && (
              <a
                href={couple.reception_maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary-sage"
              >
                <MapPin className="w-3.5 h-3.5" />
                VER UBICACIÓN
              </a>
            )}
          </div>
        </section>

        {/* 7. ITINERARY WITH SOFT WATERCOLOR SAGE WASH */}
        <section className="my-14 relative">
          <div className="bg-sage-wash py-12 px-8 border-y border-[#9FB99E]/30 relative">
            <div className="text-center mb-8">
              <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#3F5241] mb-1">
                ITINERARIO DE ACTIVIDADES
              </p>
              <h2 className="font-cormorant text-3xl font-bold text-[#3F5241]">
                Cronograma
              </h2>
            </div>

            <div className="relative pl-12 space-y-6 max-w-xs mx-auto">
              <div className="timeline-line"></div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  ⛪
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">2:30 PM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Ceremonia Religiosa</h4>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🍸
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">5:00 PM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Recepción & Bienvenida</h4>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  ✨
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">6:30 PM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Entrada de los Novios</h4>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🍽️
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">7:30 PM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Banquete</h4>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  🪩
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">8:30 PM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Fiesta</h4>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="absolute -left-12 w-8 h-8 rounded-full bg-white border border-[#6E836F] flex items-center justify-center text-xs shadow-sm z-10">
                  💫
                </div>
                <div className="pl-2">
                  <span className="text-[11px] font-bold text-[#3F5241] block">2:00 AM</span>
                  <h4 className="font-cormorant font-bold text-base text-[#3F5241] leading-tight">Despedida</h4>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 8. RESERVED SEATS (MINIMALIST LIKE REFERENCE) */}
        <section className="px-6 my-10 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-8 h-8 mx-auto mb-2 text-[#6E836F] flex items-center justify-center">
              <Ticket className="w-6 h-6" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#7E8E7F] mb-1">
              ASIENTOS RESERVADOS PARA TÍ
            </p>

            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              {group.group_name}
            </h3>

            <div className="inline-flex items-center justify-center px-4 py-1 rounded-md border border-[#9FB99E]/50 bg-white mb-4">
              <span className="font-cormorant font-bold text-base text-[#3F5241] mr-1.5">{reservedSeats}</span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-[#586959]">
                {reservedSeats === 1 ? 'Lugar' : 'Lugares'}
              </span>
            </div>

            <div>
              <Link
                href={`/${coupleSlug}/view_pass/${uuid}`}
                className="btn-primary-sage text-xs"
              >
                VER PASE VIRTUAL
              </Link>
            </div>

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

        <div className="watercolor-divider max-w-xs mx-auto my-8">
          <span className="px-2 text-[#BCA074] text-xs">❦</span>
        </div>

        {/* 9. GIFT REGISTRY & TRANSFERS */}
        <section className="px-6 my-10 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-8 h-8 mx-auto mb-2 text-[#6E836F] flex items-center justify-center">
              <Gift className="w-6 h-6" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              SUGERENCIAS DE REGALOS
            </p>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              Mesa de Regalos
            </h3>
            <p className="text-xs text-[#586959] leading-relaxed mb-5">
              Su presencia es nuestro mayor regalo. Si desean tener un detalle con nosotros:
            </p>

            {/* Registry Buttons */}
            {config.registryLinks && config.registryLinks.length > 0 && (
              <div className="space-y-2.5 mb-5">
                {config.registryLinks.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-sage w-full py-2.5"
                  >
                    🎁 {link.title}
                  </a>
                ))}
              </div>
            )}

            {/* Bank Accounts with 1-Click Copy */}
            {config.bankAccounts && config.bankAccounts.length > 0 && (
              <div className="space-y-2 text-left pt-2">
                {config.bankAccounts.map((account, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-[#9FB99E]/30 flex items-center justify-between shadow-xs"
                  >
                    <div>
                      <span className="text-[9px] uppercase font-bold text-[#6E836F] block">
                        {account.bank} • {account.holder}
                      </span>
                      <span className="font-mono text-xs font-bold text-[#3F5241] tracking-wider select-all">
                        {account.accountNumber}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(account.accountNumber)}
                      className={`px-2 py-1 text-[9px] font-semibold uppercase tracking-wider rounded-md border transition ${
                        copiedAccount === account.accountNumber
                          ? 'bg-[#3F5241] text-white border-[#3F5241]'
                          : 'bg-[#FAF8F5] border-[#9FB99E] text-[#3F5241] hover:bg-[#3F5241] hover:text-white'
                      }`}
                    >
                      {copiedAccount === account.accountNumber ? '¡Copiado!' : 'Copiar'}
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Envelope note */}
            <p className="text-[11px] text-[#7E8E7F] mt-4 italic">
              ✉️ También contaremos con buzón para lluvia de sobres en el salón.
            </p>
          </div>
        </section>

        <div className="watercolor-divider max-w-xs mx-auto my-8">
          <span className="px-2 text-[#BCA074] text-xs">❦</span>
        </div>

        {/* 10. RSVP CONFIRMATION SECTION */}
        <section className="px-6 my-10 text-center">
          <div className="max-w-xs mx-auto">
            <div className="w-8 h-8 mx-auto mb-2 text-[#6E836F] flex items-center justify-center">
              <Heart className="w-6 h-6 fill-[#6E836F]" />
            </div>

            <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
              CONFIRMACIÓN
            </p>
            <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
              Confirmación de Asistencia
            </h3>

            <p className="text-xs text-[#586959] leading-relaxed mb-4">
              Agradecemos confirmar antes del:<br />
              <strong className="font-bold text-[#3F5241] text-xs block mt-1">
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
              className="btn-primary-sage py-3 px-6 text-xs shadow-md"
            >
              CONFIRMAR ASISTENCIA
            </Link>

            {/* Contacts */}
            {config.contacts && (
              <div className="mt-6 pt-4 border-t border-[#9FB99E]/25 text-xs text-[#586959]">
                <div className="flex justify-center gap-6">
                  {config.contacts.groom && (
                    <div>
                      <span className="font-semibold text-[#3F5241] block text-[11px]">
                        {config.contacts.groom.name}
                      </span>
                      <a href={`tel:${config.contacts.groom.phone}`} className="text-[10px] text-[#7E8E7F] hover:text-[#6E836F]">
                        {config.contacts.groom.phone}
                      </a>
                    </div>
                  )}
                  {config.contacts.bride && (
                    <div>
                      <span className="font-semibold text-[#3F5241] block text-[11px]">
                        {config.contacts.bride.name}
                      </span>
                      <a href={`tel:${config.contacts.bride.phone}`} className="text-[10px] text-[#7E8E7F] hover:text-[#6E836F]">
                        {config.contacts.bride.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        <div className="watercolor-divider max-w-xs mx-auto my-8">
          <span className="px-2 text-[#BCA074] text-xs">❦</span>
        </div>

        {/* 11. ADULTS ONLY (CLEAN TYPOGRAPHY) */}
        {config.adultsOnly && (
          <section className="px-6 my-10 text-center">
            <div className="max-w-xs mx-auto">
              <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#BCA074] mb-1">
                IMPORTANTE
              </p>
              <h3 className="font-cormorant text-2xl font-bold text-[#3F5241] mb-2">
                Solo Adultos
              </h3>
              <p className="text-xs text-[#586959] leading-relaxed">
                {config.adultsOnlyMessage ||
                  'Esperamos comprendan que nuestro día especial será una celebración exclusivamente para adultos.'}
              </p>
            </div>
          </section>
        )}

        {/* 12. SWIPEABLE PHOTO CAROUSEL WITH FULLSCREEN MODAL */}
        <section className="my-12 px-6 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase font-bold text-[#6E836F] mb-1">
            NUESTROS MOMENTOS
          </p>
          <h3 className="font-cormorant text-3xl font-bold text-[#3F5241] mb-4">
            Galería de Fotos
          </h3>

          <div
            className="relative max-w-xs mx-auto rounded-2xl overflow-hidden shadow-lg border-2 border-white bg-black/5"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={() => handleTouchEnd(albumPhotos.length)}
          >
            <div
              className="cursor-pointer relative group"
              onClick={() => setModalPhoto(albumPhotos[activePhotoIndex])}
            >
              <img
                src={albumPhotos[activePhotoIndex]}
                alt={`Momento ${activePhotoIndex + 1}`}
                className="w-full h-72 object-cover transition-transform duration-300 group-hover:scale-102"
              />
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Maximize2 className="w-8 h-8 drop-shadow-md" />
              </div>
            </div>

            {/* Left/Right Carousel Controls */}
            {albumPhotos.length > 1 && (
              <>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev - 1 + albumPhotos.length) % albumPhotos.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-[#3F5241] flex items-center justify-center shadow-md hover:bg-white transition"
                  aria-label="Foto anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActivePhotoIndex((prev) => (prev + 1) % albumPhotos.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 text-[#3F5241] flex items-center justify-center shadow-md hover:bg-white transition"
                  aria-label="Siguiente foto"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Carousel Dots */}
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
              {albumPhotos.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhotoIndex(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    idx === activePhotoIndex ? 'w-5 bg-white shadow' : 'w-1.5 bg-white/60'
                  }`}
                  aria-label={`Ir a foto ${idx + 1}`}
                />
              ))}
            </div>
          </div>
          <p className="text-[10px] text-[#7E8E7F] mt-2">
            Desliza para ver más • Toca para ampliar
          </p>
        </section>

        {/* 13. CLOSING PHOTO & BLESSING */}
        <footer className="text-center pt-8 px-6 pb-6 relative">
          <p className="text-[10px] tracking-[0.25em] uppercase font-bold text-[#7E8E7F] mb-1">
            ESPERAMOS CELEBRAR CON USTEDES
          </p>
          <p className="font-script text-4xl sm:text-5xl text-[#3F5241] mb-6">
            ¡Te esperamos!
          </p>

          <div className="w-full rounded-2xl overflow-hidden shadow-xl border-2 border-white max-w-xs mx-auto mb-6">
            <img
              src={config.photos?.end || '/img/end.webp'}
              alt="Foto Final"
              className="w-full h-56 object-cover"
            />
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
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
        )}

        {/* CLIPBOARD TOAST */}
        <div
          className={`fixed bottom-20 left-1/2 -translate-x-1/2 bg-[#3F5241] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-xl transition-opacity duration-300 pointer-events-none z-50 ${
            copiedAccount ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ✓ Copiado al portapapeles
        </div>

        {/* FULLSCREEN PHOTO LIGHTBOX MODAL */}
        {modalPhoto && (
          <div
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => setModalPhoto(null)}
          >
            <button
              onClick={() => setModalPhoto(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition"
              aria-label="Cerrar foto"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="relative max-w-2xl max-h-[85vh] w-full flex items-center justify-center">
              <img
                src={modalPhoto}
                alt="Foto ampliada"
                className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
