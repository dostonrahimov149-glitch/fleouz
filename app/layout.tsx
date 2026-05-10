import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BottomMenu from "../components/BottomMenu";

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
  description:
    "Fransuz tilini zamonaviy o‘rganish platformasi",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (

    <html
      lang="en"
      id="root-html"
      className={`
        ${geistSans.variable}
        ${geistMono.variable}
        h-full
        dark-theme
      `}
    >

      <body
        suppressHydrationWarning
        className="
          min-h-screen
          flex
          flex-col
          antialiased
          transition-all
          duration-300
        "
      >

        {/* 🌍 GLOBAL APP */}
        <main
          className="
            flex-1
            pb-28
            bg-app
            transition-all
            duration-300
          "
        >

          {children}

        </main>

        {/* 🔥 GLOBAL MENU */}
        <BottomMenu />

      </body>

    </html>

  );

}