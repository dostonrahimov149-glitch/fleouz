"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    // 🔐 AUTH REGISTER
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Xatolik yuz berdi ❌");
      return;
    }

    // 👤 PROFILES TABLE CREATE
    if (data.user) {

      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            email: data.user.email,
            xp: 0,
            tests_completed: 0,
            average_score: 0,
          },
        ]);

      if (profileError) {
        console.log(profileError);
      }
    }

    alert("Ro‘yxatdan o‘tildi ✅");

    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-blue-900 p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">

        <h2 className="text-3xl font-bold text-white mb-2">
          Ro‘yxatdan o‘tish ✨
        </h2>

        <p className="text-white/70 mb-6">
          FLEOUZ platformasiga xush kelibsiz
        </p>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder:text-white/50 outline-none mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parol"
          className="w-full p-4 rounded-2xl bg-white/20 text-white placeholder:text-white/50 outline-none mb-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg hover:scale-[1.02] transition"
        >
          Ro‘yxatdan o‘tish 🚀
        </button>

        <p className="text-center text-white/60 text-sm mt-6">
          Hisobingiz bormi?{" "}
          <span
            onClick={() => router.push("/login")}
            className="text-white font-semibold cursor-pointer hover:underline"
          >
            Kirish
          </span>
        </p>

      </div>
    </div>
  );
}