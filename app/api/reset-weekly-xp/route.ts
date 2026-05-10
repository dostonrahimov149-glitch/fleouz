import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    // barcha userlarni olish
    const { data: profiles, error: fetchError } =
      await supabase
        .from("profiles")
        .select("id");

    if (fetchError) {

      return NextResponse.json({
        success: false,
        error: fetchError,
      });

    }

    // har bir user weekly_xp reset
    for (const profile of profiles) {

      await supabase
        .from("profiles")
        .update({
          weekly_xp: 0,
        })
        .eq("id", profile.id);

    }

    return NextResponse.json({
      success: true,
      message:
        "Weekly XP reset successful",
    });

  } catch (err) {

    return NextResponse.json({
      success: false,
      message: "Server error",
    });

  }

}