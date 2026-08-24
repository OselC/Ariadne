export function Footer() {
  return (
<<<<<<< HEAD
    <footer className="border-t bg-[var(--color-paper-2)]">
      <div className="page-shell py-10 sm:py-12">
        <p className="max-w-4xl font-outlier text-xs leading-6 text-muted-foreground">
          Ariadne / FitVision AI / COMPFEST AIC 2026. Smart commerce and return prevention for Indonesian fashion.
          Built by Sergio, Vincent, Osel, Louis, and Kay. Next.js, Supabase, GPT-4o Vision, MediaPipe,
          IDM-VTON, LoRA, and YOLOv8. The digital thread to your perfect fit.
        </p>
        <div className="mt-6 flex flex-col gap-2 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ariadne</span>
          <span>Jakarta, Indonesia · Smart Commerce · Smart Logistics</span>
=======
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-display text-lg font-bold">Ariadne</div>
            <p className="mt-2 max-w-md text-sm text-muted-foreground">
              &ldquo;The digital thread to your perfect fit.&rdquo; Guiding you through the fashion labyrinth with
              Hybrid AI — Hugging Face Qwen2-VL + IDM-VTON + MediaPipe.
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Smart Commerce (Primary) &middot; Smart Logistics (Secondary) &middot; Backbone of the Economy
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold">Team</div>
            <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
              <li>Sergio — Frontend Lead</li>
              <li>Vincent — Backend & Integration</li>
              <li>Osel — AI Pipeline & Fine-Tuning</li>
              <li>Louis — Merchant Dashboard</li>
              <li>Kay 🎀 — Product & Pitch</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold">Stack</div>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>Next.js + Tailwind + shadcn/ui</li>
              <li>Supabase · Node.js</li>
              <li>Hugging Face Qwen2-VL · Replicate IDM-VTON</li>
              <li>MediaPipe Pose · LoRA / YOLOv8</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 border-t pt-6 text-xs text-muted-foreground">
          <span>© 2026 Ariadne — FitVision AI. For COMPFEST AIC.</span>
          <span className="rounded-full border px-2.5 py-1 text-[10px] tracking-widest">INDONESIA · REDUCE RTO 15–30% · MSME FIRST</span>
>>>>>>> 5a7db915e115651f6f2c9ba1a9b7d1a72487932b
        </div>
      </div>
    </footer>
  );
}
