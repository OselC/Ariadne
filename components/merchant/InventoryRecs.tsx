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
          <CardTitle className="text-base flex items-center gap-2"><Lightbulb className="h-4 w-4 text-amber-500" /> Inventory Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-xl border p-4 flex gap-3">
            <div className="h-9 w-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0"><TrendingUp className="h-4 w-4" /></div>
            <div>
              <div className="font-semibold">Stock deeper: Size {topDemand?.size} — highest demand ({topDemand?.demand}) with moderate returns</div>
              <div className="text-muted-foreground mt-1">Recommended +25% PO vs last cycle. Marketing: feature M in hero; keep fabric stretch medium/high for forgiveness.</div>
            </div>
          </div>
          <div className="rounded-xl border p-4 flex gap-3 border-amber-200 bg-amber-50 dark:bg-amber-950/20">
            <div className="h-9 w-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0"><AlertCircle className="h-4 w-4" /></div>
            <div>
              <div className="font-semibold">Re-grade: Size {topReturnSize?.size} — highest return ratio</div>
              <div className="text-muted-foreground mt-1">
                {topReturnSize?.returns} returns on {topReturnSize?.demand} purchases. Action: widen waist by 1–1.5cm or switch to higher stretch fabric; update size chart copy.
              </div>
            </div>
          </div>
          <div className="rounded-xl border p-4 flex gap-3">
            <div className="h-9 w-9 rounded-xl bg-[#0a0a0f] text-white flex items-center justify-center shrink-0"><PackageCheck className="h-4 w-4" /></div>
            <div>
              <div className="font-semibold">Prevent deadstock — bundle slow movers with try-on incentive</div>
              <div className="text-muted-foreground mt-1">Push “Try first, free return avoided” badge on outerwear & XL — currently low velocity.</div>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Badge variant="outline">Units saved: ~{topReturnSize?.returns ?? 8} RTOs avoided</Badge>
            <Badge variant="success">Est. saving Rp {( (topReturnSize?.returns ?? 8) * 85000 ).toLocaleString("id-ID")}</Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Health</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {(returnsByCategory.length ? returnsByCategory : [{ category: "upper_body", returns: 18, total: 140 }, { category: "dress", returns: 6, total: 54 }]).map((c) => (
            <div key={c.category} className="flex items-center justify-between rounded-xl border p-3">
              <span className="capitalize font-medium">{c.category.replace("_", " ")}</span>
              <span className="text-xs text-muted-foreground">{c.returns} returns · {c.total} sales · {((c.returns / Math.max(1, c.total)) * 100).toFixed(1)}%</span>
            </div>
          ))}
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
