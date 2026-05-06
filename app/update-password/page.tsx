"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function UpdatePasswordPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!password) return;

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Parol muvaffaqiyatli yangilandi ✅");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6">

      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl p-6 text-white">

        <h1 className="text-2xl font-bold mb-4">
          Yangi parol
        </h1>

        <input
          type="password"
          placeholder="Yangi parol"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 rounded-xl bg-white/20 outline-none mb-4"
        />

        <button
          onClick={handleUpdatePassword}
          disabled={loading}
          className="w-full p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 font-bold"
        >
          {loading ? "Saqlanmoqda..." : "Parolni yangilash"}
        </button>

      </div>
    </div>
  );
}