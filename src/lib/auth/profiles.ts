import type { SupabaseClient, User } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

export async function ensureUserProfile(
  supabase: SupabaseClient<Database>,
  user: User,
) {
  const fullName = user.user_metadata.full_name;

  await supabase.from("profiles").upsert({
    id: user.id,
    email: user.email ?? "",
    full_name: typeof fullName === "string" ? fullName : null,
  });
}
