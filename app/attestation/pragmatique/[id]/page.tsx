"use client";

import ExamEngine from "@/components/ExamEngine";
import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  const id = Number(params.id);

  const questions = [
    {
      question: "Tu peux fermer la fenêtre, s’il te plaît ?",
      options: [
        "Une demande polie",
        "Une interdiction",
        "Une menace",
        "Une information",
      ],
      answer: "Une demande polie",
    },
    {
      question: "Je suis désolé.",
      options: [
        "Excuse",
        "Demande",
        "Ordre",
        "Question",
      ],
      answer: "Excuse",
    },
    {
      question: "Tu dois finir ce travail !",
      options: [
        "Une suggestion",
        "Une obligation",
        "Une question",
        "Une excuse",
      ],
      answer: "Une obligation",
    },
  ];

  return <ExamEngine questions={questions} />;
}