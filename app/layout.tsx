import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Ariadne — The digital thread to your perfect fit.",
    template: "%s | Ariadne",
  },
  description:
    "Smart Commerce and return-prevention ecosystem combining real-time body and fabric analysis with virtual try-on. Built for COMPFEST AIC — AI for the Backbone of the Economy.",
  keywords: [
    "virtual try-on",
    "VTON",
    "fit prediction",
    "fashion AI",
    "return prevention",
    "smart commerce",
    "Indonesian MSME",
    "MediaPipe Pose",
    "Body measurement",
    "IDM-VTON",
  ],
  authors: [{ name: "Ariadne Team" }],
  openGraph: {
    title: "Ariadne — Guiding you through the fashion labyrinth.",
    description:
      "Eliminate size guesswork with live-camera AI. Real-time body analysis + photorealistic try-on.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
