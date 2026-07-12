const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const getVar = (name) => {
    const match = envContent.match(new RegExp(`^${name}=(.+)`, 'm'));
    return match ? match[1].replace(/^"|"$/g, '').trim() : null;
  };

  const projectRef = 'sqnycndqbbychopyzntw';
  const serviceKey = getVar('SUPABASE_SERVICE_ROLE_KEY');

  // Supabase pooler connection (Transaction mode)
  // Format: postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
  // Or direct: postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
  //
  // We need the DATABASE PASSWORD from Supabase Dashboard → Settings → Database
  const dbPassword = getVar('SUPABASE_DB_PASSWORD') || getVar('DATABASE_PASSWORD');

  if (!dbPassword) {
    console.log('');
    console.log('Need your database password.');
    console.log('');
    console.log('Get it from:');
    console.log('  1. Go to https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
    console.log('  2. Copy the password under "Connection string" → "URI"');
    console.log('');
    console.log('Then add this to your .env file:');
    console.log('  SUPABASE_DB_PASSWORD=your_password_here');
    console.log('');
    process.exit(1);
  }

  const connectionString = `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`;

  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'full_migration.sql'), 'utf8');
  console.log(`Running migration (${sql.length} chars)...`);

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  try {
    await client.connect();
    console.log('Connected to database');

    // Split into statements, handling $$ function bodies
    const statements = [];
    let current = '';
    let dollarCount = 0;

    for (const line of sql.split('\n')) {
      const stripped = line.trim();
      if (stripped.startsWith('--') && !stripped.includes('$$')) {
        continue; // skip comments
      }
      const dollarMatches = (stripped.match(/\$\$/g) || []).length;
      dollarCount += dollarMatches;
      current += line + '\n';
      if (stripped.endsWith(';') && dollarCount % 2 === 0) {
        statements.push(current.trim());
        current = '';
        dollarCount = 0;
      }
    }
    if (current.trim()) statements.push(current.trim());

    for (const stmt of statements) {
      const firstLine = stmt.split('\n')[0].substring(0, 70);
      try {
        await client.query(stmt);
        console.log(`  OK  ${firstLine}`);
      } catch (err) {
        if (err.message.includes('already exists')) {
          console.log(`  SKIP ${firstLine}`);
        } else {
          console.error(`  ERR ${firstLine}`);
          console.error(`       ${err.message}`);
        }
      }
    }

    console.log('\nDone!');
  } catch (err) {
    console.error('Connection failed:', err.message);
  } finally {
    await client.end();
  }
}

main();
