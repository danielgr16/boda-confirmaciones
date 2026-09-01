import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { DEFAULT_COUPLES } from '../lib/db';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  console.log('👉 Define DATABASE_URL in .env.local before running migration.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function migrate() {
  console.log('🚀 Starting Data Migration to Neon PostgreSQL...');

  try {
    for (const [slug, couple] of Object.entries(DEFAULT_COUPLES)) {
      console.log(`\n💍 Migrating Couple: ${couple.bride_name} & ${couple.groom_name} (${slug})...`);

      // 1. Upsert Couple
      const coupleRows = await sql`
        INSERT INTO couples (
          slug, groom_name, bride_name, event_date, reception_time,
          ceremony_address, reception_address, ceremony_maps_url, reception_maps_url,
          bible_verse, bible_citation, access_password, rsvp_deadline, config
        ) VALUES (
          ${couple.slug}, ${couple.groom_name}, ${couple.bride_name}, ${couple.event_date}, ${couple.reception_time || null},
          ${couple.ceremony_address || null}, ${couple.reception_address || null}, ${couple.ceremony_maps_url || null}, ${couple.reception_maps_url || null},
          ${couple.bible_verse || null}, ${couple.bible_citation || null}, ${couple.access_password || 'boda2026'}, ${couple.rsvp_deadline || null},
          ${JSON.stringify(couple.config)}::jsonb
        )
        ON CONFLICT (slug) DO UPDATE SET
          groom_name = EXCLUDED.groom_name,
          bride_name = EXCLUDED.bride_name,
          event_date = EXCLUDED.event_date,
          reception_time = EXCLUDED.reception_time,
          ceremony_address = EXCLUDED.ceremony_address,
          reception_address = EXCLUDED.reception_address,
          ceremony_maps_url = EXCLUDED.ceremony_maps_url,
          reception_maps_url = EXCLUDED.reception_maps_url,
          bible_verse = EXCLUDED.bible_verse,
          bible_citation = EXCLUDED.bible_citation,
          config = EXCLUDED.config
        RETURNING id;
      `;

      const coupleId = coupleRows[0].id;
      console.log(`✅ Couple ID: ${coupleId}`);

      // 2. Read local JSON data for this couple
      const possibleJsonPaths = [
        path.join(process.cwd(), `storage/app/public/${slug}/invitados.json`),
        path.join(process.cwd(), `storage/app/${slug}/invitados.json`),
        path.join(process.cwd(), `storage/app/${slug}.json`),
        path.join(process.cwd(), 'storage/app/invitados.json')
      ];

      let jsonPath = possibleJsonPaths.find(p => fs.existsSync(p));
      if (!jsonPath) {
        console.log(`⚠️ No local JSON found for ${slug}, skipping guests migration.`);
        continue;
      }

      console.log(`📖 Reading guests from: ${path.relative(process.cwd(), jsonPath)}`);
      const rawData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

      if (!Array.isArray(rawData)) {
        console.log(`⚠️ Invalid JSON format in ${jsonPath}`);
        continue;
      }

      let groupsCount = 0;
      let guestsCount = 0;

      for (const item of rawData) {
        const uuid = item.uuid;
        const groupName = item.group || item.invitado || 'Invitado';
        const titular = item.invitado || item.group || null;
        const attendance = item.asistencia ?? null;
        const message = item.mensaje || '';
        const isCouple = Boolean(item.novios);
        const isGuard = Boolean(item.guardia);

        // Upsert invitation group
        const groupRows = await sql`
          INSERT INTO invitation_groups (
            couple_id, uuid, group_name, titular_name, attendance, message, is_couple, is_guard
          ) VALUES (
            ${coupleId}, ${uuid}, ${groupName}, ${titular}, ${attendance}, ${message}, ${isCouple}, ${isGuard}
          )
          ON CONFLICT (couple_id, uuid) DO UPDATE SET
            group_name = EXCLUDED.group_name,
            titular_name = EXCLUDED.titular_name,
            attendance = EXCLUDED.attendance,
            message = EXCLUDED.message,
            is_couple = EXCLUDED.is_couple,
            is_guard = EXCLUDED.is_guard,
            updated_at = NOW()
          RETURNING id;
        `;

        const groupId = groupRows[0].id;
        groupsCount++;

        // Delete existing guests for clean re-insertion
        await sql`DELETE FROM guests WHERE group_id = ${groupId};`;

        // Extract individual members
        if (Array.isArray(item.familia) && item.familia.length > 0) {
          for (const fam of item.familia) {
            const guestName = fam.invitado || fam.name;
            if (guestName) {
              await sql`
                INSERT INTO guests (group_id, name, type, attendance, arrived)
                VALUES (${groupId}, ${guestName}, 'familiar', ${fam.asistencia ?? null}, ${fam.llegada ?? null});
              `;
              guestsCount++;
            }
          }
        } else {
          if (item.invitado) {
            await sql`
              INSERT INTO guests (group_id, name, type, attendance, arrived)
              VALUES (${groupId}, ${item.invitado}, 'principal', ${item.asistencia ?? null}, ${item.llegada ?? null});
            `;
            guestsCount++;
          }

          if (Array.isArray(item.acompanantes)) {
            for (const acomp of item.acompanantes) {
              const guestName = acomp.invitado || acomp.name;
              if (guestName) {
                await sql`
                  INSERT INTO guests (group_id, name, type, attendance, arrived)
                  VALUES (${groupId}, ${guestName}, 'acompanante', ${acomp.asistencia ?? null}, ${acomp.llegada ?? null});
                `;
                guestsCount++;
              }
            }
          }
        }
      }

      console.log(`✨ Migrated ${groupsCount} invitation groups and ${guestsCount} individual guests for ${slug}.`);
    }

    console.log('\n🎉 ALL DATA MIGRATED SUCCESSFULLY TO NEON POSTGRESQL!\n');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
