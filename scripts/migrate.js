const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

async function main() {
  const envContent = fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8');
  const getVar = (name) => {
    const match = envContent.match(new RegExp(`^${name}=(.+)`, 'm'));
    return match ? match[1].replace(/^"|"$/g, '').trim() : null;
  };

  const projectRef = 'mlbtqsqcdumzgyrzisxw';
  const dbPassword = getVar('SUPABASE_DB_PASSWORD');

  if (!dbPassword) {
    console.error('SUPABASE_DB_PASSWORD not found in .env');
    console.error('Add it from: Supabase Dashboard → Settings → Database → Connection string');
    process.exit(1);
  }

  const urls = [
    `postgresql://postgres:${dbPassword}@db.${projectRef}.supabase.co:5432/postgres`,
    `postgresql://postgres.${projectRef}:${dbPassword}@aws-0-us-east-1.pooler.supabase.com:6543/postgres`,
  ];

  let client = null;

  for (const url of urls) {
    const c = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
    try {
      await c.connect();
      console.log(`Connected to ${url.substring(0, 60)}...`);
      client = c;
      break;
    } catch (err) {
      console.log(`  Failed: ${err.message}`);
    }
  }

  if (!client) {
    console.error('\nCould not connect. Reset your database password at:');
    console.error('https://supabase.com/dashboard/project/' + projectRef + '/settings/database');
    process.exit(1);
  }

  const sql = fs.readFileSync(path.join(__dirname, '..', 'supabase', 'full_migration.sql'), 'utf8');
  console.log(`\nRunning migration (${sql.length} chars)...\n`);

  const statements = [];
  let current = '';
  let inDollar = false;

  for (const line of sql.split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('--') && !trimmed.includes('$$')) continue;

    const dollCount = (trimmed.match(/\$\$/g) || []).length;
    if (dollCount % 2 === 1) inDollar = !inDollar;

    current += line + '\n';

    if (trimmed.endsWith(';') && !inDollar) {
      statements.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) statements.push(current.trim());

  for (const stmt of statements) {
    const label = stmt.split('\n')[0].substring(0, 70);
    try {
      await client.query(stmt);
      console.log(`  OK   ${label}`);
    } catch (err) {
      if (err.message.includes('already exists')) {
        console.log(`  SKIP ${label}`);
      } else {
        console.error(`  ERR  ${label}`);
        console.error(`       ${err.message}`);
      }
    }
  }

  await client.end();
  console.log('\nMigration complete!');
}

main();
