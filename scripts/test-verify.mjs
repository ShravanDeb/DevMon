import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const admin = createClient(supabaseUrl, serviceKey);

async function test() {
  // Query with the production cardId from curl
  const cardId = "DM-ARLUSY";
  const { data: allProfiles, error: queryError } = await admin
    .from("profiles")
    .select("id, username, display_name, avatar_url, card, updated_at");

  console.log("Query error:", queryError?.message ?? "none");
  console.log("Total profiles:", allProfiles?.length ?? 0);

  for (const p of allProfiles ?? []) {
    const c = p.card;
    const v = c?.verification;
    console.log(`  id=${p.id} user_id=${p.user_id} cardId=${v?.cardId ?? "NULL"} typeof=${typeof c}`);
  }

  // Also try a simple eq lookup by id
  console.log("\n=== eq by id ===");
  const r = await admin.from("profiles").select("id, username, card").eq("id", "ShravanDeb").maybeSingle();
  console.log("Result:", JSON.stringify(r.data ?? null));
  console.log("Error:", r.error?.message ?? "none");
}

test();
