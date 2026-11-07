"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Loader2, Package, ShieldCheck, Sparkles } from "lucide-react";
import BrandLogo from "./BrandLogo";
import ProductImage from "./ProductImage";
import VerifyingStatus from "./VerifyingStatus";
import ResultCard, { ResultData } from "./ResultCard";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent } from "./ui/card";
import {
  BOUGHT_AT_OPTIONS,
  boughtAtSchema,
  emailSchema,
  mobileSchema,
  nameSchema,
} from "@/lib/validators";
import { PRODUCTS } from "@/lib/products";

type Stage = "details" | "product" | "verifying" | "result";

export default function VerifyForm() {
  const router = useRouter();
  const search = useSearchParams();
  const urlId = search.get("id");
  const urlVerified = search.get("verified") === "true";

  const [stage, setStage] = useState<Stage>("details");
  const [boughtAt, setBoughtAt] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [product, setProduct] = useState<string>("");
  const [recordId, setRecordId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [hydrating, setHydrating] = useState(Boolean(urlId));
  const [fromHydration, setFromHydration] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [result, setResult] = useState<ResultData | null>(null);

  useEffect(() => {
    if (!urlId || recordId) return;
    if (!/^[a-f0-9]{24}$/i.test(urlId)) {
      router.replace("/verify", { scroll: false });
      return;
    }
    let cancelled = false;
    setHydrating(true);
    (async () => {
      try {
        const res = await fetch(`/api/verify/${urlId}`);
        const json = await res.json();
        if (cancelled) return;
        if (!res.ok || !json.ok) {
          router.replace("/verify", { scroll: false });
          return;
        }
        setRecordId(urlId);
        setName(json.name);
        setFromHydration(true);
        if (json.product) setProduct(json.product);
        if (urlVerified && json.product) {
          setResult({
            name: json.name,
            product: json.product,
            verifiedAt: new Date().toISOString(),
          });
          setStage("result");
        } else {
          setStage("product");
        }
      } catch {
        if (!cancelled) router.replace("/verify", { scroll: false });
      } finally {
        if (!cancelled) setHydrating(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [urlId, urlVerified, recordId, router]);

  const mobileValid = mobileSchema.safeParse(mobile).success;
  const emailValid = emailSchema.safeParse(email).success;
  const nameValid = nameSchema.safeParse(name).success;
  const boughtValid = boughtAtSchema.safeParse(boughtAt).success;

  const canContinueDetails = useMemo(
    () => mobileValid && emailValid && nameValid && boughtValid,
    [mobileValid, emailValid, nameValid, boughtValid]
  );

  function onMobileChange(v: string) {
    setMobile(v.replace(/\D/g, "").slice(0, 10));
  }

  async function submitDetails() {
    if (!canContinueDetails || submitting) return;
    setErr(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/verify/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, mobile, boughtAt }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErr(json.error || "Could not save your details");
        return;
      }
      setRecordId(json.id);
      setStage("product");
      router.replace(`/verify?id=${json.id}`, { scroll: false });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setErr("Network error. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function pickProduct(opt: string) {
    if (finalizing) return;
    setProduct(opt);
    if (!recordId) return;
    setErr(null);
    setFinalizing(true);
    setStage("verifying");
    const startedAt = Date.now();
    try {
      const res = await fetch("/api/verify/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: recordId, product: opt }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setErr(json.error || "Could not save product selection");
        setStage("product");
        setFinalizing(false);
        return;
      }
      const minDelay = 3000;
      const elapsed = Date.now() - startedAt;
      if (elapsed < minDelay) {
        await new Promise((r) => setTimeout(r, minDelay - elapsed));
      }
      setResult({
        name,
        product: opt,
        verifiedAt: new Date().toISOString(),
      });
      setStage("result");
      router.replace(`/verify?id=${recordId}&verified=true`, { scroll: false });
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setErr("Network error. Try again.");
      setStage("product");
    } finally {
      setFinalizing(false);
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-0">
      <div className="flex flex-col items-center mb-4 sm:mb-6">
        <BrandLogo
          size={72}
          priority
          className="drop-shadow-sm sm:!w-28 sm:!h-28"
        />
        <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1.5 sm:gap-2 rounded-full border border-brandline bg-white/60 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs text-brand shadow-soft">
          <Sparkles className="h-3 w-3" aria-hidden />
          Authentic. Verified. Trusted.
        </div>
      </div>

      <AnimatePresence mode="wait">
        {hydrating && (
          <motion.div
            key="hydrating"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="overflow-hidden">
              <div className="h-1.5 bg-brand-sheen" />
              <CardContent className="p-4 sm:p-7 md:p-8">
                <div className="flex flex-col items-center mb-5 sm:mb-6 animate-pulse">
                  <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-brand/10 mb-3" />
                  <div className="h-5 sm:h-6 w-3/4 rounded bg-brand/10 mb-2" />
                  <div className="h-3 w-1/2 rounded bg-brand/10" />
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-brandline to-transparent mb-4 sm:mb-6" />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3 animate-pulse">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-brandline overflow-hidden"
                    >
                      <div className="aspect-square w-full bg-brand/10" />
                      <div className="p-2 sm:p-3 space-y-1.5">
                        <div className="h-3 w-3/4 rounded bg-brand/10" />
                        <div className="h-2 w-1/2 rounded bg-brand/10" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
        {!hydrating && stage === "details" && (
          <motion.div
            key="details"
            initial={false}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="overflow-hidden backdrop-blur-sm">
              <div className="h-1.5 bg-brand-sheen" />
              <CardContent className="p-4 sm:p-7 md:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 text-brand mb-2 sm:mb-3">
                    <ShieldCheck
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      aria-hidden
                    />
                  </div>
                  <h1 className="text-base sm:text-2xl md:text-3xl font-semibold tracking-tight shimmer-text leading-snug px-1">
                    Verify your original Crystal Glow product.
                  </h1>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                    Step 1 of 2 — tell us about yourself.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-brandline to-transparent mb-4 sm:mb-6" />

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void submitDetails();
                  }}
                  className="space-y-3.5 sm:space-y-5"
                  noValidate
                >
                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="boughtAt">Bought At</Label>
                    <Select value={boughtAt} onValueChange={setBoughtAt}>
                      <SelectTrigger id="boughtAt" aria-label="Bought At">
                        <SelectValue placeholder="Select where you bought it" />
                      </SelectTrigger>
                      <SelectContent>
                        {BOUGHT_AT_OPTIONS.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      aria-invalid={!!name && !nameValid}
                    />
                    {!nameValid && name && (
                      <p
                        className="text-xs text-destructive mt-1"
                        aria-live="polite"
                      >
                        Enter a valid name
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={!!email && !emailValid}
                    />
                    {!emailValid && email && (
                      <p
                        className="text-xs text-destructive mt-1"
                        aria-live="polite"
                      >
                        Enter a valid email
                      </p>
                    )}
                  </div>

                  <div className="space-y-1 sm:space-y-1.5">
                    <Label htmlFor="mobile">Mobile Number</Label>
                    <div className="flex items-center rounded-lg border border-brandline bg-white overflow-hidden h-10 sm:h-12 shadow-soft focus-within:ring-2 focus-within:ring-brand/30 focus-within:border-brand transition-all">
                      <span className="px-2.5 sm:px-3 h-full flex items-center text-[12px] sm:text-sm text-brand/80 bg-brand/5 border-r border-brandline shrink-0">
                        +91
                      </span>
                      <input
                        id="mobile"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        maxLength={10}
                        value={mobile}
                        onChange={(e) => onMobileChange(e.target.value)}
                        placeholder="10-digit mobile"
                        className="flex-1 min-w-0 px-2.5 sm:px-3 h-full outline-none bg-transparent text-[13px] sm:text-sm"
                        aria-invalid={!!mobile && !mobileValid}
                      />
                    </div>
                    {!mobileValid && mobile && (
                      <p
                        className="text-xs text-destructive mt-1"
                        aria-live="polite"
                      >
                        Enter a valid 10-digit mobile number
                      </p>
                    )}
                  </div>

                  {err && (
                    <p
                      className="text-sm text-destructive text-center"
                      aria-live="assertive"
                    >
                      {err}
                    </p>
                  )}

                  <div className="pt-1 sm:pt-2">
                    <Button
                      type="submit"
                      variant="gradient"
                      size="lg"
                      disabled={!canContinueDetails || submitting}
                      className="w-full"
                    >
                      {submitting ? (
                        <>
                          <Loader2 className="animate-spin" aria-hidden />
                          Saving…
                        </>
                      ) : (
                        <>
                          Continue
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            aria-hidden
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 12h14M13 5l7 7-7 7"
                            />
                          </svg>
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <p className="text-center text-xs text-muted-foreground mt-4">
              By continuing you agree to our terms. Your details are kept
              private.
            </p>
          </motion.div>
        )}

        {stage === "product" && (
          <motion.div
            key="product"
            initial={fromHydration ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <Card className="overflow-hidden backdrop-blur-sm">
              <div className="h-1.5 bg-brand-sheen" />
              <CardContent className="p-4 sm:p-7 md:p-8">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-brand/10 text-brand mb-2 sm:mb-3">
                    <Package
                      className="h-4 w-4 sm:h-6 sm:w-6"
                      aria-hidden
                    />
                  </div>
                  <h1 className="text-base sm:text-2xl md:text-3xl font-semibold tracking-tight shimmer-text leading-snug px-1">
                    Which product did you order?
                  </h1>
                  <p className="text-[11px] sm:text-sm text-muted-foreground mt-1.5 sm:mt-2">
                    Step 2 of 2 — pick the product you want to verify.
                  </p>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-brandline to-transparent mb-4 sm:mb-6" />

                <div className="space-y-3.5 sm:space-y-5">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
                    {PRODUCTS.map((p) => {
                      const selected = product === p.name;
                      return (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => void pickProduct(p.name)}
                          disabled={finalizing}
                          className={
                            "relative rounded-xl border overflow-hidden text-left shadow-soft transition-all flex flex-col disabled:opacity-60 disabled:cursor-not-allowed " +
                            (selected
                              ? "border-brand ring-2 ring-brand/30 bg-brand/5"
                              : "border-brandline bg-white hover:border-brand/40 hover:shadow-card")
                          }
                          aria-pressed={selected}
                        >
                          <div className="relative aspect-square w-full bg-brand/5 overflow-hidden">
                            <ProductImage
                              src={p.image}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                            {selected && (
                              <span
                                aria-hidden
                                className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[11px] shadow"
                              >
                                ✓
                              </span>
                            )}
                          </div>
                          <div className="p-2 sm:p-3">
                            <p className="text-[12px] sm:text-sm font-medium text-foreground leading-tight line-clamp-1">
                              {p.name}
                            </p>
                            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                              {p.tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {err && (
                    <p
                      className="text-sm text-destructive text-center"
                      aria-live="assertive"
                    >
                      {err}
                    </p>
                  )}

                  <div className="pt-1 flex justify-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setStage("details");
                        setRecordId(null);
                        setProduct("");
                        router.replace("/verify", { scroll: false });
                        if (typeof window !== "undefined") {
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }
                      }}
                      disabled={finalizing}
                    >
                      <ArrowLeft aria-hidden /> Back
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="overflow-hidden">
              <div className="h-1.5 bg-brand-sheen" />
              <CardContent className="p-6 sm:p-10">
                <VerifyingStatus />
              </CardContent>
            </Card>
          </motion.div>
        )}

        {stage === "result" && result && (
          <motion.div
            key="result"
            initial={fromHydration ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ResultCard
              data={result}
              onVerifyAgain={() => {
                setResult(null);
                setRecordId(null);
                setBoughtAt("");
                setName("");
                setEmail("");
                setMobile("");
                setProduct("");
                setErr(null);
                setFromHydration(false);
                setStage("details");
                router.replace("/verify", { scroll: false });
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
