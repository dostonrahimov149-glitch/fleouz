"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { translations } from "@/lib/translations";

export default function RankingPage() {

  const [users, setUsers] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState("uz");

  // 🌍 LOAD LANGUAGE
  useEffect(() => {

    const savedLang =
      localStorage.getItem("language") || "uz";

    setLang(savedLang);

  }, []);

  const t =
    translations[
      lang as keyof typeof translations
    ];

  // 🔥 GET RANKING
  useEffect(() => {

    const getRanking = async () => {

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("weekly_xp", { ascending: false });

      if (error) {
        console.log(error);
      }

      if (data) {
        setUsers(data);
      }

      setLoading(false);

    };

    getRanking();

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

        async () => {

          const { data } = await supabase
            .from("profiles")
            .select("*")
            .order("weekly_xp", { ascending: false });

          if (data) {
            setUsers(data);
          }

        }

      )

      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, []);

  // ⏳ LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-app flex items-center justify-center text-white">

        Loading...

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-app p-6 pb-32 text-white">

      {/* 🏆 TITLE */}
      <h1 className="text-4xl font-bold mb-2 text-center">

        🏆 {t.champion}

      </h1>

      <p className="text-center text-white/60 mb-8">

        {
          lang === "fr"
            ? "Les meilleurs utilisateurs de la semaine"
            : "Haftaning eng faol foydalanuvchilari"
        }

      </p>

      {/* 👑 USERS */}
      <div className="space-y-4">

        {users.map((user, index) => (

          <motion.div
            key={user.id}

            initial={{ opacity: 0, y: 20 }}

            animate={{ opacity: 1, y: 0 }}

            whileHover={{ scale: 1.02 }}

            className={`
              rounded-3xl
              p-5
              flex
              items-center
              justify-between
              backdrop-blur-xl
              border
              transition-all

              ${index === 0
                ? "bg-yellow-400/20 border-yellow-300 shadow-[0_0_40px_rgba(255,215,0,0.5)]"
                : index === 1
                ? "bg-gray-300/10 border-gray-300/30"
                : index === 2
                ? "bg-orange-400/10 border-orange-300/30"
                : "bg-white/10 border-white/10"}
            `}
          >

            {/* 👈 LEFT */}
            <div className="flex items-center gap-4">

              {/* 🏅 POSITION */}
              <div className="text-3xl w-12 text-center">

                {index === 0 && "👑"}

                {index === 1 && "🥈"}

                {index === 2 && "🥉"}

                {index > 2 && (
                  <span className="font-bold text-white">
                    #{index + 1}
                  </span>
                )}

              </div>

              {/* 👤 AVATAR */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xl font-bold shadow-lg">

                {
                  user.full_name?.[0]?.toUpperCase()
                  ||
                  user.email?.[0]?.toUpperCase()
                }

              </div>

              {/* 📄 INFO */}
              <div>

                <p className="font-bold text-lg">

                  {
                    user.full_name
                    ||
                    user.email?.split("@")[0]
                  }

                </p>

                <p className="text-sm opacity-70">

                  {user.tests_completed || 0} {

                    lang === "fr"
                      ? "tests"
                      : "ta test"

                  }

                </p>

              </div>

            </div>

            {/* 👉 RIGHT */}
            <div className="text-right">

              <p className="text-2xl font-bold text-yellow-300">

                ⚡ {user.weekly_xp || 0} XP

              </p>

              <p className="text-sm opacity-70">

                {user.average_score || 0}% {

                  lang === "fr"
                    ? "résultat"
                    : "natija"

                }

              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </div>

  );

}