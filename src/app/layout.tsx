import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

// Rajdhani is loaded via a plain <link> instead of next/font/google so the
// production build never depends on reaching fonts.googleapis.com at build
// time (some sandboxed / offline CI environments block that request). It
// still loads normally for real visitors in the browser.

export const metadata: Metadata = {
  title: "MARK — HUD Systems",
  description:
    "A scroll-driven reactor HUD demo: generative canvas hero, live diagnostics, and a flight log — no licensed imagery, all systems generated.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
