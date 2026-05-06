"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);

  // 🔥 RESET MODAL
  const [showReset, setShowReset] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  // 🔥 AUTO LOGIN
  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getSession();

    if (data.session) {
      router.push("/dashboard");
    }
  };

  // 🔐 LOGIN
  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email va parolni kiriting ❗");
      return;
    }

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      console.log(error);
      setError(error.message);
    } else {
      router.push("/dashboard");
    }
  };

  // 🔥 RESET PASSWORD
  const handleResetPassword = async () => {
    if (!resetEmail) {
      setError("Email kiriting");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      resetEmail,
      {
        redirectTo: "http://localhost:3000/update-password",
      }
    );

    if (error) {
      setError(error.message);
    } else {
      alert("Parol tiklash linki emailingizga yuborildi ✅");
      setShowReset(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] flex flex-col justify-between p-4 overflow-hidden">

      {/* 🔥 BACKGROUND */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900" />

      {/* 🔝 HEADER */}
      <div className="text-center mt-2">

        {/* LOGO */}
        <div className="flex justify-center mb-0">
          <img
            src="/logo.png"
            alt="FLEOUZ logo"
            className="w-80 h-30 object-contain drop-shadow-xl"
          />
        </div>

        {/* PLATFORM NAME */}
        <h1 className="text-3xl font-extrabold tracking-wide bg-gradient-to-r from-blue-400 via-white to-red-400 bg-clip-text text-transparent drop-shadow-lg">
          FLEOUZ
        </h1>

        {/* SLOGAN */}
        <p className="mt-2 px-4 leading-relaxed">
          <span className="text-sm font-medium bg-gradient-to-r from-blue-300 via-white to-red-300 bg-clip-text text-transparent">
            Real attestatsiya formatida bilimingizni sinab ko‘ring va natijangizni aniq baholang
          </span>
        </p>

      </div>

      {/* 🔥 CENTER */}
      <div className="flex items-center justify-center">

        <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 text-white">

          <h2 className="text-xl font-semibold mb-2">
            Xush kelibsiz 👋
          </h2>

          <p className="text-sm opacity-80 mb-6">
            Hisobingizga kiring va davom eting
          </p>

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 mb-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* PASSWORD */}
          <div className="relative mb-4">
            <input
              type={show ? "text" : "password"}
              placeholder="Parol"
              className="w-full p-3 rounded-xl bg-white/20 placeholder-white/70 outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />

            <span
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 cursor-pointer text-sm opacity-70"
            >
              {show ? "🙈" : "👁"}
            </span>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-bold hover:scale-105 transition disabled:opacity-50"
          >
            {loading ? "Yuklanmoqda..." : "Davom etish →"}
          </button>

          {/* FORGOT PASSWORD */}
          <p
            onClick={() => setShowReset(true)}
            className="text-sm text-blue-300 mt-3 cursor-pointer text-center"
          >
            Parolni unutdingizmi?
          </p>

          {/* LINK */}
          <p className="text-sm mt-4 text-center">
            Hisobingiz yo‘qmi?{" "}
            <span
              onClick={() => router.push("/register")}
              className="underline cursor-pointer"
            >
              Ro‘yxatdan o‘tish
            </span>
          </p>

        </div>
      </div>

      {/* RESET MODAL */}
      {showReset && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

          <div className="bg-white p-6 rounded-3xl w-full max-w-sm">

            <h2 className="text-xl font-bold mb-4 text-black">
              Parolni tiklash
            </h2>

            <input
              type="email"
              placeholder="Email kiriting"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
              className="w-full p-3 border rounded-xl mb-4 text-black"
            />

            <button
              onClick={handleResetPassword}
              className="w-full p-3 bg-blue-500 text-white rounded-xl"
            >
              Kod yuborish
            </button>

            <button
              onClick={() => setShowReset(false)}
              className="w-full mt-3 p-3 bg-gray-200 rounded-xl text-black"
            >
              Bekor qilish
            </button>

          </div>
        </div>
      )}

      {/* 🔻 FOOTER */}
      <div className="text-center text-white/60 text-xs mb-3">
        Powered by <span className="font-semibold">FLEOUZ</span>
      </div>

    </div>
  );
}