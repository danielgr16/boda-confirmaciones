'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Users,
  Plus,
  Search,
  Edit2,
  Trash2,
  Copy,
  Check,
  Send,
  ExternalLink,
  ShieldCheck,
  ChevronLeft,
  X,
  UserPlus,
  Sparkles,
  Heart,
  QrCode,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  UserCheck,
} from 'lucide-react';

interface GuestFormItem {
  id?: number;
  name: string;
  type: 'principal' | 'acompanante' | 'familiar';
  attendance?: boolean | null;
  arrived?: boolean | null;
}

export default function InvitationsCrudPage({
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
  const [invitations, setInvitations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'family' | 'single' | 'couple'>('all');
  const [copiedUuid, setCopiedUuid] = useState<string | null>(null);

  // Modal State (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [currentPreset, setCurrentPreset] = useState<'individual' | 'pareja' | 'family'>('individual');
  const [editingUuid, setEditingUuid] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    group_name: string;
    titular_name: string;
    uuid: string;
    is_couple: boolean;
    is_guard: boolean;
    kids_count: number;
    message: string;
    guests: GuestFormItem[];
  }>({
    group_name: '',
    titular_name: '',
    uuid: '',
    is_couple: false,
    is_guard: false,
    kids_count: 0,
    message: '',
    guests: [{ name: '', type: 'principal' }],
  });

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete Dialog State
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check auth
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

  // Load Invitations Data
  const loadInvitations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/${coupleSlug}/invitations`);
      if (res.ok) {
        const json = await res.json();
        setInvitations(json.list || []);
      }
    } catch (err) {
      console.error('Error loading invitations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadInvitations();
    }
  }, [isAuthenticated, coupleSlug]);

  // Generate random UUID string
  const generateRandomUuid = () => {
    const hex = () => Math.random().toString(16).substring(2, 6);
    const hexLong = () => Math.random().toString(16).substring(2, 14);
    return `${hex()}-${hexLong()}`;
  };

  // Open Create Modal with Preset
  const handleOpenCreate = (presetType: 'individual' | 'pareja' | 'family' = 'individual') => {
    setModalMode('create');
    setCurrentPreset(presetType);
    setEditingUuid(null);
    setFormError('');

    let initialGuests: GuestFormItem[] = [];

    if (presetType === 'individual') {
      initialGuests = [
        { name: '', type: 'principal' },
      ];
    } else if (presetType === 'pareja') {
      initialGuests = [
        { name: '', type: 'principal' },
        { name: 'Acompañante', type: 'acompanante' },
      ];
    } else if (presetType === 'family') {
      initialGuests = [
        { name: '', type: 'familiar' },
        { name: '', type: 'familiar' },
      ];
    }

    setFormData({
      group_name: '',
      titular_name: '',
      uuid: generateRandomUuid(),
      is_couple: false,
      is_guard: false,
      kids_count: 0,
      message: '',
      guests: initialGuests,
    });

    setIsModalOpen(true);
  };

  // Switch Preset within modal
  const handleSwitchPreset = (presetType: 'individual' | 'pareja' | 'family') => {
    setCurrentPreset(presetType);
    const currentName = formData.group_name;

    if (presetType === 'individual') {
      setFormData((prev) => ({
        ...prev,
        guests: [{ name: currentName || '', type: 'principal' }],
      }));
    } else if (presetType === 'pareja') {
      setFormData((prev) => ({
        ...prev,
        guests: [
          { name: currentName || '', type: 'principal' },
          { name: 'Acompañante', type: 'acompanante' },
        ],
      }));
    } else if (presetType === 'family') {
      setFormData((prev) => ({
        ...prev,
        guests: [
          { name: '', type: 'familiar' },
          { name: '', type: 'familiar' },
        ],
      }));
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (item: any) => {
    setModalMode('edit');
    setEditingUuid(item.uuid);
    setFormError('');

    const rawGuests = item.guests || item.familia || item.acompanantes || [];
    const guestsList: GuestFormItem[] = rawGuests.map((g: any) => ({
      id: g.id,
      name: g.name || g.invitado || '',
      type: g.type || (g.familia ? 'familiar' : 'principal'),
      attendance: g.attendance !== undefined ? g.attendance : g.asistencia,
      arrived: g.arrived !== undefined ? g.arrived : g.llegada,
    }));

    if (guestsList.length === 0) {
      guestsList.push({ name: item.group_name || item.invitado || '', type: 'principal' });
    }

    // Infer preset
    if (guestsList.some((g) => g.type === 'familiar')) {
      setCurrentPreset('family');
    } else if (guestsList.length > 1) {
      setCurrentPreset('pareja');
    } else {
      setCurrentPreset('individual');
    }

    setFormData({
      group_name: item.group_name || item.group || item.invitado || '',
      titular_name: item.titular_name || item.invitado || '',
      uuid: item.uuid,
      is_couple: Boolean(item.is_couple || item.novios),
      is_guard: Boolean(item.is_guard || item.guardia),
      kids_count: Number(item.kids_count) || 0,
      message: item.message || item.mensaje || '',
      guests: guestsList,
    });

    setIsModalOpen(true);
  };

  // Guest Row Manipulation
  const handleAddGuestRow = (defaultType?: 'principal' | 'acompanante' | 'familiar') => {
    const typeToUse = defaultType || (currentPreset === 'family' ? 'familiar' : 'acompanante');
    setFormData((prev) => ({
      ...prev,
      guests: [
        ...prev.guests,
        {
          name: typeToUse === 'acompanante' ? 'Acompañante' : '',
          type: typeToUse,
        },
      ],
    }));
  };

  const handleRemoveGuestRow = (index: number) => {
    if (formData.guests.length <= 1) {
      setFormError('La invitación debe tener al menos una persona.');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      guests: prev.guests.filter((_, i) => i !== index),
    }));
  };

  const handleGuestChange = (index: number, field: keyof GuestFormItem, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.guests];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, guests: updated };
    });
  };

  // Submit Form (Create / Update)
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formData.group_name.trim()) {
      setFormError('Por favor ingresa el nombre de la familia o grupo.');
      return;
    }

    const validGuests = formData.guests.filter((g) => g.name.trim() !== '');
    if (validGuests.length === 0) {
      setFormError('Debes ingresar al menos el nombre de una persona.');
      return;
    }

    setIsSubmitting(true);

    try {
      const url =
        modalMode === 'create'
          ? `/api/${coupleSlug}/invitations`
          : `/api/${coupleSlug}/invitations/${editingUuid}`;

      const method = modalMode === 'create' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          guests: validGuests,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setIsModalOpen(false);
        await loadInvitations();
      } else {
        setFormError(data.error || 'Error al procesar la invitación');
      }
    } catch {
      setFormError('Error de conexión con el servidor');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Invitation
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/${coupleSlug}/invitations/${deleteTarget.uuid}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDeleteTarget(null);
        await loadInvitations();
      } else {
        const data = await res.json();
        alert(data.error || 'No se pudo eliminar la invitación');
      }
    } catch {
      alert('Error de conexión al eliminar');
    } finally {
      setIsDeleting(false);
    }
  };

  // Helpers
  const handleCopyLink = (uuid: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/${coupleSlug}/${uuid}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUuid(uuid);
    setTimeout(() => setCopiedUuid(null), 2500);
  };

  const handleShareWhatsApp = (item: any) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const fullUrl = `${origin}/${coupleSlug}/${item.uuid}`;
    const groupName = item.group_name || item.group || item.invitado || 'Familia';

    const bride = coupleInfo?.bride_name?.split(' ')[0] || 'la novia';
    const groom = coupleInfo?.groom_name?.split(' ')[0] || 'el novio';

    const message = `¡Hola ${groupName}! 👋 Con mucha alegría los invitamos a celebrar nuestra boda (${bride} & ${groom}) 💍✨\n\nPueden ver todos los detalles y confirmar su asistencia en este enlace:\n${fullUrl}\n\n¡Esperamos contar con su presencia!`;

    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Filtered list
  const filteredList = invitations.filter((item) => {
    const searchLower = search.toLowerCase();
    const groupName = (item.group_name || item.group || item.invitado || '').toLowerCase();
    const uuidLower = (item.uuid || '').toLowerCase();
    const guests = item.guests || item.familia || item.acompanantes || [];
    const hasGuestMatch = guests.some((g: any) =>
      (g.name || g.invitado || '').toLowerCase().includes(searchLower)
    );

    const matchesSearch = groupName.includes(searchLower) || uuidLower.includes(searchLower) || hasGuestMatch;
    if (!matchesSearch) return false;

    if (typeFilter === 'family') {
      return guests.some((g: any) => g.type === 'familiar' || g.familia) || groupName.toLowerCase().startsWith('familia');
    }
    if (typeFilter === 'single') {
      return !item.is_couple && !item.novios && (!groupName.toLowerCase().startsWith('familia') && guests.length <= 2);
    }
    if (typeFilter === 'couple') {
      return Boolean(item.is_couple || item.novios);
    }

    return true;
  });

  // Calculate statistics
  const totalPases = invitations.reduce((acc, curr) => {
    const guests = curr.guests || curr.familia || curr.acompanantes || [];
    return acc + (guests.length || 1);
  }, 0);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#FBF9F5] flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6E836F] border-t-transparent mx-auto"></div>
          <p className="text-xs font-semibold text-[#586959] uppercase tracking-widest">
            Verificando acceso...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBF9F5] text-[#2C3E2D] pb-20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href={`/${coupleSlug}/admin`}
              className="p-2 rounded-xl text-stone-600 hover:text-[#3F5241] hover:bg-[#E8F0E7] transition"
              title="Volver al Panel"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-cormorant font-bold text-2xl text-[#2C3E2D]">
                  Gestión de Invitaciones
                </h1>
              </div>
              <p className="text-xs text-stone-500">
                Crea, edita y organiza las familias y pases de tu boda ({coupleSlug})
              </p>
            </div>
          </div>

          <button
            onClick={() => handleOpenCreate('individual')}
            className="px-4 py-2.5 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2C3E2D] transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nueva Invitación</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 pt-6 space-y-6">
        {/* KPI Badges */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Total Invitaciones
            </span>
            <span className="font-cormorant font-bold text-2xl text-stone-900 block mt-1">
              {loading ? '...' : invitations.length}
            </span>
            <span className="text-[10px] text-gray-400">Grupos familiares / enlaces</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-[#3F5241] tracking-wider">
              Total de Pases
            </span>
            <span className="font-cormorant font-bold text-2xl text-[#3F5241] block mt-1">
              {loading ? '...' : totalPases}
            </span>
            <span className="text-[10px] text-stone-400">Personas convocadas</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs">
            <span className="block text-[10px] uppercase font-bold text-stone-500 tracking-wider">
              Promedio por Grupo
            </span>
            <span className="font-cormorant font-bold text-2xl text-stone-800 block mt-1">
              {invitations.length > 0 ? (totalPases / invitations.length).toFixed(1) : 0}
            </span>
            <span className="text-[10px] text-gray-400">Pases por invitación</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-xs flex items-center justify-between">
            <div>
              <span className="block text-[10px] uppercase font-bold text-[#3F5241] tracking-wider">
                Creación Rápida
              </span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                <button
                  onClick={() => handleOpenCreate('individual')}
                  className="text-[10px] px-2.5 py-1 bg-stone-100 hover:bg-[#E8F0E7] text-stone-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  + Individual
                </button>
                <button
                  onClick={() => handleOpenCreate('pareja')}
                  className="text-[10px] px-2.5 py-1 bg-stone-100 hover:bg-[#E8F0E7] text-stone-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  + Pareja
                </button>
                <button
                  onClick={() => handleOpenCreate('family')}
                  className="text-[10px] px-2.5 py-1 bg-stone-100 hover:bg-[#E8F0E7] text-stone-700 font-semibold rounded-lg transition cursor-pointer"
                >
                  + Familia
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filters Bar */}
        <section className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por familia, nombre de invitado o UUID..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6E836F]"
              />
            </div>

            {/* Filter pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs items-center">
              <button
                onClick={() => setTypeFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  typeFilter === 'all'
                    ? 'bg-[#3F5241] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Todas ({invitations.length})
              </button>
              <button
                onClick={() => setTypeFilter('family')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  typeFilter === 'family'
                    ? 'bg-[#3F5241] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Familias
              </button>
              <button
                onClick={() => setTypeFilter('single')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  typeFilter === 'single'
                    ? 'bg-[#3F5241] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                Individual / Pareja
              </button>
              <button
                onClick={() => setTypeFilter('couple')}
                className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer ${
                  typeFilter === 'couple'
                    ? 'bg-[#3F5241] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                💍 Novios
              </button>
            </div>
          </div>
        </section>

        {/* Invitations List / Cards */}
        <section className="space-y-3">
          {loading ? (
            <div className="py-16 text-center">
              <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#6E836F] border-t-transparent mx-auto mb-3"></div>
              <p className="text-xs text-stone-500 font-medium">Cargando invitaciones...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/80 shadow-xs space-y-3">
              <Users className="w-12 h-12 mx-auto text-stone-300" />
              <h3 className="font-cormorant font-bold text-xl text-stone-700">
                No se encontraron invitaciones
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No hay invitaciones que coincidan con la búsqueda. Puedes crear una nueva con el botón superior.
              </p>
              <button
                onClick={() => handleOpenCreate('family')}
                className="mt-2 px-4 py-2 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Crear Invitación
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredList.map((item, idx) => {
                const groupName = item.group_name || item.group || item.invitado || 'Invitado';
                const rawGuests = item.guests || item.familia || item.acompanantes || [];
                const isCopied = copiedUuid === item.uuid;
                const isCouple = Boolean(item.is_couple || item.novios);

                return (
                  <div
                    key={item.uuid || idx}
                    className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-cormorant font-bold text-xl text-stone-900">
                              {groupName}
                            </h3>
                            {isCouple && (
                              <span className="text-[9px] font-bold bg-[#E8F0E7] text-[#3F5241] px-2 py-0.5 rounded-full">
                                Novios
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                            UUID: <span className="text-stone-600 font-semibold">{item.uuid}</span>
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 justify-end shrink-0">
                          <span className="text-xs font-semibold bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">
                            {rawGuests.length} {rawGuests.length === 1 ? 'pase' : 'pases'}
                          </span>
                          {Number(item.kids_count) > 0 && (
                            <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full">
                              🧒 +{item.kids_count} {Number(item.kids_count) === 1 ? 'niño' : 'niños'}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Guests badges */}
                      <div className="mt-3.5 pt-3 border-t border-stone-100 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block mb-1">
                          Integrantes convocados:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {rawGuests.map((g: any, gIdx: number) => {
                            const name = g.name || g.invitado;
                            const status = g.attendance !== undefined ? g.attendance : g.asistencia;
                            const type = g.type || (g.familia ? 'familiar' : 'principal');

                            return (
                              <span
                                key={gIdx}
                                className={`inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg border ${
                                  status === true
                                    ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                    : status === false
                                    ? 'bg-rose-50 text-rose-800 border-rose-200'
                                    : 'bg-stone-50 text-stone-700 border-stone-200'
                                }`}
                              >
                                <span className="font-medium">{name}</span>
                                <span className="text-[9px] opacity-60">({type})</span>
                                {status === true && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                                {status === false && <XCircle className="w-3 h-3 text-rose-600" />}
                                {status === null && <Clock className="w-3 h-3 text-amber-500" />}
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      {/* Message preview if any */}
                      {(item.message || item.mensaje) && (
                        <div className="mt-3 text-xs italic text-[#3F5241] bg-[#E8F0E7]/40 p-2.5 rounded-xl border border-[#3F5241]/10">
                          "{item.message || item.mensaje}"
                        </div>
                      )}
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleCopyLink(item.uuid)}
                          className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer ${
                            isCopied
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                          }`}
                          title="Copiar enlace de invitación"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span className="text-[11px] hidden sm:inline">{isCopied ? 'Copiado' : 'Link'}</span>
                        </button>

                        <button
                          onClick={() => handleShareWhatsApp(item)}
                          className="p-2 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center gap-1 transition cursor-pointer"
                          title="Enviar por WhatsApp"
                        >
                          <Send className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-[11px] hidden sm:inline">WhatsApp</span>
                        </button>

                        <Link
                          href={`/${coupleSlug}/${item.uuid}`}
                          target="_blank"
                          className="p-2 rounded-xl text-stone-500 hover:text-[#3F5241] hover:bg-[#E8F0E7] transition"
                          title="Abrir invitación en nueva pestaña"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(item)}
                          className="p-2 rounded-xl text-stone-600 hover:text-blue-700 hover:bg-blue-50 transition cursor-pointer"
                          title="Editar invitación"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                          title="Eliminar invitación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 relative my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E8F0E7] text-[#3F5241]">
                  {modalMode === 'create' ? <UserPlus className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
                </div>
                <div>
                  <h2 className="font-cormorant font-bold text-2xl text-stone-900 leading-tight">
                    {modalMode === 'create' ? 'Nueva Invitación' : 'Editar Invitación'}
                  </h2>
                  <p className="text-xs text-stone-500">
                    {modalMode === 'create' ? 'Agrega una familia o invitado' : `Modificando grupo: ${formData.group_name}`}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmitForm} className="space-y-4 pt-4 overflow-y-auto flex-1 pr-1">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
                  {formError}
                </div>
              )}

              {/* Preset Selector Tabs (when in create mode) */}
              {modalMode === 'create' && (
                <div className="flex bg-stone-100 p-1 rounded-2xl gap-1">
                  <button
                    type="button"
                    onClick={() => handleSwitchPreset('individual')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentPreset === 'individual'
                        ? 'bg-white text-[#3F5241] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    👤 Individual
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchPreset('pareja')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentPreset === 'pareja'
                        ? 'bg-white text-[#3F5241] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    👥 Pareja
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSwitchPreset('family')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      currentPreset === 'family'
                        ? 'bg-white text-[#3F5241] shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    👨‍👩‍👧‍👦 Familia
                  </button>
                </div>
              )}

              {/* Group Name (Single Input) */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-semibold text-stone-600 mb-1">
                  Nombre del Invitado, Grupo o Familia *
                </label>
                <input
                  type="text"
                  value={formData.group_name}
                  onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
                  placeholder={
                    currentPreset === 'family'
                      ? 'Ej. Familia Gómez García'
                      : currentPreset === 'pareja'
                      ? 'Ej. Juan Gómez y Acompañante'
                      : 'Ej. Juan Gómez'
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6E836F] text-stone-800"
                  autoFocus
                  required
                />
              </div>

              {/* Dynamic Guests List */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-700">
                    Pases e Integrantes ({formData.guests.length})
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAddGuestRow()}
                    className="text-[11px] font-bold text-[#6E836F] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Agregar Persona
                  </button>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {formData.guests.map((guest, idx) => {
                    const canSuggest =
                      idx === 0 &&
                      currentPreset !== 'family' &&
                      formData.group_name.trim() !== '' &&
                      guest.name.trim() !== formData.group_name.trim();

                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5"
                      >
                        {/* Header of guest card */}
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-stone-600">
                            Persona {idx + 1}
                            {guest.type === 'principal' && ' (Titular)'}
                            {guest.type === 'acompanante' && ' (Acompañante)'}
                            {guest.type === 'familiar' && ' (Familia)'}
                          </span>

                          {formData.guests.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveGuestRow(idx)}
                              className="text-stone-400 hover:text-rose-600 p-1 rounded-lg transition cursor-pointer text-[11px] flex items-center gap-1"
                              title="Quitar persona"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Quitar</span>
                            </button>
                          )}
                        </div>

                        {/* Input for name */}
                        <div>
                          <input
                            type="text"
                            value={guest.name}
                            onChange={(e) => handleGuestChange(idx, 'name', e.target.value)}
                            placeholder={
                              guest.type === 'acompanante'
                                ? 'Ej. Acompañante o Nombre de la pareja'
                                : 'Nombre completo del invitado'
                            }
                            className="w-full px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-[#6E836F] text-stone-800"
                            required
                          />

                          {/* Autocomplete suggestion chip for guest 0 */}
                          {canSuggest && (
                            <button
                              type="button"
                              onClick={() => handleGuestChange(0, 'name', formData.group_name.trim())}
                              className="mt-1.5 text-[11px] font-semibold text-[#3F5241] bg-[#E8F0E7] hover:bg-[#d8e6d7] px-2.5 py-1 rounded-lg transition inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Sparkles className="w-3 h-3 text-[#BCA074]" />
                              Usar "{formData.group_name.trim()}"
                            </button>
                          )}
                        </div>

                        {/* Select for type placed under the input */}
                        <div className="flex items-center gap-2 pt-0.5">
                          <label className="text-[10px] uppercase font-bold text-stone-500 tracking-wider whitespace-nowrap">
                            Tipo:
                          </label>
                          <select
                            value={guest.type}
                            onChange={(e) => handleGuestChange(idx, 'type', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#6E836F]"
                          >
                            <option value="principal">Titular</option>
                            <option value="acompanante">Invitado / Acompañante</option>
                            <option value="familiar">Familia</option>
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Kids Stepper */}
              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider font-bold text-stone-700">
                      Niños Permitidos
                    </label>
                    <p className="text-[11px] text-stone-500">
                      {formData.kids_count > 0
                        ? `Se permitirán ${formData.kids_count} ${formData.kids_count === 1 ? 'niño' : 'niños'} en esta invitación.`
                        : '0 por defecto (no se mencionarán niños en pase ni confirmación).'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          kids_count: Math.max(0, (Number(prev.kids_count) || 0) - 1),
                        }))
                      }
                      disabled={formData.kids_count <= 0}
                      className="w-8 h-8 rounded-lg bg-white text-stone-700 font-bold flex items-center justify-center hover:bg-stone-200 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer shadow-xs text-base"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={formData.kids_count}
                      onChange={(e) => {
                        const val = Math.max(0, parseInt(e.target.value) || 0);
                        setFormData((prev) => ({ ...prev, kids_count: val }));
                      }}
                      className="w-10 text-center text-xs font-bold bg-transparent text-stone-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          kids_count: (Number(prev.kids_count) || 0) + 1,
                        }))
                      }
                      className="w-8 h-8 rounded-lg bg-white text-stone-700 font-bold flex items-center justify-center hover:bg-stone-200 transition cursor-pointer shadow-xs text-base"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Flags */}
              <div className="pt-2 border-t border-stone-100 flex flex-wrap gap-4 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.is_couple}
                    onChange={(e) => setFormData({ ...formData, is_couple: e.target.checked })}
                    className="rounded text-[#3F5241] focus:ring-[#6E836F]"
                  />
                  <span>Es pase de los Novios</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.is_guard}
                    onChange={(e) => setFormData({ ...formData, is_guard: e.target.checked })}
                    className="rounded text-[#3F5241] focus:ring-[#6E836F]"
                  />
                  <span>Permiso de Guardia / Recepción</span>
                </label>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-full bg-[#3F5241] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2C3E2D] transition shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Guardando...' : modalMode === 'create' ? 'Crear Invitación' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 text-center space-y-4">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-cormorant font-bold text-2xl text-stone-900">
                ¿Eliminar Invitación?
              </h3>
              <p className="text-xs text-stone-500">
                Estás a punto de eliminar la invitación de{' '}
                <strong className="text-stone-800">
                  "{deleteTarget.group_name || deleteTarget.group || deleteTarget.invitado}"
                </strong>{' '}
                y todos sus pases asignados. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-100 transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="flex-1 py-2.5 rounded-full bg-rose-600 text-white text-xs font-bold uppercase tracking-wider hover:bg-rose-700 transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? 'Eliminando...' : 'Sí, Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
