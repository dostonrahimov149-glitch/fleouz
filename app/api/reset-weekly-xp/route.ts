import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {

  try {

    const { error } = await supabase
      .from("profiles")
      .update({
        weekly_xp: 0,
      });

    if (error) {

      return NextResponse.json({
        success: false,
        error,
      });

    }

    return NextResponse.json({
      success: true,
      message: "Weekly XP reset successful",
    });

  } catch (err) {

    return NextResponse.json({
      success: false,
      message: "Server error",
    });

  }

}