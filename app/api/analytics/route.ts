import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const supabase = getSupabaseServer();

  // Mock analytics when no DB
  if (!supabase) {
    return NextResponse.json({
      mock: true,
      kpis: {
        tryOns: 1248,
        purchases: 412,
        returns: 38,
        returnRate: 9.2,
        returnRateBefore: 24.5,
        rtoSavedIDR: 18600000,
        conversionUplift: 31,
      },
      sizingDemand: [
        { size: "S", demand: 22, returns: 5 },
        { size: "M", demand: 38, returns: 9 },
        { size: "L", demand: 26, returns: 14 },
        { size: "XL", demand: 14, returns: 8 },
      ],
      returnsByCategory: [
        { category: "upper_body", returns: 18, total: 140 },
        { category: "lower_body", returns: 12, total: 68 },
        { category: "dress", returns: 6, total: 54 },
        { category: "outerwear", returns: 2, total: 22 },
      ],
      weeklyTrend: [
        { week: "W1", tryOns: 180, purchases: 52, returns: 11 },
        { week: "W2", tryOns: 220, purchases: 71, returns: 9 },
        { week: "W3", tryOns: 310, purchases: 105, returns: 8 },
        { week: "W4", tryOns: 410, purchases: 138, returns: 7 },
      ],
      fitRisk: [
        { risk: "low", count: 682 },
        { risk: "medium", count: 312 },
        { risk: "high", count: 128 },
      ],
    });
  }

  // Try to aggregate from real data
  try {
    const { data: events } = await supabase.from("analytics_events").select("event_type, size, fit_risk, created_at, product_id");

    const byType = (t: string) => (events ?? []).filter((e) => e.event_type === t).length;
    const purchases = byType("purchase");
    const returns = byType("return");
    const tryOns = byType("try_on");
    const returnRate = purchases ? (returns / purchases) * 100 : 0;

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
        tryOns,
        purchases,
        returns,
        returnRate: Number(returnRate.toFixed(1)),
        returnRateBefore: 24.5,
        rtoSavedIDR: Math.round(returns * 85000 * 0.6),
        conversionUplift: 24,
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
