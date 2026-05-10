"use client";

import ExamEngine from "@/components/ExamEngine";
import { useParams } from "next/navigation";

export default function TestPage() {

  const params = useParams();

  const id = Number(params.id);

  const questions = [
    {
      question: "Que signifie 'rapide' ?",
      options: ["lent", "vite", "petit", "grand"],
      answer: "vite",
    },
    {
      question: "Synonyme de 'maison' ?",
      options: ["voiture", "habitation", "école", "porte"],
      answer: "habitation",
    },
    {
      question: "Antonyme de 'grand' ?",
      options: ["petit", "haut", "long", "large"],
      answer: "petit",
    },
  ];

  return (

    <ExamEngine
      questions={questions}
      testId={`lexique-${id}`}
    />

  );

}