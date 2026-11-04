"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const MESSAGES = [
  "Checking product code…",
  "Validating batch…",
  "Confirming authenticity…",
];

export default function VerifyingAnimation() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % MESSAGES.length);
    }, 650);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="flex flex-col items-center gap-6 py-4"
      aria-live="polite"
      role="status"
    >
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <motion.div
          className="absolute inset-0 rounded-full bg-brand/10 blur-xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <svg viewBox="0 0 100 100" className="relative w-full h-full" aria-hidden>
          <circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="#e6f2f2"
            strokeWidth="6"
          />
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="276"
            initial={{ strokeDashoffset: 276, rotate: -90 }}
            animate={{ strokeDashoffset: 0, rotate: 270 }}
            transition={{ duration: 1.8, ease: "easeInOut" }}
            style={{ transformOrigin: "50% 50%" }}
          />
          <motion.path
            d="M30 52 L45 67 L72 38"
            fill="none"
            stroke="#008080"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2, ease: "easeOut" }}
          />
          <defs>
            <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#008080" />
              <stop offset="100%" stopColor="#4CA3A3" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="text-brand font-medium text-center tracking-wide"
        >
          {MESSAGES[idx]}
        </motion.p>
      </AnimatePresence>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-brand"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    </div>
  );
}
