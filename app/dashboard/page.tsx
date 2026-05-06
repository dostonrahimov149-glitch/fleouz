"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const router = useRouter();
  const [winner, setWinner] = useState<any>(null);

  const c1Words = [
    { word: "s’avérer", meaning: "ma’lum bo‘lmoq", example: "Cette solution s’avère efficace." },
    { word: "mettre en œuvre", meaning: "amalga oshirmoq", example: "Le gouvernement met en œuvre une réforme." },
    { word: "un enjeu", meaning: "muhim masala", example: "C’est un enjeu majeur pour l’avenir." },
    { word: "une démarche", meaning: "yondashuv", example: "Sa démarche est très structurée." },
    { word: "néanmoins", meaning: "shunga qaramay", example: "Il est fatigué, néanmoins il continue." },
    { word: "dans la mesure où", meaning: "chunki", example: "Dans la mesure où c’est important, il faut agir." },
    { word: "globalement", meaning: "umumiy olganda", example: "Globalement, les résultats sont bons." },
    { word: "notamment", meaning: "ayniqsa", example: "Il aime les langues, notamment le français." },
    { word: "aller de soi", meaning: "o‘z-o‘zidan tushunarli", example: "Cela va de soi." },
    { word: "à cet égard", meaning: "shu jihatdan", example: "À cet égard, il faut réfléchir." }
  ];

  const today = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  const currentWord = today % c1Words.length;

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  useEffect(() => {
    const users = [
      { name: "Ali", score: 9800, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
      { name: "Dilnoza", score: 12540, avatar: "https://randomuser.me/api/portraits/women/44.jpg" }
    ];
    setWinner(users[Math.floor(Math.random() * users.length)]);
  }, []);

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
        <div className="mx-4 mb-6 p-[30px] rounded-3xl 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
shadow-[0_15px_50px_rgba(139,92,246,0.4)]">

          <div className="flex justify-between items-center">

            <div className="flex items-center gap-4">
              <img src={winner.avatar} className="w-23 h-23 rounded-full border-4 border-yellow-400"/>

              <div>
                <p className="text-1g text-white-500">🥇 Hafta g‘olibi</p>
                <p className="text-lg font-bold">{winner.name}</p>
                <p className="text-1g">⭐ {winner.score}</p>
              </div>
            </div>

            <motion.img
              src="/trophy.png"
              className="w-16"
              animate={{ rotate: [0, 6, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
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

      {/* 🔥 CONTENT */}
      <div className="flex items-center justify-between">

        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">

          <img 
            src="/attest.png" 
            className="
              w-20 h-20 object-contain invert 
              drop-shadow-1g [0_0_10px_rgba(255,255,255,0.7)]
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

        {/* 👉 CTA ARROW */}
        <motion.div
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-5xl font-bold"
        >
          →
        </motion.div>

      </div>

    </motion.div>
  </Link>
</div>

      {/* 🇫🇷 DAILY WORD */}
     <div className="mx-4 mt-6 p-[20px] rounded-3xl 
bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
shadow-[0_15px_50px_rgba(139,92,246,0.4)]">
        <p className="text-xs text-white-500">🇫🇷 Mot du jour</p>

        <h2 className="text-3xl font-bold text-black-600 mt-1">
          {c1Words[currentWord].word}
        </h2>

        <p className="text-1g text-white-600 mt-1">
          {c1Words[currentWord].meaning}
        </p>

        <p className="text-1italic text-white-400 mt-2">
          {c1Words[currentWord].example}
        </p>
      </div>

      {/* 📱 FLOATING MENU */}
      <div className="
        fixed bottom-4 left-4 right-4
        bg-gradient-to-r from-indigo-100/80 via-blue-50/70 to-white/80
        backdrop-blur-2xl
        rounded-2xl
        shadow-[0_10px_40px_rgba(0,0,0,0.2)]
        flex justify-around py-3
      ">

        {[
          { name: "Home", icon: "/home.png", color: "bg-indigo-500" },
          { name: "Testlar", icon: "/result1.png", color: "bg-green-500" },
          { name: "Reyting", icon: "/target.png", color: "bg-orange-500" },
          { name: "Profil", icon: "/profil.png", color: "bg-pink-500" }
        ].map((item, i) => (
          <div key={i} className="flex flex-col items-center text-xs">

            <motion.div
              whileTap={{ scale: 0.85 }}
              className={`${item.color} p-2 rounded-xl text-white shadow-md`}
            >
              <img src={item.icon} className="w-6 h-6"/>
            </motion.div>

            <span className="mt-1 text-gray-700">{item.name}</span>
          </div>
        ))}

      </div>

    </div>
  );
}