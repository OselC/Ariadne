"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

export function Progress({ value = 0, className, label }: { value?: number; className?: string; label: string }) {
  const normalized = Math.min(100, Math.max(0, value));

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(normalized)}
      aria-label={label}
      className={cn("h-1.5 w-full overflow-hidden bg-secondary", className)}
    >
      <div
        className="motion-progress h-full origin-left bg-primary transition-transform [transition-duration:var(--dur-long)] [transition-timing-function:var(--ease-out)]"
        style={{ transform: `scaleX(${normalized / 100})` }}
      />
    </div>
  );
}
