"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, LayoutDashboard, Shirt, Menu } from "lucide-react";
import { useState } from "react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/try-on", label: "Try-On", icon: Shirt },
  { href: "/dashboard", label: "Merchant", icon: LayoutDashboard },
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e63946] to-[#d4a574] text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="leading-none">
            <div className="font-display text-lg font-bold tracking-tight">Ariadne</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground -mt-1">FitVision AI</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5",
                  active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {item.icon ? <item.icon className="h-4 w-4" /> : null}
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="hidden lg:inline text-xs text-muted-foreground mr-1">COMPFEST AIC 2026</span>
          <Link href="/try-on">
            <Button variant="thread" size="sm">
              <Sparkles className="h-3.5 w-3.5" /> Start Try-On
            </Button>
          </Link>
        </div>

        <button
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl border"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-4 py-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium",
                pathname === item.href ? "bg-secondary" : "hover:bg-muted"
              )}
            >
              {item.icon ? <item.icon className="h-4 w-4" /> : null}
              {item.label}
            </Link>
          ))}
          <Link href="/try-on" onClick={() => setOpen(false)} className="block pt-2">
            <Button variant="thread" className="w-full">
              Start Try-On
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
