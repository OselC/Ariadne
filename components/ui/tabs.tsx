"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

const TabsContext = React.createContext<{
  value: string;
  onValueChange: (v: string) => void;
  id: string;
} | null>(null);

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  children,
  className,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
  className?: string;
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "");
  const id = React.useId();
  const current = value ?? internal;
  const set = (v: string) => {
    if (!value) setInternal(v);
    onValueChange?.(v);
  };
  return (
    <TabsContext.Provider value={{ value: current, onValueChange: set, id }}>
      <div className={cn(className)}>{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div role="tablist" className={cn("inline-flex min-h-11 items-end gap-5 border-b text-muted-foreground", className)} {...props} />;
}

export function TabsTrigger({
  value,
  children,
  className,
  onClick,
  onKeyDown,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const ctx = React.useContext(TabsContext)!;
  const active = ctx.value === value;
  return (
    <button
      {...props}
      type="button"
      id={`${ctx.id}-tab-${value}`}
      aria-controls={`${ctx.id}-panel-${value}`}
      tabIndex={active ? 0 : -1}
      onClick={(event) => {
        ctx.onValueChange(value);
        onClick?.(event);
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        const tabs = Array.from(
          event.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? []
        );
        const current = tabs.indexOf(event.currentTarget);
        const next = event.key === "Home"
          ? tabs[0]
          : event.key === "End"
            ? tabs.at(-1)
            : tabs[(current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length];
        event.preventDefault();
        next?.focus();
        next?.click();
      }}
      role="tab"
      aria-selected={active}
      className={cn(
        "inline-flex min-h-11 items-center justify-center whitespace-nowrap border-b-2 border-transparent px-0 text-sm font-semibold transition-[color,transform] hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55",
        active && "border-primary text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(TabsContext)!;
  if (ctx.value !== value) return null;
  return (
    <div
      id={`${ctx.id}-panel-${value}`}
      role="tabpanel"
      aria-labelledby={`${ctx.id}-tab-${value}`}
      tabIndex={0}
      className={cn("mt-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring", className)}
    >
      {children}
    </div>
  );
}
