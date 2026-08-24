"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const onDashboard = pathname.startsWith("/dashboard");
  const onTryOn = pathname.startsWith("/try-on");
  const href = onDashboard ? "/try-on" : onTryOn ? "/dashboard" : "/try-on";
  const label = onDashboard ? "Open try-on" : onTryOn ? "Merchant view" : "Begin try-on";

  return (
    <header className="sticky top-0 z-[var(--z-sticky-nav)] w-full border-b bg-background">
      <div className="page-shell flex h-[var(--banner-height)] items-center justify-between">
        <Link
          href="/"
          className="group flex min-h-11 items-center gap-3 whitespace-nowrap focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-px"
        >
          <span className="h-2 w-2 bg-primary" aria-hidden="true" />
          <span className="font-display text-xl font-bold tracking-[-0.025em]">Ariadne</span>
          <span className="hidden border-l pl-3 text-xs text-muted-foreground sm:inline">
            Fit intelligence for online fashion
          </span>
        </Link>
        <Link href={href} className={buttonVariants({ variant: "outline", size: "sm" })}>
          <span className="hidden sm:inline">{label}</span>
          <span className="sm:hidden">Open</span>
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
    </header>
  );
}
