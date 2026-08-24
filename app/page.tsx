import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Camera,
  PackageCheck,
  Ruler,
  ScanLine,
  ShieldCheck,
  Shirt,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/* Hallmark · genre: editorial · macrostructure: Narrative Workflow · design-system: design.md · designed-as-app
 * F4 knobs: numbering=1.0/2.0/3.0 · layout=vertical stack · connector=rule
 * enrichment: semantic thread rule only · nav: N9 · footer: Ft4
 */

const stages = [
  {
    number: "1.0",
    verb: "Frame",
    title: "Start with a usable image.",
    body: "MediaPipe checks framing and steadiness in the browser before a frame leaves the device. Upload remains available when a live camera is not practical.",
    Icon: Camera,
    details: ["Full-body guide", "Client-side pose check", "Camera or image upload"],
  },
  {
    number: "2.0",
    verb: "Read",
    title: "Compare the body, garment, and fabric.",
    body: "GPT Vision reads proportions against the selected size chart, then accounts for fabric stretch and the cut of the garment before recommending a size.",
    Icon: Ruler,
    details: ["Fit-risk assessment", "Size recommendation", "Specific garment warnings"],
  },
  {
    number: "3.0",
    verb: "Render",
    title: "See the garment before checkout.",
    body: "IDM-VTON produces the try-on view while the fit analysis explains where the garment may pull, loosen, or sit differently from the catalogue image.",
    Icon: Shirt,
    details: ["Garment-specific drape", "Parallel analysis and render", "Purchase event for merchant insight"],
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="page-shell grid gap-12 pb-28 pt-20 lg:grid-cols-12 lg:gap-10 lg:pb-32 lg:pt-24">
        <div className="min-w-0 lg:col-span-7">
          <p className="max-w-xl text-sm font-semibold text-muted-foreground">
            COMPFEST AIC 2026 · Smart Commerce for Indonesian fashion
          </p>
          <h1 className="mt-5 max-w-4xl text-[length:var(--text-display)] font-bold leading-[1.03] tracking-[-0.035em] text-balance">
            The digital <span className="text-primary">thread</span> to your perfect fit.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--color-ink-2)]">
            Ariadne joins live-camera fit analysis with virtual try-on, giving shoppers a clearer decision and merchants better evidence about returns and sizing demand.
          </p>
          <div className="mt-9 flex flex-wrap gap-x-7 gap-y-3">
            <Link href="/try-on" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap border-b border-primary text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-px">
              Begin with your camera <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link href="/dashboard" className="inline-flex min-h-11 items-center gap-2 whitespace-nowrap border-b border-foreground text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring active:translate-y-px">
              View merchant evidence <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <aside className="self-end border-t pt-5 lg:col-span-5" aria-label="Ariadne system overview">
          <div className="flex items-center justify-between gap-4 pb-4 text-sm">
            <span className="font-semibold">Hybrid AI route</span>
            <span className="text-xs text-muted-foreground">CAMERA → DECISION</span>
          </div>
          {[
            ["Frame", "MediaPipe Pose", ScanLine],
            ["Fit", "GPT Vision + size chart", ShieldCheck],
            ["Drape", "IDM-VTON + LoRA", Shirt],
            ["Demand", "Supabase analytics", BarChart3],
          ].map(([label, value, Icon]) => {
            const RowIcon = Icon as typeof ScanLine;
            return (
              <div key={label as string} className="grid grid-cols-[2rem_minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 border-t py-4 text-sm">
                <RowIcon aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="font-semibold">{label as string}</span>
                <span className="text-right text-muted-foreground">{value as string}</span>
              </div>
            );
          })}
        </aside>
      </section>

      <section className="border-y bg-[var(--color-paper-2)]">
        <div className="page-shell py-20 sm:py-24">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold tracking-[-0.025em] sm:text-4xl">A fit decision in three stages.</h2>
            <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
              Each stage has one job. The sequence stays legible because the explanation and evidence share the same route.
            </p>
          </div>

<<<<<<< HEAD
          <ol className="mt-14 border-t">
            {stages.map(({ number, verb, title, body, Icon, details }) => (
              <li key={number} className="grid gap-8 border-b py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
                <div className="lg:col-span-7">
                  <div className="text-sm font-semibold text-primary">{number} · {verb}</div>
                  <h3 className="mt-3 max-w-2xl text-3xl font-bold tracking-[-0.025em] sm:text-4xl">{title}</h3>
                  <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--color-ink-2)]">{body}</p>
=======
          {/* Architecture diagram card */}
          <div className="mt-10 lg:absolute lg:right-8 lg:top-24 lg:w-[420px]">
            <Card className="bg-white/95 backdrop-blur border-0 shadow-2xl overflow-hidden">
              <div className="bg-[#0a0a0f] text-white p-4">
                <div className="text-xs tracking-widest opacity-60">HYBRID AI ARCHITECTURE</div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                    <div className="font-semibold flex items-center gap-1.5"><ScanLine className="h-3.5 w-3.5 text-[#e63946]" /> Layer 1: HF Vision</div>
                    <div className="opacity-70 mt-1">Parses body proportions, size charts & fabric stretch</div>
                  </div>
                  <div className="rounded-xl bg-white/10 border border-white/10 p-3">
                    <div className="font-semibold flex items-center gap-1.5"><Shirt className="h-3.5 w-3.5 text-[#d4a574]" /> Layer 2: VTON</div>
                    <div className="opacity-70 mt-1">IDM-VTON + LoRA — photoreal draping</div>
                  </div>
>>>>>>> 5a7db915e115651f6f2c9ba1a9b7d1a72487932b
                </div>
                <div className="border-t pt-5 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                  <ul className="mt-6 space-y-0 text-sm">
                    {details.map((detail) => (
                      <li key={detail} className="border-t py-3 first:border-t-0">{detail}</li>
                    ))}
                  </ul>
                </div>
<<<<<<< HEAD
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="page-shell py-24 sm:py-32">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold tracking-[-0.025em] sm:text-4xl">One fitting room, two useful outcomes.</h2>
          </div>
          <div className="grid gap-10 lg:col-span-7 sm:grid-cols-2">
            <article className="border-t pt-5">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary" />
              <h3 className="mt-5 text-2xl font-bold">For shoppers</h3>
              <p className="mt-3 leading-7 text-muted-foreground">See the drape, compare the selected size, and understand fit warnings before paying.</p>
            </article>
            <article className="border-t pt-5">
              <PackageCheck aria-hidden="true" className="h-5 w-5 text-primary" />
              <h3 className="mt-5 text-2xl font-bold">For merchants</h3>
              <p className="mt-3 leading-7 text-muted-foreground">Read return risk by SKU and size, then use demand evidence to revise grading and inventory.</p>
            </article>
=======
              </div>
              <CardContent className="p-4 text-xs text-muted-foreground">
                Live Smartphone Camera → MediaPipe Pose (steadiness) → Base64 → Hugging Face + Replicate in parallel
              </CardContent>
            </Card>
>>>>>>> 5a7db915e115651f6f2c9ba1a9b7d1a72487932b
          </div>
        </div>
      </section>

      <section className="dark-paper">
        <div className="page-shell grid gap-10 py-20 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-8">
            <h2 className="max-w-4xl text-3xl font-bold tracking-[-0.025em] sm:text-5xl">
              Ariadne answered a labyrinth with a thread. Online sizing deserves the same clarity.
            </h2>
          </div>
          <p className="max-w-md self-end text-sm leading-7 text-[var(--color-dark-ink)] lg:col-span-4">
            Fabric thread and data thread meet in one decision: what fits, what to buy, and what merchants should change next.
          </p>
        </div>
<<<<<<< HEAD
=======

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
              desc: "Hugging Face Qwen2-VL parses body proportions, reads the brand’s size chart, factors fabric stretch → fit risk & recommended size.",
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
>>>>>>> 5a7db915e115651f6f2c9ba1a9b7d1a72487932b
      </section>

      <section className="page-shell flex flex-col gap-7 py-20 sm:flex-row sm:items-end sm:justify-between sm:py-24">
        <div>
          <h2 className="text-3xl font-bold tracking-[-0.025em]">Start at stage one.</h2>
          <p className="mt-3 text-muted-foreground">Open the camera or upload a full-body image.</p>
        </div>
        <Link href="/try-on" className={buttonVariants({ variant: "thread", size: "lg" })}>
          Begin try-on <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
