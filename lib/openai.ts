import OpenAI from "openai";

export function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  return new OpenAI({ apiKey: key });
}

export const FIT_ANALYSIS_SYSTEM_PROMPT = `You are Ariadne FitVision AI — the Intelligence Engine (Layer 1).
Analyze a live camera frame (base64 JPEG) + product metadata + brand size chart.

Return STRICT JSON only (no markdown, no extra text) with shape:
{
  "recommended_size": "S" | "M" | "L" | "XL" | string,
  "fit_risk": "low" | "medium" | "high",
  "confidence": 0.0-1.0,
  "body_proportions": { "shoulder_cm": number, "chest_cm": number, "waist_cm": number, "height_cm": number },
  "fabric_stretch_note": string,
  "warnings": string[],
  "rationale": string
}

Rules:
- Estimate body proportions from visible pose; if uncertain, lower confidence.
- Parse size chart precisely; calculate fit risk based on stretch_level (low/medium/high).
- fabric_stretch_note should explain how fabric behaves for this body.
- warnings: e.g. "tight shoulder", "waist gap", "fabric pulling at chest".
- Be concise but accurate. Confidence reflects visibility and pose steadiness.
`;

export type AnalyzeFitInput = {
  imageBase64: string; // data:image/jpeg;base64,...
  product: {
    name: string;
    brand: string;
    category: string;
    fabric: string;
    stretch_level: string;
    size_chart: Record<string, any>;
  };
  selectedSize?: string;
  poseSteadiness?: number; // 0-1 from MediaPipe
};

export async function analyzeFitWithGPT4o(input: AnalyzeFitInput) {
  const client = getOpenAI();
  if (!client) throw new Error("OPENAI_API_KEY not configured");

  const userContent: any[] = [
    {
      type: "text",
      text: `Product: ${input.product.name} (${input.product.brand}) | Fabric: ${input.product.fabric} stretch:${input.product.stretch_level} | Size chart: ${JSON.stringify(input.product.size_chart)} | User selected size: ${input.selectedSize ?? "unknown"} | Pose steadiness: ${input.poseSteadiness ?? "unknown"}\nAnalyze and return JSON only.`,
    },
    {
      type: "image_url",
      image_url: { url: input.imageBase64, detail: "high" },
    },
  ];

  const res = await client.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: FIT_ANALYSIS_SYSTEM_PROMPT },
      { role: "user", content: userContent },
    ],
    max_tokens: 700,
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const text = res.choices[0]?.message?.content ?? "{}";
  return JSON.parse(text);
}

// Mock for demo without API key
export function mockFitAnalysis(selectedSize = "M"): any {
  const sizes = ["S", "M", "L", "XL"];
  const idx = Math.max(0, sizes.indexOf(selectedSize));
  const recommended = sizes[idx] ?? "M";
  return {
    recommended_size: recommended,
    fit_risk: idx === 1 ? "low" : idx === 0 ? "medium" : "high",
    confidence: 0.88,
    body_proportions: { shoulder_cm: 43, chest_cm: 96, waist_cm: 82, height_cm: 172 },
    fabric_stretch_note: "Medium stretch — drapes well on shoulders, slight pull at chest if size down.",
    warnings: recommended !== selectedSize ? ["Selected size may cause waist gap"] : [],
    rationale:
      "Estimated chest 96cm aligns with M (95–100). Fabric medium stretch provides 2–3cm tolerance. Low RTO risk.",
  };
}
