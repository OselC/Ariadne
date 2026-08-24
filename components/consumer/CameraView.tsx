"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, RefreshCcw, CheckCircle2, AlertTriangle, Upload } from "lucide-react";

export function CameraView({
  onCapture,
  disabled,
}: {
  onCapture: (dataUrl: string, steadiness: number) => void;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steadiness, setSteadiness] = useState(0.55);
  const [statusMsg, setStatusMsg] = useState("Initializing camera…");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  const start = useCallback(async () => {
    setError(null);
    setStatusMsg("Requesting camera…");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = s;
        try {
          await video.play();
        } catch (e: any) {
          if (e?.name !== "AbortError") console.warn("video.play failed:", e);
        }
      }
      setStatusMsg("Hold steady — full body visible");
      // Prototype-only readiness simulation; no pose model runs in this client yet.
      let t = 0;
      const id = setInterval(() => {
        t += 1;
        const mock = 0.5 + 0.4 * Math.sin(t * 0.15) + Math.random() * 0.08;
        const clamped = Math.min(0.98, Math.max(0.25, mock));
        setSteadiness(clamped);
        setStatusMsg(clamped > 0.78 ? "Simulation: ready to capture" : "Simulation: hold steady");
      }, 350);
      // store cleanup
      (videoRef.current as any)._steadinessInterval = id;
    } catch (e: any) {
      setError(e.message ?? "Camera access denied");
      setStatusMsg("Camera unavailable");
    }
  }, []);

  const stop = useCallback(() => {
    stream?.getTracks().forEach((tr) => tr.stop());
    if (videoRef.current && (videoRef.current as any)._steadinessInterval) {
      clearInterval((videoRef.current as any)._steadinessInterval);
    }
    setStream(null);
  }, [stream]);

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const w = video.videoWidth || 720;
    const h = video.videoHeight || 1280;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    // mirror for user camera
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    setCapturedUrl(dataUrl);
    onCapture(dataUrl, steadiness);
  }, [onCapture, steadiness]);

  const retake = () => {
    setCapturedUrl(null);
    if (!stream) start();
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setCapturedUrl(dataUrl);
      onCapture(dataUrl, 0.95);
      setStatusMsg("Uploaded image ready");
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-center bg-[var(--color-dark-paper)]">
        <div className="relative aspect-[3/4] max-h-[460px] w-full max-w-[345px] shrink-0 overflow-hidden bg-[var(--color-dark-paper)]">
        {/* video */}
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover scale-x-[-1] ${capturedUrl ? "hidden" : "block"}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {capturedUrl && <img src={capturedUrl} alt="Captured frame" className="h-full w-full object-cover" />}

        {/* silhouette guide */}
        {!capturedUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="flex h-[82%] w-[56%] items-center justify-center border border-dashed border-[var(--color-rule-2)]">
              <span className="font-outlier text-[10px] tracking-widest text-[var(--color-dark-ink)]">FRAME GUIDE</span>
            </div>
          </div>
        )}

        {/* top bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant={steadiness > 0.78 ? "success" : steadiness > 0.5 ? "warning" : "secondary"}>
            {steadiness > 0.78 ? <CheckCircle2 aria-hidden="true" className="h-3 w-3 mr-1" /> : <AlertTriangle aria-hidden="true" className="h-3 w-3 mr-1" />}
            {Math.round(steadiness * 100)}% steady
          </Badge>
          <span className="hidden border border-[var(--color-rule-2)] bg-[var(--color-dark-paper-2)] px-2.5 py-1 text-[11px] text-[var(--color-dark-ink)] sm:inline">
            Readiness simulation
          </span>
        </div>

        {/* bottom status */}
        <div className="absolute bottom-0 left-0 right-0 bg-[var(--color-dark-paper-2)] p-3">
          <div className="text-xs text-[var(--color-dark-ink)]" aria-live="polite">{statusMsg}</div>
          <Progress value={steadiness * 100} label="Pose steadiness" className="mt-2" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <CardContent className="flex flex-wrap gap-2 p-4">
        <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        {error ? (
          <>
            <div className="w-full text-sm text-destructive">{error}</div>
            <Button variant="outline" className="flex-1" onClick={start} disabled={disabled}>
              <RefreshCcw aria-hidden="true" className="h-4 w-4" /> Retry camera
            </Button>
            <Button variant="thread" className="flex-1" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Upload aria-hidden="true" className="h-4 w-4" /> Upload
            </Button>
          </>
        ) : capturedUrl ? (
          <>
            <Button variant="outline" className="flex-1" onClick={retake} disabled={disabled}>
              <RefreshCcw aria-hidden="true" className="h-4 w-4" /> Retake
            </Button>
            <Button variant="thread" className="flex-1" disabled={disabled} onClick={() => capturedUrl && onCapture(capturedUrl, steadiness)}>
              Use this frame
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Upload aria-hidden="true" className="h-4 w-4" /> Upload
            </Button>
            <Button
              variant="thread"
              className="flex-1"
              onClick={capture}
              disabled={disabled || steadiness < 0.32}
            >
              <Camera aria-hidden="true" className="h-4 w-4" /> Capture
            </Button>
          </>
        )}
      </CardContent>

      {!stream && !error && (
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          Tip: Stand 1.5–2m away, arms relaxed, full body in frame. Bright, even light.
        </div>
      )}
    </Card>
  );
}
