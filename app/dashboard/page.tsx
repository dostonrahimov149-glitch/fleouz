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

  // 🏆 WEEKLY WINNER
  useEffect(() => {

    const getWinner =
      async () => {

        const { data, error } =
          await supabase
            .from("profiles")
            .select("*")
            .order("weekly_xp", {
              ascending: false,
            })
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

    // ⚡ REALTIME
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

  // 🇫🇷 DAILY WORDS
  const c1Words = [

    {
      word: "s’avérer",

      meaning:
        language === "fr"
          ? "se révéler"
          : "ma’lum bo‘lmoq",

      example:
        "Cette solution s’avère efficace.",
    },

    {
      word: "mettre en œuvre",

      meaning:
        language === "fr"
          ? "appliquer"
          : "amalga oshirmoq",

      example:
        "Le gouvernement met en œuvre une réforme.",
    },

    {
      word: "une démarche",

      meaning:
        language === "fr"
          ? "approche"
          : "yondashuv",

      example:
        "Sa démarche est très structurée.",
    },

  ];

  const today = Math.floor(
    Date.now() /
      (1000 * 60 * 60 * 24)
  );

  const currentWord =
    today % c1Words.length;

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

      {/* 🏆 WINNER */}
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

            {/* LEFT */}
            <div className="
              flex items-center gap-4
            ">

              {/* 👑 */}
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

              {/* INFO */}
              <div>

                <p className="
                  text-lg text-white/90
                ">

                  {
                    language === "fr"
                      ? "🏅 Champion de la semaine"
                      : "🏅 Hafta g‘olibi"
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

            {/* 🏆 */}
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

              {/* LEFT */}
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

              {/* 👉 */}
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

      {/* 🇫🇷 WORD */}
      <div className="
        mx-4 mt-6
        p-[20px]
        rounded-3xl
        bg-gradient-to-r
        from-indigo-500
        via-purple-500
        to-pink-500
      ">

        <p className="
          text-xs text-white
        ">

          {
            language === "fr"
              ? "🇫🇷 Mot du jour"
              : "🇫🇷 Kun so‘zi"
          }

        </p>

        <h2 className="
          text-3xl
          font-bold
          text-black
          mt-1
        ">

          {
            c1Words[currentWord].word
          }

        </h2>

        <p className="
          text-lg text-white mt-1
        ">

          {
            c1Words[currentWord].meaning
          }

        </p>

        <p className="
          italic text-white/80 mt-2
        ">

          {
            c1Words[currentWord].example
          }

        </p>

      </div>

    </div>

  );

}