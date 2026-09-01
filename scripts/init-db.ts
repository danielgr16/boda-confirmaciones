import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  console.log('👉 Define DATABASE_URL in .env.local (e.g. postgresql://user:pass@ep-xyz.neon.tech/neondb?sslmode=require)');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log('🚀 Initializing PostgreSQL tables in Neon...');

  try {
    // 1. Couples table
    await sql`
      CREATE TABLE IF NOT EXISTS couples (
        id SERIAL PRIMARY KEY,
        slug VARCHAR(100) UNIQUE NOT NULL,
        groom_name VARCHAR(150) NOT NULL,
        bride_name VARCHAR(150) NOT NULL,
        event_date TIMESTAMP WITH TIME ZONE NOT NULL,
        reception_time VARCHAR(50),
        ceremony_address TEXT,
        reception_address TEXT,
        ceremony_maps_url TEXT,
        reception_maps_url TEXT,
        bible_verse TEXT,
        bible_citation VARCHAR(100),
        access_password VARCHAR(100) DEFAULT 'boda2026',
        rsvp_deadline TIMESTAMP WITH TIME ZONE,
        config JSONB DEFAULT '{}'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('✅ Table "couples" created/verified.');

    // 2. Invitation groups table
    await sql`
      CREATE TABLE IF NOT EXISTS invitation_groups (
        id SERIAL PRIMARY KEY,
        couple_id INTEGER REFERENCES couples(id) ON DELETE CASCADE,
        uuid VARCHAR(100) NOT NULL,
        group_name VARCHAR(200) NOT NULL,
        titular_name VARCHAR(200),
        attendance BOOLEAN DEFAULT NULL,
        message TEXT,
        is_couple BOOLEAN DEFAULT FALSE,
        is_guard BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        UNIQUE(couple_id, uuid)
      );
    `;
    console.log('✅ Table "invitation_groups" created/verified.');

    // 3. Guests table
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES invitation_groups(id) ON DELETE CASCADE,
        name VARCHAR(200) NOT NULL,
        type VARCHAR(50) NOT NULL,
        attendance BOOLEAN DEFAULT NULL,
        arrived BOOLEAN DEFAULT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    console.log('✅ Table "guests" created/verified.');

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_couples_slug ON couples(slug);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_groups_couple_uuid ON invitation_groups(couple_id, uuid);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_group ON guests(group_id);`;

    console.log('🎉 Database initialized successfully in Neon!');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
}

main();
