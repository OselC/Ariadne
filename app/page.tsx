import Link from "next/link";
import { ArrowRight, BarChart3, Camera, PackageCheck, Ruler, ScanLine, ShieldCheck, Shirt } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

/* Hallmark · genre: modern-minimal · macrostructure: Marquee Hero + F4 workflow · design-system: design.md · designed-as-app
 * hero: single-statement · workflow: vertical stack · enrichment: semantic thread rule only
 * theme: Coral · nav: N5 · footer: Ft2
 */

const stages = [
  { number: "1.0", verb: "Frame", title: "Start with a usable image.", body: "The prototype provides a browser-camera framing guide and a simulated steadiness indicator. Upload remains available when a live camera is not practical.", Icon: Camera, details: ["Full-body guide", "Readiness simulation", "Camera or image upload"] },
  { number: "2.0", verb: "Read", title: "Compare the body, garment, and fabric.", body: "Hugging Face Qwen2-VL reads proportions against the selected size chart, then accounts for fabric stretch and the cut of the garment before recommending a size.", Icon: Ruler, details: ["Fit-risk assessment", "Size recommendation", "Specific garment warnings"] },
  { number: "3.0", verb: "Render", title: "See the garment before checkout.", body: "IDM-VTON produces the try-on view while the fit analysis explains where the garment may pull, loosen, or sit differently from the catalogue image.", Icon: Shirt, details: ["Garment-specific drape", "Independent analysis and render", "Purchase event for merchant insight"] },
];

const systemRows = [
  ["Frame", "Browser camera guide", ScanLine],
  ["Fit", "Qwen2-VL + size chart", ShieldCheck],
  ["Drape", "IDM-VTON", Shirt],
  ["Demand", "Supabase analytics", BarChart3],
] as const;

export default function LandingPage() {
  return (
    <div>
      <section className="page-shell pb-16 pt-10 sm:pb-20 sm:pt-14">
        <h1 className="max-w-5xl text-[length:var(--text-display)] font-bold leading-[1.04] text-balance">
          Know the fit before checkout.
        </h1>
        <div className="mt-12 flex flex-col gap-3 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>Camera → Fit → Drape → Demand</span>
          <span>AI-assisted sizing for Indonesian fashion</span>
        </div>
      </section>

      <section className="border-y bg-[var(--color-paper-2)]">
        <div className="page-shell grid gap-10 py-12 lg:grid-cols-12 lg:gap-10 lg:py-16">
          <div className="lg:col-span-7">
            <h2 className="max-w-3xl text-3xl font-bold sm:text-5xl">
              One decision layer for shoppers and merchants.
            </h2>
            <p className="mt-6 max-w-2xl text-base leading-7 text-[var(--color-ink-2)] sm:text-lg sm:leading-8">
              Ariadne joins live-camera fit analysis with virtual try-on, giving shoppers a clearer decision and merchants better evidence about returns and sizing demand.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/try-on" className={buttonVariants({ variant: "thread", size: "lg" })}>Begin try-on <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link>
              <Link href="/dashboard" className={buttonVariants({ variant: "outline", size: "lg" })}>Merchant view</Link>
            </div>
          </div>
          <aside className="self-end border-t pt-4 lg:col-span-5" aria-label="Ariadne system overview">
            <div className="flex items-center justify-between gap-4 pb-3 text-xs text-muted-foreground"><span>Technology map</span><span>Input → evidence</span></div>
            {systemRows.map(([label, value, Icon]) => (
              <div key={label} className="grid grid-cols-[1.5rem_minmax(0,1fr)_minmax(0,1.4fr)] items-center gap-3 border-t py-3 text-sm">
                <Icon aria-hidden="true" className="h-4 w-4 text-primary" />
                <span className="font-semibold">{label}</span>
                <span className="text-right text-muted-foreground">{value}</span>
              </div>
            ))}
          </aside>
        </div>
      </section>

      <section className="page-shell py-14 sm:py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-bold sm:text-5xl">A fit decision in three stages.</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Each stage has one job. The explanation and evidence stay on the same route.</p>
        </div>
        <ol className="mt-8 border-t">
          {stages.map(({ number, verb, title, body, Icon, details }) => (
            <li key={number} className="grid gap-6 border-b py-8 lg:grid-cols-12 lg:gap-10 lg:py-10">
              <div className="lg:col-span-7">
                <div className="text-sm font-semibold text-primary">{number} · {verb}</div>
                <h3 className="mt-3 max-w-2xl text-3xl font-bold sm:text-4xl">{title}</h3>
                <p className="mt-5 max-w-2xl leading-7 text-[var(--color-ink-2)]">{body}</p>
              </div>
              <div className="border-t pt-5 lg:col-span-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                <Icon aria-hidden="true" className="h-5 w-5 text-primary" />
                <ul className="mt-6 text-sm">{details.map((detail) => <li key={detail} className="border-t py-3 first:border-t-0">{detail}</li>)}</ul>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-y bg-[var(--color-paper-2)]">
        <div className="page-shell grid gap-8 py-14 lg:grid-cols-12 lg:py-16">
          <div className="lg:col-span-5"><h2 className="text-3xl font-bold sm:text-4xl">One fitting room, two useful outcomes.</h2></div>
          <div className="grid gap-8 lg:col-span-7 sm:grid-cols-5">
            <article className="border-t pt-5 sm:col-span-3"><ShieldCheck aria-hidden="true" className="h-5 w-5 text-primary" /><h3 className="mt-5 text-2xl font-bold">For shoppers</h3><p className="mt-3 leading-7 text-muted-foreground">See the drape, compare the selected size, and understand fit warnings before paying.</p></article>
            <article className="border-t pt-5 sm:col-span-2"><PackageCheck aria-hidden="true" className="h-5 w-5 text-primary" /><h3 className="mt-5 text-2xl font-bold">For merchants</h3><p className="mt-3 leading-7 text-muted-foreground">Read return risk by SKU and size, then use demand evidence to revise grading and inventory.</p></article>
          </div>
        </div>
      </section>

      <section className="dark-paper"><div className="page-shell grid gap-8 py-14 lg:grid-cols-12 lg:py-16"><div className="lg:col-span-8"><h2 className="max-w-4xl text-3xl font-bold sm:text-5xl">Ariadne answered a labyrinth with a thread. Online sizing deserves the same clarity.</h2></div><p className="max-w-md self-end text-sm leading-7 text-[var(--color-dark-ink)] lg:col-span-4">Fabric thread and data thread meet in one decision: what fits, what to buy, and what merchants should change next.</p></div></section>

      <section className="page-shell flex flex-col gap-6 py-14 sm:flex-row sm:items-end sm:justify-between sm:py-16"><div><h2 className="text-3xl font-bold">Start at stage one.</h2><p className="mt-3 text-muted-foreground">Open the camera or upload a full-body image.</p></div><Link href="/try-on" className={buttonVariants({ variant: "thread", size: "lg" })}>Begin try-on <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link></section>
    </div>
  );
}
