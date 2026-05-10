import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    // 🏆 ENG KUCHLI USERNI OLISH
    const {
      data: champion,
      error: championError,
    } = await supabase
      .from("profiles")
      .select("*")
      .order("weekly_xp", {
        ascending: false,
      })
      .limit(1)
      .single();

    if (championError) {

      return NextResponse.json({
        success: false,
        error: championError,
      });

    }

    // 👑 CHAMPIONNI SAQLASH
    const {
      error: insertError,
    } = await supabase
      .from("weekly_champion")
      .insert([
        {
          full_name:
            champion.full_name ||
            champion.email?.split("@")[0],

          email: champion.email,

          weekly_xp:
            champion.weekly_xp || 0,
        },
      ]);

    if (insertError) {

      return NextResponse.json({
        success: false,
        error: insertError,
      });

    }

    // 👥 BARCHA USERLARNI OLISH
    const {
      data: profiles,
      error: fetchError,
    } = await supabase
      .from("profiles")
      .select("id");

    if (fetchError) {

      return NextResponse.json({
        success: false,
        error: fetchError,
      });

    }

    // 🔄 WEEKLY XP RESET
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
        "Weekly champion saved and XP reset successful",
    });

  } catch (err) {

    return NextResponse.json({
      success: false,
      message: "Server error",
    });

  }

}