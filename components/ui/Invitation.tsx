"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarPlus, Clock, MapPin, UtensilsCrossed } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { COUPLE, EVENT, MAPS_LINK } from "@/lib/config";
import { EngagementRings, FloralSpray } from "./EngagementArt";
import Torana from "./Torana";

const rise = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 1.1, ease: [0.2, 0.7, 0.2, 1] as const },
});

function CalendarButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-[#c99a3a] px-5 py-3 text-sm font-medium text-pearl shadow-[0_12px_30px_-12px_rgba(122,85,18,0.8)] transition hover:brightness-110"
      >
        <CalendarPlus size={17} />
        Add to Calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="glass absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl text-sm"
          >
            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-ink/80 hover:bg-gold-light/30">
              Google Calendar
            </a>
            <button
              onClick={() => {
                downloadIcs();
                setOpen(false);
              }}
              className="block w-full border-t border-gold/15 px-4 py-3 text-left text-ink/80 hover:bg-gold-light/30"
            >
              Apple / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Ornament() {
  return (
    <div className="mx-auto my-4 flex w-48 items-center gap-3 text-gold" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 21s-7.5-4.6-9.5-9.2C1 8.3 3.4 5 6.8 5c2 0 3.6 1.1 4.2 2.6h2C13.6 6.1 15.2 5 17.2 5 20.6 5 23 8.3 21.5 11.8 19.5 16.4 12 21 12 21Z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

export default function Invitation() {
  const { partnerA: a, partnerB: b } = COUPLE;
  return (
    <section id="invitation" className="relative flex min-h-svh items-start justify-center px-3 pb-20 pt-20 sm:px-6 sm:pt-16">
      <div className="relative w-full max-w-2xl">
        {/* Torana strung across the top of the card */}
        <motion.div
          className="pointer-events-none absolute -top-6 left-1/2 z-20 w-[112%] -translate-x-1/2 sm:-top-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.2, 0.7, 0.2, 1] }}
        >
          <Torana className="w-full drop-shadow-[0_8px_10px_rgba(122,85,18,0.25)]" />
        </motion.div>

        <motion.article
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
          className="dome gold-border relative overflow-hidden bg-gradient-to-b from-pearl/90 via-ivory/85 to-[#fbefe6]/90 px-5 pb-12 pt-20 text-center shadow-[0_50px_120px_-40px_rgba(122,85,18,0.55)] backdrop-blur-[3px] sm:px-12 sm:pt-32"
        >
          {/* Inner hairline frame */}
          <div className="dome pointer-events-none absolute inset-3 border border-gold/35" aria-hidden />
          <FloralSpray className="pointer-events-none absolute -bottom-6 -left-6 w-32 -scale-y-100 opacity-90 sm:w-44" />
          <FloralSpray className="pointer-events-none absolute -bottom-6 -right-6 w-32 rotate-180 opacity-90 sm:w-44" />

          <motion.div {...rise(0.3)}>
            <EngagementRings className="mx-auto w-44 sm:w-52" />
          </motion.div>

          <motion.p {...rise(0.5)} className="mt-3 font-serif text-lg font-semibold tracking-wide text-kumkuma sm:text-xl">
            {EVENT.blessingLine}
          </motion.p>

          <motion.p {...rise(0.7)} className="mx-auto mt-4 max-w-sm font-serif text-xl leading-snug text-ink/75 sm:text-2xl">
            {/* Highlight the occasion inside the sentence rather than repeating it below the names */}
            {EVENT.invite.split(EVENT.occasion).map((part, i, parts) => (
              <span key={i}>
                {part}
                {i < parts.length - 1 && <strong className="font-bold text-kumkuma">{EVENT.occasion}</strong>}
              </span>
            ))}
          </motion.p>

          <h1 className="mt-6" aria-label={`${a} & ${b}`}>
            <motion.span {...rise(1)} className="block font-display text-[2.6rem] font-bold leading-none text-gold-gradient sm:text-6xl">
              {a.toUpperCase()}
            </motion.span>
            <motion.span {...rise(1.2)} className="my-2 flex items-center justify-center gap-4 font-serif text-4xl italic leading-none text-[#c98a6b] sm:text-5xl">
              <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/60" />
              &amp;
              <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/60" />
            </motion.span>
            <motion.span {...rise(1.4)} className="block font-display text-[2.6rem] font-bold leading-none text-gold-gradient sm:text-6xl">
              {b.toUpperCase()}
            </motion.span>
          </h1>

          {/* Date cartouche */}
          <motion.div {...rise(1.8)} className="relative mx-auto mt-6 max-w-md">
            <div className="rounded-full border-2 border-gold/50 bg-pearl/80 px-6 py-3 shadow-[inset_0_0_0_4px_rgba(255,255,255,0.9),inset_0_0_0_5px_rgba(168,121,31,0.3)]">
              <p className="font-serif text-xl font-semibold text-ink sm:text-2xl">On {EVENT.date}</p>
            </div>
          </motion.div>

          <motion.div {...rise(2)} className="mx-auto mt-5 flex max-w-xs flex-col items-center gap-1 rounded-2xl border border-gold/20 bg-pearl/60 px-4 py-3 text-ink">
            <Clock size={18} className="text-gold" />
            <span className="text-xs uppercase tracking-[0.25em] text-gold">Time</span>
            <span className="font-serif text-xl leading-snug">{EVENT.time}</span>
            <span className="flex items-center gap-2 font-serif text-lg leading-snug text-ink/75">
              <UtensilsCrossed size={15} className="text-gold" />
              {EVENT.meal}
            </span>
          </motion.div>

          <Ornament />

          <motion.div {...rise(2.2)}>
            <p className="eyebrow">Venue</p>
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="group mt-1 inline-block">
              <span className="block text-base font-semibold uppercase tracking-[0.12em] text-ink underline decoration-gold/40 underline-offset-4 group-hover:text-gold-deep sm:text-lg">
                {EVENT.venue.name},
              </span>
              <span className="block text-base font-semibold uppercase tracking-[0.12em] text-ink underline decoration-gold/40 underline-offset-4 group-hover:text-gold-deep sm:text-lg">
                {EVENT.venue.address}
              </span>
            </a>
            <p className="mt-2 font-serif text-lg italic text-ink/70">({EVENT.venue.note})</p>
          </motion.div>

          <motion.div {...rise(2.4)} className="mx-auto mt-6 max-w-md">
            <p className="font-serif text-xl italic leading-snug text-ink/70">{EVENT.blessing}</p>
            <Ornament />
            <p className="font-serif text-lg text-gold-deep">{EVENT.regards}</p>
          </motion.div>

          <motion.div {...rise(2.6)} className="relative z-10 mx-auto mt-8 grid max-w-sm gap-3">
            <CalendarButton />
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-full border border-gold/50 bg-pearl/80 px-5 py-3 text-sm font-medium text-gold-deep transition hover:bg-gold-light/30"
            >
              <MapPin size={17} />
              View Location
            </a>
          </motion.div>
        </motion.article>
      </div>
    </section>
  );
}
