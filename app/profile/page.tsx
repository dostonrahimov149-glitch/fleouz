"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { translations } from "@/lib/translations";

export default function ProfilePage() {

  const router = useRouter();

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  // 🌍 LANGUAGE
  const lang =
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "uz"
      : "uz";

  const t =
    translations[
      lang as keyof typeof translations
    ];

  useEffect(() => {

    const getProfile = async () => {

      // 🔐 AUTH USER
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      // ❌ LOGIN YO‘Q
      if (!authUser) {

        router.push("/login");

        return;

      }

      // 📦 PROFILE
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) {

        console.log(error);

      }

      // ✅ PROFILE TOPILDI
      if (data) {

        setUser(data);

      }

      // ⚠️ FALLBACK
      else {

        setUser({
          email: authUser.email,
          xp: 0,
          tests_completed: 0,
          average_score: 0,
          streak: 0,
        });

      }

      setLoading(false);

    };

    getProfile();

  }, [router]);

  // ⏳ LOADING
  if (loading) {

    return (

      <div className="min-h-screen bg-app flex items-center justify-center text-2xl">
        Loading...
      </div>

    );

  }

  if (!user) return null;

  // 📊 RESULT
  const percent =
    user.average_score || 0;

  // 🎯 LEVEL
  let level = "A1";

  if (percent >= 90) level = "C1";
  else if (percent >= 75) level = "B2";
  else if (percent >= 60) level = "B1";
  else if (percent >= 40) level = "A2";

  // 🚪 LOGOUT
  const logout = async () => {

    await supabase.auth.signOut();

    router.push("/login");

  };

  return (

    <div className="min-h-screen bg-app p-6 pb-28">

      {/* 👤 PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white/10
          backdrop-blur-xl
          p-6
          rounded-3xl
          shadow-lg
          text-center
          mb-6
        "
      >

        {/* 👤 AVATAR */}
        <div className="
          w-20
          h-20
          mx-auto
          rounded-full
          bg-gradient-to-r
          from-pink-500
          to-purple-500
          flex
          items-center
          justify-center
          text-3xl
          font-bold
          mb-3
        ">
          {user.full_name?.[0]?.toUpperCase() ||
            user.email?.[0]?.toUpperCase()}
        </div>

        {/* 👤 NAME */}
        <h1 className="text-2xl font-bold">

          {user.full_name ||
            user.email?.split("@")[0]}

        </h1>

        {/* 📧 EMAIL */}
        <p className="text-sm opacity-70">
          {user.email}
        </p>

      </motion.div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {[
          {
            label: t.tests,
            value:
              user.tests_completed || 0,
            color:
              "from-green-400 to-emerald-500",
          },
          {
            label: t.resultat,
            value: percent + "%",
            color:
              "from-blue-400 to-cyan-500",
          },
          {
            label: t.niveau,
            value: level,
            color:
              "from-purple-400 to-pink-500",
          },
          {
            label: "XP",
            value: user.xp || 0,
            color:
              "from-yellow-400 to-orange-500",
          },
        ].map((item, i) => (

          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`
              bg-gradient-to-br
              ${item.color}
              p-5
              rounded-2xl
              shadow-lg
              text-center
            `}
          >

            <p className="text-2xl font-bold">
              {item.value}
            </p>

            <p className="text-sm opacity-80">
              {item.label}
            </p>

          </motion.div>

        ))}

      </div>

      {/* 🔥 STREAK */}
      <motion.div
        whileHover={{ scale: 1.02 }}
        className="
          bg-gradient-to-r
          from-orange-500
          to-red-500
          p-5
          rounded-2xl
          shadow-lg
          text-center
          mb-6
        "
      >

        <p className="text-xl font-bold">
          🔥 {user.streak || 0}
        </p>

        <p className="text-sm opacity-80">
          {t.serie}
        </p>

      </motion.div>

      {/* 📈 PROGRESS */}
      <div className="
        bg-white/10
        backdrop-blur-xl
        p-4
        rounded-2xl
        mb-6
      ">

        <p className="text-sm mb-2">
          {t.niveau}
        </p>

        <div className="
          w-full
          h-3
          bg-white/20
          rounded-full
          overflow-hidden
        ">

          <div
            className="
              h-3
              bg-gradient-to-r
              from-blue-400
              to-purple-500
            "
            style={{
              width: `${percent}%`,
            }}
          />

        </div>

      </div>

      {/* ⚙️ SETTINGS */}
      <div className="space-y-4">

        {/* ⚙️ SETTINGS */}
        <div
          onClick={() =>
            router.push("/settings")
          }
          className="
            bg-white/10
            p-4
            rounded-2xl
            backdrop-blur
            cursor-pointer
            hover:bg-white/20
            transition-all
          "
        >
          ⚙️ {t.parametres}
        </div>

        {/* 🔒 PASSWORD */}
        <div
          className="
            bg-white/10
            p-4
            rounded-2xl
            backdrop-blur
            cursor-pointer
            hover:bg-white/20
            transition-all
          "
        >
          🔒 {t.motdepasse}
        </div>

        {/* 🚪 LOGOUT */}
        <div
          onClick={logout}
          className="
            bg-gradient-to-r
            from-red-500
            to-pink-600
            p-4
            rounded-2xl
            text-center
            cursor-pointer
            hover:scale-[1.02]
            transition-all
          "
        >
          🚪 {t.deconnexion}
        </div>

      </div>

    </div>

  );

}