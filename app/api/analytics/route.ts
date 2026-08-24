import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServer();

  // Keep unmeasured product outcomes empty until a real data source is connected.
  if (!supabase) {
    return NextResponse.json({
      mock: true,
      kpis: {
        tryOns: null,
        purchases: null,
        returns: null,
        returnRate: null,
        returnRateBefore: null,
        rtoSavedIDR: null,
        conversionUplift: null,
      },
      sizingDemand: [],
      returnsByCategory: [],
      weeklyTrend: [],
      fitRisk: [],
    });
  }

  // Try to aggregate from real data
  try {
    const { data: events } = await supabase.from("analytics_events").select("event_type, size, fit_risk, created_at, product_id");

    const byType = (t: string) => (events ?? []).filter((e) => e.event_type === t).length;
    const purchases = byType("purchase");
    const returns = byType("return");
    const tryOns = byType("try_on");
    const hasEvents = (events ?? []).length > 0;
    const returnRate = purchases ? (returns / purchases) * 100 : null;

    // demand by size
    const sizes = ["S", "M", "L", "XL"];
    const sizingDemand = sizes.map((s) => ({
      size: s,
      demand: (events ?? []).filter((e) => e.size === s && e.event_type === "purchase").length,
      returns: (events ?? []).filter((e) => e.size === s && e.event_type === "return").length,
    }));

    // weekly trend (last 4 weeks bucket by iso week)
    const weeklyTrend = ["W1", "W2", "W3", "W4"].map((w, i) => {
      const slice = (events ?? []).slice(i * 10, (i + 1) * 10);
      return {
        week: w,
        tryOns: slice.filter((e) => e.event_type === "try_on").length,
        purchases: slice.filter((e) => e.event_type === "purchase").length,
        returns: slice.filter((e) => e.event_type === "return").length,
      };
    });

    const fitRisk = ["low", "medium", "high"].map((r) => ({
      risk: r,
      count: (events ?? []).filter((e) => e.fit_risk === r).length,
    }));

    return NextResponse.json({
      mock: false,
      kpis: {
        tryOns: hasEvents ? tryOns : null,
        purchases: hasEvents ? purchases : null,
        returns: hasEvents ? returns : null,
        returnRate: returnRate === null ? null : Number(returnRate.toFixed(1)),
        returnRateBefore: null,
        rtoSavedIDR: null,
        conversionUplift: null,
      },
      sizingDemand,
      returnsByCategory: [],
      weeklyTrend,
      fitRisk,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
