"use client";

import ExamEngine from "@/components/ExamEngine";
import { useParams } from "next/navigation";

export default function TestPage() {
  const params = useParams();
  const id = Number(params.id);

  const questions = [
    {
      question: "Je ___ au marché.",
      options: ["vais", "va", "allez", "vas"],
      answer: "vais",
    },
    {
      question: "Nous ___ contents.",
      options: ["sommes", "est", "sont", "êtes"],
      answer: "sommes",
    },
    {
      question: "Il ___ à l'école.",
      options: ["vais", "vas", "va", "allons"],
      answer: "va",
    },
  ];

  return <ExamEngine questions={questions} />;
}