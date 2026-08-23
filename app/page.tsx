import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, ScanLine, Shirt, BarChart3, Truck, ShieldCheck, ArrowRight, Camera, Ruler, PackageCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero - Labyrinth */}
      <section className="relative overflow-hidden labyrinth-surface text-white">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        {/* thread SVG */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <svg className="absolute top-10 left-1/2 -translate-x-1/2 w-[900px] h-[600px] opacity-20" viewBox="0 0 900 600" fill="none">
            <path d="M 80 520 Q 240 120 450 280 T 820 80" stroke="#e63946" strokeWidth="2" strokeDasharray="8 8" className="animate-thread-weave" />
            <path d="M 120 40 Q 380 420 620 200 T 860 480" stroke="#d4a574" strokeWidth="1.5" strokeDasharray="6 10" opacity="0.7" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-3xl">
            <Badge variant="secondary" className="mb-4 bg-white/10 text-white border-white/20 backdrop-blur hover:bg-white/15">
              <Sparkles className="h-3 w-3 mr-1" /> COMPFEST AIC — AI for the Backbone of the Economy
            </Badge>
            <h1 className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-balance">
              The digital{" "}
              <span className="bg-gradient-to-r from-[#e63946] to-[#d4a574] bg-clip-text text-transparent">thread</span>{" "}
              to your perfect fit.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/80 text-balance">
              Guiding you through the fashion labyrinth. Live-camera AI weaves garments onto your body with mathematical
              precision — so you buy once, love it, and never return it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/try-on">
                <Button variant="thread" size="lg" className="rounded-full">
                  <Camera className="h-4 w-4" /> Try On Live — Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/15 hover:text-white">
                  <BarChart3 className="h-4 w-4" /> Merchant Dashboard
                </Button>
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 max-w-xl">
              {[
                { k: "15–30%", v: "return rate cut" },
                { k: "~60%", v: "RTO cost saved" },
                { k: "< 3s", v: "try-on latency" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl bg-white/10 backdrop-blur border border-white/10 p-4">
                  <div className="text-xl font-bold">{s.k}</div>
                  <div className="text-xs text-white/70">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture diagram card */}
          <div className="mt-10 lg:absolute lg:right-8 lg:top-24 lg:w-[420px]">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl overflow-hidden">
              <div className="bg-[#0a0a0f] text-white p-4">
                <div className="text-xs tracking-widest opacity-60">HYBRID AI ARCHITECTURE</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                    <div className="font-semibold flex items-center gap-1.5"><ScanLine className="h-3.5 w-3.5 text-[#e63946]" /> Layer 1: GPT Vision</div>
                    <div className="opacity-70 mt-1">Parses body proportions, size charts & fabric stretch</div>
                  </div>
                  <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                    <div className="font-semibold flex items-center gap-1.5"><Shirt className="h-3.5 w-3.5 text-[#d4a574]" /> Layer 2: VTON</div>
                    <div className="opacity-70 mt-1">IDM-VTON + LoRA — photoreal draping</div>
                  </div>
                </div>
                <div className="mt-2 rounded-xl bg-white text-[#0a0a0f] p-3 text-xs">
                  <div className="font-bold">OUTPUT</div>
                  <div>1. Consumer: Realistic Try-On + Fit Warning</div>
                  <div>2. Merchant: Return Risk & Sizing Demand Analytics</div>
                </div>
              </div>
              <CardContent className="p-4 text-xs text-muted-foreground">
                Live Smartphone Camera → MediaPipe Pose (steadiness) → Base64 → GPT-4o + Replicate in parallel
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20 w-full">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-bold tracking-tight">How Ariadne guides you</h2>
          <p className="mt-2 text-muted-foreground">
            Two AI layers, one red thread. No GPU cluster required — we orchestrate frontier models + fine-tuned LoRA/YOLOv8.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: Camera,
              title: "1. Stand steady",
              desc: "MediaPipe Pose checks you’re framed & steady in browser — no app needed. Clean frame sent as Base64.",
              color: "from-violet-500 to-indigo-500",
            },
            {
              icon: Ruler,
              title: "2. Fit intelligence",
              desc: "GPT-4o Vision parses body proportions, reads the brand’s size chart, factors fabric stretch → fit risk & recommended size.",
              color: "from-[#e63946] to-[#c1121f]",
            },
            {
              icon: Shirt,
              title: "3. Wear it, before you buy it",
              desc: "IDM-VTON + custom LoRA renders photoreal draping for that exact cut — local fashion textures base models miss.",
              color: "from-[#d4a574] to-amber-600",
            },
          ].map((step) => (
            <Card key={step.title} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center text-white`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="mt-4 font-semibold">{step.title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Dual value */}
      <section className="bg-muted/40 border-y">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid gap-6 md:grid-cols-2">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <Badge variant="outline" className="mb-3">For Shoppers</Badge>
              <h3 className="font-display text-xl font-bold">Eliminate guesswork</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Varying size charts, fabric behaviours, body proportions — solved. See the drape, get a fit warning, choose
                with confidence.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" /> Recommended size + confidence</li>
                <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" /> Warnings: tight shoulder, waist gap, fabric pull</li>
                <li className="flex gap-2"><ShieldCheck className="h-4 w-4 text-emerald-600 mt-0.5" /> Real garment photo — no 3D avatar uncanny</li>
              </ul>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-8">
              <Badge className="mb-3 bg-[#0a0a0f] hover:bg-[#0a0a0f]">For Merchants & Supply Chains</Badge>
              <h3 className="font-display text-xl font-bold">Cut reverse-logistics overhead</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Indonesia’s logistics ~14–20% of GDP. Every avoided Return-to-Origin saves double shipping + packaging waste.
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                <li className="flex gap-2"><PackageCheck className="h-4 w-4 text-[#e63946] mt-0.5" /> Return risk per SKU/size</li>
                <li className="flex gap-2"><Truck className="h-4 w-4 text-[#e63946] mt-0.5" /> Sizing demand → inventory forecasting</li>
                <li className="flex gap-2"><BarChart3 className="h-4 w-4 text-[#e63946] mt-0.5" /> MSME margin protection — prevent deadstock</li>
              </ul>
              <Link href="/dashboard" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Open merchant dashboard <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Myth */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-[2rem] bg-[#0a0a0f] text-white p-8 sm:p-10 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#e63946]/10 via-transparent to-[#d4a574]/10" />
          <div className="relative">
            <div className="text-xs tracking-[0.2em] opacity-60">WHY ARIADNE</div>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold text-balance">
              Ariadne knew the labyrinth was built to bewilder — so she gave Theseus a thread.
            </h3>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-white/70">
              Online shopping is a modern labyrinth: inconsistent charts, endless options, friction of returns. Our AI is the
              enchanted red string — the Fabric Thread (textiles, weaving) and the Tech Thread (live data threads) woven
              together. The moment you turn on your camera, we weave the garment onto your moving body with mathematical
              precision.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 text-xs">
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5">The Fabric Thread · Weaving & garments</span>
              <span className="rounded-full bg-white/10 border border-white/10 px-3 py-1.5">The Tech Thread · Live data streams</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
