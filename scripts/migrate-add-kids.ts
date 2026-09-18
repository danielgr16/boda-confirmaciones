import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL environment variable is not defined.');
  process.exit(1);
}

const sql = neon(databaseUrl);

async function main() {
  console.log('🚀 Adding kids_count column to invitation_groups in Neon DB...');

  try {
    await sql`
      ALTER TABLE invitation_groups
      ADD COLUMN IF NOT EXISTS kids_count INTEGER DEFAULT 0;
    `;
    console.log('✅ Column "kids_count" added/verified in "invitation_groups".');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

main();
