"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, TrendingUp, AlertCircle, PackageCheck } from "lucide-react";

export function InventoryRecs({ sizingDemand, returnsByCategory }: { sizingDemand: any[]; returnsByCategory: any[] }) {
  const topReturnSize = [...sizingDemand].sort((a, b) => (b.returns / Math.max(1, b.demand)) - (a.returns / Math.max(1, a.demand)))[0];
  const topDemand = [...sizingDemand].sort((a, b) => b.demand - a.demand)[0];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Lightbulb aria-hidden="true" className="h-4 w-4 text-[var(--color-warning)]" /> Inventory Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex gap-3 border-t py-4 first:border-t-0">
            <TrendingUp aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-success)]" />
            <div>
              <div className="font-semibold">Stock deeper: Size {topDemand?.size} — highest demand ({topDemand?.demand}) with moderate returns</div>
              <div className="text-muted-foreground mt-1">Review the next purchase order against demand and return ratio before increasing depth.</div>
            </div>
          </div>
          <div className="flex gap-3 border-t py-4">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-warning)]" />
            <div>
              <div className="font-semibold">Re-grade: Size {topReturnSize?.size} — highest return ratio</div>
              <div className="text-muted-foreground mt-1">
                {topReturnSize?.returns} returns on {topReturnSize?.demand} purchases. Review garment measurements, fabric stretch, and size-chart copy before re-grading.
              </div>
            </div>
          </div>
          <div className="flex gap-3 border-t py-4">
            <PackageCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-semibold">Prevent deadstock — bundle slow movers with try-on incentive</div>
              <div className="text-muted-foreground mt-1">Push “Try first, free return avoided” badge on outerwear & XL — currently low velocity.</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2 tnum">
            <Badge variant="outline">{topReturnSize?.returns ?? 0} return cases in selected data</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {returnsByCategory.map((c) => (
            <div key={c.category} className="flex items-center justify-between border-t py-3 first:border-t-0 tnum">
              <span className="capitalize font-medium">{c.category.replace("_", " ")}</span>
              <span className="text-xs text-muted-foreground">{c.returns} returns · {c.total} sales · {((c.returns / Math.max(1, c.total)) * 100).toFixed(1)}%</span>
            </div>
          ))}
          {returnsByCategory.length === 0 && <p className="text-sm text-muted-foreground">No category data yet.</p>}
          <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => alert("Export CSV: would query Supabase analytics_events and generate report.")}>
            Export report (CSV)
          </Button>
          <div className="text-[11px] text-muted-foreground pt-2">
            Backbone impact: fewer RTO shipments → lower logistics share of GDP, less packaging waste.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
