'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  MessageSquareHeart,
  Share2,
  Copy,
  Check,
  ExternalLink,
  QrCode,
  ListFilter,
  DoorOpen,
  Calendar,
  LogOut,
  Lock,
  Search,
  Sparkles,
  Heart,
  Send,
  ShieldCheck,
  ChevronRight,
  Eye,
  UserPlus,
} from 'lucide-react';

export default function AdminDashboardPage({
  params,
}: {
  params: Promise<{ coupleSlug: string }>;
}) {
  const { coupleSlug } = use(params);
  const router = useRouter();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [coupleInfo, setCoupleInfo] = useState<any>(null);

  // Data State
  const [tableData, setTableData] = useState<any[]>([]);
  const [rsvpStats, setRsvpStats] = useState({
    total: 0,
    confirmados: 0,
    rechazados: 0,
    pendientes: 0,
  });
  const [checkoutStats, setCheckoutStats] = useState({
    total: 0,
    llegaron: 0,
    no_llegaron: 0,
    pendientes: 0,
  });
  const [loadingData, setLoadingData] = useState(true);

  // Guest search for WhatsApp sharing tool
  const [guestSearch, setGuestSearch] = useState('');
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'links' | 'messages'>('overview');

  // Check authentication session on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch(`/api/${coupleSlug}/auth/me`);
        if (res.ok) {
          const json = await res.json();
          if (json.authenticated) {
            setIsAuthenticated(true);
            setCurrentUser(json.user);
            setCoupleInfo(json.couple);
            return;
          }
        }
        router.replace('/login');
      } catch {
        router.replace('/login');
      }
    }
    checkAuth();
  }, [coupleSlug, router]);

  // Load Dashboard Data
  const loadDashboardData = async () => {
    setLoadingData(true);
    try {
      // 1. Table & RSVP data
      const tableRes = await fetch(`/api/${coupleSlug}/table`);
      if (tableRes.ok) {
        const json = await tableRes.json();
        setTableData(json.list || []);
        if (json.stats) setRsvpStats(json.stats);
      }

      // 2. Checkout data
      const checkoutRes = await fetch(`/api/${coupleSlug}/checkout-list`);
      if (checkoutRes.ok) {
        const json = await checkoutRes.json();
        if (json.stats) setCheckoutStats(json.stats);
      }
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated, coupleSlug]);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      await fetch(`/api/${coupleSlug}/auth/logout`, { method: 'POST' });
    } catch (err) {
      console.error('Error logging out:', err);
    } finally {
      router.replace('/login');
    }
  };

  // Copy invitation link helper
  const handleCopyLink = (uuid: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/${coupleSlug}/${uuid}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUuid(uuid);
    setTimeout(() => setCopiedUuid(null), 2500);
  };

  // WhatsApp share helper
  const handleShareWhatsApp = (item: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/${coupleSlug}/${item.uuid}`;
    const groupName = item.group_name || item.group || item.invitado || 'Familia';

    const bride = coupleInfo?.bride_name?.split(' ')[0] || 'la novia';
    const groom = coupleInfo?.groom_name?.split(' ')[0] || 'el novio';

    const message = `¡Hola ${groupName}! 👋 Con mucha alegría los invitamos a celebrar nuestra boda (${bride} & ${groom}) 💍✨\n\nPueden ver todos los detalles de la ceremonia, recepción y confirmar su asistencia en este enlace personalizado:\n${fullUrl}\n\n¡Esperamos contar con su presencia!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  // Filter messages from guests
  const messagesList = tableData.filter((item) => {
    const msg = item.message || item.mensaje;
    return msg && msg.trim() !== '';
  });

  // Filter guests for link generator
  const filteredGuests = tableData.filter((item) => {
    const searchLower = guestSearch.toLowerCase();
    const groupName = (item.group_name || item.group || item.invitado || '').toLowerCase();
    const hasMatchingGuest = (item.guests || item.familia || item.acompanantes || []).some((g: any) =>
      (g.name || g.invitado || '').toLowerCase().includes(searchLower)
    );
    return groupName.includes(searchLower) || hasMatchingGuest;
  });

  // Days left calculation
  const eventDateStr = coupleInfo?.event_date;
  let daysRemaining: number | null = null;
  if (eventDateStr) {
    const diff = new Date(eventDateStr).getTime() - new Date().getTime();
    daysRemaining = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  // Find host/couple group if available
  const coupleGroup = tableData.find((item) => item.is_couple || item.novios || item.uuid === 'novios-gz');

  // Loading Session Spinner (or Redirecting)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-[#586959] uppercase tracking-widest">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED DASHBOARD
  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C3E2D] pb-16">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#E8F0E7] text-[#3F5241] flex items-center justify-center font-cormorant font-bold text-lg border border-[#3F5241]/10">
              {coupleInfo?.config?.monogram || '💍'}
            </div>
            <div>
              <h2 className="font-cormorant font-bold text-lg text-[#2C3E2D] leading-tight">
                {coupleInfo?.bride_name && coupleInfo?.groom_name
                  ? `${coupleInfo.bride_name.split(' ')[0]} & ${coupleInfo.groom_name.split(' ')[0]}`
                  : 'Panel de Novios'}
              </h2>
              <span className="text-[10px] text-gray-400 font-mono tracking-wider">
                {coupleSlug}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold bg-[#E8F0E7] text-[#3F5241] px-2.5 py-1 rounded-full">
              <Sparkles className="w-3 h-3 text-[#BCA074]" /> {currentUser?.name || 'Novios'}
            </span>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl text-gray-500 hover:text-rose-600 hover:bg-rose-50 transition text-xs font-semibold flex items-center gap-1.5"
              title="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 pt-6 space-y-6">
        {/* Welcome & Countdown Banner */}
        <div className="bg-gradient-to-br from-[#3F5241] to-[#2C3E2D] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-8 translate-y-8 pointer-events-none">
            <Heart className="w-64 h-64 fill-white" />
          </div>

          <div className="relative z-10 space-y-2">
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-[#DFC69E] block">
              PANEL DE CONTROL GENERAL
            </span>
            <h1 className="font-cormorant text-3xl sm:text-4xl font-bold leading-tight">
              {coupleInfo?.bride_name && coupleInfo?.groom_name
                ? `${coupleInfo.bride_name} y ${coupleInfo.groom_name}`
                : 'Bienvenidos al Control de su Boda'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-200/90 max-w-xl">
              Aquí pueden consultar en tiempo real quiénes han confirmado, enviar invitaciones por WhatsApp y gestionar el acceso para el día del evento.
            </p>

            {daysRemaining !== null && (
              <div className="pt-2 flex items-center gap-2 text-xs text-[#DFC69E] font-medium">
                <Calendar className="w-4 h-4" />
                <span>
                  {daysRemaining === 0
                    ? '¡Hoy es el gran día de la boda!'
                    : `Faltan ${daysRemaining} días para la boda`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Real-time Metric Cards */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-100 shadow-xs text-center space-y-1">
            <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-600 flex items-center justify-center mx-auto mb-1">
              <Users className="w-4 h-4" />
            </div>
            <span className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Total Invitados
            </span>
            <span className="font-cormorant font-bold text-3xl text-stone-900 block">
              {loadingData ? '...' : rsvpStats.total}
            </span>
            <span className="text-[10px] text-gray-400">Pases convocados</span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-emerald-100/60 shadow-xs text-center space-y-1 bg-gradient-to-b from-white to-emerald-50/30">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-1">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="block text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
              Confirmados
            </span>
            <span className="font-cormorant font-bold text-3xl text-emerald-700 block">
              {loadingData ? '...' : rsvpStats.confirmados}
            </span>
            <span className="text-[10px] text-emerald-600/80">
              {rsvpStats.total > 0
                ? `${Math.round((rsvpStats.confirmados / rsvpStats.total) * 100)}% del total`
                : '0%'}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-rose-100/60 shadow-xs text-center space-y-1 bg-gradient-to-b from-white to-rose-50/30">
            <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center mx-auto mb-1">
              <XCircle className="w-4 h-4" />
            </div>
            <span className="block text-[10px] uppercase font-bold text-rose-700 tracking-wider">
              No Asisten
            </span>
            <span className="font-cormorant font-bold text-3xl text-rose-700 block">
              {loadingData ? '...' : rsvpStats.rechazados}
            </span>
            <span className="text-[10px] text-rose-600/80">
              {rsvpStats.total > 0
                ? `${Math.round((rsvpStats.rechazados / rsvpStats.total) * 100)}% del total`
                : '0%'}
            </span>
          </div>

          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-100/60 shadow-xs text-center space-y-1 bg-gradient-to-b from-white to-amber-50/30">
            <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto mb-1">
              <Clock className="w-4 h-4" />
            </div>
            <span className="block text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              Pendientes
            </span>
            <span className="font-cormorant font-bold text-3xl text-amber-700 block">
              {loadingData ? '...' : rsvpStats.pendientes}
            </span>
            <span className="text-[10px] text-amber-600/80">
              {rsvpStats.total > 0
                ? `${Math.round((rsvpStats.pendientes / rsvpStats.total) * 100)}% del total`
                : '0%'}
            </span>
          </div>
        </section>

        {/* Existing Views Hub (Accesos Rápidos Directos) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-cormorant text-2xl font-bold text-[#2C3E2D]">
              Accesos Rápidos a Módulos del Sistema
            </h2>
            <span className="text-xs text-gray-500">Vistas integradas</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 0. CRUD de Invitaciones */}
            <Link
              href={`/${coupleSlug}/admin/invitations`}
              className="bg-white rounded-2xl p-5 border-2 border-[#3F5241]/20 bg-gradient-to-br from-white to-[#E8F0E7]/30 shadow-xs hover:shadow-md hover:border-[#3F5241] transition group flex items-start justify-between sm:col-span-2"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2.5 rounded-xl bg-[#3F5241] text-white shadow-xs group-hover:bg-[#2C3E2D] transition">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-[#BCA074]">
                      Herramienta Principal
                    </span>
                    <h3 className="font-cormorant font-bold text-2xl text-stone-900 group-hover:text-[#3F5241] transition leading-tight">
                      Gestión de Invitaciones (Crear / Editar / Eliminar)
                    </h3>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed max-w-2xl">
                  Administra las familias convocadas, agrega nuevas invitaciones, asigna pases por persona y modifica los nombres o acompañantes de cada grupo.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#3F5241]">
                  Abrir panel de invitaciones <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            {/* 1. Control de Confirmaciones (Tabla RSVP) */}
            <Link
              href={`/${coupleSlug}/table`}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-[#6E836F] transition group flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-[#E8F0E7] text-[#3F5241] group-hover:bg-[#3F5241] group-hover:text-white transition">
                    <ListFilter className="w-5 h-5" />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800 group-hover:text-[#3F5241] transition">
                    Control de Confirmaciones (RSVP)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pr-2">
                  Tabla detallada de familias con filtros por estado (Asiste, Rechazado, Pendiente) y mensajes.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#6E836F]">
                  Abrir tabla completa <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            {/* 2. Control de Llegadas en Puerta */}
            <Link
              href={`/${coupleSlug}/checkout_list`}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-[#6E836F] transition group flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-50 text-blue-800 group-hover:bg-blue-700 group-hover:text-white transition">
                    <DoorOpen className="w-5 h-5" />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800 group-hover:text-blue-800 transition">
                    Control de Llegadas (Check-in)
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pr-2">
                  Dashboard de recepción para validar ingresos en vivo con buscador y registro de puerta.
                </p>
                <div className="flex items-center gap-3 pt-1">
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                    {checkoutStats.llegaron} en el evento
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700">
                    Abrir recepción <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </span>
                </div>
              </div>
            </Link>

            {/* 3. Pase Digital de los Novios */}
            <Link
              href={coupleGroup ? `/${coupleSlug}/view_pass/${coupleGroup.uuid}` : `/${coupleSlug}/view_pass/novios-gz`}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-[#6E836F] transition group flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-800 group-hover:bg-amber-700 group-hover:text-white transition">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800 group-hover:text-amber-800 transition">
                    Pase Digital con QR
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pr-2">
                  Accede al pase de entrada digital oficial de la pareja con su código QR para escaneo.
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800">
                  Ver pase digital <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                </span>
              </div>
            </Link>

            {/* 4. Vista Previa de la Invitación Web */}
            <Link
              href={coupleGroup ? `/${coupleSlug}/${coupleGroup.uuid}` : `/${coupleSlug}/novios-gz`}
              target="_blank"
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md hover:border-[#6E836F] transition group flex items-start justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-800 group-hover:bg-purple-700 group-hover:text-white transition">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800 group-hover:text-purple-800 transition">
                    Ver Invitación Digital
                  </h3>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed pr-2">
                  Abre la experiencia interactiva completa tal como la ven tus invitados (música, mapas, itinerario).
                </p>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700">
                  Abrir en pestaña nueva <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Tab Navigation for Tools */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center gap-2 border-b border-stone-200 pb-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#3F5241] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              📱 Generador de Enlaces de WhatsApp
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'messages'
                  ? 'bg-[#3F5241] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              💌 Muro de Mensajes ({messagesList.length})
            </button>
          </div>

          {/* TAB 1: WHATSAPP LINK GENERATOR */}
          {activeTab === 'overview' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800">
                    Enviar Invitación Personalizada
                  </h3>
                  <p className="text-xs text-gray-500">
                    Copia el link único de cada familia o envíalo directamente por WhatsApp con un solo clic.
                  </p>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    placeholder="Buscar familia..."
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6E836F]"
                  />
                </div>
              </div>

              <div className="divide-y divide-stone-100 max-h-96 overflow-y-auto pr-1">
                {filteredGuests.length === 0 ? (
                  <div className="text-center py-8 text-xs text-gray-400">
                    No se encontraron invitados.
                  </div>
                ) : (
                  filteredGuests.map((item, idx) => {
                    const groupName = item.group_name || item.group || item.invitado || 'Invitado';
                    const rawGuests = item.guests || item.familia || item.acompanantes || [];
                    const isCopied = copiedUuid === item.uuid;

                    return (
                      <div
                        key={item.uuid || idx}
                        className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FBF9F5]/70 px-2 rounded-xl transition"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm text-gray-800">
                              {groupName}
                            </span>
                            {item.is_couple && (
                              <span className="text-[9px] font-bold bg-[#E8F0E7] text-[#3F5241] px-2 py-0.5 rounded-full">
                                Novios
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-gray-500">
                            {rawGuests.length} {rawGuests.length === 1 ? 'persona' : 'personas'} · UUID:{' '}
                            <span className="font-mono text-gray-400">{item.uuid}</span>
                          </p>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          {/* Copy Link */}
                          <button
                            onClick={() => handleCopyLink(item.uuid)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                              isCopied
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                            }`}
                            title="Copiar enlace"
                          >
                            {isCopied ? (
                              <>
                                <Check className="w-3.5 h-3.5" /> Copiado
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copiar Link
                              </>
                            )}
                          </button>

                          {/* WhatsApp Direct Share */}
                          <button
                            onClick={() => handleShareWhatsApp(item)}
                            className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center gap-1.5 transition cursor-pointer border border-emerald-200"
                            title="Enviar por WhatsApp"
                          >
                            <Send className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 2: GUEST MESSAGES WALL */}
          {activeTab === 'messages' && (
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F0E7] text-[#3F5241]">
                  <MessageSquareHeart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-cormorant font-bold text-xl text-gray-800">
                    Mensajes y Buenos Deseos
                  </h3>
                  <p className="text-xs text-gray-500">
                    Felicitaciones dejadas por sus seres queridos al momento de confirmar su asistencia.
                  </p>
                </div>
              </div>

              {messagesList.length === 0 ? (
                <div className="text-center py-12 text-stone-400 space-y-2">
                  <MessageSquareHeart className="w-10 h-10 mx-auto opacity-30 text-[#3F5241]" />
                  <p className="text-xs font-medium">Aún no hay mensajes de felicitación registrados.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {messagesList.map((item, idx) => {
                    const groupName = item.group_name || item.group || item.invitado || 'Invitado';
                    const msg = item.message || item.mensaje;

                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-[#FBF9F5] border border-stone-100 flex flex-col justify-between space-y-3"
                      >
                        <p className="text-xs italic text-[#3F5241] leading-relaxed">
                          "{msg}"
                        </p>
                        <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 text-[11px] text-gray-500">
                          <span className="font-semibold text-gray-800">{groupName}</span>
                          <span className="text-[10px] text-stone-400">Confirmado</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
