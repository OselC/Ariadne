"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Moon, Sun } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const onDashboard = pathname.startsWith("/dashboard");
  const onTryOn = pathname.startsWith("/try-on");
  const href = onDashboard ? "/try-on" : onTryOn ? "/dashboard" : "/try-on";
  const label = onDashboard ? "Open try-on" : onTryOn ? "Merchant view" : "Begin try-on";
  const mobileLabel = onTryOn ? "Dashboard" : "Try on";

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setDark(root.classList.contains("dark"));
    const followSystem = () => {
      if (!localStorage.getItem("ariadne-theme")) root.classList.toggle("dark", media.matches);
      sync();
    };
    sync();
    media.addEventListener("change", followSystem);
    return () => media.removeEventListener("change", followSystem);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("ariadne-theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <header className="pointer-events-none fixed inset-x-0 top-4 z-[var(--z-sticky-nav)]">
      <nav
        aria-label="Primary"
        className="pointer-events-auto mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 rounded-[var(--radius-pill)] border bg-background/90 p-2 leading-none shadow-[var(--shadow-card)] backdrop-blur-md"
      >
        <Link
          href="/"
          className="flex min-h-10 items-center gap-2 whitespace-nowrap rounded-[var(--radius-pill)] px-3 transition-[background-color,transform] [transition-duration:var(--dur-micro)] [transition-timing-function:var(--ease-out)] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"
        >
          <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          <span className="font-display text-base font-bold tracking-[-0.03em]">Ariadne</span>
        </Link>
        <Link href={href} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">{mobileLabel}</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
        <button
          type="button"
          aria-label="Toggle color theme"
          onClick={toggleTheme}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-input bg-background transition-[background-color,color,transform] [transition-duration:var(--dur-micro)] [transition-timing-function:var(--ease-out)] hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px"
        >
          <Sun aria-hidden="true" className="hidden h-4 w-4 dark:block" />
          <Moon aria-hidden="true" className="h-4 w-4 dark:hidden" />
        </button>
      </nav>
    </header>
  );
}
