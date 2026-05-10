"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function SettingsPage() {

  const [theme, setTheme] = useState("dark");

  const [language, setLanguage] = useState("uz");

  // 🔄 LOAD SETTINGS
  useEffect(() => {

    const savedTheme =
      localStorage.getItem("theme");

    const savedLanguage =
      localStorage.getItem("language");

    const html =
      document.getElementById(
        "root-html"
      );

    // 🌙 THEME
    if (savedTheme) {

      setTheme(savedTheme);

      if (html) {

        // ☀️ LIGHT
        if (savedTheme === "light") {

          html.classList.remove(
            "dark-theme"
          );

          html.classList.add(
            "light-theme"
          );

        }

        // 🌑 DARK
        else {

          html.classList.remove(
            "light-theme"
          );

          html.classList.add(
            "dark-theme"
          );

        }

      }

    }

    // 🌍 LANGUAGE
    if (savedLanguage) {

      setLanguage(savedLanguage);

    }

  }, []);

  // 🌙 CHANGE THEME
  const changeTheme = (
    newTheme: string
  ) => {

    setTheme(newTheme);

    localStorage.setItem(
      "theme",
      newTheme
    );

    const html =
      document.getElementById(
        "root-html"
      );

    if (!html) return;

    // ☀️ LIGHT
    if (newTheme === "light") {

      html.classList.remove(
        "dark-theme"
      );

      html.classList.add(
        "light-theme"
      );

    }

    // 🌑 DARK
    else {

      html.classList.remove(
        "light-theme"
      );

      html.classList.add(
        "dark-theme"
      );

    }

  };

  // 🌍 CHANGE LANGUAGE
  const changeLanguage = (
    newLang: string
  ) => {

    setLanguage(newLang);

    localStorage.setItem(
      "language",
      newLang
    );

    // 🔥 REALTIME UPDATE
    window.dispatchEvent(
      new Event("languageChanged")
    );

  };

  return (

    <div className="
      min-h-screen
      bg-app
      text-white
      p-6
      pb-32
      transition-all
      duration-300
    ">

      {/* ⚙️ TITLE */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >

        <h1 className="text-4xl font-bold mb-2">

          {
            language === "fr"
              ? "⚙️ Paramètres"
              : "⚙️ Sozlamalar"
          }

        </h1>

        <p className="text-white/70">

          {
            language === "fr"
              ? "Personnalisez votre application FLEOUZ"
              : "FLEOUZ ilovasini moslashtiring"
          }

        </p>

      </motion.div>

      {/* 🌙 THEME */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white/10
          backdrop-blur-xl
          rounded-3xl
          p-6
          mb-6
          border
          border-white/10
        "
      >

        <h2 className="text-2xl font-bold mb-4">

          {
            language === "fr"
              ? "🌙 Thème"
              : "🌙 Mavzu"
          }

        </h2>

        <div className="grid grid-cols-2 gap-4">

          {/* 🌑 DARK */}
          <button
            onClick={() =>
              changeTheme("dark")
            }
            className={`
              p-6
              rounded-2xl
              border
              transition-all
              duration-300
              ${
                theme === "dark"
                  ? "bg-blue-500 border-blue-300 scale-105 shadow-2xl"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }
            `}
          >

            <p className="text-5xl mb-4">
              🌑
            </p>

            <p className="font-bold text-2xl">

              {
                language === "fr"
                  ? "Sombre"
                  : "Qorong‘i"
              }

            </p>

          </button>

          {/* ☀️ LIGHT */}
          <button
            onClick={() =>
              changeTheme("light")
            }
            className={`
              p-6
              rounded-2xl
              border
              transition-all
              duration-300
              ${
                theme === "light"
                  ? "bg-yellow-400 text-black border-yellow-200 scale-105 shadow-2xl"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }
            `}
          >

            <p className="text-5xl mb-4">
              ☀️
            </p>

            <p className="font-bold text-2xl">

              {
                language === "fr"
                  ? "Clair"
                  : "Yorug‘"
              }

            </p>

          </button>

        </div>

      </motion.div>

      {/* 🌍 LANGUAGE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="
          bg-white/10
          backdrop-blur-xl
          rounded-3xl
          p-6
          border
          border-white/10
        "
      >

        <h2 className="text-2xl font-bold mb-4">

          {
            language === "fr"
              ? "🌍 Langue"
              : "🌍 Til"
          }

        </h2>

        <div className="grid grid-cols-2 gap-4">

          {/* 🇺🇿 UZ */}
          <button
            onClick={() =>
              changeLanguage("uz")
            }
            className={`
              p-6
              rounded-2xl
              border
              transition-all
              duration-300
              ${
                language === "uz"
                  ? "bg-green-500 border-green-300 scale-105 shadow-2xl"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }
            `}
          >

            <p className="text-5xl mb-4">
              🇺🇿
            </p>

            <p className="font-bold text-2xl">
              UZ
            </p>

            <p className="opacity-80 mt-1">
              O‘zbekcha
            </p>

          </button>

          {/* 🇫🇷 FR */}
          <button
            onClick={() =>
              changeLanguage("fr")
            }
            className={`
              p-6
              rounded-2xl
              border
              transition-all
              duration-300
              ${
                language === "fr"
                  ? "bg-blue-500 border-blue-300 scale-105 shadow-2xl"
                  : "bg-white/10 border-white/10 hover:bg-white/20"
              }
            `}
          >

            <p className="text-5xl mb-4">
              🇫🇷
            </p>

            <p className="font-bold text-2xl">
              FR
            </p>

            <p className="opacity-80 mt-1">
              Français
            </p>

          </button>

        </div>

      </motion.div>

    </div>

  );

}