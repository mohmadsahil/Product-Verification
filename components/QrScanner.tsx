"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Scanner, type IDetectedBarcode } from "@yudiel/react-qr-scanner";
import { Camera, CameraOff, Edit3, QrCode, ShieldCheck } from "lucide-react";
import BrandLogo from "./BrandLogo";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type CamState = "idle" | "requesting" | "active" | "denied" | "unsupported";

export default function QrScanner() {
  const router = useRouter();
  const [camState, setCamState] = useState<CamState>("idle");
  const [err, setErr] = useState<string | null>(null);
  const handledRef = useRef(false);

  useEffect(() => {
    if (typeof navigator === "undefined") return;
    const hasCam =
      !!navigator.mediaDevices &&
      typeof navigator.mediaDevices.getUserMedia === "function";
    if (!hasCam) {
      setCamState("unsupported");
    }
  }, []);

  function routeFromScan(raw: string) {
    if (handledRef.current) return;
    handledRef.current = true;

    let path = "/verify";
    try {
      const u = new URL(raw);
      const originHere =
        typeof window !== "undefined" ? window.location.origin : "";
      if (originHere && u.origin === originHere) {
        path = `${u.pathname}${u.search}`;
        if (!path.startsWith("/verify")) path = `/verify${u.search}`;
      } else {
        path = `/verify${u.search}`;
      }
    } catch {
      const idMatch = raw.match(/[a-f0-9]{24}/i);
      if (idMatch) path = `/verify?id=${idMatch[0]}`;
    }
    router.push(path);
  }

  function onDetect(codes: IDetectedBarcode[]) {
    const first = codes[0]?.rawValue;
    if (first) routeFromScan(first);
  }

  function onError(e: unknown) {
    const name = (e as { name?: string })?.name || "";
    if (name === "NotAllowedError" || name === "PermissionDeniedError") {
      setCamState("denied");
      setErr("Camera access denied. Enter details manually below.");
    } else if (name === "NotFoundError" || name === "OverconstrainedError") {
      setCamState("unsupported");
      setErr("No camera found on this device.");
    } else {
      setErr("Camera error. You can continue manually below.");
    }
  }

  const showScanner = camState === "active";

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col items-center mb-4 sm:mb-6">
        <BrandLogo
          size={72}
          priority
          className="drop-shadow-sm sm:!w-28 sm:!h-28"
        />
        <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-brandline bg-white/60 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-brand shadow-soft">
          <ShieldCheck className="h-3 w-3" aria-hidden />
          Scan to verify authenticity
        </div>
      </div>

      <Card className="overflow-hidden backdrop-blur-sm">
        <div className="h-1.5 bg-brand-sheen" />
        <CardContent className="p-4 sm:p-7 md:p-8">
          <div className="text-center mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 text-brand mb-2 sm:mb-3">
              <QrCode className="h-4 w-4 sm:h-6 sm:w-6" aria-hidden />
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-semibold tracking-tight shimmer-text leading-snug px-1">
              Scan the Crystal Glow QR code
            </h1>
            <p className="text-[11px] sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
              Point your camera at the QR on your pack to verify instantly.
            </p>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-brandline to-transparent mb-4 sm:mb-6" />

          {camState === "idle" && (
            <div className="flex flex-col items-center gap-3 py-4">
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={() => setCamState("active")}
                className="w-full sm:w-auto"
              >
                <Camera className="h-4 w-4" aria-hidden />
                Open camera & scan QR
              </Button>
              {/* <button
                type="button"
                onClick={() => router.push("/verify")}
                className="text-xs sm:text-sm text-brand hover:underline inline-flex items-center gap-1"
              >
                <Edit3 className="h-3 w-3" aria-hidden />
                Or enter details manually
              </button> */}
            </div>
          )}

          {showScanner && (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-brandline bg-black aspect-square max-w-sm mx-auto">
                <Scanner
                  onScan={onDetect}
                  onError={onError}
                  constraints={{ facingMode: "environment" }}
                  formats={["qr_code"]}
                  components={{ finder: false }}
                  styles={{
                    container: { width: "100%", height: "100%" },
                    video: { width: "100%", height: "100%", objectFit: "cover" },
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-black/30"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(circle at center, transparent 36%, black 70%)",
                    maskImage:
                      "radial-gradient(circle at center, transparent 36%, black 70%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative w-[70%] aspect-square rounded-lg">
                    <span className="qr-corner absolute top-0 left-0 w-[15%] h-[15%] border-t-4 border-l-4 border-brand rounded-tl-lg" />
                    <span className="qr-corner absolute top-0 right-0 w-[15%] h-[15%] border-t-4 border-r-4 border-brand rounded-tr-lg" />
                    <span className="qr-corner absolute bottom-0 left-0 w-[15%] h-[15%] border-b-4 border-l-4 border-brand rounded-bl-lg" />
                    <span className="qr-corner absolute bottom-0 right-0 w-[15%] h-[15%] border-b-4 border-r-4 border-brand rounded-br-lg" />
                    <div className="qr-scan-line absolute left-[6%] right-[6%] h-[2px] rounded-full bg-brand" />
                  </div>
                </div>
              </div>
              <p className="text-center text-[11px] sm:text-xs text-muted-foreground">
                Hold steady — we&apos;ll detect the code automatically.
              </p>
              {/* <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => router.push("/verify")}
                  className="text-xs sm:text-sm text-brand hover:underline inline-flex items-center gap-1"
                >
                  <Edit3 className="h-3 w-3" aria-hidden />
                  Enter details manually instead
                </button>
              </div> */}
            </div>
          )}

          {(camState === "denied" || camState === "unsupported") && (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-destructive/10 text-destructive">
                <CameraOff className="h-5 w-5" aria-hidden />
              </div>
              <p className="text-sm text-center text-muted-foreground max-w-sm">
                {err || "Camera is unavailable. Continue by entering your details manually."}
              </p>
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={() => router.push("/verify")}
              >
                Continue manually
              </Button>
            </div>
          )}

          {err && camState === "active" && (
            <p className="text-sm text-destructive text-center mt-3" aria-live="assertive">
              {err}
            </p>
          )}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground mt-4">
        Your camera feed stays on your device — nothing is uploaded.
      </p>
    </div>
  );
}
