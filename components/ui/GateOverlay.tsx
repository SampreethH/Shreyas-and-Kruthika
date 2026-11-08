"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronsUp } from "lucide-react";
import { COUPLE } from "@/lib/config";

/** Sacred medallion CTA and gate titling, layered over the 3D doors. */
export default function GateOverlay({ visible, onEnter }: { visible: boolean; onEnter: () => void }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-between px-4 pb-8 pt-[4.5rem] sm:pt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
        >
          <motion.header
            className="rounded-2xl bg-ivory/55 px-4 py-1 text-center backdrop-blur-sm sm:rounded-3xl sm:px-6 sm:py-2"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 1.4 }}
          >
            <h1 className="font-display text-gold-gradient text-xl font-bold leading-snug sm:text-3xl">
              {COUPLE.partnerA} &amp; {COUPLE.partnerB}
            </h1>
            <p className="text-xs uppercase tracking-[0.3em] text-gold-deep">Engagement Ceremony</p>
          </motion.header>

          <motion.button
            type="button"
            onClick={onEnter}
            className="pointer-events-auto group relative grid size-44 place-items-center rounded-full sm:size-52"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.1, type: "spring", stiffness: 90, damping: 14 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Enter the Sanctum"
          >
            <span className="absolute inset-0 animate-pulse-ring rounded-full border-2 border-gold/60" />
            <span className="absolute inset-0 animate-pulse-ring rounded-full border border-gold/40 [animation-delay:1.3s]" />
            {/* Rotating chakra-petal halo */}
            <svg viewBox="0 0 200 200" className="absolute inset-0 animate-spin-slow">
              <defs>
                <linearGradient id="medal" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0" stopColor="#E8CF8E" />
                  <stop offset="0.5" stopColor="#A8791F" />
                  <stop offset="1" stopColor="#7A5512" />
                </linearGradient>
              </defs>
              {Array.from({ length: 32 }, (_, i) => (
                <path
                  key={i}
                  d="M100 4 Q104 14 100 22 Q96 14 100 4Z"
                  fill="url(#medal)"
                  transform={`rotate(${(i * 360) / 32} 100 100)`}
                  opacity={i % 2 ? 0.6 : 1}
                />
              ))}
              <circle cx="100" cy="100" r="74" fill="none" stroke="url(#medal)" strokeWidth="1.2" strokeDasharray="2 5" />
            </svg>
            <span className="absolute inset-[18%] rounded-full border border-gold-light bg-[radial-gradient(circle_at_40%_30%,#ffffff,#fbf3df_45%,#ecd59c_100%)] shadow-[0_0_50px_6px_rgba(232,207,142,0.8),0_10px_30px_-8px_rgba(122,85,18,0.6),inset_0_-6px_16px_rgba(168,121,31,0.35)] transition group-hover:shadow-[0_0_80px_16px_rgba(232,207,142,0.95),0_10px_30px_-8px_rgba(122,85,18,0.6),inset_0_-6px_16px_rgba(168,121,31,0.35)]" />
            <span className="relative flex flex-col items-center px-6 text-center">
              <span className="font-serif text-xs font-semibold italic leading-tight text-kumkuma sm:text-sm">Om Namah Shivaya</span>
              <span className="font-display mt-1 text-base font-bold leading-tight text-gold-deep sm:text-lg">Welcome</span>
              <span className="mt-0.5 text-[0.65rem] uppercase tracking-[0.2em] text-ink/70">Tap to open</span>
            </span>
          </motion.button>

          <motion.p
            className="flex flex-col items-center gap-1 rounded-full bg-ivory/55 px-5 py-2 text-center backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="flex items-center gap-2 text-sm text-ink/80">
              <ChevronsUp size={14} className="animate-bounce text-gold" />
              Tap the medallion or swipe up to open
            </span>
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
