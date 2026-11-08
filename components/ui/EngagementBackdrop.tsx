"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";
import { EngagementRings, FloralSpray } from "./EngagementArt";

/**
 * Engagement-themed background behind the sanctum: floral sprays in the
 * corners, faint rings, and blush petals drifting down.
 */
export default function EngagementBackdrop() {
  const petals = useMemo(
    () =>
      Array.from({ length: 16 }, (_, i) => ({
        left: (i * 61) % 100,
        size: 10 + ((i * 7) % 12),
        delay: (i * 1.7) % 14,
        duration: 14 + ((i * 5) % 10),
        drift: ((i % 2 ? 1 : -1) * (20 + ((i * 13) % 40))),
        hue: ["#f6c6cf", "#f2b3c0", "#fbe3e7", "#e8c46a"][i % 4],
      })),
    [],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,#fffaf2,#fbf1e6_55%,#f6e6dc)]" />

      {/* Corner sprays, as on the printed card */}
      <motion.div className="absolute -left-10 -top-10 w-64 sm:w-96 lg:w-[30rem]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6 }}>
        <FloralSpray className="w-full" />
      </motion.div>
      <motion.div className="absolute -bottom-10 -right-10 w-64 rotate-180 sm:w-96 lg:w-[30rem]" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: 0.3 }}>
        <FloralSpray className="w-full" />
      </motion.div>
      <motion.div className="absolute -right-8 -top-8 hidden w-56 -scale-x-100 opacity-70 md:block lg:w-72" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 1.6, delay: 0.5 }}>
        <FloralSpray className="w-full" />
      </motion.div>
      <motion.div className="absolute -bottom-8 -left-8 hidden w-56 -scale-y-100 opacity-70 md:block lg:w-72" initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ duration: 1.6, delay: 0.7 }}>
        <FloralSpray className="w-full" />
      </motion.div>

      {/* Faint rings either side of the card on wide screens */}
      <EngagementRings wreath={false} className="absolute left-[6%] top-[42%] hidden w-48 -rotate-12 opacity-25 lg:block" />
      <EngagementRings wreath={false} className="absolute right-[6%] top-[22%] hidden w-40 rotate-12 opacity-20 lg:block" />

      {/* Drifting petals */}
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal absolute -top-8 block rounded-[60%_0_60%_0]"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size * 0.8,
            background: p.hue,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            ["--drift" as string]: `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
