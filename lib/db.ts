import { neon, neonConfig } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import type { Couple, InvitationGroup, Guest } from './types';

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
    ceremony_address: 'Enrique Felix Castro 2569, Humaya, 80020 Culiacán Rosales, Sin.',
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
        cover: '/img/cover.webp',
        album: [
          '/img/album-1.webp',
          '/img/album-2.webp',
          '/img/album-3.webp',
          '/img/album-4.webp'
        ],
        end: '/img/end.webp'
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
    ceremony_address: 'Templo / Iglesia',
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
