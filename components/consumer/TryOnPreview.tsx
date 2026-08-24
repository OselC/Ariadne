"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Image as ImageIcon, ScanLine } from "lucide-react";

export function TryOnPreview({
  resultUrl,
  garmentUrl,
  mock,
}: {
  resultUrl: string | null;
  garmentUrl?: string;
  mock?: boolean;
}) {
  if (!resultUrl) {
    return (
      <Card className="border-dashed">
        <CardContent className="p-6">
          <ImageIcon aria-hidden="true" className="h-5 w-5 text-muted-foreground" />
          <div className="mt-4 text-sm font-semibold">Try-on preview</div>
          <div className="mt-1 text-xs leading-5 text-muted-foreground">The IDM-VTON render appears here after a frame and garment are ready.</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[3/4] bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={resultUrl} alt="Virtual try-on result" className="h-full w-full object-cover" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="border-[var(--color-dark-paper)] bg-[var(--color-dark-paper)] text-[var(--color-dark-ink)]">
            <ScanLine aria-hidden="true" className="mr-1 h-3 w-3" /> IDM-VTON {mock ? "· mock" : ""}
          </Badge>
          {mock && <Badge variant="warning">Demo mode — set REPLICATE_API_TOKEN for real render</Badge>}
        </div>
      </div>
      <CardContent className="p-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>IDM-VTON renders the selected garment against the captured frame.</span>
        {garmentUrl && <span className="hidden sm:inline">Garment → rendered</span>}
      </CardContent>
    </Card>
  );
}
