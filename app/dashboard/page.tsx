"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();

  const [winner, setWinner] = useState<any>(null);

  // 🔒 AUTH PROTECTION
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.replace("/login");
      }
    };

    checkSession();
  }, [router]);

  // 🏆 GET REAL WINNER
  useEffect(() => {
    const getWinner = async () => {

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("xp", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.log(error);
      }

      if (data) {
        setWinner(data);
      }
    };

    getWinner();

    // ⚡ REALTIME UPDATE
    const channel = supabase
      .channel("ranking-live")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
        },
        () => {
          getWinner();
        }
      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  const c1Words = [
    {
      word: "s’avérer",
      meaning: "ma’lum bo‘lmoq",
      example: "Cette solution s’avère efficace.",
    },
    {
      word: "mettre en œuvre",
      meaning: "amalga oshirmoq",
      example: "Le gouvernement met en œuvre une réforme.",
    },
    {
      word: "un enjeu",
      meaning: "muhim masala",
      example: "C’est un enjeu majeur pour l’avenir.",
    },
    {
      word: "une démarche",
      meaning: "yondashuv",
      example: "Sa démarche est très structurée.",
    },
    {
      word: "néanmoins",
      meaning: "shunga qaramay",
      example: "Il est fatigué, néanmoins il continue.",
    },
    {
      word: "dans la mesure où",
      meaning: "chunki",
      example:
        "Dans la mesure où c’est important, il faut agir.",
    },
    {
      word: "globalement",
      meaning: "umumiy olganda",
      example: "Globalement, les résultats sont bons.",
    },
    {
      word: "notamment",
      meaning: "ayniqsa",
      example:
        "Il aime les langues, notamment le français.",
    },
    {
      word: "aller de soi",
      meaning: "o‘z-o‘zidan tushunarli",
      example: "Cela va de soi.",
    },
    {
      word: "à cet égard",
      meaning: "shu jihatdan",
      example: "À cet égard, il faut réfléchir.",
    },
  ];

  const today = Math.floor(
    Date.now() / (1000 * 60 * 60 * 24)
  );

  const currentWord = today % c1Words.length;

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen relative overflow-hidden pb-32">

      {/* 🔥 GLOBAL BACKGROUND */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500 via-white to-blue-100" />

      {/* glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 blur-[120px] opacity-30 rounded-full" />

      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-300 blur-[120px] opacity-30 rounded-full" />

      {/* 🔵 bottom glow */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-200/70 to-transparent blur-[40px] -z-10" />

      {/* 🔝 TOP */}
      <div className="flex justify-between items-center p-4">

        <h1 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 to-red-600 bg-clip-text text-transparent">
          FLEOUZ
        </h1>

        <button
          onClick={logout}
          className="text-sm bg-gradient-to-r from-orange-400 to-red-400 text-white px-4 py-2 rounded-xl shadow-md"
        >
          Chiqish
        </button>

      </div>

      {/* 🏆 WINNER */}
      {winner && (
        <div
          className="
            mx-4 mb-6 p-[30px] rounded-3xl
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
            shadow-[0_15px_50px_rgba(139,92,246,0.4)]
          "
        >

          <div className="flex justify-between items-center">

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* AVATAR */}
              <div
                className="
                  w-24 h-24 rounded-full
                  bg-gradient-to-r from-yellow-300 to-orange-400
                  flex items-center justify-center
                  text-4xl font-bold text-white
                  border-4 border-yellow-300
                  shadow-lg
                "
              >
                👑
              </div>

              {/* INFO */}
              <div>

                <p className="text-lg text-white/90">
                  🥇 Hafta g‘olibi
                </p>

                <p className="text-3xl font-extrabold text-white">
                  {user.full_name || user.email?.split("@")[0]}
                </p>

                <p className="text-lg text-yellow-200 font-bold">
                  ⭐ {winner.xp || 0} XP
                </p>

              </div>

            </div>

            {/* TROPHY */}
            <motion.img
              src="/trophy.png"
              className="w-20"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />

          </div>

        </div>
      )}

      {/* 📘 ATTESTATSIYA */}
      <div className="mx-4">

        <Link href="/attestation">

          <motion.div
            whileTap={{ scale: 0.97 }}
            className="
              p-8 rounded-3xl
              bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
              text-white
              shadow-[0_25px_50px_rgba(139,92,246,0.5)]
              relative overflow-hidden
            "
          >

            <div className="flex items-center justify-between">

              {/* LEFT */}
              <div className="flex items-center gap-4">

                <img
                  src="/attest.png"
                  className="
                    w-20 h-20 object-contain invert
                  "
                />

                <div>

                  <h3 className="text-2xl font-bold tracking-wide">
                    Attestatsiya
                  </h3>

                  <p className="text-lg opacity-90">
                    Real test formatida sinab ko‘ring
                  </p>

                </div>

              </div>

              {/* RIGHT */}
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="text-5xl font-bold"
              >
                →
              </motion.div>

            </div>

          </motion.div>

        </Link>

      </div>

      {/* 🇫🇷 DAILY WORD */}
      <div
        className="
          mx-4 mt-6 p-[20px] rounded-3xl
          bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
          shadow-[0_15px_50px_rgba(139,92,246,0.4)]
        "
      >

        <p className="text-xs text-white">
          🇫🇷 Mot du jour
        </p>

        <h2 className="text-3xl font-bold text-black mt-1">
          {c1Words[currentWord].word}
        </h2>

        <p className="text-lg text-white mt-1">
          {c1Words[currentWord].meaning}
        </p>

        <p className="italic text-white/80 mt-2">
          {c1Words[currentWord].example}
        </p>

      </div>

    </div>
  );
}