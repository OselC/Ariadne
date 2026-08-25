// Client-side MediaPipe Pose helper (loaded dynamically to avoid SSR issues)
// Uses @mediapipe/tasks-vision

export type PoseSteadiness = {
  score: number; // 0-1
  landmarksVisible: boolean;
  message: string;
};

// Simple heuristic: check that key landmarks are visible and stable across frames
export function evaluatePoseSteadiness(
  landmarks: { x: number; y: number; visibility?: number }[] | null,
  history: number[] = []
): PoseSteadiness {
  if (!landmarks || landmarks.length < 33) {
    return { score: 0, landmarksVisible: false, message: "Step back — full body not visible" };
  }
  const keyIdx = [11, 12, 23, 24, 27, 28]; // shoulders, hips, ankles
  const visible = keyIdx.every((i) => (landmarks[i]?.visibility ?? 1) > 0.5);
  if (!visible) return { score: 0.3, landmarksVisible: false, message: "Ensure shoulders & hips are visible" };

  // Use history variance if provided
  if (history.length >= 5) {
    const avg = history.reduce((a, b) => a + b, 0) / history.length;
    const variance = history.reduce((a, b) => a + (b - avg) ** 2, 0) / history.length;
    const steadiness = Math.max(0, 1 - variance * 50);
    if (steadiness > 0.7) return { score: steadiness, landmarksVisible: true, message: "Steady — ready to capture" };
    return { score: steadiness, landmarksVisible: true, message: "Hold steady..." };
  }

  return { score: 0.6, landmarksVisible: true, message: "Hold steady for 2 seconds" };
}

export const MEDIAPIPE_WASM_URL = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14/wasm";

export type BodyProportions = { shoulder_cm: number; chest_cm: number; waist_cm: number; height_cm: number };
export type FitAnalysis = {
  recommended_size: string;
  fit_risk: "low" | "medium" | "high";
  confidence: number;
  body_proportions: BodyProportions;
  fabric_stretch_note: string;
  warnings: string[];
  rationale: string;
};

function dist(a: { x: number; y: number }, b: { x: number; y: number }) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

export function estimateBodyProportions(landmarks: { x: number; y: number; visibility?: number }[] | null): BodyProportions | null {
  if (!landmarks || landmarks.length < 33) return null;
  const vis = (i: number) => (landmarks[i]?.visibility ?? 1) > 0.4;
  if (![11, 12, 23, 24, 0, 27, 28].every(vis)) return null;
  const shoulderW = dist(landmarks[11], landmarks[12]);
  const hipW = dist(landmarks[23], landmarks[24]);
  const torsoH = dist(
    { x: (landmarks[11].x + landmarks[12].x) / 2, y: (landmarks[11].y + landmarks[12].y) / 2 },
    { x: (landmarks[23].x + landmarks[24].x) / 2, y: (landmarks[23].y + landmarks[24].y) / 2 }
  );
  const heightNorm = dist(landmarks[0], { x: (landmarks[27].x + landmarks[28].x) / 2, y: (landmarks[27].y + landmarks[28].y) / 2 });
  if (shoulderW < 0.08 || heightNorm < 0.4) return null;
  const scale = 42 / shoulderW;
  const chest = Math.round(shoulderW * 2.28 * scale);
  const waist = Math.round(hipW * 2.15 * scale);
  const shoulder = Math.round(shoulderW * scale);
  const height = Math.round(heightNorm * scale);
  return {
    shoulder_cm: Math.min(60, Math.max(32, shoulder)),
    chest_cm: Math.min(130, Math.max(70, chest)),
    waist_cm: Math.min(120, Math.max(60, waist)),
    height_cm: Math.min(195, Math.max(145, height)),
  };
}

export function calculateFitAnalysis(
  product: { size_chart: Record<string, { chest: number; waist: number; length?: number }>; fabric: string; stretch_level: string },
  body: BodyProportions,
  selectedSize?: string,
  confidence: number = 0.82
): FitAnalysis {
  const sizes = Object.entries(product.size_chart);
  if (sizes.length === 0) throw new Error("Empty size_chart");
  const stretchBonus = product.stretch_level === "high" ? 4 : product.stretch_level === "medium" ? 2 : 0;
  let bestSize = sizes[0][0];
  let bestScore = Infinity;
  for (const [sz, dims] of sizes) {
    const chestDiff = Math.abs((dims.chest ?? body.chest_cm) - body.chest_cm) - stretchBonus;
    const waistDiff = Math.abs((dims.waist ?? body.waist_cm) - body.waist_cm) - stretchBonus;
    const score = chestDiff * 0.6 + waistDiff * 0.4;
    if (score < bestScore) {
      bestScore = score;
      bestSize = sz;
    }
  }
  const selectedDims = selectedSize ? (product.size_chart as any)[selectedSize] : null;
  const bestDims = (product.size_chart as any)[bestSize];
  const risk = (() => {
    if (!selectedDims || selectedSize === bestSize) return bestScore < 4 ? "low" : bestScore < 9 ? "medium" : "high";
    const selScore = (() => {
      const cd = Math.abs((selectedDims.chest ?? body.chest_cm) - body.chest_cm) - stretchBonus;
      const wd = Math.abs((selectedDims.waist ?? body.waist_cm) - body.waist_cm) - stretchBonus;
      return cd * 0.6 + wd * 0.4;
    })();
    if (selScore < 5) return "low";
    if (selScore < 11) return "medium";
    return "high";
  })() as FitAnalysis["fit_risk"];

  const warnings: string[] = [];
  if (selectedDims) {
    if ((selectedDims.chest ?? 0) + stretchBonus < body.chest_cm - 1) warnings.push("Tight chest — fabric pulling at chest");
    if ((selectedDims.chest ?? 0) > body.chest_cm + 7) warnings.push("Loose chest — size down for cleaner drape");
    if ((selectedDims.waist ?? 0) + stretchBonus < body.waist_cm - 1) warnings.push("Tight waist — waist gap risk when sitting");
    if ((selectedDims.waist ?? 0) > body.waist_cm + 6) warnings.push("Waist gap — belt needed");
  }
  const fabricNote =
    product.stretch_level === "high"
      ? `High stretch ${product.fabric} — forgives ~4cm, drapes softly.`
      : product.stretch_level === "medium"
      ? `Medium stretch ${product.fabric} — tolerates 2–3cm, check chest/waist deltas.`
      : `Low stretch ${product.fabric} — precise fit needed, no forgiveness.`;

  const rationale =
    selectedDims && selectedSize !== bestSize
      ? `Measured chest ${body.chest_cm}cm / waist ${body.waist_cm}cm best matches ${bestSize} (chest ${bestDims.chest} waist ${bestDims.waist}). Selected ${selectedSize} is ${risk} risk after ${stretchBonus}cm stretch bonus.`
      : `Measured chest ${body.chest_cm}cm / waist ${body.waist_cm}cm aligns with ${bestSize}. ${fabricNote} Low RTO risk.`;

  return {
    recommended_size: bestSize,
    fit_risk: risk,
    confidence: Math.min(0.96, Math.max(0.55, confidence)),
    body_proportions: body,
    fabric_stretch_note: fabricNote,
    warnings,
    rationale,
  };
}
