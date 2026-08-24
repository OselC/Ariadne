export type HFAnalyzeFitInput = {
  imageBase64: string;
  product: {
    name: string;
    brand: string;
    category: string;
    fabric: string;
    stretch_level: string;
    size_chart: Record<string, any>;
  };
  selectedSize?: string;
  poseSteadiness?: number;
};

const SYSTEM_PROMPT = `You are Ariadne FitVision AI — Intelligence Engine.
Analyze live camera frame + product metadata + brand size chart.
Return STRICT JSON only (no markdown) with shape:
{
  "recommended_size": "S"|"M"|"L"|"XL"|string,
  "fit_risk": "low"|"medium"|"high",
  "confidence": 0.0-1.0,
  "body_proportions": {"shoulder_cm": number, "chest_cm": number, "waist_cm": number, "height_cm": number},
  "fabric_stretch_note": string,
  "warnings": string[],
  "rationale": string
}
Rules: Estimate body from visible pose; parse size chart; factor stretch_level; warnings e.g. tight shoulder/waist gap/fabric pulling.`;

function extractJson(text: string): any {
  const cleaned = text
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/g, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON in HF response: " + text.slice(0, 300));
  return JSON.parse(cleaned.slice(start, end + 1));
}

function toHfImagePayload(dataUrl: string): string {
  return dataUrl;
}

export const DEFAULT_HF_MODEL = process.env.HF_MODEL || "Qwen/Qwen2-VL-7B-Instruct";

export async function analyzeFitWithHF(input: HFAnalyzeFitInput, model = DEFAULT_HF_MODEL): Promise<any> {
  const token = process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY;
  if (!token) throw new Error("HF_TOKEN / HUGGINGFACE_API_KEY not configured");

  const prompt = `${SYSTEM_PROMPT}\n\nProduct: ${input.product.name} (${input.product.brand}) | Fabric: ${input.product.fabric} stretch:${input.product.stretch_level} | Size chart: ${JSON.stringify(input.product.size_chart)} | Selected size: ${input.selectedSize ?? "unknown"} | Pose steadiness: ${input.poseSteadiness ?? "unknown"}\nReturn JSON only.`;

  const url = `https://router.huggingface.co/hf-inference/models/${model}`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { max_new_tokens: 700, temperature: 0.2 },
      options: { wait_for_model: true },
      // Many VL models expect image as separate field; HF Inference will handle base64 in inputs for VL
      // We send image as base64 alongside prompt for Qwen-VL
      // Fallback: if model expects "image" field, include it
      // @ts-ignore
      image: toHfImagePayload(input.imageBase64),
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    // If model loading, HF returns 503 with estimated_time — retry once after wait
    if (res.status === 503) {
      const wait = 8000;
      await new Promise((r) => setTimeout(r, wait));
      const retry = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt, parameters: { max_new_tokens: 700, temperature: 0.2 }, options: { wait_for_model: true }, image: toHfImagePayload(input.imageBase64) }),
      });
      if (!retry.ok) throw new Error(`HF ${model} retry failed ${retry.status}: ${await retry.text()}`);
      const j2 = await retry.json();
      const text2 = typeof j2 === "string" ? j2 : j2.generated_text ?? j2[0]?.generated_text ?? JSON.stringify(j2);
      return extractJson(text2);
    }
    throw new Error(`HF ${model} failed ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data: any = await res.json();
  // HF returns varied shapes: string, {generated_text}, [{generated_text}]
  let text: string;
  if (typeof data === "string") text = data;
  else if (data.generated_text) text = data.generated_text;
  else if (Array.isArray(data) && data[0]?.generated_text) text = data[0].generated_text;
  else text = JSON.stringify(data);

  return extractJson(text);
}

export function getHFToken(): string | null {
  return process.env.HF_TOKEN || process.env.HUGGINGFACE_API_KEY || null;
}

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
    rationale: "Estimated chest 96cm aligns with M (95–100). Fabric medium stretch provides 2–3cm tolerance. Low RTO risk.",
  };
}
