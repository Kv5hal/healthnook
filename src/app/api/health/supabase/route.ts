import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();

  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("published", true);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          service: "supabase",
          check: "published_events_select",
          message:
            "Supabase responded, but the public events query failed. Check the migration and RLS policies.",
          code: error.code,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      service: "supabase",
      check: "published_events_select",
      publishedEventsCount: count ?? 0,
      elapsedMs: Date.now() - startedAt,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        service: "supabase",
        check: "environment_and_client",
        message:
          error instanceof Error
            ? error.message
            : "Unable to create the Supabase client.",
      },
      { status: 500 },
    );
  }
}
