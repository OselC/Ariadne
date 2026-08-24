"use client";
import { useEffect, useState } from "react";
import { KPIRow } from "@/components/merchant/ReturnAnalytics";
import { SizingTrends } from "@/components/merchant/SizingTrends";
import { InventoryRecs } from "@/components/merchant/InventoryRecs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Store, Truck, Leaf } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  /* Hallmark · genre: editorial · macrostructure: Workbench · design-system: design.md · designed-as-app
   * panes: overview=12 · trends=6/6 · recommendations=8/4 · enrichment: none · nav: N9 · footer: Ft4
   */
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
      <div className="page-shell py-16" aria-live="polite">
        <div className="h-8 w-64 animate-pulse bg-muted" />
        <div className="mt-4 h-4 w-full max-w-xl animate-pulse bg-muted" />
        <div className="mt-10 grid gap-4 md:grid-cols-4">
          {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse border bg-[var(--color-paper-2)]" />)}
        </div>
        <span className="sr-only">Loading merchant analytics from Supabase…</span>
      </div>
    );
  }

  const kpis = data?.kpis ?? { tryOns: 0, purchases: 0, returns: 0, returnRate: 0, returnRateBefore: null, rtoSavedIDR: null, conversionUplift: null };

  return (
    <div className="page-shell space-y-8 py-10 sm:py-12">
      <header className="grid gap-5 border-b pb-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-4xl">Merchant evidence</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Return prevention, sizing demand, and inventory signals drawn from the same fitting workflow shoppers use.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-2 lg:col-span-5 lg:justify-end">
          {data?.mock && <Badge variant="warning">Mock data — connect Supabase for live</Badge>}
          <Badge variant="outline" className="gap-1.5"><Store aria-hidden="true" className="h-3 w-3" /> MSME brand portal</Badge>
          <Link href="/try-on" className={buttonVariants({ variant: "outline", size: "sm" })}>Back to Try-On</Link>
        </div>
      </header>

      {/* Alignment banner */}
      <div className="grid gap-5 border-y py-5 text-sm md:grid-cols-12">
          <div className="md:col-span-8">
            <span className="font-bold">COMPFEST AIC:</span> AI for the Backbone of the Economy · Smart Commerce and Smart Logistics
          </div>
          <div className="flex flex-wrap gap-5 text-xs text-muted-foreground md:col-span-4 md:justify-end">
            <span className="flex items-center gap-1.5"><Truck aria-hidden="true" className="h-3 w-3" /> Fewer reverse-logistics trips</span>
            <span className="flex items-center gap-1.5"><Leaf aria-hidden="true" className="h-3 w-3" /> Less packaging waste</span>
          </div>
      </div>

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

      <Card className="border-dashed bg-[var(--color-paper-2)]">
        <CardContent className="p-4 text-xs text-muted-foreground">
          Data source: <code>analytics_events</code> (view / try_on / purchase / return) + <code>try_on_sessions</code> with <code>fit_analysis</code> JSON. In production, connect Supabase Realtime for live updates and schedule nightly aggregation for PO generation.
        </CardContent>
      </Card>
    </div>
  );
}
