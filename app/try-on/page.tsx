"use client";

import { useState } from "react";
import { Loader2, ScanLine, ShoppingBag, Wand2 } from "lucide-react";
import { CameraView } from "@/components/consumer/CameraView";
import { GarmentSelector } from "@/components/consumer/GarmentSelector";
import { FitAnalysisCard, type FitAnalysis } from "@/components/consumer/FitAnalysisCard";
import { TryOnPreview } from "@/components/consumer/TryOnPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyIDR } from "@/lib/utils";
import { calculateFitAnalysis, type BodyProportions } from "@/lib/mediapipe";

/* Hallmark · genre: editorial · macrostructure: Workbench · design-system: design.md · designed-as-app
 * panes: camera=4 · catalogue=5 · output=3 · F3 specs=key/value/unit
 * enrichment: none · nav: N9 · footer: Ft4
 */

type Product = any;

export default function TryOnPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [frame, setFrame] = useState<string | null>(null);
  const [steadiness, setSteadiness] = useState(0.7);
  const [body, setBody] = useState<BodyProportions | null>(null);
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [trying, setTrying] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [mockFlags, setMockFlags] = useState<{ fit?: boolean; vton?: boolean }>({});
  const [actionError, setActionError] = useState<string | null>(null);

  const handleCapture = (dataUrl: string, s: number, measuredBody?: BodyProportions | null) => {
    setFrame(dataUrl);
    setSteadiness(s);
    if (measuredBody) setBody(measuredBody);
  };

  const runAnalysis = async () => {
    if (!frame || !selected) return;
    setAnalyzing(true);
    setAnalysis(null);
    setActionError(null);
    try {
      const measured = body ?? { shoulder_cm: 42, chest_cm: 96, waist_cm: 82, height_cm: 170 };
      const result = calculateFitAnalysis(
        { size_chart: selected.size_chart, fabric: selected.fabric, stretch_level: selected.stretch_level },
        measured,
        selectedSize,
        Math.min(0.95, Math.max(0.6, steadiness * 0.9 + 0.15))
      );
      await new Promise((r) => setTimeout(r, 400));
      setAnalysis(result as FitAnalysis);
      setMockFlags((current) => ({ ...current, fit: !body }));
      if (result.recommended_size) setSelectedSize(result.recommended_size);
      if (selected.id) {
        fetch("/api/analytics", { method: "POST" as any, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product_id: selected.id, event_type: "try_on", size: selectedSize, fit_risk: result.fit_risk }) }).catch(() => {});
        fetch("/api/analyze-fit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ imageBase64: frame, productId: selected.id, selectedSize, poseSteadiness: steadiness, body: measured }),
        }).catch(() => {});
      }
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Fit analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  const runTryOn = async () => {
    if (!frame || !selected) return;
    setTrying(true);
    setResultUrl(null);
    setActionError(null);
    try {
      const res = await fetch("/api/virtual-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          humanImage: frame,
          garmentImage: selected.image_url,
          productId: selected.id,
          selectedSize,
          category: selected.category,
          garmentDescription: `${selected.name} by ${selected.brand}, fabric ${selected.fabric}, stretch ${selected.stretch_level}`,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setResultUrl(json.resultUrl);
      setMockFlags((current) => ({ ...current, vton: json.mock }));
    } catch (error) {
      setActionError(error instanceof Error ? error.message : "Try-on rendering failed. Try again.");
    } finally {
      setTrying(false);
    }
  };

  return (
    <div className="page-shell py-10 sm:py-12">
      <header className="grid gap-5 border-b pb-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h1 className="text-3xl font-bold tracking-[-0.025em] sm:text-4xl">Live try-on workbench</h1>
          <p className="mt-3 max-w-2xl leading-7 text-muted-foreground">
            Frame the body, choose a garment, then compare fit analysis with the rendered result.
          </p>
        </div>
        <div className="self-end text-sm text-muted-foreground lg:col-span-5 lg:text-right">
          Browser camera · MediaPipe Pose · IDM-VTON · Supabase
        </div>
      </header>

      <div className="mt-8 grid min-w-0 gap-8 lg:grid-cols-12 lg:gap-6">
        <section className="min-w-0 space-y-4 lg:col-span-4" aria-labelledby="camera-heading">
          <div className="border-b pb-3">
            <h2 id="camera-heading" className="text-xl font-bold">Frame</h2>
          </div>
          <CameraView onCapture={handleCapture} onMeasures={(b) => b && setBody(b)} disabled={analyzing || trying} />
          {frame && (
            <div className="flex items-center justify-between gap-3 border border-[var(--color-success)] bg-[var(--color-success-soft)] p-3 text-xs tnum">
              <span>Frame ready for both AI layers</span>
              <span className="font-semibold">{Math.round(steadiness * 100)}% steady</span>
            </div>
          )}
        </section>

        <section className="min-w-0 space-y-4 lg:col-span-5" aria-labelledby="catalogue-heading">
          <div className="border-b pb-3">
            <h2 id="catalogue-heading" className="text-xl font-bold">Choose</h2>
          </div>
          <GarmentSelector selectedId={selected?.id ?? null} onSelect={(product) => setSelected(product)} />

          {selected && (
            <Card>
              <CardContent className="space-y-5 p-5">
                <div className="flex gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.image_url} alt={selected.name} className="h-24 w-20 shrink-0 object-cover" />
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground">{selected.brand}</div>
                    <div className="mt-1 text-base font-bold leading-tight">{selected.name}</div>
                    <div className="mt-2 text-sm font-semibold tnum">{formatCurrencyIDR(selected.price)}</div>
                    <div className="mt-1 text-xs text-muted-foreground">{selected.fabric} · {selected.stretch_level} stretch</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="mb-2 text-sm font-semibold">Select size</div>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(selected.size_chart ?? { S: {}, M: {}, L: {} }).map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        aria-pressed={selectedSize === size}
                        className={`min-h-11 min-w-11 border px-4 text-sm font-semibold transition-[background-color,color,transform] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-y-px disabled:cursor-not-allowed disabled:opacity-55 ${selectedSize === size ? "border-primary bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                  <dl className="mt-4 grid grid-cols-3 border-y py-3 text-xs tnum">
                    {[
                      ["Chest", selected.size_chart?.[selectedSize]?.chest],
                      ["Waist", selected.size_chart?.[selectedSize]?.waist],
                      ["Length", selected.size_chart?.[selectedSize]?.length],
                    ].map(([label, value]) => (
                      <div key={label} className="border-l px-3 first:border-l-0 first:pl-0">
                        <dt className="text-muted-foreground">{label}</dt>
                        <dd className="mt-1 font-semibold">{value ?? "—"} cm</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  <Button variant="outline" onClick={runAnalysis} disabled={!frame || analyzing || trying} data-state={analyzing ? "loading" : undefined}>
                    {analyzing ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <Wand2 aria-hidden="true" className="h-4 w-4" />}
                    {analyzing ? "Analyzing…" : "Analyze fit"}
                  </Button>
                  <Button variant="thread" onClick={runTryOn} disabled={!frame || trying || analyzing} data-state={trying ? "loading" : undefined}>
                    {trying ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : <ScanLine aria-hidden="true" className="h-4 w-4" />}
                    {trying ? "Rendering…" : "Render try-on"}
                  </Button>
                </div>
                <p className="text-xs leading-5 text-muted-foreground">Fit analysis and rendering may run independently; each result remains visible when the other finishes.</p>
                <p className="min-h-5 text-xs text-destructive" role="alert">{actionError}</p>
              </CardContent>
            </Card>
          )}
        </section>

        <section className="min-w-0 space-y-5 lg:col-span-3" aria-labelledby="output-heading">
          <div className="border-b pb-3">
            <h2 id="output-heading" className="text-xl font-bold">Compare</h2>
          </div>
          <FitAnalysisCard analysis={analysis} selectedSize={selectedSize} />
          {mockFlags.fit && <p className="text-xs leading-5 text-muted-foreground">Estimated fit — frame entire body for MediaPipe measurement.</p>}
          <TryOnPreview resultUrl={resultUrl} garmentUrl={selected?.image_url} mock={mockFlags.vton} />

          {(analysis || resultUrl) && (
            <Card className="border-[var(--color-dark-paper)] bg-[var(--color-dark-paper)] text-[var(--color-dark-ink)]">
              <CardContent className="space-y-4 p-4">
                <ShoppingBag aria-hidden="true" className="h-5 w-5 text-[var(--color-dark-ink)]" />
                <div>
                  <div className="text-sm font-semibold">Checkout integration pending</div>
                  <div className="mt-1 text-xs leading-5">Purchase outcomes will feed merchant analysis after checkout is connected.</div>
                </div>
                <Button
                  variant="thread"
                  size="sm"
                  className="w-full"
                  disabled
                >
                  Checkout unavailable
                </Button>
              </CardContent>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
}
