import { neon, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import type { Couple, InvitationGroup, Guest, User } from './types';

// Cache database connection
const databaseUrl = process.env.DATABASE_URL;
export const sql = databaseUrl ? neon(databaseUrl) : null;

// Built-in couple configurations
export const DEFAULT_COUPLES: Record<string, Couple> = {
  'silva-arce': {
    id: 1,
    slug: 'silva-arce',
    groom_name: 'Erik Alejandro Silva Rueda',
    bride_name: 'Daniela Arce Rocha',
    event_date: '2026-11-14T14:30:00-06:00',
    reception_time: '17:00',
    ceremony_place: 'Parroquia San Juan Bautista',
    ceremony_address: 'Enrique Felix Castro 2569, Humaya, 80020 Culiacán Rosales, Sin.',
    reception_place: 'Salón de Eventos Las Palmas',
    reception_address: 'Calle Fetsu 4408, Unión de Trabajadores, 80050 Culiacán Rosales, Sin.',
    ceremony_maps_url: 'https://www.google.com/maps/search/?api=1&query=Enrique+Felix+Castro+2569,+Humaya,+80020+Culiac%C3%A1n+Rosales,+Sin.',
    reception_maps_url: 'https://www.google.com/maps/search/?api=1&query=Calle+Fetsu+4408,+Uni%C3%B3n+de+Trabajadores,+80050+Culiac%C3%A1n+Rosales,+Sin.',
    bible_verse: '“Mejores son dos que uno; porque tienen mejor paga de su trabajo. Porque si cayeren, el uno levantará a su compañero; pero ¡ay del solo! que cuando cayere, no habrá segundo que lo levante.”',
    bible_citation: 'Eclesiastés 4:9-10',
    access_password: 'boda2026',
    rsvp_deadline: '2026-10-16T23:00:00-06:00',
    config: {
      theme: {
        primary: '#6E836F',
        secondary: '#9FB99E',
        background: '#FBF9F5',
        accent: '#BCA074'
      },
      monogram: 'D | E',
      parents: {
        brideFather: 'Rodolfo Arce Arce',
        brideMother: 'Bertha Alicia Rocha Flores',
        groomFather: 'Alejandro Silva Rodelo',
        groomMother: 'Apolonia Rueda Montes'
      },
      contacts: {
        groom: { name: 'Erik', phone: '667 361 6529' },
        bride: { name: 'Daniela', phone: '667 491 5813' }
      },
      dressCode: {
        type: 'Formal',
        description: 'Agradecemos a todos nuestros invitados vestir con atuendo formal.',
        restrictedColors: 'El color blanco está reservado exclusivamente para la novia.'
      },
      musicUrl: '/sound/music.ogg',
      registryLinks: [
        {
          title: 'Mesa de Regalos en Liverpool',
          url: 'https://mesaderegalos.liverpool.com.mx/milistaderegalos/52020540',
          icon: 'gift'
        },
        {
          title: 'Mesa de Regalos en Cimaco',
          url: 'https://mdr.cimaco.com.mx/evento/46620',
          icon: 'sparkles'
        }
      ],
      bankAccounts: [
        {
          bank: 'BBVA',
          holder: 'Daniela Arce',
          accountNumber: '4152 3137 5760 7093'
        },
        {
          bank: 'Bancoppel',
          holder: 'Erik Silva',
          accountNumber: '4169 1614 1413 7538'
        }
      ],
      photos: {
        cover: '/img/silva-arce/IMG_8472.webp',
        album: [
          '/img/silva-arce/IMG_8190.webp',
          '/img/silva-arce/IMG_8202.webp',
          '/img/silva-arce/IMG_8216.webp',
          '/img/silva-arce/IMG_8258.webp',
          '/img/silva-arce/IMG_8476.webp',
          '/img/silva-arce/IMG_8477.webp'
        ],
        end: '/img/silva-arce/IMG_8480.webp'
      },
      adultsOnly: true,
      adultsOnlyMessage: 'Amamos a sus pequeños, pero para que todos podamos disfrutar plenamente de esta celebración, nuestra boda será un evento exclusivamente para adultos.'
    }
  },
  'garcia-zentella': {
    id: 2,
    slug: 'garcia-zentella',
    groom_name: 'Daniel García',
    bride_name: 'Perla Zentella',
    event_date: '2026-04-18T14:30:00-07:00',
    reception_time: '17:00',
    ceremony_place: 'Templo / Parroquia',
    ceremony_address: 'Templo / Iglesia',
    reception_place: 'Salón Jardín',
    reception_address: 'Salón de Eventos',
    ceremony_maps_url: 'https://maps.app.goo.gl/DafNRfBwB2AV1gVV6',
    reception_maps_url: 'https://maps.app.goo.gl/DafNRfBwB2AV1gVV6',
    bible_verse: '“Ponme como un sello sobre tu corazón, como una marca sobre tu brazo; Porque fuerte es como la muerte el amor;”',
    bible_citation: 'Cantares 8:6',
    access_password: 'boda2026',
    rsvp_deadline: '2026-03-31T23:59:00-07:00',
    config: {
      theme: {
        primary: '#3A4F31',
        secondary: '#FF6200',
        background: '#FFFFFF',
        accent: '#818A7C'
      },
      monogram: 'P | D',
      parents: {
        brideFather: 'Juan José Zentella Hernandez',
        brideMother: 'Perla Mundo',
        groomFather: 'Daniel García',
        groomMother: 'Familia García'
      },
      contacts: {
        groom: { name: 'Daniel', phone: '664 308 1523' },
        bride: { name: 'Perla', phone: '664 765 6976' },
        dayOfEvent: { name: 'Dulce Zentella', phone: '664 724 7825' }
      },
      dressCode: {
        type: 'Rigurosa Etiqueta',
        description: 'Mujeres: Vestido largo. Hombres: Traje formal.',
        restrictedColors: 'Evitar tonos blancos, marfil y beige.'
      },
      musicUrl: '/sound/music.ogg',
      registryLinks: [
        {
          title: 'Mesa de Regalos en Amazon',
          url: 'https://www.amazon.com.mx/wedding/share/danielyperla',
          icon: 'gift'
        }
      ],
      bankAccounts: [
        {
          bank: 'BBVA',
          holder: 'Perla Zentella Mundo',
          accountNumber: '4189 1400 5394 1448'
        }
      ],
      photos: {
        cover: '/img/cover.webp',
        album: [
          '/img/album-1.webp',
          '/img/album-2.webp',
          '/img/album-3.webp',
          '/img/album-4.webp'
        ],
        end: '/img/end.webp'
      }
    }
  }
};

// Local JSON Fallback reader
function getLocalJsonPath(slug: string): string {
  const candidates = [
    path.join(process.cwd(), `storage/app/public/${slug}/invitados.json`),
    path.join(process.cwd(), `storage/app/${slug}/invitados.json`),
    path.join(process.cwd(), `storage/app/${slug}.json`),
    path.join(process.cwd(), 'storage/app/invitados.json')
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }
  return path.join(process.cwd(), 'storage/app/invitados.json');
}

export function getLocalGuests(slug: string): any[] {
  try {
    const filePath = getLocalJsonPath(slug);
    if (!fs.existsSync(filePath)) return [];
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content) || [];
  } catch (err) {
    console.error('Error reading local JSON:', err);
    return [];
  }
}

export function saveLocalGuests(slug: string, data: any[]): void {
  try {
    const filePath = getLocalJsonPath(slug);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4), 'utf-8');
  } catch (err) {
    console.error('Error writing local JSON:', err);
  }
}

// Database query functions
export async function getCoupleBySlug(slug: string): Promise<Couple | null> {
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM couples WHERE slug = ${slug} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return rows[0] as Couple;
      }
    } catch (err) {
      console.warn('Neon DB query failed, using built-in config fallback:', err);
    }
  }
  return DEFAULT_COUPLES[slug] || null;
}

export async function getCoupleById(id: number): Promise<Couple | null> {
  if (sql) {
    try {
      const rows = await sql`
        SELECT * FROM couples WHERE id = ${id} LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return rows[0] as Couple;
      }
    } catch (err) {
      console.warn('Neon DB getCoupleById query failed, using fallback:', err);
    }
  }
  for (const couple of Object.values(DEFAULT_COUPLES)) {
    if (couple.id === id) return couple;
  }
  return null;
}

export async function getInvitation(coupleSlug: string, uuid: string): Promise<{ couple: Couple; group: InvitationGroup } | null> {
  const couple = await getCoupleBySlug(coupleSlug);
  if (!couple) return null;

  if (sql) {
    try {
      const groupRows = await sql`
        SELECT g.* 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug} AND g.uuid = ${uuid}
        LIMIT 1
      `;

      if (groupRows && groupRows.length > 0) {
        const groupRow = groupRows[0];
        const guestsRows = await sql`
          SELECT * FROM guests WHERE group_id = ${groupRow.id} ORDER BY id ASC
        `;

        const group: InvitationGroup = {
          id: groupRow.id,
          couple_id: groupRow.couple_id,
          uuid: groupRow.uuid,
          group_name: groupRow.group_name,
          titular_name: groupRow.titular_name,
          attendance: groupRow.attendance,
          message: groupRow.message,
          is_couple: groupRow.is_couple,
          is_guard: groupRow.is_guard,
          kids_count: Number(groupRow.kids_count) || 0,
          guests: guestsRows.map(g => ({
            id: g.id,
            group_id: g.group_id,
            name: g.name,
            type: g.type,
            attendance: g.attendance,
            arrived: g.arrived
          }))
        };

        return { couple, group };
      }
    } catch (err) {
      console.warn('Neon DB query failed, trying local JSON fallback:', err);
    }
  }

  // Fallback to local JSON
  const rawList = getLocalGuests(coupleSlug);
  const item = rawList.find(i => i.uuid === uuid);
  if (!item) return null;

  const guests: Guest[] = [];
  if (Array.isArray(item.familia) && item.familia.length > 0) {
    for (const f of item.familia) {
      guests.push({
        name: f.invitado || f.name,
        type: 'familiar',
        attendance: f.asistencia ?? null,
        arrived: f.llegada ?? null
      });
    }
  } else {
    if (item.invitado) {
      guests.push({
        name: item.invitado,
        type: 'principal',
        attendance: item.asistencia ?? null,
        arrived: item.llegada ?? null
      });
    }
    if (Array.isArray(item.acompanantes)) {
      for (const a of item.acompanantes) {
        guests.push({
          name: a.invitado || a.name,
          type: 'acompanante',
          attendance: a.asistencia ?? null,
          arrived: a.llegada ?? null
        });
      }
    }
  }

  const group: InvitationGroup = {
    uuid: item.uuid,
    group_name: item.group || item.invitado || 'Invitado',
    titular_name: item.invitado || item.group,
    attendance: item.asistencia ?? null,
    message: item.mensaje || '',
    is_couple: item.novios || false,
    is_guard: item.guardia || false,
    kids_count: Number(item.kids_count) || 0,
    guests
  };

  return { couple, group };
}

export async function updateConfirmation(
  coupleSlug: string,
  uuid: string,
  guestName: string,
  type: string,
  attendance: boolean | null,
  message?: string
): Promise<boolean> {
  if (sql) {
    try {
      const groupRows = await sql`
        SELECT g.id 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug} AND g.uuid = ${uuid}
        LIMIT 1
      `;

      if (groupRows && groupRows.length > 0) {
        const groupId = groupRows[0].id;

        // Update individual guest
        await sql`
          UPDATE guests 
          SET attendance = ${attendance}, updated_at = NOW()
          WHERE group_id = ${groupId} AND name = ${guestName}
        `;

        // Update group message if provided
        if (message !== undefined) {
          await sql`
            UPDATE invitation_groups 
            SET message = ${message}, updated_at = NOW()
            WHERE id = ${groupId}
          `;
        }

        return true;
      }
    } catch (err) {
      console.error('Database update failed:', err);
    }
  }

  // Fallback to local JSON
  const rawList = getLocalGuests(coupleSlug);
  let updated = false;

  for (const item of rawList) {
    if (item.uuid === uuid) {
      if (type === 'familiar' && Array.isArray(item.familia)) {
        for (const fam of item.familia) {
          if (fam.invitado === guestName) {
            fam.asistencia = attendance;
            updated = true;
          }
        }
      } else if (type === 'principal') {
        item.asistencia = attendance;
        updated = true;
      } else if (type === 'acompanante' && Array.isArray(item.acompanantes)) {
        for (const acomp of item.acompanantes) {
          if (acomp.invitado === guestName) {
            acomp.asistencia = attendance;
            updated = true;
          }
        }
      }

      if (message !== undefined) {
        item.mensaje = message;
      }
      break;
    }
  }

  if (updated) {
    saveLocalGuests(coupleSlug, rawList);
  }
  return updated;
}

export async function updateArrival(
  coupleSlug: string,
  uuid: string,
  guestName: string,
  type: string,
  arrived: boolean
): Promise<boolean> {
  if (sql) {
    try {
      const groupRows = await sql`
        SELECT g.id 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug} AND g.uuid = ${uuid}
        LIMIT 1
      `;

      if (groupRows && groupRows.length > 0) {
        const groupId = groupRows[0].id;
        await sql`
          UPDATE guests 
          SET arrived = ${arrived}, updated_at = NOW()
          WHERE group_id = ${groupId} AND name = ${guestName}
        `;
        return true;
      }
    } catch (err) {
      console.error('Database update arrival failed:', err);
    }
  }

  // Local fallback
  const rawList = getLocalGuests(coupleSlug);
  let updated = false;

  for (const item of rawList) {
    if (item.uuid === uuid) {
      if (type === 'familiar' && Array.isArray(item.familia)) {
        for (const fam of item.familia) {
          if (fam.invitado === guestName) {
            fam.llegada = arrived;
            updated = true;
          }
        }
      } else if (type === 'principal') {
        item.llegada = arrived;
        updated = true;
      } else if (type === 'acompanante' && Array.isArray(item.acompanantes)) {
        for (const acomp of item.acompanantes) {
          if (acomp.invitado === guestName) {
            acomp.llegada = arrived;
            updated = true;
          }
        }
      }
      break;
    }
  }

  if (updated) {
    saveLocalGuests(coupleSlug, rawList);
  }
  return updated;
}

export async function getTableData(coupleSlug: string): Promise<{ list: any[]; stats: any }> {
  const stats = {
    total: 0,
    confirmados: 0,
    rechazados: 0,
    pendientes: 0
  };

  if (sql) {
    try {
      const groups = await sql`
        SELECT g.* 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug}
        ORDER BY g.group_name ASC
      `;

      const guests = await sql`
        SELECT gu.* 
        FROM guests gu
        JOIN invitation_groups g ON gu.group_id = g.id
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug}
      `;

      const list = groups.map(g => {
        const groupGuests = guests.filter(gu => gu.group_id === g.id);
        for (const gu of groupGuests) {
          stats.total++;
          if (gu.attendance === true) stats.confirmados++;
          else if (gu.attendance === false) stats.rechazados++;
          else stats.pendientes++;
        }
        return {
          ...g,
          guests: groupGuests
        };
      });

      return { list, stats };
    } catch (err) {
      console.warn('Neon DB table query failed, falling back to local JSON:', err);
    }
  }

  // Local fallback
  const rawList = getLocalGuests(coupleSlug);
  for (const grupo of rawList) {
    const personas: any[] = [];
    if (!empty(grupo.invitado)) personas.push({ asistencia: grupo.asistencia ?? null });
    if (Array.isArray(grupo.acompanantes)) {
      for (const a of grupo.acompanantes) personas.push({ asistencia: a.asistencia ?? null });
    }
    if (Array.isArray(grupo.familia)) {
      for (const f of grupo.familia) personas.push({ asistencia: f.asistencia ?? null });
    }

    for (const p of personas) {
      stats.total++;
      if (p.asistencia === true) stats.confirmados++;
      else if (p.asistencia === false) stats.rechazados++;
      else stats.pendientes++;
    }
  }

  return { list: rawList, stats };
}

export async function getCheckoutData(coupleSlug: string): Promise<{ list: any[]; stats: any }> {
  const stats = {
    total: 0,
    llegaron: 0,
    no_llegaron: 0,
    pendientes: 0
  };

  if (sql) {
    try {
      const groups = await sql`
        SELECT g.* 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug}
        ORDER BY g.group_name ASC
      `;

      const guests = await sql`
        SELECT gu.* 
        FROM guests gu
        JOIN invitation_groups g ON gu.group_id = g.id
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug}
      `;

      const list = groups.map(g => {
        const groupGuests = guests.filter(gu => gu.group_id === g.id);
        for (const gu of groupGuests) {
          stats.total++;
          if (gu.arrived === true) stats.llegaron++;
          else if (gu.arrived === false) stats.no_llegaron++;
          else stats.pendientes++;
        }
        return {
          ...g,
          guests: groupGuests
        };
      });

      return { list, stats };
    } catch (err) {
      console.warn('Neon DB checkout query failed, falling back to local JSON:', err);
    }
  }

  // Local fallback
  const rawList = getLocalGuests(coupleSlug);
  for (const grupo of rawList) {
    const personas: any[] = [];
    if (Array.isArray(grupo.familia) && grupo.familia.length > 0) {
      for (const f of grupo.familia) personas.push({ llegada: f.llegada ?? null });
    } else {
      if (!empty(grupo.invitado)) personas.push({ llegada: grupo.llegada ?? null });
      if (Array.isArray(grupo.acompanantes)) {
        for (const a of grupo.acompanantes) personas.push({ llegada: a.llegada ?? null });
      }
    }

    for (const p of personas) {
      stats.total++;
      if (p.llegada === true) stats.llegaron++;
      else if (p.llegada === false) stats.no_llegaron++;
      else stats.pendientes++;
    }
  }

  return { list: rawList, stats };
}

function empty(val: any): boolean {
  return val === undefined || val === null || val === '';
}

// User & Authentication Methods
export async function getUserByUsername(username: string): Promise<User | null> {
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, couple_id, username, password, name, role, created_at
        FROM users 
        WHERE username = ${username}
        LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return rows[0] as User;
      }
    } catch (err) {
      console.warn('Neon DB user query failed, checking fallback:', err);
    }
  }

  // Fallback check against DEFAULT_COUPLES
  for (const [slug, couple] of Object.entries(DEFAULT_COUPLES)) {
    if (slug === username) {
      return {
        id: couple.id,
        couple_id: couple.id,
        username: slug,
        password: couple.access_password || 'boda2026',
        name: `${couple.bride_name} & ${couple.groom_name}`,
        role: 'couple'
      };
    }
    if (`${slug}-guard` === username) {
      return {
        id: couple.id * 1000 + 1,
        couple_id: couple.id,
        username: `${slug}-guard`,
        password: couple.access_password || 'boda2026',
        name: `Recepción ${slug}`,
        role: 'guard'
      };
    }
  }

  return null;
}

export async function getUserById(id: number): Promise<User | null> {
  if (sql) {
    try {
      const rows = await sql`
        SELECT id, couple_id, username, name, role, created_at
        FROM users 
        WHERE id = ${id}
        LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return rows[0] as User;
      }
    } catch (err) {
      console.warn('Neon DB getUserById query failed:', err);
    }
  }

  for (const [slug, couple] of Object.entries(DEFAULT_COUPLES)) {
    if (couple.id === id) {
      return {
        id: couple.id,
        couple_id: couple.id,
        username: slug,
        name: `${couple.bride_name} & ${couple.groom_name}`,
        role: 'couple'
      };
    }
  }

  return null;
}

export async function authenticateUser(
  username: string,
  passwordInput: string,
  coupleSlug?: string
): Promise<{ success: boolean; user?: User; error?: string }> {
  // 1. Try to find user in DB or fallback
  let user = await getUserByUsername(username);

  // If username wasn't found directly, but coupleSlug is provided and matches, try coupleSlug
  if (!user && coupleSlug && (username.toLowerCase() === 'admin' || username.toLowerCase() === 'novios')) {
    user = await getUserByUsername(coupleSlug);
  }

  // If still not found and coupleSlug is provided, check if password matches couple access_password
  if (!user && coupleSlug) {
    const couple = await getCoupleBySlug(coupleSlug);
    if (couple && (couple.access_password || 'boda2026') === passwordInput) {
      user = {
        id: couple.id,
        couple_id: couple.id,
        username: couple.slug,
        password: couple.access_password || 'boda2026',
        name: `${couple.bride_name} & ${couple.groom_name}`,
        role: 'couple'
      };
    }
  }

  if (!user) {
    return { success: false, error: 'Usuario o contraseña no válidos' };
  }

  // 2. Validate password
  if (user.password !== passwordInput) {
    return { success: false, error: 'Contraseña incorrecta' };
  }

  // 3. Verify couple slug match if restricted
  if (coupleSlug) {
    const couple = await getCoupleBySlug(coupleSlug);
    if (couple && user.couple_id !== couple.id && user.role !== 'admin') {
      return { success: false, error: 'El usuario no tiene acceso a esta boda' };
    }
  }

  // Omit password from returned object for safety
  const safeUser: User = {
    id: user.id,
    couple_id: user.couple_id,
    username: user.username,
    name: user.name,
    role: user.role,
    created_at: user.created_at
  };

  return { success: true, user: safeUser };
}

// ==========================================
// INVITATION CRUD OPERATIONS
// ==========================================

function generateCustomUuid(): string {
  const hex = () => Math.random().toString(16).substring(2, 6);
  const hexLong = () => Math.random().toString(16).substring(2, 14);
  return `${hex()}-${hexLong()}`;
}

export async function createInvitationGroup(
  coupleSlug: string,
  data: {
    group_name: string;
    titular_name?: string;
    uuid?: string;
    is_couple?: boolean;
    is_guard?: boolean;
    kids_count?: number;
    message?: string;
    guests: {
      name: string;
      type: 'principal' | 'acompanante' | 'familiar';
      attendance?: boolean | null;
      arrived?: boolean | null;
    }[];
  }
): Promise<{ success: boolean; group?: InvitationGroup; error?: string }> {
  const couple = await getCoupleBySlug(coupleSlug);
  if (!couple) return { success: false, error: 'Boda no encontrada' };

  const rawUuid = data.uuid && data.uuid.trim() !== '' ? data.uuid.trim() : generateCustomUuid();
  const uuid = rawUuid.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const group_name = data.group_name.trim();
  const titular_name = data.titular_name?.trim() || null;
  const is_couple = Boolean(data.is_couple);
  const is_guard = Boolean(data.is_guard);
  const kids_count = Math.max(0, Number(data.kids_count) || 0);
  const message = data.message || '';

  if (sql) {
    try {
      // Check if UUID already exists for this couple
      const existing = await sql`
        SELECT id FROM invitation_groups WHERE couple_id = ${couple.id} AND uuid = ${uuid} LIMIT 1
      `;
      if (existing && existing.length > 0) {
        return { success: false, error: 'El identificador (UUID) ya está en uso en esta boda' };
      }

      const groupRows = await sql`
        INSERT INTO invitation_groups (
          couple_id, uuid, group_name, titular_name, attendance, message, is_couple, is_guard, kids_count
        ) VALUES (
          ${couple.id}, ${uuid}, ${group_name}, ${titular_name}, null, ${message}, ${is_couple}, ${is_guard}, ${kids_count}
        )
        RETURNING *
      `;

      const groupRow = groupRows[0];
      const insertedGuests: Guest[] = [];

      for (const g of data.guests) {
        if (!g.name || g.name.trim() === '') continue;
        const guestRows = await sql`
          INSERT INTO guests (group_id, name, type, attendance, arrived)
          VALUES (${groupRow.id}, ${g.name.trim()}, ${g.type || 'familiar'}, ${g.attendance ?? null}, ${g.arrived ?? null})
          RETURNING *
        `;
        if (guestRows && guestRows.length > 0) {
          insertedGuests.push(guestRows[0] as Guest);
        }
      }

      return {
        success: true,
        group: {
          id: groupRow.id,
          couple_id: groupRow.couple_id,
          uuid: groupRow.uuid,
          group_name: groupRow.group_name,
          titular_name: groupRow.titular_name,
          attendance: groupRow.attendance,
          message: groupRow.message,
          is_couple: groupRow.is_couple,
          is_guard: groupRow.is_guard,
          kids_count: Number(groupRow.kids_count) || 0,
          guests: insertedGuests
        }
      };
    } catch (err: any) {
      console.error('Error creating invitation in Neon DB:', err);
      return { success: false, error: err.message || 'Error al guardar en base de datos' };
    }
  }

  // Fallback to local JSON
  const rawList = getLocalGuests(coupleSlug);
  if (rawList.some((item: any) => item.uuid === uuid)) {
    return { success: false, error: 'El identificador (UUID) ya está en uso' };
  }

  const newGroupJson: any = {
    uuid,
    group: group_name,
    invitado: titular_name || '',
    asistencia: null,
    mensaje: message,
    novios: is_couple,
    guardia: is_guard,
    kids_count,
  };

  const familia = data.guests.filter(g => g.type === 'familiar').map(g => ({
    invitado: g.name.trim(),
    asistencia: g.attendance ?? null,
    llegada: g.arrived ?? null
  }));

  const acompanantes = data.guests.filter(g => g.type === 'acompanante').map(g => ({
    invitado: g.name.trim(),
    asistencia: g.attendance ?? null,
    llegada: g.arrived ?? null
  }));

  if (familia.length > 0) {
    newGroupJson.familia = familia;
  }
  if (acompanantes.length > 0) {
    newGroupJson.acompanantes = acompanantes;
  }

  rawList.push(newGroupJson);
  saveLocalGuests(coupleSlug, rawList);

  return {
    success: true,
    group: {
      uuid,
      group_name,
      titular_name: titular_name || undefined,
      is_couple,
      is_guard,
      kids_count,
      attendance: null,
      message,
      guests: data.guests.map(g => ({
        name: g.name.trim(),
        type: g.type,
        attendance: g.attendance ?? null,
        arrived: g.arrived ?? null
      }))
    }
  };
}

export async function updateInvitationGroup(
  coupleSlug: string,
  targetUuid: string,
  data: {
    group_name: string;
    titular_name?: string;
    new_uuid?: string;
    is_couple?: boolean;
    is_guard?: boolean;
    kids_count?: number;
    message?: string;
    guests: {
      name: string;
      type: 'principal' | 'acompanante' | 'familiar';
      attendance?: boolean | null;
      arrived?: boolean | null;
    }[];
  }
): Promise<{ success: boolean; group?: InvitationGroup; error?: string }> {
  const couple = await getCoupleBySlug(coupleSlug);
  if (!couple) return { success: false, error: 'Boda no encontrada' };

  const group_name = data.group_name.trim();
  const titular_name = data.titular_name?.trim() || null;
  const is_couple = Boolean(data.is_couple);
  const is_guard = Boolean(data.is_guard);
  const kids_count = data.kids_count !== undefined ? Math.max(0, Number(data.kids_count) || 0) : undefined;
  const message = data.message !== undefined ? data.message : undefined;
  const nextUuid = data.new_uuid && data.new_uuid.trim() !== '' ? data.new_uuid.trim().toLowerCase() : targetUuid;

  if (sql) {
    try {
      const groupRows = await sql`
        SELECT g.id 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug} AND g.uuid = ${targetUuid}
        LIMIT 1
      `;

      if (!groupRows || groupRows.length === 0) {
        return { success: false, error: 'Invitación no encontrada' };
      }

      const groupId = groupRows[0].id;

      // Check if new UUID conflicts with another group
      if (nextUuid !== targetUuid) {
        const conflict = await sql`
          SELECT id FROM invitation_groups 
          WHERE couple_id = ${couple.id} AND uuid = ${nextUuid} AND id != ${groupId} 
          LIMIT 1
        `;
        if (conflict && conflict.length > 0) {
          return { success: false, error: 'El nuevo UUID ya está en uso' };
        }
      }

      await sql`
        UPDATE invitation_groups
        SET 
          group_name = ${group_name},
          titular_name = ${titular_name},
          uuid = ${nextUuid},
          is_couple = ${is_couple},
          is_guard = ${is_guard},
          kids_count = COALESCE(${kids_count}, kids_count),
          message = COALESCE(${message}, message),
          updated_at = NOW()
        WHERE id = ${groupId}
      `;

      // Replace guests: delete old guests and insert current ones
      await sql`DELETE FROM guests WHERE group_id = ${groupId}`;

      const insertedGuests: Guest[] = [];
      for (const g of data.guests) {
        if (!g.name || g.name.trim() === '') continue;
        const guestRows = await sql`
          INSERT INTO guests (group_id, name, type, attendance, arrived)
          VALUES (${groupId}, ${g.name.trim()}, ${g.type || 'familiar'}, ${g.attendance ?? null}, ${g.arrived ?? null})
          RETURNING *
        `;
        if (guestRows && guestRows.length > 0) {
          insertedGuests.push(guestRows[0] as Guest);
        }
      }

      return {
        success: true,
        group: {
          id: groupId,
          couple_id: couple.id,
          uuid: nextUuid,
          group_name,
          titular_name: titular_name || undefined,
          attendance: null,
          is_couple,
          is_guard,
          kids_count: kids_count ?? 0,
          guests: insertedGuests
        }
      };
    } catch (err: any) {
      console.error('Error updating invitation in Neon DB:', err);
      return { success: false, error: err.message || 'Error al actualizar invitación' };
    }
  }

  // Fallback to local JSON
  const rawList = getLocalGuests(coupleSlug);
  const index = rawList.findIndex((item: any) => item.uuid === targetUuid);
  if (index === -1) {
    return { success: false, error: 'Invitación no encontrada' };
  }

  const updatedJson: any = {
    ...rawList[index],
    uuid: nextUuid,
    group: group_name,
    invitado: titular_name || '',
    novios: is_couple,
    guardia: is_guard,
  };

  if (kids_count !== undefined) {
    updatedJson.kids_count = kids_count;
  }

  if (message !== undefined) {
    updatedJson.mensaje = message;
  }

  const familia = data.guests.filter(g => g.type === 'familiar').map(g => ({
    invitado: g.name.trim(),
    asistencia: g.attendance ?? null,
    llegada: g.arrived ?? null
  }));

  const acompanantes = data.guests.filter(g => g.type === 'acompanante').map(g => ({
    invitado: g.name.trim(),
    asistencia: g.attendance ?? null,
    llegada: g.arrived ?? null
  }));

  delete updatedJson.familia;
  delete updatedJson.acompanantes;

  if (familia.length > 0) updatedJson.familia = familia;
  if (acompanantes.length > 0) updatedJson.acompanantes = acompanantes;

  rawList[index] = updatedJson;
  saveLocalGuests(coupleSlug, rawList);

  return {
    success: true,
    group: {
      uuid: nextUuid,
      group_name,
      titular_name: titular_name || undefined,
      attendance: null,
      is_couple,
      is_guard,
      kids_count: kids_count !== undefined ? kids_count : (Number(updatedJson.kids_count) || 0),
      guests: data.guests.map(g => ({
        name: g.name.trim(),
        type: g.type,
        attendance: g.attendance ?? null,
        arrived: g.arrived ?? null
      }))
    }
  };
}

export async function deleteInvitationGroup(
  coupleSlug: string,
  targetUuid: string
): Promise<{ success: boolean; error?: string }> {
  const couple = await getCoupleBySlug(coupleSlug);
  if (!couple) return { success: false, error: 'Boda no encontrada' };

  if (sql) {
    try {
      const groupRows = await sql`
        SELECT g.id 
        FROM invitation_groups g
        JOIN couples c ON g.couple_id = c.id
        WHERE c.slug = ${coupleSlug} AND g.uuid = ${targetUuid}
        LIMIT 1
      `;

      if (!groupRows || groupRows.length === 0) {
        return { success: false, error: 'Invitación no encontrada' };
      }

      const groupId = groupRows[0].id;
      // Cascade delete guests and invitation_group
      await sql`DELETE FROM invitation_groups WHERE id = ${groupId}`;
      return { success: true };
    } catch (err: any) {
      console.error('Error deleting invitation from Neon DB:', err);
      return { success: false, error: err.message || 'Error al eliminar invitación' };
    }
  }

  // Fallback to local JSON
  const rawList = getLocalGuests(coupleSlug);
  const filtered = rawList.filter((item: any) => item.uuid !== targetUuid);
  if (filtered.length === rawList.length) {
    return { success: false, error: 'Invitación no encontrada' };
  }

  saveLocalGuests(coupleSlug, filtered);
  return { success: true };
}
