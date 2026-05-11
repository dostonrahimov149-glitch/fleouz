"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {

  const router = useRouter();

  const [winner, setWinner] =
    useState<any>(null);

  const [dailyDuel, setDailyDuel] =
    useState<any>(null);

  const [language, setLanguage] =
    useState("uz");

  // 🌍 LANGUAGE
  useEffect(() => {

    const savedLanguage =
      localStorage.getItem("language");

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }

    const handleLanguage =
      () => {

        const lang =
          localStorage.getItem("language");

        if (lang) {
          setLanguage(lang);
        }

      };

    window.addEventListener(
      "languageChanged",
      handleLanguage
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguage
      );

    };

  }, []);

  // 🔒 AUTH
  useEffect(() => {

    const checkSession =
      async () => {

        const {
          data: { session },
        } =
          await supabase.auth.getSession();

        if (!session) {
          router.replace("/login");
        }

      };

    checkSession();

  }, [router]);

  // 🏆 WEEKLY CHAMPION
  useEffect(() => {

    const getChampion =
      async () => {

        const { data } =
          await supabase
            .from("weekly_champion")
            .select("*")
            .order("created_at", {
              ascending: false,
            })
            .limit(1)
            .single();

        if (data) {
          setWinner(data);
        }

      };

    const fetchDailyDuel =
      async () => {

        const { data } =
          await supabase
            .from("daily_duel")
            .select("*")
            .order("created_at", {
              ascending: false,
            })
            .limit(1)
            .single();

        if (data) {
          setDailyDuel(data);
        }

      };

    getChampion();
    fetchDailyDuel();

  }, []);

  // 🚪 LOGOUT
  const logout = async () => {

    await supabase.auth.signOut();

    router.replace("/login");

  };

  return (

    <div className="
      min-h-screen
      relative
      overflow-hidden
      pb-32
      bg-app
    ">

      {/* 🔥 BACKGROUND */}
      <div className="
        absolute inset-0 -z-10
        bg-gradient-to-br
        from-indigo-900
        via-purple-900
        to-blue-900
      " />

      {/* 🔝 TOP */}
      <div className="
        flex justify-between
        items-center
        p-4
      ">

        <h1 className="
          text-xl font-extrabold
          bg-gradient-to-r
          from-blue-500
          to-red-500
          bg-clip-text
          text-transparent
        ">
          FLEOUZ
        </h1>

        <button
          onClick={logout}
          className="
            text-sm
            bg-gradient-to-r
            from-orange-400
            to-red-400
            text-white
            px-4 py-2
            rounded-xl
            shadow-md
          "
        >

          {
            language === "fr"
              ? "Déconnexion"
              : "Chiqish"
          }

        </button>

      </div>

      {/* 🏆 WEEKLY CHAMPION */}
      {winner && (

        <div className="
          mx-4 mb-6
          p-[30px]
          rounded-3xl
          bg-gradient-to-r
          from-indigo-500
          via-purple-500
          to-pink-500
          shadow-[0_15px_50px_rgba(139,92,246,0.4)]
        ">

          <div className="
            flex justify-between
            items-center
          ">

            <div className="
              flex items-center gap-4
            ">

              <div className="
                w-24 h-24 rounded-full
                bg-gradient-to-r
                from-yellow-300
                to-orange-400
                flex items-center
                justify-center
                text-4xl
                border-4
                border-yellow-300
              ">
                👑
              </div>

              <div>

                <p className="
                  text-lg text-white/90
                ">

                  {
                    language === "fr"
                      ? "🏅 Champion de la semaine"
                      : "🏅 Hafta chempioni"
                  }

                </p>

                <p className="
                  text-3xl font-extrabold text-white
                ">

                  {
                    winner.full_name
                    ||
                    winner.email?.split("@")[0]
                  }

                </p>

                <p className="
                  text-lg
                  text-yellow-200
                  font-bold
                ">
                  ⭐ {winner.weekly_xp || 0} XP
                </p>

              </div>

            </div>

            <motion.img
              src="/trophy.png"
              className="w-20"

              animate={{
                rotate: [0, 6, -6, 0]
              }}

              transition={{
                duration: 4,
                repeat: Infinity,
              }}
            />

          </div>

        </div>

      )}

      {/* ⚔️ DAILY DUEL */}
      {
        dailyDuel && (

          <div className="
            mx-4 mb-6
            rounded-[35px]
            p-8
            bg-gradient-to-r
            from-orange-500
            via-pink-500
            to-red-500
            shadow-[0_20px_60px_rgba(255,80,120,0.5)]
          ">

            <div className="
              flex items-center
              justify-between
            ">

              <div>

                <p className="
                  text-white/90
                  text-xl
                  font-bold
                ">
                  ⚔️ Duel du jour
                </p>

                <h1 className="
                  text-white
                  text-4xl
                  font-extrabold
                  mt-3
                ">

                  {dailyDuel.player1_name}

                  <span className="mx-3">
                    🆚
                  </span>

                  {dailyDuel.player2_name}

                </h1>

                <p className="
                  text-white/90
                  text-xl
                  mt-4
                ">

                  {dailyDuel.section}

                  <span className="mx-2">
                    •
                  </span>

                  10 Questions

                </p>

                <p className="
                  text-yellow-300
                  text-lg
                  font-bold
                  mt-3
                ">
                  ⚡ +50 XP BONUS
                </p>

              </div>

              <motion.div

                animate={{
                  scale: [1, 1.15, 1]
                }}

                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}

                className="text-8xl"
              >
                🔥
              </motion.div>

            </div>

          </div>

        )
      }

      {/* 📘 ATTESTATION */}
      <div className="mx-4">

        <Link href="/attestation">

          <motion.div
            whileTap={{
              scale: 0.97
            }}

            className="
              p-8 rounded-3xl
              bg-gradient-to-r
              from-indigo-500
              via-purple-500
              to-pink-500
              text-white
              shadow-[0_25px_50px_rgba(139,92,246,0.5)]
            "
          >

            <div className="
              flex items-center
              justify-between
            ">

              <div className="
                flex items-center gap-4
              ">

                <img
                  src="/attest.png"
                  className="
                    w-20 h-20
                    object-contain
                    invert
                  "
                />

                <div>

                  <h3 className="
                    text-2xl font-bold
                  ">

                    {
                      language === "fr"
                        ? "Attestation"
                        : "Attestatsiya"
                    }

                  </h3>

                  <p className="
                    text-lg opacity-90
                  ">

                    {
                      language === "fr"
                        ? "Essayez au format réel"
                        : "Real test formatida sinab ko‘ring"
                    }

                  </p>

                </div>

              </div>

              <motion.div
                animate={{
                  x: [0, 6, 0]
                }}

                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}

                className="
                  text-5xl font-bold
                "
              >
                →
              </motion.div>

            </div>

          </motion.div>

        </Link>

      </div>

    </div>

  );

}