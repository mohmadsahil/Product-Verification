"use client";

import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, RotateCcw } from "lucide-react";
import ProductImage from "./ProductImage";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { PRODUCTS } from "@/lib/products";

export interface ResultData {
  name: string;
  product: string;
  verifiedAt?: string;
}

interface Props {
  data: ResultData;
  onVerifyAgain?: () => void;
}

async function fireConfetti() {
  if (typeof window === "undefined") return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const mod = await import("canvas-confetti");
  mod.default({
    particleCount: 160,
    spread: 85,
    origin: { y: 0.35 },
    colors: ["#008080", "#4CA3A3", "#d6eaea", "#ffffff", "#66b1b1"],
  });
}

export default function ResultCard({ data, onVerifyAgain }: Props) {
  useEffect(() => {
    void fireConfetti();
  }, []);

  const productItem = useMemo(
    () => PRODUCTS.find((p) => p.name === data.product),
    [data.product]
  );

  return (
    <Card className="overflow-hidden">
      <div className="h-1.5 bg-brand-sheen" />
      <CardContent className="p-5 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 14 }}
            className="relative"
          >
            <div className="absolute inset-0 rounded-full bg-brand/25 blur-xl animate-pulse" />
            <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-brand-sheen flex items-center justify-center shadow-card">
              <CheckCircle2
                className="w-7 h-7 sm:w-10 sm:h-10 text-white"
                aria-hidden
              />
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 sm:mt-5 text-lg sm:text-2xl md:text-3xl font-bold text-brand tracking-tight"
          >
            Verification Successful
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-2 sm:mt-3 text-xs sm:text-base text-foreground max-w-md leading-relaxed"
          >
            Thank you, <span className="font-semibold">{data.name}</span>. Your
            product has been verified successfully.
          </motion.p>

          {productItem && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5 sm:mt-6 w-full max-w-sm rounded-xl border border-brandline bg-white shadow-soft overflow-hidden flex items-center gap-3 p-3 sm:p-4"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-brand/5 shrink-0">
                <ProductImage
                  src={productItem.image}
                  alt={productItem.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] uppercase tracking-wider text-brand/70 font-medium">
                  Verified product
                </p>
                <p className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {productItem.name}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
                  {productItem.tagline}
                </p>
              </div>
              <span
                aria-hidden
                className="w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs shrink-0"
              >
                ✓
              </span>
            </motion.div>
          )}

          {data.verifiedAt && (
            <p className="mt-3 text-[11px] sm:text-xs text-muted-foreground">
              Verified on {new Date(data.verifiedAt).toLocaleString()}
            </p>
          )}

          {onVerifyAgain && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-5 sm:mt-6 w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="gradient"
                size="lg"
                onClick={onVerifyAgain}
                className="w-full sm:w-auto"
              >
                <RotateCcw aria-hidden /> Verify Again
              </Button>
            </motion.div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
