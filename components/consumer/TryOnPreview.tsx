"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Image as ImageIcon } from "lucide-react";

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
        <CardContent className="p-10 text-center">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-muted flex items-center justify-center">
            <ImageIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="mt-3 text-sm font-medium">Try-on preview</div>
          <div className="mt-1 text-xs text-muted-foreground">Your photorealistic render (IDM-VTON + LoRA) appears here.</div>
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
          <Badge className="bg-[#0a0a0f] hover:bg-[#0a0a0f] text-white">
            <Sparkles className="h-3 w-3 mr-1" /> IDM-VTON {mock ? "· mock" : ""}
          </Badge>
          {mock && <Badge variant="warning">Demo mode — set REPLICATE_API_TOKEN for real render</Badge>}
        </div>
      </div>
      <CardContent className="p-3 text-xs text-muted-foreground flex items-center justify-between">
        <span>Fine-tuned LoRA captures structured cuts & fabric drapes base models miss.</span>
        {garmentUrl && <span className="hidden sm:inline">Garment → rendered</span>}
      </CardContent>
    </Card>
  );
}
