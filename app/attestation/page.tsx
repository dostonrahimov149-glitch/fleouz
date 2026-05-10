"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AttestationHome() {

  const [lang, setLang] = useState("uz");

  // 🌍 LANGUAGE
  useEffect(() => {

    const savedLang =
      localStorage.getItem("language") || "uz";

    setLang(savedLang);

    const handleLanguage = () => {

      const newLang =
        localStorage.getItem("language") || "uz";

      setLang(newLang);

    };

    window.addEventListener(
      "languageChanged",
      handleLanguage
    );

    return () => {

      window.removeEventListener(
        "languageChanged",
        handleLanguage
      );

    };

  }, []);

  // 🌍 TRANSLATIONS
  const t =
    lang === "fr"
      ? {
          title:
            "Sections d’attestation",

          subtitle:
            "Choisissez une section et commencez le test 🚀",

          tests:
            "40 tests disponibles",
        }
      : {
          title:
            "Attestatsiya bo‘limlari",

          subtitle:
            "Bo‘limni tanlang va testni boshlang 🚀",

          tests:
            "40 ta test mavjud",
        };

  const folders = [

    {
      name: "Grammaire",
      path: "/attestation/grammar",
      icon: "📘",
      color:
        "from-blue-500 to-indigo-600",
    },

    {
      name: "Lexique",
      path: "/attestation/lexique",
      icon: "📖",
      color:
        "from-green-500 to-emerald-600",
    },

    {
      name: "Compréhension",
      path: "/attestation/comprehension",
      icon: "📚",
      color:
        "from-purple-500 to-pink-600",
    },

    {
      name: "Pragmatique",
      path: "/attestation/pragmatique",
      icon: "💬",
      color:
        "from-orange-500 to-red-500",
    },

  ];

  return (

    <div className="
      bg-app
      min-h-screen
      pb-28
      transition-all
      duration-300
    ">

      {/* 🔝 TITLE */}
      <div className="
        text-center
        pt-10
        pb-6
      ">

        <h1 className="
          text-3xl
          font-extrabold
          bg-gradient-to-r
          from-blue-600
          to-purple-600
          bg-clip-text
          text-transparent
        ">

          {t.title}

        </h1>

        <p className="
          text-sm
          text-gray-500
          mt-2
        ">

          {t.subtitle}

        </p>

      </div>

      {/* 📚 GRID */}
      <div className="
        px-6
        grid
        grid-cols-1
        sm:grid-cols-2
        gap-5
      ">

        {folders.map((item, i) => (

          <Link
            key={i}
            href={item.path}
          >

            <motion.div

              whileTap={{
                scale: 0.97,
              }}

              whileHover={{
                scale: 1.03,
              }}

              className={`
                p-6
                rounded-3xl
                bg-gradient-to-br
                ${item.color}
                text-white
                shadow-[0_15px_40px_rgba(0,0,0,0.25)]
                relative
                overflow-hidden
              `}
            >

              {/* ICON + TITLE */}
              <div className="
                flex
                items-center
                justify-between
              ">

                <div className="
                  flex
                  items-center
                  gap-4
                ">

                  <div className="
                    text-3xl
                  ">

                    {item.icon}

                  </div>

                  <div>

                    <h2 className="
                      text-xl
                      font-bold
                    ">

                      {item.name}

                    </h2>

                    <p className="
                      text-sm
                      opacity-90
                    ">

                      {t.tests}

                    </p>

                  </div>

                </div>

                {/* 👉 ARROW */}
                <motion.div

                  animate={{
                    x: [0, 6, 0],
                  }}

                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}

                  className="
                    text-3xl
                    font-bold
                  "
                >

                  →

                </motion.div>

              </div>

            </motion.div>

          </Link>

        ))}

      </div>

    </div>

  );

}