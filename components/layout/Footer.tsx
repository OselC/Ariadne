export function Footer() {
  return (
    <footer className="border-t bg-[var(--color-paper-2)]">
      <div className="page-shell py-10 sm:py-12">
        <p className="max-w-4xl font-outlier text-xs leading-6 text-muted-foreground">
          Ariadne / FitVision AI / COMPFEST AIC 2026. Smart commerce and return prevention for Indonesian fashion.
          Built by Sergio, Vincent, Osel, Louis, and Kay. Next.js, Supabase, Hugging Face Qwen2-VL, MediaPipe,
          IDM-VTON, LoRA, and YOLOv8. The digital thread to your perfect fit.
        </p>
        <div className="mt-6 flex flex-col gap-2 border-t pt-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Ariadne</span>
          <span>Jakarta, Indonesia · Smart Commerce · Smart Logistics</span>
        </div>
      </div>
    </footer>
  );
}
