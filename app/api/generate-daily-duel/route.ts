import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const sections = [
  "Grammaire",
  "Lexique",
  "Compréhension",
  "Pragmatique",
];

export async function GET() {

  try {

    // 👥 GET USERS
    const { data: users, error } = await supabase
      .from("profiles")
      .select("*");

    if (error || !users || users.length < 2) {

      return NextResponse.json({
        success: false,
        message: "Not enough users",
      });

    }

    // 🎲 RANDOM USERS
    const shuffled = users.sort(
      () => 0.5 - Math.random()
    );

    const player1 = shuffled[0];
    const player2 = shuffled[1];

    // 🎯 RANDOM SECTION
    const section =
      sections[
        Math.floor(
          Math.random() * sections.length
        )
      ];

    // 🗑 DELETE OLD DUEL
    await supabase
      .from("daily_duel")
      .delete()
      .neq("id", 0);

    // ⚔️ INSERT NEW DUEL
    await supabase
      .from("daily_duel")
      .insert({

        player1_name:
          player1.full_name,

        player1_email:
          player1.email,

        player2_name:
          player2.full_name,

        player2_email:
          player2.email,

        section,

      });

    return NextResponse.json({

      success: true,

      duel: `${player1.full_name} vs ${player2.full_name}`,

      section,

    });

  } catch (err) {

    return NextResponse.json({

      success: false,

      message: "Server error",

    });

  }

}