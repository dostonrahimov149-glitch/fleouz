"use client";

import ExamEngine from "@/components/ExamEngine";
import { useParams } from "next/navigation";

export default function TestPage() {

  const params = useParams();

  const id = Number(params.id);

  const questions = [
    {
      question: "Marie va au marché. Que fait-elle ?",
      options: [
        "Elle achète des vêtements",
        "Elle fait des courses",
        "Elle travaille",
        "Elle dort",
      ],
      answer: "Elle fait des courses",
    },
    {
      question: "Elle parle avec qui ?",
      options: [
        "Un professeur",
        "Un vendeur",
        "Un médecin",
        "Un ami",
      ],
      answer: "Un vendeur",
    },
  ];

  return (

    <ExamEngine
      questions={questions}
      testId={`reading-${id}`}
    />

  );

}