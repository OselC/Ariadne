"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, RefreshCcw, CheckCircle2, AlertTriangle, Upload, ChevronDown, Clock, Zap } from "lucide-react";

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
  const [captureMode, setCaptureMode] = useState<"capture" | "auto" | "timer">("capture");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

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
      let t = 0;
      const id = setInterval(() => {
        t += 1;
        const mock = 0.5 + 0.4 * Math.sin(t * 0.15) + Math.random() * 0.08;
        const clamped = Math.min(0.98, Math.max(0.25, mock));
        setSteadiness(clamped);
        setStatusMsg(clamped > 0.78 ? "Simulation: ready to capture" : "Simulation: hold steady");
      }, 350);
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
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    setCapturedUrl(dataUrl);
    onCapture(dataUrl, steadiness);
    setCountdown(null);
  }, [onCapture, steadiness]);

  const retake = () => {
    setCapturedUrl(null);
    setCountdown(null);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
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

  const startTimerCapture = useCallback(() => {
    if (countdown !== null) return;
    setCountdown(timerSeconds);
    setStatusMsg(`Timer: ${timerSeconds}s — get ready...`);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          setTimeout(() => capture(), 100);
          return null;
        }
        const next = prev - 1;
        setStatusMsg(`Timer: ${next}s...`);
        return next;
      });
    }, 1000);
  }, [capture, countdown, timerSeconds]);

  const handleCaptureClick = () => {
    if (captureMode === "timer") {
      startTimerCapture();
    } else {
      capture();
    }
  };

  useEffect(() => {
    if (captureMode !== "auto" || capturedUrl || disabled || countdown !== null) {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      return;
    }
    if (steadiness > 0.78) {
      if (!autoTimeoutRef.current) {
        setStatusMsg("Auto: steady — capturing in 1.2s...");
        autoTimeoutRef.current = setTimeout(() => {
          capture();
          autoTimeoutRef.current = null;
        }, 1200);
      }
    } else {
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
        setStatusMsg("Auto: hold steady — entire body visible");
      }
    }
    return () => {
      if (autoTimeoutRef.current && steadiness <= 0.78) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
      }
    };
  }, [steadiness, captureMode, capturedUrl, disabled, countdown, capture]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-capture-dropdown]")) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [dropdownOpen]);

  const modeLabel = captureMode === "auto" ? "Auto-Capture" : captureMode === "timer" ? `Timer ${timerSeconds}s` : "Capture";
  const ModeIcon = captureMode === "auto" ? Zap : captureMode === "timer" ? Clock : Camera;

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-center bg-[var(--color-dark-paper)]">
        <div className="relative aspect-[3/4] max-h-[460px] w-full max-w-[345px] shrink-0 overflow-hidden bg-[var(--color-dark-paper)]">
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover scale-x-[-1] ${capturedUrl ? "hidden" : "block"}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {capturedUrl && <img src={capturedUrl} alt="Captured frame" className="h-full w-full object-cover" />}

        {!capturedUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="flex h-[82%] w-[56%] items-center justify-center border border-dashed border-[var(--color-rule-2)]">
              <span className="font-outlier text-[10px] tracking-widest text-[var(--color-dark-ink)]">FRAME GUIDE</span>
            </div>
          </div>
        )}

        {countdown !== null && !capturedUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white text-5xl font-bold text-[#e63946] shadow-xl">
              {countdown}
            </div>
          </div>
        )}

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
          <Badge variant={steadiness > 0.78 ? "success" : steadiness > 0.5 ? "warning" : "secondary"}>
            {steadiness > 0.78 ? <CheckCircle2 aria-hidden="true" className="h-3 w-3 mr-1" /> : <AlertTriangle aria-hidden="true" className="h-3 w-3 mr-1" />}
            {Math.round(steadiness * 100)}% steady
          </Badge>
          <span className="hidden border border-[var(--color-rule-2)] bg-[var(--color-dark-paper-2)] px-2.5 py-1 text-[11px] text-[var(--color-dark-ink)] sm:inline">
            Readiness simulation
          </span>
        </div>

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
            <div className="relative flex flex-1 gap-0" data-capture-dropdown>
              <Button
                variant="thread"
                className="flex-1 rounded-r-none"
                onClick={handleCaptureClick}
                disabled={disabled || (captureMode === "capture" && steadiness < 0.32) || countdown !== null}
              >
                <ModeIcon aria-hidden="true" className="h-4 w-4" /> {modeLabel}
              </Button>
              <Button
                variant="thread"
                className="rounded-l-none border-l border-white/20 px-2"
                onClick={() => setDropdownOpen((v) => !v)}
                disabled={disabled || countdown !== null}
                aria-label="Capture options"
              >
                <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </Button>
              {dropdownOpen && (
                <div className="absolute bottom-full right-0 mb-2 z-20 w-56 rounded-xl border bg-card shadow-xl overflow-hidden">
                  <button
                    onClick={() => { setCaptureMode("capture"); setDropdownOpen(false); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-muted ${captureMode === "capture" ? "bg-muted font-semibold" : ""}`}
                  >
                    <Camera className="h-4 w-4" /> Capture <span className="ml-auto text-xs text-muted-foreground">Manual</span>
                  </button>
                  <button
                    onClick={() => { setCaptureMode("auto"); setDropdownOpen(false); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-muted ${captureMode === "auto" ? "bg-muted font-semibold" : ""}`}
                  >
                    <Zap className="h-4 w-4" /> Auto-Capture <span className="ml-auto text-xs text-muted-foreground">Entire body</span>
                  </button>
                  <div className={`px-3 py-2.5 ${captureMode === "timer" ? "bg-muted" : ""}`}>
                    <button
                      onClick={() => { setCaptureMode("timer"); }}
                      className="flex w-full items-center gap-2 text-sm text-left"
                    >
                      <Clock className="h-4 w-4" /> Timer
                    </button>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Seconds:</span>
                      <select
                        value={timerSeconds}
                        onChange={(e) => { setTimerSeconds(Number(e.target.value)); setCaptureMode("timer"); }}
                        className="rounded-lg border bg-background px-2 py-1 text-sm"
                      >
                        <option value={3}>3s</option>
                        <option value={5}>5s</option>
                        <option value={10}>10s</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>

      {countdown !== null && (
        <div className="px-4 pb-2 flex gap-2">
          <Button variant="outline" size="sm" className="w-full" onClick={() => { if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current); setCountdown(null); setStatusMsg("Timer cancelled"); }}>
            Cancel timer
          </Button>
        </div>
      )}

      {!stream && !error && (
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          Tip: Stand 1.5–2m away, arms relaxed, full body in frame. Bright, even light.
        </div>
      )}
    </Card>
  );
}
