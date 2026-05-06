"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert("Xatolik yuz berdi ❌");
    } else {
      alert("Ro‘yxatdan o‘tildi ✅");
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl">

        <h2 className="text-2xl font-bold mb-4">
          Ro‘yxatdan o‘tish
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Parol"
          className="w-full p-3 border rounded-xl mb-3"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
        >
          Ro‘yxatdan o‘tish
        </button>

      </div>
    </div>
  );
}