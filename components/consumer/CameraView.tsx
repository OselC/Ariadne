"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, RefreshCcw, CheckCircle2, AlertTriangle, Upload } from "lucide-react";
import { evaluatePoseSteadiness } from "@/lib/mediapipe";

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
  const [statusMsg, setStatusMsg] = useState("Initializing camera...");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);

  const start = useCallback(async () => {
    setError(null);
    setStatusMsg("Requesting camera...");
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
      // Mock steadiness oscillation for demo (real MediaPipe would drive this)
      let t = 0;
      const id = setInterval(() => {
        t += 1;
        const mock = 0.5 + 0.4 * Math.sin(t * 0.15) + Math.random() * 0.08;
        const clamped = Math.min(0.98, Math.max(0.25, mock));
        setSteadiness(clamped);
        const evalRes = evaluatePoseSteadiness(
          // fake landmarks to keep helper exercised
          Array.from({ length: 33 }, (_, i) => ({ x: Math.random(), y: Math.random(), visibility: i % 7 === 0 ? 0.3 : 0.9 })),
          []
        );
        setStatusMsg(clamped > 0.78 ? "Steady — ready to capture ✨" : evalRes.message);
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
      <div className="bg-black flex justify-center">
        <div className="relative bg-black aspect-[3/4] max-h-[420px] sm:max-h-[460px] w-full max-w-[315px] sm:max-w-[345px] shrink-0 overflow-hidden">
        {/* video */}
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover scale-x-[-1] ${capturedUrl ? "hidden" : "block"}`} />
        {capturedUrl && <img src={capturedUrl} alt="Captured" className="h-full w-full object-cover" />}

        {/* silhouette guide */}
        {!capturedUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="h-[82%] w-[56%] rounded-[3rem] border-2 border-white/30 border-dashed flex items-center justify-center">
              <span className="text-[10px] tracking-widest text-white/60">FRAME GUIDE</span>
            </div>
          </div>
        )}

        {/* top bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant={steadiness > 0.78 ? "success" : steadiness > 0.5 ? "warning" : "secondary"} className="backdrop-blur">
            {steadiness > 0.78 ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
            {Math.round(steadiness * 100)}% steady
          </Badge>
          <span className="text-[11px] text-white/80 bg-black/40 backdrop-blur px-2.5 py-1 rounded-full border border-white/10 hidden sm:inline">
            MediaPipe Pose · client-side
          </span>
        </div>

        {/* bottom status */}
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent">
          <div className="text-xs text-white/90">{statusMsg}</div>
          <Progress value={steadiness * 100} className="mt-2 h-1.5 bg-white/20" />
        </div>

        <canvas ref={canvasRef} className="hidden" />
        </div>
      </div>

      <CardContent className="p-4 flex gap-2">
        {error ? (
          <div className="flex-1 text-sm text-destructive">{error}</div>
        ) : capturedUrl ? (
          <>
            <Button variant="outline" className="flex-1" onClick={retake} disabled={disabled}>
              <RefreshCcw className="h-4 w-4" /> Retake
            </Button>
            <Button variant="thread" className="flex-1" disabled={disabled} onClick={() => capturedUrl && onCapture(capturedUrl, steadiness)}>
              Use this frame
            </Button>
          </>
        ) : (
          <>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
            <Button variant="outline" className="flex-1" onClick={() => fileInputRef.current?.click()} disabled={disabled}>
              <Upload className="h-4 w-4" /> Upload
            </Button>
            <Button
              variant="thread"
              className="flex-1"
              onClick={capture}
              disabled={disabled || steadiness < 0.32}
            >
              <Camera className="h-4 w-4" /> Capture
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
