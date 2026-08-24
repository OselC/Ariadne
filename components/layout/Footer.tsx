export function Footer() {
  return (
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
        </div>
      </div>
    </footer>
  );
}
