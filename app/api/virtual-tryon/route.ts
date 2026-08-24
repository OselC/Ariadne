import { NextRequest, NextResponse } from "next/server";
import { runIDMVTON, mockVTONResult } from "@/lib/replicate";
import { getSupabaseServer } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { humanImage, garmentImage, productId, selectedSize, category, garmentDescription } = body as {
      humanImage: string;
      garmentImage: string;
      productId?: string;
      selectedSize?: string;
      category?: "upper_body" | "lower_body" | "dress";
      garmentDescription?: string;
    };

    if (!humanImage || !garmentImage) {
      return NextResponse.json({ error: "humanImage and garmentImage required" }, { status: 400 });
    }

    const useMock = process.env.NEXT_PUBLIC_MOCK_AI === "true" || !process.env.REPLICATE_API_TOKEN;

    let resultUrl: string;
    let isMock = useMock;
    if (useMock) {
      await new Promise((r) => setTimeout(r, 1800));
      resultUrl = mockVTONResult(garmentImage);
    } else {
      try {
        resultUrl = await runIDMVTON({
          humanImage,
          garmentImage,
          category: category ?? "upper_body",
          garmentDescription,
        });
      } catch (err: any) {
        console.warn("Replicate VTON failed, falling back to mock:", err?.message);
        await new Promise((r) => setTimeout(r, 800));
        resultUrl = mockVTONResult(garmentImage);
        isMock = true;
      }
    }

    // Persist session if Supabase configured
    const supabase = getSupabaseServer();
    if (supabase && productId) {
      try {
        await supabase.from("try_on_sessions").insert({
          product_id: productId,
          selected_size: selectedSize ?? "M",
          result_image_url: resultUrl,
        });
      } catch {}
    }

    return NextResponse.json({ resultUrl, mock: isMock });
  } catch (e: any) {
    console.error("virtual-tryon error", e);
    return NextResponse.json({ error: e.message ?? "VTON failed" }, { status: 500 });
  }
}
