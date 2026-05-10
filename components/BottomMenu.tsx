"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { translations } from "@/lib/translations";

export default function BottomMenu() {

  const router = useRouter();

  const pathname = usePathname();

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  const [lang, setLang] = useState("uz");

  // 🌍 LANGUAGE
  useEffect(() => {

    const updateLanguage = () => {

      const savedLang =
        localStorage.getItem("language") || "uz";

      setLang(savedLang);

    };

    updateLanguage();

    window.addEventListener(
      "storage",
      updateLanguage
    );

    window.addEventListener(
      "languageChanged",
      updateLanguage as EventListener
    );

    return () => {

      window.removeEventListener(
        "storage",
        updateLanguage
      );

      window.removeEventListener(
        "languageChanged",
        updateLanguage as EventListener
      );

    };

  }, []);

  const t =
    translations[
      lang as keyof typeof translations
    ];

  // 🔐 AUTH
  useEffect(() => {

    checkUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {

        setUser(session?.user || null);

      }
    );

    return () =>
      subscription.unsubscribe();

  }, []);

  const checkUser = async () => {

    const { data } =
      await supabase.auth.getUser();

    if (data.user) {

      setUser(data.user);

    }

    setLoading(false);

  };

  // ❌ TEST PAGE
  const hideTestMenu =
    pathname.includes("/attestation/")
    &&
    pathname.split("/").length > 3;

  // ❌ HIDDEN
  const hiddenPages = [
    "/login",
    "/register",
    "/update-password",
  ];

  if (loading) return null;

  if (!user) return null;

  if (hideTestMenu) return null;

  if (hiddenPages.includes(pathname))
    return null;

  // 📦 MENU
  const menu = [

    {
      name:
        lang === "fr"
          ? "Accueil"
          : "Asosiy",

      icon: "/home.png",

      path: "/dashboard",

      color:
        "from-indigo-500 to-purple-600",
    },

    {
      name:
        lang === "fr"
          ? "Tests"
          : "Testlar",

      icon: "/result1.png",

      path: "/attestation",

      color:
        "from-green-500 to-emerald-600",
    },

    {
      name:
        lang === "fr"
          ? "Classement"
          : "Reyting",

      icon: "/target.png",

      path: "/ranking",

      color:
        "from-orange-500 to-amber-600",
    },

    {
      name:
        lang === "fr"
          ? "Profil"
          : "Profil",

      icon: "/profil.png",

      path: "/profile",

      color:
        "from-pink-500 to-rose-600",
    },

  ];

  return (

    <div
      className="
        fixed
        bottom-4
        left-1/2
        -translate-x-1/2
        w-[95%]
        max-w-md
        bg-white/10
        backdrop-blur-2xl
        border
        border-white/20
        rounded-3xl
        px-2
        py-3
        flex
        justify-around
        items-center
        z-50
        shadow-[0_10px_40px_rgba(0,0,0,0.35)]
      "
    >

      {menu.map((item, i) => {

        const active =
          pathname.startsWith(item.path);

        return (

          <motion.div
            key={i}

            whileTap={{ scale: 0.9 }}

            onClick={() =>
              router.push(item.path)
            }

            className="
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              relative
              w-[70px]
            "
          >

            {/* ACTIVE BG */}
            {active && (

              <motion.div

                layoutId="active-pill"

                className={`
                  absolute
                  inset-0
                  rounded-2xl
                  bg-gradient-to-r
                  ${item.color}
                  opacity-90
                `}
              />

            )}

            {/* ICON */}
            <div
              className="
                relative
                z-10
                p-2
              "
            >

              <Image
                src={item.icon}
                alt="menu-icon"
                width={24}
                height={24}
                className="
                  w-6
                  h-6
                  object-contain
                "
              />

            </div>

            {/* TEXT */}
            <span
              className={`
                relative
                z-10
                text-[11px]
                font-semibold
                mt-1
                transition-all

                ${
                  active
                    ? "text-white"
                    : "text-white/70"
                }
              `}
            >

              {item.name}

            </span>

          </motion.div>

        );

      })}

    </div>

  );

}