"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, Ruler, Sparkles } from "lucide-react";

export type FitAnalysis = {
  recommended_size: string;
  fit_risk: "low" | "medium" | "high";
  confidence: number;
  body_proportions: { shoulder_cm: number; chest_cm: number; waist_cm: number; height_cm: number };
  fabric_stretch_note: string;
  warnings: string[];
  rationale: string;
};

export function FitAnalysisCard({ analysis, selectedSize }: { analysis: FitAnalysis | null; selectedSize?: string }) {
  if (!analysis) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6 text-sm text-muted-foreground flex gap-3">
          <Ruler className="h-5 w-5 shrink-0" /> Capture a frame and run Fit Analysis to see your recommended size, risk, and fabric notes.
        </CardContent>
      </Card>
    );
  }

  const riskColor =
    analysis.fit_risk === "low" ? "success" : analysis.fit_risk === "medium" ? "warning" : "destructive";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" /> Fit Intelligence
            </CardTitle>
            <CardDescription className="mt-1">Layer 1 — Hugging Face Vision</CardDescription>
          </div>
          <Badge variant={riskColor as any} className="capitalize">
            {analysis.fit_risk} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-muted p-3">
            <div className="text-[10px] tracking-widest text-muted-foreground">RECOMMENDED</div>
            <div className="text-2xl font-bold">{analysis.recommended_size}</div>
            {selectedSize && selectedSize !== analysis.recommended_size && (
              <div className="text-xs text-amber-600 mt-1">You selected {selectedSize}</div>
            )}
          </div>
          <div className="rounded-xl bg-muted p-3">
            <div className="text-[10px] tracking-widest text-muted-foreground">CONFIDENCE</div>
            <div className="text-2xl font-bold">{Math.round(analysis.confidence * 100)}%</div>
            <Progress value={analysis.confidence * 100} className="mt-2" />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            ["Shoulder", analysis.body_proportions.shoulder_cm],
            ["Chest", analysis.body_proportions.chest_cm],
            ["Waist", analysis.body_proportions.waist_cm],
            ["Height", analysis.body_proportions.height_cm],
          ].map(([label, val]) => (
            <div key={label as string} className="rounded-xl border p-2.5">
              <div className="text-[10px] text-muted-foreground">{label}</div>
              <div className="text-sm font-bold">{val} cm</div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border bg-card p-3">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <Ruler className="h-3.5 w-3.5" /> Fabric note
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{analysis.fabric_stretch_note}</p>
        </div>

        {analysis.warnings?.length > 0 && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 dark:bg-amber-950/30">
            <div className="text-xs font-semibold flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
              <AlertTriangle className="h-3.5 w-3.5" /> Fit warnings
            </div>
            <ul className="mt-1.5 space-y-1 text-sm text-amber-800 dark:text-amber-300">
              {analysis.warnings.map((w, i) => (
                <li key={i} className="flex gap-1.5">
                  <span>•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 dark:bg-emerald-950/30 dark:border-emerald-900">
          <div className="text-xs font-semibold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" /> Rationale
          </div>
          <p className="mt-1 text-sm leading-relaxed text-emerald-900 dark:text-emerald-200">{analysis.rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
}
