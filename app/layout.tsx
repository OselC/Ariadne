import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const themeScript = `(function(){try{var saved=localStorage.getItem("ariadne-theme");var dark=saved==="dark"||(saved!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",dark)}catch(e){}})()`;

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
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
    "Hugging Face",
    "Qwen2-VL",
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
    <html lang="en" className={manrope.variable} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-20 sm:pt-24">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
