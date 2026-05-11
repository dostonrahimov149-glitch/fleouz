import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    // 🏆 TOP WEEKLY USER
    const {
      data: topUser,
      error: topError,
    } = await supabase
      .from("profiles")
      .select("*")
      .order("weekly_xp", {
        ascending: false,
      })
      .limit(1)
      .single();

    if (topError || !topUser) {

      return NextResponse.json({
        success: false,
        error: "Champion topilmadi",
      });

    }

    // 🗑 DELETE OLD CHAMPION
    await supabase
      .from("weekly_champion")
      .delete()
      .neq("id", 0);

    // 👑 SAVE NEW CHAMPION
    await supabase
      .from("weekly_champion")
      .insert({

        full_name:
          topUser.full_name,

        email:
          topUser.email,

        weekly_xp:
          topUser.weekly_xp,

      });

    // 👥 GET ALL USERS
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

    // 🔄 RESET WEEKLY XP
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

      champion:
        topUser.full_name,

      xp:
        topUser.weekly_xp,

      message:
        "Weekly champion updated successfully",

    });

  } catch (err) {

    return NextResponse.json({

      success: false,

      message:
        "Server error",

    });

  }

}