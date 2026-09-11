import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  console.log('👉 Define DATABASE_URL in .env.local before running migration.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function runMigration() {
  console.log('🚀 Running migration: Add ceremony_place and reception_place columns to "couples"...');

  try {
    // 1. Add ceremony_place column
    await sql`
      ALTER TABLE couples 
      ADD COLUMN IF NOT EXISTS ceremony_place VARCHAR(200);
    `;
    console.log('✅ Column "ceremony_place" added or verified successfully.');

    // 2. Add reception_place column
    await sql`
      ALTER TABLE couples 
      ADD COLUMN IF NOT EXISTS reception_place VARCHAR(200);
    `;
    console.log('✅ Column "reception_place" added or verified successfully.');

    console.log('🎉 Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
