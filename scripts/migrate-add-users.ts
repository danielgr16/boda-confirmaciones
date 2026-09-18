import { neon } from '@neondatabase/serverless';
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

async function migrateUsers() {
  console.log('🚀 Running Users Migration for Neon DB...');

  try {
    // 1. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        couple_id INTEGER REFERENCES couples(id) ON DELETE CASCADE,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(200) NOT NULL,
        role VARCHAR(50) DEFAULT 'couple',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_users_couple ON users(couple_id);`;
    console.log('✅ Users table ready.');

    // 2. Fetch existing couples from database
    const couples = await sql`SELECT id, slug, bride_name, groom_name, access_password FROM couples;`;
    console.log(`Found ${couples.length} couples in DB.`);

    for (const c of couples) {
      const coupleName = `${c.bride_name} & ${c.groom_name}`;
      const defaultPassword = c.access_password || 'boda2026';

      // Insert default couple user with username = slug
      await sql`
        INSERT INTO users (couple_id, username, password, name, role)
        VALUES (${c.id}, ${c.slug}, ${defaultPassword}, ${coupleName}, 'couple')
        ON CONFLICT (username) DO UPDATE SET
          couple_id = EXCLUDED.couple_id,
          name = EXCLUDED.name,
          role = EXCLUDED.role;
      `;
      console.log(`👤 User created/updated for couple: "${c.slug}" (Role: couple)`);

      // Optionally create a guard user
      const guardUsername = `${c.slug}-guard`;
      await sql`
        INSERT INTO users (couple_id, username, password, name, role)
        VALUES (${c.id}, ${guardUsername}, ${defaultPassword}, ${'Recepción / Guardia ' + c.slug}, 'guard')
        ON CONFLICT (username) DO UPDATE SET
          couple_id = EXCLUDED.couple_id,
          name = EXCLUDED.name,
          role = EXCLUDED.role;
      `;
      console.log(`🛡️ User created/updated for guard: "${guardUsername}" (Role: guard)`);
    }

    console.log('\n🎉 Users migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
}

migrateUsers();
