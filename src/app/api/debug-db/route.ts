import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = getSupabaseAdmin();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "NOT SET";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "NOT SET";
  const keyPrefix = key.slice(0, 12) + "...";

  let profileCount = 0;
  let sampleCardId = "N/A";
  if (admin) {
    const { data } = await admin.from("profiles").select("id, card");
    profileCount = data?.length ?? 0;
    if (data?.[0]?.card) {
      const v = (data[0].card as Record<string, unknown>)?.verification as Record<string, unknown> | undefined;
      sampleCardId = (v?.cardId as string) ?? "N/A";
    }
  }

  return NextResponse.json({
    supabaseUrl: url,
    keyPrefix,
    profileCount,
    sampleCardId,
    nodeEnv: process.env.NODE_ENV ?? "NOT SET",
    vercelEnv: process.env.VERCEL_ENV ?? "NOT SET",
    vercelRegion: process.env.VERCEL_REGION ?? "NOT SET",
    timestamp: new Date().toISOString(),
  });
}
