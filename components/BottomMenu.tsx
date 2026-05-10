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

      icon: "/testmenu.png?v=2",

      path: "/attestation",

      color:
        "from-green-500 to-emerald-600",
    },

    {
      name:
        lang === "fr"
          ? "Classement"
          : "Reyting",

      icon: "/result1.png?v=2",

      path: "/ranking",

      color:
        "from-orange-500 to-amber-600",
    },

    {
      name:
        lang === "fr"
          ? "Profil"
          : "Profil",

      icon: "/profil.png?v=2",

      path: "/profile",

      color:
        "from-pink-500 to-rose-600",
    },

  ];

  return (

    <div
      className="
        fixed
        bottom-3
        left-3
        right-3
        bg-white/80
        backdrop-blur-2xl
        rounded-2xl
        border
        border-white/40
        shadow-[0_15px_50px_rgba(59,130,246,0.25)]
        flex
        justify-around
        items-center
        py-3
        z-50
      "
    >

      {menu.map((item, i) => {

        const active =
          pathname.startsWith(item.path);

        return (

          <div
            key={i}

            onClick={() =>
              router.push(item.path)
            }

            className="
              flex
              flex-col
              items-center
              justify-center
              cursor-pointer
              w-[75px]
            "
          >

            {/* 🔥 ICON */}
            <motion.div

              whileTap={{ scale: 0.8 }}

              animate={
                active
                  ? { y: [0, -4, 0] }
                  : {}
              }

              transition={{
                duration: 0.4,
              }}

              className={`
                p-2
                rounded-xl
                transition-all
                duration-300

                ${
                  active
                    ? `bg-gradient-to-r ${item.color}
                    shadow-[0_5px_20px_rgba(0,0,0,0.3)]
                    text-white`
                    : "bg-white/60 hover:bg-white/90"
                }
              `}
            >

              <Image
                src={item.icon}
                alt="menu-icon"
                width={32}
                height={32}
                loading="eager"
                unoptimized
                className="
                  w-8
                  h-auto
                  object-contain
                "
              />

            </motion.div>

            {/* 🔥 TEXT */}
            <span
              className={`
                mt-1
                text-[11px]
                text-center
                leading-tight
                font-semibold
                transition

                ${
                  active
                    ? "text-blue-600"
                    : "text-gray-700"
                }
              `}
            >

              {item.name}

            </span>

          </div>

        );

      })}

    </div>

  );

}