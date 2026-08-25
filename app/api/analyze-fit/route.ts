import { NextRequest, NextResponse } from "next/server";
import { calculateFitAnalysis, type BodyProportions } from "@/lib/mediapipe";
import { getSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const reqBody = await req.json();
    const { imageBase64, productId, selectedSize, poseSteadiness, body: bodyMeasures } = reqBody as {
      imageBase64: string;
      productId: string;
      selectedSize?: string;
      poseSteadiness?: number;
      body?: BodyProportions | null;
    };

    if (!imageBase64 || !productId) {
      return NextResponse.json({ error: "imageBase64 and productId required" }, { status: 400 });
    }

    let product: any = null;
    const supabase = getSupabaseServer();
    if (supabase) {
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      product = data;
    }

    if (!product) {
      product = {
        name: "Selected Garment",
        brand: "Ariadne",
        category: "upper_body",
        fabric: "cotton",
        stretch_level: "medium",
        size_chart: { S: { chest: 90, waist: 76 }, M: { chest: 96, waist: 82 }, L: { chest: 102, waist: 88 } },
      };
    }

    const useMock = process.env.NEXT_PUBLIC_MOCK_AI === "true";
    const measured: BodyProportions = (bodyMeasures as BodyProportions | null) ?? { shoulder_cm: 42, chest_cm: 96, waist_cm: 82, height_cm: 170 };
    const isMock = !bodyMeasures || useMock;
    const analysis = calculateFitAnalysis(
      { size_chart: product.size_chart, fabric: product.fabric, stretch_level: product.stretch_level },
      measured,
      selectedSize,
      Math.min(0.95, Math.max(0.6, (poseSteadiness ?? 0.7) * 0.9 + 0.15))
    );

    // Log analytics event (try_on)
    if (supabase && productId) {
      try {
        await supabase.from("analytics_events").insert({
          product_id: productId,
          event_type: "try_on",
          size: selectedSize ?? analysis.recommended_size,
          fit_risk: analysis.fit_risk,
        });
      } catch {}
    }

    return NextResponse.json({ analysis, mock: isMock });
  } catch (e: any) {
    console.error("analyze-fit error", e);
    return NextResponse.json({ error: e.message ?? "Analysis failed" }, { status: 500 });
  }
}
