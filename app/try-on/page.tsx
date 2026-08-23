"use client";
import { useState } from "react";
import { CameraView } from "@/components/consumer/CameraView";
import { GarmentSelector } from "@/components/consumer/GarmentSelector";
import { FitAnalysisCard, type FitAnalysis } from "@/components/consumer/FitAnalysisCard";
import { TryOnPreview } from "@/components/consumer/TryOnPreview";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Sparkles, Wand2, Loader2, ShoppingBag, ArrowRight } from "lucide-react";
import { formatCurrencyIDR } from "@/lib/utils";

type Product = any;

export default function TryOnPage() {
  const [selected, setSelected] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [frame, setFrame] = useState<string | null>(null);
  const [steadiness, setSteadiness] = useState(0.7);
  const [analysis, setAnalysis] = useState<FitAnalysis | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [trying, setTrying] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [mockFlags, setMockFlags] = useState<{ fit?: boolean; vton?: boolean }>({});

  const handleCapture = (dataUrl: string, s: number) => {
    setFrame(dataUrl);
    setSteadiness(s);
  };

  const runAnalysis = async () => {
    if (!frame || !selected) return;
    setAnalyzing(true);
    setAnalysis(null);
    try {
      const res = await fetch("/api/analyze-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: frame,
          productId: selected.id,
          selectedSize,
          poseSteadiness: steadiness,
        }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      setAnalysis(json.analysis);
      setMockFlags((m) => ({ ...m, fit: json.mock }));
      if (json.analysis?.recommended_size) setSelectedSize(json.analysis.recommended_size);
    } catch (e: any) {
      alert(e.message);
    } finally {
      setAnalyzing(false);
    }
  };

  const runTryOn = async () => {
    if (!frame || !selected) return;
    setTrying(true);
    setResultUrl(null);
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
      setMockFlags((m) => ({ ...m, vton: json.mock }));
    } catch (e: any) {
      alert(e.message);
    } finally {
      setTrying(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#e63946] to-[#d4a574] text-white">
              <Sparkles className="h-4 w-4" />
            </span>
            Live Try-On
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Layer 1: GPT Vision (fit) · Layer 2: IDM-VTON + LoRA (render) · MediaPipe Pose (steadiness)
          </p>
        </div>
        <Badge variant="outline" className="rounded-full">Hybrid AI · No local GPU · Supabase logs</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Left: Camera */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-muted-foreground">CAMERA — MediaPipe</div>
          <CameraView onCapture={handleCapture} disabled={analyzing || trying} />
          {frame && (
            <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-950/20">
              <CardContent className="p-3 text-xs flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> Frame captured — steadiness {Math.round(steadiness * 100)}% · Base64 ready for AI layers
              </CardContent>
            </Card>
          )}
        </div>

        {/* Middle: Catalog */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold tracking-widest text-muted-foreground">CATALOG — Supabase</div>
          <GarmentSelector selectedId={selected?.id ?? null} onSelect={(p) => setSelected(p)} />

          {selected && (
            <Card className="overflow-hidden">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={selected.image_url} alt={selected.name} className="h-20 w-20 rounded-xl object-cover border" />
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">{selected.brand}</div>
                    <div className="text-sm font-bold leading-tight">{selected.name}</div>
                    <div className="text-xs mt-1">{formatCurrencyIDR(selected.price)}</div>
                    <div className="text-[11px] text-muted-foreground">{selected.fabric} · {selected.stretch_level} stretch</div>
                  </div>
                </div>
                <Separator />
                <div>
                  <div className="text-xs font-semibold mb-2">Select size</div>
                  <div className="flex gap-1.5 flex-wrap">
                    {Object.keys(selected.size_chart ?? { S: {}, M: {}, L: {} }).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${selectedSize === sz ? "bg-primary text-primary-foreground border-primary" : "hover:bg-muted"}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-[11px] text-muted-foreground">
                    Chest {selected.size_chart?.[selectedSize]?.chest ?? "—"} · Waist {selected.size_chart?.[selectedSize]?.waist ?? "—"} · Length {selected.size_chart?.[selectedSize]?.length ?? "—"} cm
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={runAnalysis} disabled={!frame || analyzing || trying}>
                    {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                    {analyzing ? "Analyzing..." : "Fit Analysis"}
                  </Button>
                  <Button variant="thread" onClick={runTryOn} disabled={!frame || trying || analyzing}>
                    {trying ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {trying ? "Rendering..." : "Virtual Try-On"}
                  </Button>
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Both layers run in parallel — GPT-4o parses fit while IDM-VTON renders drape.
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-semibold tracking-widest text-muted-foreground">OUTPUT</div>

          <FitAnalysisCard analysis={analysis} selectedSize={selectedSize} />
          {mockFlags.fit && <div className="text-[11px] text-muted-foreground text-center">Mock fit — set OPENAI_API_KEY for live GPT-4o</div>}

          <TryOnPreview resultUrl={resultUrl} garmentUrl={selected?.image_url} mock={mockFlags.vton} />

          {(analysis || resultUrl) && (
            <Card className="bg-[#0a0a0f] text-white border-0 overflow-hidden">
              <CardContent className="p-4 flex gap-3 items-center">
                <ShoppingBag className="h-5 w-5 text-[#d4a574]" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold">Confident to checkout?</div>
                  <div className="text-xs text-white/70">Ariadne reduces return requests — you help MSMEs cut double-shipping.</div>
                </div>
                <Button variant="thread" size="sm" onClick={() => alert("Checkout flow: would log purchase event to Supabase analytics_events. Demo stops here.")}>
                  Checkout <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
