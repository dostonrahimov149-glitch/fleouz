import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomMenu from "../components/BottomMenu"; // ✅ TO‘G‘RI

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLEOUZ",
  description: "Fransuz tilini zamonaviy o‘rganish platformasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-screen flex flex-col bg-transparent text-white antialiased">

        {/* CONTENT */}
        <main className="flex-1 pb-28">
          {children}
        </main>

        {/* 🔥 GLOBAL MENU */}
        <BottomMenu />

      </body>
    </html>
  );
}