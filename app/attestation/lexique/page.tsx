"use client";

import Link from "next/link";

export default function Page() {
  const tests = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lexique Tests</h1>

      <div className="grid grid-cols-3 gap-4">
        {tests.map((num) => (
          <Link key={num} href={`/attestation/lexique/${num}`}>
            <div className="p-4 bg-green-500 text-white rounded-xl text-center">
              Test {num}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}