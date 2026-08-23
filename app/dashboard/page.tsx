"use client";
import { useEffect, useState } from "react";
import { KPIRow } from "@/components/merchant/ReturnAnalytics";
import { SizingTrends } from "@/components/merchant/SizingTrends";
import { InventoryRecs } from "@/components/merchant/InventoryRecs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, Store, Truck, Leaf, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((j) => setData(j))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <div className="mt-3 text-sm text-muted-foreground">Loading merchant analytics from Supabase...</div>
      </div>
    );
  }

  const kpis = data?.kpis ?? { tryOns: 0, purchases: 0, returns: 0, returnRate: 0, returnRateBefore: 24.5, rtoSavedIDR: 0, conversionUplift: 0 };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <span className="h-8 w-8 rounded-xl bg-[#0a0a0f] text-white flex items-center justify-center"><LayoutDashboard className="h-4 w-4" /></span>
            Merchant Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            B2B analytics — return-prevention, sizing demand & inventory forecasting. Tremor/shadcn · Supabase logs.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {data?.mock && <Badge variant="warning">Mock data — connect Supabase for live</Badge>}
          <Badge variant="outline" className="gap-1.5"><Store className="h-3 w-3" /> MSME / Brand portal</Badge>
          <Link href="/try-on">
            <Button variant="outline" size="sm">Back to Try-On</Button>
          </Link>
        </div>
      </div>

      {/* Alignment banner */}
      <Card className="bg-[#0a0a0f] text-white border-0 overflow-hidden">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
          <div className="text-sm">
            <span className="font-bold">COMPFEST AIC Theme:</span> AI for the Backbone of the Economy — Smart Commerce (primary) + Smart Logistics (secondary)
          </div>
          <div className="flex gap-2 text-xs">
            <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 flex items-center gap-1.5"><Truck className="h-3 w-3" /> −60% RTO shipments</span>
            <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5 flex items-center gap-1.5"><Leaf className="h-3 w-3" /> Less packaging waste</span>
          </div>
        </CardContent>
      </Card>

      <KPIRow kpis={kpis} />

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Sizing Trends</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Recs</TabsTrigger>
        </TabsList>
        <TabsContent value="trends">
          <SizingTrends data={data} />
        </TabsContent>
        <TabsContent value="inventory">
          <InventoryRecs sizingDemand={data.sizingDemand ?? []} returnsByCategory={data.returnsByCategory ?? []} />
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardContent className="p-4 text-xs text-muted-foreground">
          Data source: <code>analytics_events</code> (view / try_on / purchase / return) + <code>try_on_sessions</code> with <code>fit_analysis</code> JSON. In production, connect Supabase Realtime for live updates and schedule nightly aggregation for PO generation.
        </CardContent>
      </Card>
    </div>
  );
}
