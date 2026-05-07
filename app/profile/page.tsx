"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {

      // 🔐 auth user olish
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      // ❌ login qilmagan bo‘lsa
      if (!authUser) {
        router.push("/login");
        return;
      }

      // 📦 profiles tabledan olish
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .maybeSingle();

      if (error) {
        console.log(error);
      }

      // ✅ profile topilgan bo‘lsa
      if (data) {
        setUser(data);
      }

      // ⚠️ profile yo‘q bo‘lsa fallback
      else {
        setUser({
          email: authUser.email,
          xp: 0,
          tests_completed: 0,
          average_score: 0,
        });
      }

      setLoading(false);
    };

    getProfile();
  }, [router]);

  // ⏳ loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white text-2xl">
        Loading...
      </div>
    );
  }

  if (!user) return null;

  // 📊 natija
  const percent = user.average_score || 0;

  // 🎯 level
  let level = "A1";

  if (percent >= 90) level = "C1";
  else if (percent >= 75) level = "B2";
  else if (percent >= 60) level = "B1";
  else if (percent >= 40) level = "A2";

  // 🚪 logout
  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6 pb-28 text-white">

      {/* 👤 PROFILE CARD */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-lg text-center mb-6"
      >

        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-3xl font-bold mb-3">
          {user.email?.[0]?.toUpperCase()}
        </div>

        <h1 className="text-2xl font-bold">
          {user.email?.split("@")[0]}
        </h1>

        <p className="text-sm opacity-70">
          {user.email}
        </p>

      </motion.div>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 gap-4 mb-6">

        {[
          {
            label: "Test",
            value: user.tests_completed || 0,
            color: "from-green-400 to-emerald-500",
          },
          {
            label: "Natija",
            value: percent + "%",
            color: "from-blue-400 to-cyan-500",
          },
          {
            label: "Daraja",
            value: level,
            color: "from-purple-400 to-pink-500",
          },
          {
            label: "XP",
            value: user.xp || 0,
            color: "from-yellow-400 to-orange-500",
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${item.color} p-5 rounded-2xl shadow-lg text-center`}
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
        className="bg-gradient-to-r from-orange-500 to-red-500 p-5 rounded-2xl shadow-lg text-center mb-6"
      >

        <p className="text-xl font-bold">
          🔥 0 kun
        </p>

        <p className="text-sm opacity-80">
          Ketma-ket o‘rganish
        </p>

      </motion.div>

      {/* 📈 PROGRESS */}
      <div className="bg-white/10 backdrop-blur-xl p-4 rounded-2xl mb-6">

        <p className="text-sm mb-2">
          Level progress
        </p>

        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">

          <div
            className="h-3 bg-gradient-to-r from-blue-400 to-purple-500"
            style={{ width: `${percent}%` }}
          />

        </div>

      </div>

      {/* ⚙️ SETTINGS */}
      <div className="space-y-4">

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur cursor-pointer hover:bg-white/20">
          ⚙️ Sozlamalar
        </div>

        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur cursor-pointer hover:bg-white/20">
          🔒 Parolni o‘zgartirish
        </div>

        <div
          onClick={logout}
          className="bg-gradient-to-r from-red-500 to-pink-600 p-4 rounded-2xl text-center cursor-pointer"
        >
          🚪 Chiqish
        </div>

      </div>

    </div>
  );
}