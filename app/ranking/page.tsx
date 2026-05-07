"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";

export default function RankingPage() {

  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getRanking = async () => {

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("xp", { ascending: false });

      if (error) {
        console.log(error);
      }

      if (data) {
        setUsers(data);
      }

      setLoading(false);
    };

    getRanking();

  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 p-6 pb-32 text-white">

      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-8 text-center">
        🏆 Reyting
      </h1>

      {/* TOP USERS */}
      <div className="space-y-4">

        {users.map((user, index) => (

          <motion.div
            key={user.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-xl rounded-3xl p-5 flex items-center justify-between"
          >

            {/* LEFT */}
            <div className="flex items-center gap-4">

              {/* POSITION */}
              <div className="text-2xl font-bold w-10">
                #{index + 1}
              </div>

              {/* AVATAR */}
              <div className="w-14 h-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                {user.email?.[0]?.toUpperCase()}
              </div>

              {/* INFO */}
              <div>
                <p className="font-bold text-lg">
                  {user.email?.split("@")[0]}
                </p>

                <p className="text-sm opacity-70">
                  {user.tests_completed || 0} ta test
                </p>
              </div>

            </div>

            {/* RIGHT */}
            <div className="text-right">

              <p className="text-2xl font-bold text-yellow-300">
                {user.xp || 0} XP
              </p>

              <p className="text-sm opacity-70">
                {user.average_score || 0}% natija
              </p>

            </div>

          </motion.div>

        ))}

      </div>

    </div>
  );
}