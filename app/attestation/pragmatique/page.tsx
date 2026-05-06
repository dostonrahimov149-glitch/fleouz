"use client";

import Link from "next/link";

export default function Page() {
  const tests = Array.from({ length: 40 }, (_, i) => i + 1);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <h1 className="text-2xl font-bold mb-6 text-orange-600">
        Pragmatique Tests
      </h1>

      <div className="grid grid-cols-3 gap-4">
        {tests.map((num) => (
          <Link key={num} href={`/attestation/pragmatique/${num}`}>
            <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl text-center cursor-pointer shadow-md hover:scale-105 transition">
              Test {num}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}