import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// Fallback catalog when Supabase not configured — allows demo without keys
const FALLBACK = [
  {
    id: "fallback-1",
    name: "Oversized Kimono Shirt - Sora",
    brand: "Tanuki Kimono",
    category: "upper_body",
    price: 459000,
    image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800",
    gallery: [],
    size_chart: { S: { chest: 98, waist: 94, length: 68 }, M: { chest: 104, waist: 100, length: 70 }, L: { chest: 110, waist: 106, length: 72 } },
    fabric: "cotton-linen",
    stretch_level: "low",
  },
  {
    id: "fallback-2",
    name: "Lolita Puff Sleeve Blouse",
    brand: "LoveChara",
    category: "upper_body",
    price: 389000,
    image_url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800",
    gallery: [],
    size_chart: { S: { chest: 84, waist: 70, length: 56 }, M: { chest: 88, waist: 74, length: 58 }, L: { chest: 94, waist: 80, length: 60 } },
    fabric: "cotton-poplin",
    stretch_level: "medium",
  },
  {
    id: "fallback-3",
    name: "Floral Wrap Dress - Sakura",
    brand: "LoveChara",
    category: "dress",
    price: 639000,
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800",
    gallery: [],
    size_chart: { S: { chest: 86, waist: 68, length: 110 }, M: { chest: 92, waist: 74, length: 112 }, L: { chest: 98, waist: 80, length: 114 } },
    fabric: "crepe",
    stretch_level: "high",
  },
  {
    id: "fallback-4",
    name: "Kebaya Modern Encim",
    brand: "Batik Studio",
    category: "upper_body",
    price: 699000,
    image_url: "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?q=80&w=800",
    gallery: [],
    size_chart: { S: { chest: 88, waist: 72, length: 62 }, M: { chest: 94, waist: 78, length: 64 }, L: { chest: 100, waist: 84, length: 66 } },
    fabric: "brocade",
    stretch_level: "low",
  },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const supabase = getSupabaseServer();
  if (!supabase) {
    let filtered = FALLBACK;
    if (category && category !== "all") filtered = filtered.filter((p) => p.category === category);
    if (q) filtered = filtered.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    return NextResponse.json({ products: filtered, mock: true });
  }

  let query = supabase.from("products").select("*").order("created_at", { ascending: false });
  if (category && category !== "all") query = query.eq("category", category);
  if (q) query = query.ilike("name", `%${q}%`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data ?? [], mock: false });
}
