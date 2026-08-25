"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Camera, RefreshCcw, CheckCircle2, AlertTriangle, Upload, ChevronDown, Clock, Zap } from "lucide-react";
import { evaluatePoseSteadiness, estimateBodyProportions, MEDIAPIPE_WASM_URL, type BodyProportions } from "@/lib/mediapipe";

export function CameraView({
  onCapture,
  onMeasures,
  disabled,
}: {
  onCapture: (dataUrl: string, steadiness: number, body?: BodyProportions | null) => void;
  onMeasures?: (body: BodyProportions | null, confidence: number) => void;
  disabled?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const captureOptionsRef = useRef<HTMLDivElement>(null);
  const captureOptionsTriggerRef = useRef<HTMLButtonElement>(null);
  const poseLandmarkerRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cameraRequestRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const historyRef = useRef<number[]>([]);
  const lastBodyRef = useRef<BodyProportions | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [steadiness, setSteadiness] = useState(0.45);
  const [statusMsg, setStatusMsg] = useState("Initializing camera…");
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [captureMode, setCaptureMode] = useState<"capture" | "auto" | "timer">("capture");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(3);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [modelReady, setModelReady] = useState(false);
  const autoTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const countdownIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopDetection = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
  }, []);

  const start = useCallback(async () => {
    const requestId = ++cameraRequestRef.current;
    setError(null);
    setCapturedUrl(null);
    setCountdown(null);
    setSteadiness(0.45);
    setStatusMsg("Requesting camera…");
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
        audio: false,
      });
      if (requestId !== cameraRequestRef.current) {
        s.getTracks().forEach((track) => track.stop());
        return;
      }
      streamRef.current = s;
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
      setStatusMsg("Camera ready");
      let t = 0;
      const simId = setInterval(() => {
        if (captureMode === "auto" && modelReady) return;
        t += 1;
        const mock = 0.5 + 0.4 * Math.sin(t * 0.15) + Math.random() * 0.08;
        const clamped = Math.min(0.98, Math.max(0.25, mock));
        setSteadiness(clamped);
        if (captureMode !== "auto") {
          setStatusMsg(clamped > 0.78 ? "Ready to capture" : "Hold steady");
        }
      }, 350);
      if (videoRef.current) (videoRef.current as any)._steadinessInterval = simId;
    } catch (e: any) {
      if (requestId !== cameraRequestRef.current) return;
      setError(e.message ?? "Camera access denied");
      setStatusMsg("Camera unavailable");
    }
  }, [capturedUrl]);

  const stop = useCallback(() => {
    cameraRequestRef.current += 1;
    const currentStream = streamRef.current ?? (videoRef.current?.srcObject as MediaStream | null);
    currentStream?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (videoRef.current && (videoRef.current as any)._steadinessInterval) {
      clearInterval((videoRef.current as any)._steadinessInterval);
    }
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    autoTimeoutRef.current = null;
    countdownIntervalRef.current = null;
    stopDetection();
    if (poseLandmarkerRef.current) {
      try { poseLandmarkerRef.current.close(); } catch {}
      poseLandmarkerRef.current = null;
    }
    setStream(null);
    setModelReady(false);
  }, [stopDetection]);

  const ensurePoseModel = useCallback(async () => {
    if (poseLandmarkerRef.current || modelReady || !stream || capturedUrl) return;
    setStatusMsg("Loading pose model…");
    try {
      const vision = await import("@mediapipe/tasks-vision");
      const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
      let landmarker: any = null;
      try {
        landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      } catch {
        landmarker = await vision.PoseLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
            delegate: "CPU",
          },
          runningMode: "VIDEO",
          numPoses: 1,
          minPoseDetectionConfidence: 0.5,
          minPosePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });
      }
      poseLandmarkerRef.current = landmarker;
      setModelReady(true);
      setStatusMsg("Pose model ready — stand steady");
      historyRef.current = [];
      lastBodyRef.current = null;
      let lastTime = -1;
      const detect = () => {
        const video = videoRef.current;
        if (!video || video.readyState < 2 || video.videoWidth === 0 || capturedUrl || captureMode !== "auto") {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }
        const now = performance.now();
        if (now - lastTime < 120) {
          rafRef.current = requestAnimationFrame(detect);
          return;
        }
        lastTime = now;
        try {
          const result = landmarker.detectForVideo(video, now);
          const landmarks = result.landmarks?.[0] ?? null;
          if (landmarks) {
            const avgY = landmarks.slice(11, 13).reduce((a: number, p: any) => a + p.y, 0) / 2;
            historyRef.current.push(avgY);
            if (historyRef.current.length > 8) historyRef.current.shift();
            const body = estimateBodyProportions(landmarks as any);
            lastBodyRef.current = body;
            onMeasures?.(body, 0.82);
          }
          const evalRes = evaluatePoseSteadiness(landmarks as any, historyRef.current);
          setSteadiness(evalRes.score);
          setStatusMsg(evalRes.message);
        } catch {}
        rafRef.current = requestAnimationFrame(detect);
      };
      detect();
    } catch (err) {
      console.warn("Pose model failed, staying on manual simulation:", err);
      setModelReady(false);
      setStatusMsg("Auto requires pose — using simulation");
    }
  }, [stream, capturedUrl, modelReady, onMeasures, captureMode]);

  useEffect(() => {
    start();
    return () => stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    if (video.readyState < 2 || video.videoWidth === 0) {
      setError("Camera not ready — retake or reload");
      return;
    }
    const canvas = canvasRef.current;
    const w = video.videoWidth;
    const h = video.videoHeight;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d")!;
    ctx.translate(w, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, w, h);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.86);
    if (dataUrl.length < 1000) {
      setError("Capture failed — try again");
      return;
    }
    setCapturedUrl(dataUrl);
    onCapture(dataUrl, steadiness, lastBodyRef.current);
    setCountdown(null);
    stop();
    setStatusMsg("Photo captured — camera off");
  }, [onCapture, steadiness, stop]);

  const retake = () => {
    setCapturedUrl(null);
    setCountdown(null);
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
    stopDetection();
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
      setStatusMsg("Uploaded image ready — camera off");
      stop();
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const startTimerCapture = useCallback(() => {
    if (countdown !== null) return;
    setCountdown(timerSeconds);
    setStatusMsg(`Timer: ${timerSeconds}s — get ready…`);
    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
          capture();
          return null;
        }
        const next = prev - 1;
        setStatusMsg(`Timer: ${next}s…`);
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
    if (captureMode !== "auto" || capturedUrl || disabled || countdown !== null || !modelReady) {
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      if (captureMode === "auto" && !modelReady && !capturedUrl) setStatusMsg("Auto: loading pose…");
      return;
    }
    const hasBody = !!lastBodyRef.current;
    const isSteady = steadiness > 0.78 && hasBody && historyRef.current.length >= 5;
    if (isSteady) {
      if (!autoTimeoutRef.current) {
        setStatusMsg("Auto: steady — capturing in 1.2s…");
        autoTimeoutRef.current = setTimeout(() => {
          if (lastBodyRef.current && !capturedUrl && captureMode === "auto") capture();
          autoTimeoutRef.current = null;
        }, 1200);
      }
    } else {
      if (autoTimeoutRef.current) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
        setStatusMsg(modelReady ? "Auto: hold steady — entire body visible" : "Auto: hold steady…");
      }
      if (!hasBody) setStatusMsg("Auto: show entire body");
      else setStatusMsg("Auto: hold steady — entire body visible");
    }
    return () => {
      if (autoTimeoutRef.current && !isSteady) {
        clearTimeout(autoTimeoutRef.current);
        autoTimeoutRef.current = null;
      }
    };
  }, [steadiness, captureMode, capturedUrl, disabled, countdown, capture, modelReady]);

  const closeCaptureOptions = useCallback((restoreFocus = false) => {
    setDropdownOpen(false);
    if (restoreFocus) captureOptionsTriggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (captureMode === "auto") {
      historyRef.current = [];
      lastBodyRef.current = null;
      if (autoTimeoutRef.current) clearTimeout(autoTimeoutRef.current);
      setStatusMsg("Auto: show entire body");
      if (stream && !capturedUrl) ensurePoseModel();
    } else {
      stopDetection();
      if (poseLandmarkerRef.current) {
        try { poseLandmarkerRef.current.close(); } catch {}
        poseLandmarkerRef.current = null;
      }
      setModelReady(false);
      if (!capturedUrl && stream) setStatusMsg("Ready to capture");
    }
  }, [captureMode, stream, capturedUrl, ensurePoseModel, stopDetection]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const focusFrame = requestAnimationFrame(() => {
      captureOptionsRef.current?.querySelector<HTMLButtonElement>("button")?.focus();
    });
    const close = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-capture-dropdown]")) setDropdownOpen(false);
    };
    const closeOnEscape = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      closeCaptureOptions(true);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [closeCaptureOptions, dropdownOpen]);

  const modeLabel = captureMode === "auto" ? "Auto-Capture" : captureMode === "timer" ? `Timer ${timerSeconds}s` : "Capture";
  const ModeIcon = captureMode === "auto" ? Zap : captureMode === "timer" ? Clock : Camera;

  return (
    <Card className="overflow-hidden">
      <div className="flex justify-center bg-[var(--color-dark-paper)]">
        <div className="relative aspect-[3/4] max-h-[460px] w-full max-w-[345px] shrink-0 overflow-hidden bg-[var(--color-dark-paper)]">
        <video ref={videoRef} playsInline muted className={`h-full w-full object-cover scale-x-[-1] ${capturedUrl ? "hidden" : "block"}`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {capturedUrl && <img src={capturedUrl} alt="Captured frame" width={768} height={1024} className="h-full w-full object-cover" />}

        {!capturedUrl && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="flex h-[82%] w-[56%] items-center justify-center border border-dashed border-[var(--color-rule-2)]">
              <span className="font-outlier text-[10px] tracking-widest text-[var(--color-dark-ink)]">FRAME GUIDE</span>
            </div>
          </div>
        )}

        {countdown !== null && !capturedUrl && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px]">
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
            {captureMode === "auto" ? (modelReady ? "MediaPipe Pose · live" : "Loading pose…") : captureMode === "timer" ? "Timer mode" : "Manual mode"}
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
                ref={captureOptionsTriggerRef}
                variant="thread"
                className="flex-1 rounded-r-none"
                onClick={handleCaptureClick}
                disabled={disabled || (captureMode === "capture" && steadiness < 0.32) || countdown !== null}
              >
                <ModeIcon aria-hidden="true" className="h-4 w-4" /> {modeLabel}
              </Button>
              <Button
                variant="thread"
                className="rounded-l-none border-l border-[var(--color-rule-2)] px-2"
                onClick={() => setDropdownOpen((v) => !v)}
                disabled={disabled || countdown !== null}
                aria-label="Capture options"
                aria-haspopup="dialog"
                aria-expanded={dropdownOpen}
                aria-controls="capture-options"
              >
                <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform [transition-duration:var(--dur-micro)] [transition-timing-function:var(--ease-out)] ${dropdownOpen ? "rotate-180" : ""}`} />
              </Button>
              {dropdownOpen && (
                <div ref={captureOptionsRef} id="capture-options" role="dialog" aria-modal="false" aria-label="Capture options" className="absolute bottom-full right-0 mb-2 w-56 overflow-hidden rounded-[var(--radius-card)] border bg-card shadow-[var(--shadow-card)] [z-index:var(--z-dropdown)]">
                  <button
                    onClick={() => { setCaptureMode("capture"); closeCaptureOptions(true); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-muted ${captureMode === "capture" ? "bg-muted font-semibold" : ""}`}
                  >
                    <Camera className="h-4 w-4" /> Capture <span className="ml-auto text-xs text-muted-foreground">Manual</span>
                  </button>
                  <button
                    onClick={() => { historyRef.current = []; lastBodyRef.current = null; if (autoTimeoutRef.current) { clearTimeout(autoTimeoutRef.current); autoTimeoutRef.current = null; } setCaptureMode("auto"); setDropdownOpen(false); }}
                    className={`flex w-full items-center gap-2 px-3 py-2.5 text-sm text-left hover:bg-muted ${captureMode === "auto" ? "bg-muted font-semibold" : ""}`}
                  >
                    <Zap className="h-4 w-4" /> Auto-Capture <span className="ml-auto text-xs text-muted-foreground">Entire body</span>
                  </button>
                  <div className={`px-3 py-3 ${captureMode === "timer" ? "bg-muted" : ""}`}>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-pressed={captureMode === "timer"}
                      onClick={() => { setCaptureMode("timer"); }}
                      className="w-full justify-start rounded-none px-0"
                    >
                      <Clock className="h-4 w-4" /> Timer
                    </Button>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Seconds:</span>
                      <select
                        value={timerSeconds}
                        onChange={(e) => { setTimerSeconds(Number(e.target.value)); setCaptureMode("timer"); }}
                        className="h-11 rounded-[var(--radius-input)] border border-input bg-background px-2 text-sm outline outline-2 outline-transparent hover:bg-secondary/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-55"
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

      {!stream && !error && !capturedUrl && (
        <div className="px-4 pb-4 text-xs text-muted-foreground">
          Tip: Stand 1.5–2m away, arms relaxed, full body in frame. Bright, even light.
        </div>
      )}
    </Card>
  );
}
