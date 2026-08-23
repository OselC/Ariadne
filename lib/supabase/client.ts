import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});

// Typed helpers for tables (see supabase/schema.sql)
export type Product = {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image_url: string;
  gallery: string[];
  size_chart: Record<string, { chest: number; waist: number; length: number }>;
  fabric: string;
  stretch_level: "low" | "medium" | "high";
  created_at: string;
};

export type TryOnSession = {
  id: string;
  user_id: string | null;
  product_id: string;
  selected_size: string;
  source_image_base64: string | null;
  result_image_url: string | null;
  fit_analysis: FitAnalysis | null;
  created_at: string;
};

export type FitAnalysis = {
  recommended_size: string;
  fit_risk: "low" | "medium" | "high";
  confidence: number;
  body_proportions: { shoulder_cm: number; chest_cm: number; waist_cm: number; height_cm: number };
  fabric_stretch_note: string;
  warnings: string[];
  rationale: string;
};

export type AnalyticsEvent = {
  id: string;
  product_id: string;
  event_type: "view" | "try_on" | "purchase" | "return";
  size: string;
  fit_risk: string | null;
  created_at: string;
};
