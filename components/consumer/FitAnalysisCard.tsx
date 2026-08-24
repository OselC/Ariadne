"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ShieldCheck, AlertTriangle, Ruler } from "lucide-react";

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
          <Ruler aria-hidden="true" className="h-5 w-5 shrink-0" /> Capture a frame and run Fit Analysis to see your recommended size, risk, and fabric notes.
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
              <ShieldCheck aria-hidden="true" className="h-4 w-4 text-primary" /> Fit intelligence
            </CardTitle>
            <CardDescription className="mt-1">Layer 1 — GPT-4o Vision</CardDescription>
          </div>
          <Badge variant={riskColor as any} className="capitalize">
            {analysis.fit_risk} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid grid-cols-2 border-y py-3 tnum">
          <div className="pr-3">
            <dt className="text-xs text-muted-foreground">Recommended</dt>
            <dd className="text-2xl font-bold">{analysis.recommended_size}</dd>
            {selectedSize && selectedSize !== analysis.recommended_size && (
              <div className="mt-1 text-xs text-foreground">You selected {selectedSize}</div>
            )}
          </div>
          <div className="border-l pl-3">
            <dt className="text-xs text-muted-foreground">Confidence</dt>
            <dd className="text-2xl font-bold">{Math.round(analysis.confidence * 100)}%</dd>
            <Progress value={analysis.confidence * 100} className="mt-2" />
          </div>
        </dl>

        <dl className="grid grid-cols-2 border-b text-center tnum sm:grid-cols-4">
          {[
            ["Shoulder", analysis.body_proportions.shoulder_cm],
            ["Chest", analysis.body_proportions.chest_cm],
            ["Waist", analysis.body_proportions.waist_cm],
            ["Height", analysis.body_proportions.height_cm],
          ].map(([label, val]) => (
            <div key={label as string} className="border-l p-2.5 first:border-l-0">
              <dt className="text-[10px] text-muted-foreground">{label}</dt>
              <dd className="text-sm font-bold">{val} cm</dd>
            </div>
          ))}
        </dl>

        <div className="border-t pt-3">
          <div className="text-xs font-semibold flex items-center gap-1.5">
            <Ruler aria-hidden="true" className="h-3.5 w-3.5" /> Fabric note
          </div>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{analysis.fabric_stretch_note}</p>
        </div>

        {analysis.warnings?.length > 0 && (
          <div className="border border-[var(--color-warning)] bg-[var(--color-warning-soft)] p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold">
              <AlertTriangle aria-hidden="true" className="h-3.5 w-3.5" /> Fit warnings
            </div>
            <ul className="mt-1.5 space-y-1 text-sm">
              {analysis.warnings.map((w, i) => (
                <li key={i} className="flex gap-1.5">
                  <span>•</span> {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border border-[var(--color-success)] bg-[var(--color-success-soft)] p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold">
            <ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" /> Rationale
          </div>
          <p className="mt-1 text-sm leading-relaxed">{analysis.rationale}</p>
        </div>
      </CardContent>
    </Card>
  );
}
