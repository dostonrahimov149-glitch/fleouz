"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

type Question = {
  question: string;
  options: string[];
  answer: string;
};

export default function ExamEngine({
  questions,
  premiumLimit = 5,
  testId,
}: {
  questions: Question[];
  premiumLimit?: number;
  testId: string;
}) {

  const [current, setCurrent] = useState(0);

  const [answers, setAnswers] = useState<{
    [key: number]: string;
  }>({});

  const [time, setTime] = useState(1800);

  const [finished, setFinished] =
    useState(false);

  const language =
    typeof window !== "undefined"
      ? localStorage.getItem("language") || "uz"
      : "uz";

  const text = {
    uz: {
      result: "Natija",
      retry: "Qayta urinish",
      dashboard: "Bosh sahifa",
      ranking: "Reyting",
      premium:
        "🔒 Premium ochish kerak",
      finish: "Tugatish",
      congrats: "Tabriklaymiz!",
    },

    fr: {
      result: "Résultat",
      retry: "Réessayer",
      dashboard: "Accueil",
      ranking: "Classement",
      premium:
        "🔒 Premium requis",
      finish: "Terminer",
      congrats: "Félicitations !",
    },
  };

  const t =
    language === "fr"
      ? text.fr
      : text.uz;

  const isPremiumLocked =
    current >= premiumLimit;

  // ⏱ TIMER
  useEffect(() => {

    if (time > 0 && !finished) {

      const t = setTimeout(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearTimeout(t);

    }

    else if (time === 0) {

      handleFinish();

    }

  }, [time, finished]);

  // ✅ SELECT
  const handleSelect = (opt: string) => {

    if (isPremiumLocked) return;

    setAnswers({
      ...answers,
      [current]: opt,
    });

  };

  // 📊 SCORE
  const score = questions.filter(
    (q, i) =>
      answers[i] === q.answer
  ).length;

  const percent = Math.round(
    (score / questions.length) * 100
  );

  // 🎓 LEVEL
  let level = "A1";

  if (percent >= 90) level = "C1";
  else if (percent >= 75)
    level = "B2";
  else if (percent >= 60)
    level = "B1";
  else if (percent >= 40)
    level = "A2";

  // ⏰ TIMER
  const minutes = Math.floor(
    time / 60
  );

  const seconds = time % 60;

  // 🚀 FINISH
  const handleFinish = async () => {

    try {

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {

        setFinished(true);
        return;

      }

      const { data: profile } =
        await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

      const today =
        new Date()
          .toISOString()
          .split("T")[0];

      // 🆕 PROFILE
      if (!profile) {

        await supabase
          .from("profiles")
          .insert([
            {
              id: user.id,
              email: user.email,

              xp: percent,

              weekly_xp: percent,

              tests_completed: 1,

              average_score: percent,

              completed_tests: [testId],

              streak: 1,

              last_study_date:
                today,
            },
          ]);

      }

      // 🔄 UPDATE
      else {

        const completedTests =
          profile.completed_tests || [];

        const alreadyCompleted =
          completedTests.includes(
            testId
          );

        const oldXP =
          profile.xp || 0;

        const oldWeeklyXP =
          profile.weekly_xp || 0;

        const oldTests =
          profile.tests_completed ||
          0;

        const oldAverage =
          profile.average_score ||
          0;

        // 🔥 STREAK
        let newStreak =
          profile.streak || 0;

        const lastStudyDate =
          profile.last_study_date;

        if (!lastStudyDate) {

          newStreak = 1;

        }

        else {

          const lastDate =
            new Date(
              lastStudyDate
            );

          const currentDate =
            new Date(today);

          const diffDays =
            Math.floor(
              (
                currentDate.getTime() -
                lastDate.getTime()
              ) /
                (1000 *
                  60 *
                  60 *
                  24)
            );

          if (diffDays === 1) {

            newStreak += 1;

          }

          else if (diffDays > 1) {

            newStreak = 1;

          }

        }

        const newTests =
          alreadyCompleted
            ? oldTests
            : oldTests + 1;

        const newAverage =
          alreadyCompleted
            ? oldAverage
            : Math.round(
                (
                  oldAverage *
                    oldTests +
                  percent
                ) / newTests
              );

        const newXP =
          alreadyCompleted
            ? oldXP
            : oldXP + percent;

        const newWeeklyXP =
          alreadyCompleted
            ? oldWeeklyXP
            : oldWeeklyXP +
              percent;

        const updatedCompleted =
          alreadyCompleted
            ? completedTests
            : [
                ...completedTests,
                testId,
              ];

        await supabase
          .from("profiles")
          .update({

            xp: newXP,

            weekly_xp:
              newWeeklyXP,

            tests_completed:
              newTests,

            average_score:
              newAverage,

            completed_tests:
              updatedCompleted,

            streak: newStreak,

            last_study_date:
              today,
          })
          .eq("id", user.id);

      }

    } catch (err) {

      console.log(err);

    }

    setFinished(true);

  };

  // 🎉 RESULT PAGE
  if (finished) {

    return (

      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white p-6">

        {/* HEADER */}
        <div className="text-center mb-10">

          <motion.h1
            initial={{
              scale: 0.5,
              opacity: 0,
            }}
            animate={{
              scale: 1,
              opacity: 1,
            }}
            className="text-5xl font-extrabold mb-4"
          >
            🎉 {t.result}
          </motion.h1>

          <p className="text-zinc-400">
            {t.congrats}
          </p>

        </div>

        {/* SCORE */}
        <motion.div
          initial={{
            y: 30,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          className="max-w-xl mx-auto bg-white/10 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl mb-10"
        >

          <div className="text-6xl font-extrabold text-blue-400 mb-4">
            {percent}%
          </div>

          <div className="text-2xl font-bold mb-3">
            {score} / {questions.length}
          </div>

          <div className="text-4xl font-bold text-purple-400 mb-6">
            {level}
          </div>

          <div className="flex justify-center gap-4 flex-wrap">

            <div className="bg-blue-500/20 border border-blue-400 px-5 py-3 rounded-2xl">
              ⚡ +{percent} XP
            </div>

            <div className="bg-orange-500/20 border border-orange-400 px-5 py-3 rounded-2xl">
              🔥 +1 Streak
            </div>

          </div>

        </motion.div>

        {/* BUTTONS */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">

          <button
            onClick={() => {

              setAnswers({});
              setCurrent(0);
              setTime(1800);
              setFinished(false);

            }}
            className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition font-bold"
          >
            {t.retry}
          </button>

          <button
            onClick={() => {
              window.location.href =
                "/dashboard";
            }}
            className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition font-bold"
          >
            {t.dashboard}
          </button>

          <button
            onClick={() => {
              window.location.href =
                "/ranking";
            }}
            className="px-6 py-3 rounded-2xl bg-pink-500 hover:bg-pink-600 transition font-bold"
          >
            {t.ranking}
          </button>

        </div>

        {/* ANSWERS */}
        <div className="space-y-6 max-w-3xl mx-auto">

          {questions.map((q, i) => {

            const userAnswer =
              answers[i];

            const correct =
              q.answer;

            return (

              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="p-6 bg-white/10 border border-white/10 rounded-3xl backdrop-blur-xl"
              >

                <p className="font-bold text-xl mb-4">
                  {i + 1}.{" "}
                  {q.question}
                </p>

                <div className="space-y-2">

                  {q.options.map(
                    (opt, idx) => (

                      <div
                        key={idx}
                        className={`p-3 rounded-xl
                        ${
                          opt ===
                          correct
                            ? "bg-green-500"
                            : opt ===
                              userAnswer
                            ? "bg-red-500"
                            : "bg-white/5"
                        }`}
                      >
                        {opt}
                      </div>

                    )
                  )}

                </div>

              </motion.div>

            );

          })}

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">

      {/* SIDEBAR */}
      <div className="w-20 bg-black/30 flex flex-col items-center py-4 space-y-2">

        {questions.map((_, i) => (

          <div
            key={i}
            onClick={() =>
              setCurrent(i)
            }
            className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer
            ${
              current === i
                ? "bg-blue-500"
                : answers[i]
                ? "bg-green-500"
                : "bg-white/20"
            }`}
          >
            {i + 1}
          </div>

        ))}

      </div>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* TOP */}
        <div className="flex justify-between p-4 bg-white/10">

          <span>
            ⏱ {minutes}:
            {seconds < 10
              ? "0"
              : ""}
            {seconds}
          </span>

          <span>
            {current + 1} /{" "}
            {questions.length}
          </span>

        </div>

        {/* PROGRESS */}
        <div className="h-1 bg-white/10">

          <div
            className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"
            style={{
              width: `${
                ((current + 1) /
                  questions.length) *
                100
              }%`,
            }}
          />

        </div>

        {/* QUESTION */}
        <div className="flex-1 flex items-center justify-center p-6">

          <div className="max-w-xl w-full">

            {isPremiumLocked && (

              <div className="bg-yellow-500 text-black p-4 rounded-xl mb-4 text-center">
                {t.premium}
              </div>

            )}

            <motion.h2
              key={current}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="text-3xl font-bold mb-8 text-center"
            >
              {
                questions[current]
                  .question
              }
            </motion.h2>

            <div className="space-y-4">

              {questions[
                current
              ].options.map(
                (opt, i) => {

                  const selected =
                    answers[
                      current
                    ] === opt;

                  return (

                    <motion.div
                      key={i}
                      whileTap={{
                        scale: 0.97,
                      }}
                      onClick={() =>
                        handleSelect(
                          opt
                        )
                      }
                      className={`p-4 rounded-2xl cursor-pointer transition border
                      ${
                        selected
                          ? "bg-blue-500 scale-105 shadow-2xl"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                    >
                      {opt}
                    </motion.div>

                  );

                }
              )}

            </div>

            {/* NAV */}
            <div className="flex justify-between mt-10">

              <button
                onClick={() =>
                  setCurrent(
                    Math.max(
                      current - 1,
                      0
                    )
                  )
                }
                className="px-5 py-3 bg-white/20 rounded-2xl"
              >
                ←
              </button>

              {current ===
              questions.length -
                1 ? (

                <button
                  onClick={
                    handleFinish
                  }
                  className="px-8 py-3 bg-green-500 rounded-2xl font-bold"
                >
                  {t.finish}
                </button>

              ) : (

                <button
                  onClick={() =>
                    setCurrent(
                      current + 1
                    )
                  }
                  className="px-8 py-3 bg-blue-500 rounded-2xl font-bold"
                >
                  →
                </button>

              )}

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}