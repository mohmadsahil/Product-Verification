"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Fingerprint, ScanLine, ShieldCheck } from "lucide-react";

type Step = {
  message: string;
  Icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  { message: "We're getting your details…", Icon: Fingerprint },
  { message: "Scanning product signature…", Icon: ScanLine },
  { message: "Verifying authenticity…", Icon: ShieldCheck },
];

const STEP_MS = 1000;

export default function VerifyingStatus() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setIdx((i) => (i + 1 < STEPS.length ? i + 1 : i)),
      STEP_MS
    );
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="relative flex flex-col items-center gap-6 sm:gap-7 py-2"
      aria-live="polite"
      role="status"
    >
      {/* Floating particles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {[
          { x: "10%", y: "20%", d: 3.2 },
          { x: "85%", y: "15%", d: 2.8 },
          { x: "15%", y: "75%", d: 3.6 },
          { x: "80%", y: "70%", d: 3.0 },
          { x: "50%", y: "90%", d: 3.4 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-brand/40"
            style={{ left: p.x, top: p.y }}
            animate={{
              y: [0, -14, 0],
              opacity: [0, 0.8, 0],
              scale: [0.6, 1, 0.6],
            }}
            transition={{
              duration: p.d,
              repeat: Infinity,
              delay: i * 0.3,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* 3-icon progression */}
      <div className="relative flex items-center justify-center gap-3 sm:gap-5 z-10">
        {STEPS.map((s, i) => {
          const done = i < idx;
          const active = i === idx;
          const Icon = s.Icon;
          return (
            <div key={i} className="flex items-center">
              <div className="relative">
                {/* Halo for active */}
                {active && (
                  <motion.span
                    aria-hidden
                    className="absolute inset-0 rounded-full bg-brand/30 blur-xl"
                    animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.1, repeat: Infinity }}
                  />
                )}
                {/* Spinning ring for active */}
                {active && (
                  <svg
                    viewBox="0 0 80 80"
                    className="absolute inset-0 w-full h-full"
                    aria-hidden
                  >
                    <defs>
                      <linearGradient id={`spin-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#008080" />
                        <stop offset="100%" stopColor="#4CA3A3" />
                      </linearGradient>
                    </defs>
                    <motion.circle
                      cx="40"
                      cy="40"
                      r="36"
                      fill="none"
                      stroke={`url(#spin-${i})`}
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeDasharray="90 230"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                      style={{ transformOrigin: "40px 40px" }}
                    />
                  </svg>
                )}

                {/* Icon tile */}
                <motion.div
                  initial={false}
                  animate={{
                    scale: active ? 1.08 : 1,
                  }}
                  transition={{ type: "spring", stiffness: 240, damping: 16 }}
                  className={
                    "relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-soft transition-colors duration-300 " +
                    (done || active
                      ? "bg-brand-sheen text-white"
                      : "bg-brand/10 text-brand/40 border border-brandline")
                  }
                >
                  <AnimatePresence mode="wait">
                    {done ? (
                      <motion.span
                        key="check"
                        initial={{ scale: 0, rotate: -40 }}
                        animate={{ scale: 1, rotate: 0 }}
                        exit={{ scale: 0 }}
                        transition={{ type: "spring", stiffness: 280, damping: 18 }}
                      >
                        <Check className="w-6 h-6 sm:w-7 sm:h-7" aria-hidden />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="icon"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>
              </div>

              {/* Connector */}
              {i < STEPS.length - 1 && (
                <span className="relative block h-[3px] w-8 sm:w-12 bg-brand/15 rounded-full mx-1 overflow-hidden">
                  <motion.span
                    className="absolute inset-y-0 left-0 bg-brand-sheen rounded-full"
                    initial={false}
                    animate={{ width: i < idx ? "100%" : "0%" }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  />
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Message */}
      <div className="h-6 flex items-center justify-center relative z-10">
        <AnimatePresence mode="wait">
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
            transition={{ duration: 0.3 }}
            className="text-sm sm:text-base font-medium shimmer-text tracking-wide text-center"
          >
            {STEPS[idx].message}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-[240px] h-1.5 rounded-full bg-brand/10 overflow-hidden relative z-10">
        <motion.div
          className="h-full rounded-full bg-brand-sheen"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: (STEPS.length * STEP_MS) / 1000, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
}
