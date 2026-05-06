"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Email va parolni kiriting");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert("Xatolik: " + error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex">

      {/* LEFT */}
      <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-600 text-white p-12 flex-col justify-between">

        <div className="text-2xl font-bold tracking-wide">
          FLEOUZ
        </div>

        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Har kuni 1 qadam — <br /> Fransuz tilida erkinlik sari 🇫🇷
          </h1>

          <p className="mt-4 text-white/70 text-lg">
            O‘rgan, o‘yna va natijani his qil.
          </p>
        </div>

        <div className="text-sm text-white/40">
          © 2026 FLEOUZ platform
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-50 p-6">

        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

          <h2 className="text-3xl font-bold mb-2">
            Xush kelibsiz 👋
          </h2>

          <p className="text-gray-500 mb-6">
            Hisobingizga kiring va davom eting
          </p>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-4 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Parol"
            className="w-full mb-6 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition active:scale-95"
          >
            {loading ? "Kutilmoqda..." : "Davom etish →"}
          </button>

          <p className="text-sm text-gray-500 mt-6 text-center">
            Hisobingiz yo‘qmi?{" "}
            <span
              onClick={() => router.push("/register")}
              className="text-indigo-600 cursor-pointer hover:underline"
            >
              Ro‘yxatdan o‘tish
            </span>
          </p>

        </div>
      </div>
    </div>
  );
}