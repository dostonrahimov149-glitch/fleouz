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

  const [finished, setFinished] = useState(false);

  const isPremiumLocked = current >= premiumLimit;

  // ⏱ TIMER
  useEffect(() => {

    if (time > 0 && !finished) {

      const t = setTimeout(() => {
        setTime(time - 1);
      }, 1000);

      return () => clearTimeout(t);

    } else if (time === 0) {

      handleFinish();

    }

  }, [time, finished]);

  // ✅ SELECT ANSWER
  const handleSelect = (opt: string) => {

    if (isPremiumLocked) return;

    setAnswers({
      ...answers,
      [current]: opt,
    });

  };

  // 📊 SCORE
  const score = questions.filter(
    (q, i) => answers[i] === q.answer
  ).length;

  const percent = Math.round(
    (score / questions.length) * 100
  );

  // 🎓 LEVEL
  let level = "A1";

  if (percent >= 90) level = "C1";
  else if (percent >= 75) level = "B2";
  else if (percent >= 60) level = "B1";
  else if (percent >= 40) level = "A2";

  // ⏰ TIMER FORMAT
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  // 🚀 FINISH EXAM
  const handleFinish = async () => {

    try {

      // 🔐 AUTH USER
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // ❌ USER YO‘Q
      if (!user) {
        setFinished(true);
        return;
      }

      // 📦 PROFILE
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      // 🆕 PROFILE YO‘Q
      if (!profile) {

        const today =
          new Date().toISOString().split("T")[0];

        const { error: insertError } = await supabase
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

              last_study_date: today,
            },
          ]);

        if (insertError) {
          console.log(insertError);
        }

      } else {

        // 📊 OLD VALUES
        const oldXP =
          profile.xp || 0;

        const oldWeeklyXP =
          profile.weekly_xp || 0;

        const oldTests =
          profile.tests_completed || 0;

        const oldAverage =
          profile.average_score || 0;

        // 🛡 COMPLETED TESTS
        const completedTests =
          profile.completed_tests || [];

        const alreadyCompleted =
          completedTests.includes(testId);

        // 🔥 STREAK SYSTEM
        const today =
          new Date().toISOString().split("T")[0];

        const lastStudyDate =
          profile.last_study_date;

        let newStreak =
          profile.streak || 0;

        // FIRST TIME
        if (!lastStudyDate) {

          newStreak = 1;

        } else {

          const lastDate =
            new Date(lastStudyDate);

          const currentDate =
            new Date(today);

          const diffTime =
            currentDate.getTime() -
            lastDate.getTime();

          const diffDays =
            Math.floor(
              diffTime /
              (1000 * 60 * 60 * 24)
            );

          // NEXT DAY
          if (diffDays === 1) {

            newStreak += 1;

          }

          // SAME DAY
          else if (diffDays === 0) {

            newStreak =
              profile.streak || 0;

          }

          // RESET
          else {

            newStreak = 1;

          }

        }

        // 🆕 TEST COUNT
        const newTests =
          alreadyCompleted
            ? oldTests
            : oldTests + 1;

        // 🆕 AVERAGE
        const newAverage =
          alreadyCompleted
            ? oldAverage
            : Math.round(
                (
                  (oldAverage * oldTests) +
                  percent
                ) / newTests
              );

        // 🆕 XP
        const newXP =
          alreadyCompleted
            ? oldXP
            : oldXP + percent;

        // 🆕 WEEKLY XP
        const newWeeklyXP =
          alreadyCompleted
            ? oldWeeklyXP
            : oldWeeklyXP + percent;

        // 🆕 COMPLETED TESTS
        const updatedCompletedTests =
          alreadyCompleted
            ? completedTests
            : [...completedTests, testId];

        // 🚀 UPDATE
        const { error } = await supabase
          .from("profiles")
          .update({

            xp: newXP,

            weekly_xp: newWeeklyXP,

            tests_completed: newTests,

            average_score: newAverage,

            completed_tests:
              updatedCompletedTests,

            streak: newStreak,

            last_study_date: today,

          })
          .eq("id", user.id);

        if (error) {

          console.log(error);

        } else {

          console.log(
            "PROFILE UPDATED ✅"
          );

        }

      }

    } catch (err) {

      console.log(err);

    }

    // 🎉 RESULT SCREEN
    setFinished(true);

  };

  // 🎉 RESULT PAGE
  if (finished) {

    return (

      <div className="min-h-screen bg-black text-white p-6">

        <h1 className="text-4xl font-bold text-center mb-6">
          🎉 Natija
        </h1>

        <div className="text-center mb-10">

          <p className="text-xl">
            {score} / {questions.length}
          </p>

          <p className="text-lg">
            {percent}%
          </p>

          <p className="text-2xl text-blue-400 mt-2">
            {level}
          </p>

        </div>

        <div className="space-y-4 max-w-2xl mx-auto">

          {questions.map((q, i) => {

            const userAnswer = answers[i];
            const correct = q.answer;

            return (

              <div
                key={i}
                className="p-4 bg-white/10 rounded-xl"
              >

                <p className="font-bold mb-2">
                  {i + 1}. {q.question}
                </p>

                {q.options.map((opt, idx) => (

                  <div
                    key={idx}
                    className={`p-2 rounded mb-1 ${
                      opt === correct
                        ? "bg-green-500"
                        : opt === userAnswer
                        ? "bg-red-500"
                        : "bg-white/5"
                    }`}
                  >
                    {opt}
                  </div>

                ))}

              </div>

            );

          })}

        </div>

      </div>

    );

  }

  return (

    <div className="min-h-screen flex bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">

      {/* 📌 SIDEBAR */}
      <div className="w-20 bg-black/30 flex flex-col items-center py-4 space-y-2">

        {questions.map((_, i) => (

          <div
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl cursor-pointer text-sm
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

      {/* 🧠 MAIN */}
      <div className="flex-1 flex flex-col">

        {/* 🔝 TOP */}
        <div className="flex justify-between p-4 bg-white/10">

          <span>
            ⏱ {minutes}:{seconds < 10 ? "0" : ""}
            {seconds}
          </span>

          <span>
            {current + 1} / {questions.length}
          </span>

        </div>

        {/* 📊 PROGRESS */}
        <div className="h-1 bg-white/10">

          <div
            className="h-1 bg-gradient-to-r from-blue-400 to-purple-500"
            style={{
              width: `${
                ((current + 1) / questions.length) * 100
              }%`,
            }}
          />

        </div>

        {/* ❓ QUESTION */}
        <div className="flex-1 flex items-center justify-center p-6">

          <div className="max-w-xl w-full">

            {isPremiumLocked && (

              <div className="bg-yellow-500 text-black p-4 rounded-xl mb-4 text-center">
                🔒 Premium ochish kerak
              </div>

            )}

            <motion.h2
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-bold mb-6 text-center"
            >
              {questions[current].question}
            </motion.h2>

            <div className="space-y-4">

              {questions[current].options.map((opt, i) => {

                const selected =
                  answers[current] === opt;

                return (

                  <motion.div
                    key={i}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSelect(opt)}
                    className={`p-4 rounded-2xl cursor-pointer transition border
                    ${
                      selected
                        ? "bg-blue-500 scale-105 shadow-xl"
                        : "bg-white/10 hover:bg-white/20"
                    }`}
                  >
                    {opt}
                  </motion.div>

                );

              })}

            </div>

            {/* ➡️ NAV */}
            <div className="flex justify-between mt-8">

              <button
                onClick={() =>
                  setCurrent(
                    Math.max(current - 1, 0)
                  )
                }
                className="px-4 py-2 bg-white/20 rounded-xl"
              >
                ←
              </button>

              {current === questions.length - 1 ? (

                <button
                  onClick={async () => {
                    await handleFinish();
                  }}
                  className="px-6 py-2 bg-green-500 rounded-xl"
                >
                  Finish
                </button>

              ) : (

                <button
                  onClick={() =>
                    setCurrent(current + 1)
                  }
                  className="px-6 py-2 bg-blue-500 rounded-xl"
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