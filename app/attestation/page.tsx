"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function AttestationHome() {
  const router = useRouter();
  const pathname = usePathname();

  const folders = [
    { name: "Grammaire", path: "/attestation/grammar", icon: "📘", color: "from-blue-500 to-indigo-600" },
    { name: "Lexique", path: "/attestation/lexique", icon: "📖", color: "from-green-500 to-emerald-600" },
    { name: "Compréhension", path: "/attestation/comprehension", icon: "📚", color: "from-purple-500 to-pink-600" },
    { name: "Pragmatique", path: "/attestation/pragmatique", icon: "💬", color: "from-orange-500 to-red-500" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef4ff] via-[#f7f9ff] to-[#eef4ff] pb-28">

      {/* 🔝 TITLE */}
      <div className="text-center pt-10 pb-6">
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Attestatsiya bo‘limlari
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Bo‘limni tanlang va testni boshlang 🚀
        </p>
      </div>

      {/* 📚 GRID */}
      <div className="px-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

        {folders.map((item, i) => (
          <Link key={i} href={item.path}>
            <motion.div
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.03 }}
              className={`
                p-6 rounded-3xl 
                bg-gradient-to-br ${item.color}
                text-white
                shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                relative overflow-hidden
              `}
            >

              {/* ICON + TITLE */}
              <div className="flex items-center justify-between">

                <div className="flex items-center gap-4">

                  <div className="text-3xl">
                    {item.icon}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold">
                      {item.name}
                    </h2>

                    <p className="text-sm opacity-90">
                      40 ta test mavjud
                    </p>
                  </div>

                </div>

                {/* 👉 ARROW */}
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-3xl font-bold"
                >
                  →
                </motion.div>

              </div>

            </motion.div>
          </Link>
        ))}

      </div>

      {/* 📱 FLOATING MENU */}
      <div className="
        fixed bottom-4 left-4 right-4
        bg-gradient-to-r from-indigo-100/80 via-blue-100/80 to-purple-100/80
        backdrop-blur-2xl
        rounded-2xl
        border border-white/40
        shadow-[0_20px_60px_rgba(59,130,246,0.25)]
        flex justify-around py-3 z-50
      ">

        {[
          { name: "Home", icon: "/home.png", path: "/dashboard" },
          { name: "Testlar", icon: "/result1.png", path: "/tests" },
          { name: "Reyting", icon: "/target.png", path: "/ranking" },
          { name: "Profil", icon: "/profil.png", path: "/profile" },
        ].map((item, i) => {
          const active = pathname === item.path;

          return (
            <div
              key={i}
              onClick={() => router.push(item.path)}
              className="flex flex-col items-center text-xs cursor-pointer"
            >
              <motion.div
                whileTap={{ scale: 0.8 }}
                className={`
                  p-2 rounded-xl transition
                  ${active 
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg" 
                    : "hover:bg-white/60"
                  }
                `}
              >
                <img src={item.icon} className="w-6 h-6" />
              </motion.div>

              <span className={`mt-1 font-semibold ${active ? "text-blue-600" : "text-gray-600"}`}>
                {item.name}
              </span>
            </div>
          );
        })}

      </div>

    </div>
  );
}