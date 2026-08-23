"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, Package, Truck } from "lucide-react";
import { formatCurrencyIDR, formatPercent } from "@/lib/utils";

export function KPIRow({ kpis }: { kpis: any }) {
  const saved = kpis.rtoSavedIDR ?? 0;
  const uplift = kpis.conversionUplift ?? 0;
  const before = kpis.returnRateBefore ?? 24.5;
  const after = kpis.returnRate ?? 9.2;
  const drop = before - after;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="text-xs opacity-80">Return rate → now</div>
            <TrendingDown className="h-4 w-4 opacity-80" />
          </div>
          <div className="mt-2 text-2xl font-bold">{formatPercent(after)}</div>
          <div className="text-xs opacity-80">was {formatPercent(before)} · ↓ {formatPercent(drop)} saved</div>
          <Badge variant="secondary" className="mt-2 bg-white/20 text-white border-white/20 hover:bg-white/20">
            {kpis.returns} returns / {kpis.purchases} purchases
          </Badge>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Package className="h-3.5 w-3.5" /> Try-ons</div>
          <div className="mt-2 text-2xl font-bold">{kpis.tryOns}</div>
          <div className="text-xs text-emerald-600">+{uplift}% conversion uplift</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5"><Truck className="h-3.5 w-3.5" /> RTO saved</div>
          <div className="mt-2 text-xl font-bold">{formatCurrencyIDR(saved)}</div>
          <div className="text-xs text-muted-foreground">est. @ Rp 85k / return</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-5">
          <div className="text-xs text-muted-foreground">Fit risk split</div>
          <div className="mt-2 text-sm font-semibold">
            Low dominates — Ariadne filters high-risk purchases.
          </div>
          <div className="mt-2 flex gap-1.5 flex-wrap">
            <Badge variant="success">Low strong</Badge>
            <Badge variant="warning">Medium watch</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
