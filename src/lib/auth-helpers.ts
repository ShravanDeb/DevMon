import { createClient } from "@/lib/supabase/server";

export async function getSessionUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: { session } } = await supabase.auth.getSession();
  const accessToken = session?.provider_token ?? null;

  return { userId: user.id, accessToken, email: user.email };
}
