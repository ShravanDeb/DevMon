import pg from "pg";

async function main() {
  const client = new pg.Client({
    host: "db.sqnycndqbbychopyzntw.supabase.co",
    port: 5432,
    database: "postgres",
    user: "postgres",
    password: "DfI1k1sh80zUqxCJ",
    ssl: { rejectUnauthorized: false },
  });
  await client.connect();

  // Read current profile
  const r = await client.query(`SELECT id, card->'verification'->>'cardId' as "currentCardId" FROM profiles`);
  console.log("Current cardId:", r.rows[0]?.currentCardId);

  // Update cardId from DM-ARLUSY → DM-GUB6GE
  await client.query(`
    UPDATE profiles
    SET card = jsonb_set(card, '{verification,cardId}', '"DM-GUB6GE"'::jsonb)
    WHERE id = 'ShravanDeb'
  `);

  // Verify
  const r2 = await client.query(`SELECT id, card->'verification'->>'cardId' as "newCardId" FROM profiles`);
  console.log("New cardId:", r2.rows[0]?.newCardId);

  await client.end();
}

main();
