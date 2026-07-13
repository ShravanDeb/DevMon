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

  console.log("=== All profiles ===");
  const r = await client.query(
    `SELECT id, user_id, username, card->'verification'->>'cardId' as "cardId", card->'verification'->>'edition' as "edition", left(card->>'flavorText', 80) as "flavorText", card->>'rarity' as "rarity" FROM profiles`
  );
  for (const row of r.rows) {
    console.log(`  id=${row.id} user_id=${row.user_id} username=${row.username}`);
    console.log(`    cardId=${row.cardId ?? "NULL"} edition=${row.edition ?? "NULL"} rarity=${row.rarity ?? "NULL"}`);
    console.log(`    flavorText=${row.flavorText ?? "NULL"}`);
  }
  if (r.rows.length === 0) console.log("  (empty)");

  console.log("\n=== Editions ===");
  const e = await client.query("SELECT * FROM editions");
  for (const row of e.rows) console.log(`  card_id=${row.card_id} edition=${row.edition}`);
  if (e.rows.length === 0) console.log("  (empty)");

  await client.end();
}

main();
