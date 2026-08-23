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
