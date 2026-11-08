"use client";

/**
 * The invitation as a short walk through five rooms, each with its own
 * arrival:
 *   1. the mandapam: blessing and names (the scene the gatefold opened onto)
 *   2. families: the invitation itself, inside a cusped arch that draws itself
 *   3. the date, set as a lockup on bottle green
 *   4. the venue, seen through an arch window
 *   5. the closing line, back on the red silk the guest first opened
 */

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarPlus, ChevronDown, Navigation } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { archMask, archPath } from "@/lib/arch";
import { downloadIcs, googleCalendarUrl } from "@/lib/calendar";
import { COUPLE, EVENT, MAPS_EMBED, MAPS_LINK } from "@/lib/config";
import MandapamScene, { JasmineStrand, Kalasha, MarigoldStrand } from "./MandapamScene";
import { Buttas, Medallion, ZariBand } from "./OpeningCard";
import "./Rooms.css";

const EASE = [0.22, 0.8, 0.26, 1] as const;

type From = "up" | "left" | "right" | "zoom";
const OFFSET: Record<From, Record<string, number>> = {
  up: { y: 44 },
  left: { x: -70 },
  right: { x: 70 },
  zoom: { scale: 0.86 },
};

/** Arrives from a direction as it scrolls into view; reduced motion just fades. */
function Reveal({ from = "up", delay = 0, className = "", children }: { from?: From; delay?: number; className?: string; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...(reduce ? {} : OFFSET[from]) }}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: reduce ? 0.4 : 1.15, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

function Names({ className = "" }: { className?: string }) {
  return (
    <p className={`rm-names ${className}`}>
      {COUPLE.partnerA} <i>&amp;</i> {COUPLE.partnerB}
    </p>
  );
}

function Rule({ light = false }: { light?: boolean }) {
  return <span className={`rm-rule ${light ? "light" : ""}`} aria-hidden />;
}

/* ------------------------------------------------------------- 1. names */

function HeroRoom() {
  return (
    <section className="relative h-svh" aria-label="Blessing and names">
      <MandapamScene still>
        <a href="#families" className="rm-cue" aria-label="Scroll to continue">
          <span>Scroll</span>
          <ChevronDown size={16} />
        </a>
      </MandapamScene>
    </section>
  );
}

/* ---------------------------------------------------------- 2. families */

function FamiliesRoom() {
  const reduce = useReducedMotion();
  const frame = archPath({ bottom: 150 });
  const outer = archPath({ x0: -4, x1: 104, top: -5, spring: 50, bottom: 150 });
  return (
    <section id="families" className="rm rm-ivory">
      <JasmineStrand className="rm-hang l" length={520} />
      <JasmineStrand className="rm-hang r" length={520} />
      <MarigoldStrand className="rm-hang m l" length={380} />
      <MarigoldStrand className="rm-hang m r" length={380} />

      <div className="rm-archbox">
        <svg viewBox="-6 -8 112 160" className="rm-archline" aria-hidden>
          <motion.path
            d={outer}
            fill="none"
            stroke="#c99a3a"
            strokeWidth=".35"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.4, ease: "easeInOut" }}
          />
          <motion.path
            d={frame}
            fill="rgba(255,252,244,.7)"
            stroke="#a8791f"
            strokeWidth=".7"
            initial={{ pathLength: reduce ? 1 : 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 2.2, ease: "easeInOut", delay: 0.15 }}
          />
        </svg>

        <div className="rm-archtext">
          <Reveal from="zoom">
            <Kalasha className="mx-auto w-11" />
          </Reveal>
          <Reveal delay={0.2}>
            <p className="rm-kicker mt-5">You are invited</p>
          </Reveal>
          <Reveal delay={0.35}>
            <p className="rm-lede mt-5">{EVENT.invite}</p>
          </Reveal>
          <Reveal delay={0.55} from="zoom">
            <Names className="mt-6" />
          </Reveal>
          <Reveal delay={0.75}>
            <Rule />
            <p className="rm-small mt-4">With the blessings of Sri Nanjundeshwara Swamy</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- 3. date */

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
    <div ref={ref} className="relative mx-auto w-full max-w-xs">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="rm-btn light w-full">
        <CalendarPlus size={16} />
        Add to calendar
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="absolute inset-x-0 top-full z-10 mt-2 overflow-hidden rounded-2xl border border-gold-light/40 bg-bottle-deep/95 text-left text-sm text-champagne shadow-xl backdrop-blur"
          >
            <a href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 hover:bg-white/5">
              Google Calendar
            </a>
            <button
              type="button"
              onClick={() => {
                downloadIcs();
                setOpen(false);
              }}
              className="block w-full border-t border-gold-light/20 px-4 py-3 text-left hover:bg-white/5"
            >
              Apple / Outlook (.ics)
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DateRoom() {
  const day = new Date(EVENT.start).toLocaleDateString("en-IN", { weekday: "long", timeZone: "Asia/Kolkata" });
  const date = new Date(EVENT.start);
  const dd = date.toLocaleDateString("en-IN", { day: "numeric", timeZone: "Asia/Kolkata" });
  const month = date.toLocaleDateString("en-IN", { month: "long", timeZone: "Asia/Kolkata" });
  const year = date.toLocaleDateString("en-IN", { year: "numeric", timeZone: "Asia/Kolkata" });
  return (
    <section className="rm rm-green" aria-label="Date and time">
      <div className="rm-in text-center">
        <Reveal>
          <p className="rm-kicker light">Save the date</p>
        </Reveal>
        <Reveal delay={0.15}>
          <p className="rm-month">{month}</p>
        </Reveal>

        <div className="rm-lockup" aria-label={`${day} ${dd} ${month} ${year}`}>
          <Reveal from="left" delay={0.3} className="rm-side">
            {day}
          </Reveal>
          <Reveal from="zoom" delay={0.2} className="rm-day">
            {dd}
          </Reveal>
          <Reveal from="right" delay={0.3} className="rm-side">
            {year}
          </Reveal>
        </div>

        <Reveal delay={0.55}>
          <p className="rm-time">{EVENT.time}</p>
          <p className="rm-small light mt-1">{EVENT.meal}</p>
        </Reveal>
        <Reveal delay={0.7} className="mt-9">
          <CalendarButton />
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- 4. venue */

/** Shown in the arch until a real photograph is added at public/images/venue.jpg. */
function PalaceSketch() {
  return (
    <svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMax slice" className="h-full w-full" aria-hidden>
      <defs>
        <linearGradient id="ps-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f3d9a4" />
          <stop offset=".55" stopColor="#e9b979" />
          <stop offset="1" stopColor="#c98a52" />
        </linearGradient>
        <linearGradient id="ps-wall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#fbf3e2" />
          <stop offset="1" stopColor="#e4cfa6" />
        </linearGradient>
      </defs>
      <rect width="100" height="150" fill="url(#ps-sky)" />
      <circle cx="74" cy="44" r="9" fill="#fff4d6" opacity=".7" />
      <g fill="url(#ps-wall)" stroke="#a8791f" strokeWidth=".4">
        {/* central dome and drum */}
        <path d="M38 78 Q38 58 50 52 Q62 58 62 78 Z" />
        <line x1="50" y1="52" x2="50" y2="45" />
        <circle cx="50" cy="44.5" r="1.2" fill="#c99a3a" />
        <rect x="36" y="78" width="28" height="8" />
        {/* side chhatris */}
        {[16, 84].map((x) => (
          <g key={x}>
            <path d={`M${x - 7} 92 Q${x - 7} 82 ${x} 79 Q${x + 7} 82 ${x + 7} 92 Z`} />
            <rect x={x - 8} y="92" width="16" height="4" />
          </g>
        ))}
        {/* facade */}
        <rect x="6" y="96" width="88" height="40" />
        <rect x="30" y="86" width="40" height="50" />
      </g>
      <g fill="#7a5512" opacity=".55">
        {[10, 19, 75, 84].map((x) => (
          <path key={x} d={`M${x} 132 V114 Q${x + 3.5} 108 ${x + 7} 114 V132 Z`} />
        ))}
        {[34, 45, 56].map((x) => (
          <path key={x} d={`M${x} 132 V106 Q${x + 5} 98 ${x + 10} 106 V132 Z`} />
        ))}
      </g>
      <rect y="136" width="100" height="14" fill="#2f5b3f" />
      <rect y="136" width="100" height="1" fill="#e9cd86" />
    </svg>
  );
}

function VenueRoom() {
  const [photo, setPhoto] = useState(false);
  useEffect(() => {
    fetch("/images/venue.jpg", { method: "HEAD" })
      .then((r) => r.ok && (r.headers.get("content-type") ?? "").startsWith("image") && setPhoto(true))
      .catch(() => {});
  }, []);
  const mask = archMask(150);
  return (
    <section id="venue" className="rm rm-ivory" aria-label="Venue">
      <div className="rm-in rm-in--wide grid items-center gap-12 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:gap-16">
        <Reveal from="left" className="rm-window-wrap">
          <div className="rm-window" style={{ maskImage: mask, WebkitMaskImage: mask }}>
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src="/images/venue.jpg" alt={`${EVENT.venue.name}, ${EVENT.venue.address}`} className="h-full w-full object-cover" />
            ) : (
              <PalaceSketch />
            )}
          </div>
          <svg viewBox="-5 -7 110 162" className="rm-window-line" aria-hidden>
            <path d={archPath({ x0: -3.5, x1: 103.5, top: -4.5, spring: 50, bottom: 153.5 })} fill="none" stroke="#c99a3a" strokeWidth=".4" />
            <path d={archPath({ bottom: 150 })} fill="none" stroke="#a8791f" strokeWidth=".9" />
          </svg>
        </Reveal>

        <div className="text-center md:text-left">
          <Reveal from="right">
            <p className="rm-kicker">The venue</p>
            <h2 className="rm-title mt-4">{EVENT.venue.name}</h2>
            <p className="rm-lede mt-2">{EVENT.venue.address}</p>
            <p className="rm-small mt-2">{EVENT.venue.note}</p>
          </Reveal>
          <Reveal from="right" delay={0.2} className="mt-8">
            <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="rm-btn">
              <Navigation size={16} />
              Get directions
            </a>
          </Reveal>
        </div>

        <Reveal className="md:col-span-2">
          <iframe
            title={`${EVENT.venue.name} map`}
            src={MAPS_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-72 w-full rounded-[1.25rem] border border-gold/30 shadow-[0_30px_60px_-30px_rgba(18,51,41,0.5)] sepia-[0.2] md:h-80"
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ----------------------------------------------------------- 5. closing */

function ClosingRoom() {
  return (
    <section className="rm rm-silk" aria-label="Closing">
      <Buttas />
      <ZariBand horizontal className="rm-zari top" />
      <ZariBand horizontal className="rm-zari bottom" />
      <div className="rm-in relative text-center">
        <Reveal from="zoom">
          <div className="rm-medal">
            <Medallion />
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="rm-closing">{EVENT.blessing}</p>
        </Reveal>
        <Reveal delay={0.45}>
          <Rule light />
          <p className="rm-kicker light mt-5">{EVENT.regards}</p>
          <Names className="light mt-6" />
        </Reveal>
      </div>
    </section>
  );
}

export default function Rooms() {
  return (
    <div className="relative">
      <HeroRoom />
      <FamiliesRoom />
      <DateRoom />
      <VenueRoom />
      <ClosingRoom />
    </div>
  );
}
