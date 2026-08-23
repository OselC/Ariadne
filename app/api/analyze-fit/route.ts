import { NextRequest, NextResponse } from "next/server";
import { analyzeFitWithGPT4o, mockFitAnalysis } from "@/lib/openai";
import { getSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, productId, selectedSize, poseSteadiness } = body as {
      imageBase64: string;
      productId: string;
      selectedSize?: string;
      poseSteadiness?: number;
    };

    if (!imageBase64 || !productId) {
      return NextResponse.json({ error: "imageBase64 and productId required" }, { status: 400 });
    }

    // Fetch product for size chart context
    let product: any = null;
    const supabase = getSupabaseServer();
    if (supabase) {
      const { data } = await supabase.from("products").select("*").eq("id", productId).single();
      product = data;
    }

    // Fallback mock product if no DB
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

    const useMock = process.env.NEXT_PUBLIC_MOCK_AI === "true" || !process.env.OPENAI_API_KEY;

    let analysis: any;
    if (useMock) {
      await new Promise((r) => setTimeout(r, 900)); // simulate latency
      analysis = mockFitAnalysis(selectedSize ?? "M");
    } else {
      analysis = await analyzeFitWithGPT4o({
        imageBase64,
        product: {
          name: product.name,
          brand: product.brand,
          category: product.category,
          fabric: product.fabric,
          stretch_level: product.stretch_level,
          size_chart: product.size_chart,
        },
        selectedSize,
        poseSteadiness,
      });
    }

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

    return NextResponse.json({ analysis, mock: useMock });
  } catch (e: any) {
    console.error("analyze-fit error", e);
    return NextResponse.json({ error: e.message ?? "Analysis failed" }, { status: 500 });
  }
}
