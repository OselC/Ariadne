"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Package, Truck } from "lucide-react";
import { formatCurrencyIDR, formatPercent } from "@/lib/utils";

export function KPIRow({ kpis }: { kpis: any }) {
  const saved = kpis.rtoSavedIDR;
  const uplift = kpis.conversionUplift;
  const before = kpis.returnRateBefore;
  const after = kpis.returnRate;
  const drop = typeof before === "number" ? before - after : null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-12 tnum">
      <Card className="lg:col-span-4">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-80">Return rate → now</div>
            <TrendingDown aria-hidden="true" className="h-4 w-4 opacity-80" />
          </div>
          <div className="mt-2 text-2xl font-bold">{typeof after === "number" ? formatPercent(after) : "—"}</div>
          <div className="text-xs opacity-80">
            {drop === null ? "Live baseline pending" : `was ${formatPercent(before)} · ↓ ${formatPercent(drop)} saved`}
          </div>
          <Badge variant="outline" className="mt-2">
            {typeof kpis.returns === "number" && typeof kpis.purchases === "number" ? `${kpis.returns} returns / ${kpis.purchases} purchases` : "Live counts pending"}
          </Badge>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Package aria-hidden="true" className="h-3.5 w-3.5" /> Try-ons</div>
          <div className="mt-2 text-2xl font-bold">{typeof kpis.tryOns === "number" ? kpis.tryOns : "—"}</div>
          <div className="text-xs text-[var(--color-success)]">
            {typeof uplift === "number" ? `+${uplift}% conversion uplift` : "Conversion benchmark pending"}
          </div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground"><Truck aria-hidden="true" className="h-3.5 w-3.5" /> RTO saved</div>
          <div className="mt-2 text-xl font-bold">{typeof saved === "number" ? formatCurrencyIDR(saved) : "—"}</div>
          <div className="text-xs text-muted-foreground">{typeof saved === "number" ? "Modelled saving" : "Cost basis pending"}</div>
        </CardContent>
      </Card>
      <Card className="lg:col-span-2">
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Fit risk split</div>
          <div className="mt-2 text-sm font-semibold">
            Review low, medium, and high risk before changing purchase controls.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
