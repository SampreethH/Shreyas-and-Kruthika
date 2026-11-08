"use client";

/**
 * The opening card: a silk gatefold, closed with a gold-foil medallion.
 *
 * Two panels of vermilion Kanjeevaram silk meet at the centre fold. Each
 * carries a gold zari temple border along the fold and scattered gold
 * buttas. The medallion is struck across the fold, so each panel holds one
 * half of it (S on one side, K on the other) and it splits as they open.
 *
 * Tapping the medallion runs the sequence, driven by classes on the root:
 *   s1  the medallion is pressed, the hints fade
 *   s2  a ring of gold light leaves the seal, the panels swing open on their
 *       outer hinges, darkening as they turn away from the light
 *   s3  the ivory card inside is read, line by line
 *   s4  the card comes towards the guest and the whole opening dissolves
 *       into the invitation, which is already rising underneath
 */

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { COUPLE } from "@/lib/config";
import MandapamScene from "./MandapamScene";
import "./OpeningCard.css";

type Step = 0 | 1 | 2 | 3 | 4;

// Server and browser trig can differ in the last digit; round so hydration matches.
const r2 = (n: number) => Math.round(n * 100) / 100;

/* ---------------------------------------------------------------- zari */

type Pt = [number, number];
const pts = (p: Pt[], h: boolean) => p.map(([x, y]) => (h ? `${y},${x}` : `${x},${y}`)).join(" ");

/**
 * A temple ("gopuram") zari border: a solid gold band with a chain of
 * diamonds woven into it and a row of triangles pointing into the silk.
 * Drawn vertically; `horizontal` transposes every coordinate.
 */
export function ZariBand({ horizontal = false, className = "" }: { horizontal?: boolean; className?: string }) {
  const id = `z${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const h = horizontal;
  const tri = pts([[18, 0], [3, 8], [18, 16]], h);
  const triIn = pts([[15.5, 3.6], [8.2, 8], [15.5, 12.4]], h);
  const dia = pts([[30, 1.5], [34.5, 7], [30, 12.5], [25.5, 7]], h);
  const r = (x: number, w: number) => (h ? { x: 0, y: x, width: "100%", height: w } : { x, y: 0, width: w, height: "100%" });
  const line = (x: number) => (h ? { x1: 0, x2: "100%", y1: x, y2: x } : { x1: x, x2: x, y1: 0, y2: "100%" });

  return (
    <svg className={className} aria-hidden width={h ? "100%" : 42} height={h ? 42 : "100%"}>
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2={h ? "0" : "1"} y2={h ? "1" : "0"}>
          <stop offset="0" stopColor="#b5852e" />
          <stop offset=".35" stopColor="#f2dc9c" />
          <stop offset=".62" stopColor="#c99a3a" />
          <stop offset="1" stopColor="#8a6118" />
        </linearGradient>
        <pattern id={`${id}t`} width={h ? 16 : 42} height={h ? 42 : 16} patternUnits="userSpaceOnUse">
          <polygon points={tri} fill={`url(#${id}g)`} />
          <polygon points={triIn} fill="#6f1512" />
          <circle cx={h ? 8 : 12.6} cy={h ? 12.6 : 8} r="1.15" fill="#f2dc9c" />
        </pattern>
        <pattern id={`${id}d`} width={h ? 14 : 42} height={h ? 42 : 14} patternUnits="userSpaceOnUse">
          <polygon points={dia} fill="#7a1a14" />
          <circle cx={h ? 7 : 30} cy={h ? 30 : 7} r="1.3" fill="#f6e3ad" />
        </pattern>
      </defs>
      <rect {...r(0, 42)} fill={`url(#${id}t)`} />
      <rect {...r(18, 24)} fill={`url(#${id}g)`} />
      <rect {...r(18, 24)} fill={`url(#${id}d)`} />
      <line {...line(21.2)} stroke="#7a1a14" strokeWidth=".7" opacity=".75" />
      <line {...line(38.8)} stroke="#7a1a14" strokeWidth=".7" opacity=".75" />
      <line {...line(18.4)} stroke="#fff2c8" strokeWidth=".6" opacity=".8" />
    </svg>
  );
}

/** Scattered gold buttas (small mango motifs), the way they are woven into the body of a silk saree. */
export function Buttas() {
  const id = `b${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const mango = "M0 -10 C7 -9 10 -2 8 4 C6 9 0 11 -4 9.5 C-8 8 -9 3 -6 0 C-3 -3 2 -2 1 -6 C0.6 -8 -0.8 -9.4 0 -10Z";
  const butta = (x: number, y: number, rot: number, s: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d={mango} fill={`url(#${id}g)`} />
      <path d="M-1 3 C1 5 4 4 4.5 1" fill="none" stroke="#7a1a14" strokeWidth=".9" opacity=".7" />
      <circle cx="-1.2" cy="2.5" r="1.4" fill="#7a1a14" opacity=".55" />
    </g>
  );
  return (
    <svg className="oc-buttas" aria-hidden width="100%" height="100%">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f4dfa2" />
          <stop offset=".55" stopColor="#c99a3a" />
          <stop offset="1" stopColor="#8a6118" />
        </linearGradient>
        <pattern id={`${id}p`} width="76" height="88" patternUnits="userSpaceOnUse">
          {butta(19, 22, -18, 0.62)}
          {butta(57, 66, 18, 0.62)}
          {[[57, 22], [19, 66]].map(([x, y]) => (
            <g key={`${x}-${y}`} fill="#e9cd86" opacity=".7">
              <circle cx={x} cy={y} r="1.1" />
              <circle cx={x - 4} cy={y} r=".55" />
              <circle cx={x + 4} cy={y} r=".55" />
              <circle cx={x} cy={y - 4} r=".55" />
              <circle cx={x} cy={y + 4} r=".55" />
            </g>
          ))}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id}p)`} />
    </svg>
  );
}

/* ------------------------------------------------------------ medallion */

/**
 * Gold-foil medallion. Foil is not a mirror: one broad warm highlight, a
 * scalloped edge where the die cut it, a beaded ring, and lettering that
 * is pressed INTO the foil (dark face, light lower lip), not printed on it.
 */
export function Medallion() {
  const id = `m${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const ring = `${COUPLE.partnerA} ✦ ${COUPLE.partnerB} ✦ 26 · XI · MMXXVI ✦`.toUpperCase();
  return (
    <svg viewBox="0 0 200 200" className="oc-medal-svg" aria-hidden>
      <defs>
        <radialGradient id={`${id}f`} cx="36%" cy="28%" r="80%">
          <stop offset="0" stopColor="#fff4d2" />
          <stop offset=".24" stopColor="#ecd08a" />
          <stop offset=".58" stopColor="#c49b47" />
          <stop offset=".86" stopColor="#94691f" />
          <stop offset="1" stopColor="#6d4b12" />
        </radialGradient>
        <radialGradient id={`${id}i`} cx="42%" cy="34%" r="75%">
          <stop offset="0" stopColor="#f6e2a8" />
          <stop offset=".6" stopColor="#d3ad5c" />
          <stop offset="1" stopColor="#a47a2c" />
        </radialGradient>
        <linearGradient id={`${id}s`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset=".5" stopColor="#fffaf0" stopOpacity=".75" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <path id={`${id}c`} d="M100 100 m-61 0 a61 61 0 1 1 122 0 a61 61 0 1 1 -122 0" />
        <clipPath id={`${id}k`}>
          <circle cx="100" cy="100" r="96" />
        </clipPath>
      </defs>

      {/* die-cut scalloped edge */}
      <g fill={`url(#${id}f)`}>
        <circle cx="100" cy="100" r="88" />
        {Array.from({ length: 36 }, (_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return <circle key={i} cx={r2(100 + Math.cos(a) * 88)} cy={r2(100 + Math.sin(a) * 88)} r="8.2" />;
        })}
      </g>
      {/* beaded ring */}
      {Array.from({ length: 56 }, (_, i) => {
        const a = (i / 56) * Math.PI * 2;
        return (
          <g key={i}>
            <circle cx={r2(100 + Math.cos(a) * 80)} cy={r2(100.7 + Math.sin(a) * 80)} r="1.75" fill="#6d4b12" opacity=".45" />
            <circle cx={r2(100 + Math.cos(a) * 80)} cy={r2(100 + Math.sin(a) * 80)} r="1.6" fill="#fff0c4" opacity=".9" />
          </g>
        );
      })}
      {/* engraved double rule: a dark cut with a lit edge below it */}
      <circle cx="100" cy="100" r="72.5" fill="none" stroke="#6d4b12" strokeWidth="1.1" opacity=".75" />
      <circle cx="100" cy="100.8" r="72.5" fill="none" stroke="#fff3cc" strokeWidth=".6" opacity=".7" />
      {/* names around the ring */}
      <text fontSize="8.6" letterSpacing="1.6" fill="#5d3f0f" style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 500 }}>
        <textPath href={`#${id}c`} startOffset="0" textLength="376" lengthAdjust="spacing">
          {ring}
        </textPath>
      </text>
      <circle cx="100" cy="100" r="51" fill="none" stroke="#6d4b12" strokeWidth="1" opacity=".7" />
      <circle cx="100" cy="100" r="50" fill={`url(#${id}i)`} />
      {/* guilloché rosette in the well */}
      <g fill="none" stroke="#8a6118" strokeWidth=".45" opacity=".32">
        {Array.from({ length: 18 }, (_, i) => (
          <ellipse key={i} cx="100" cy="100" rx="47" ry="17" transform={`rotate(${i * 10} 100 100)`} />
        ))}
      </g>
      <circle cx="100" cy="100" r="50" fill="none" stroke="#fff3cc" strokeWidth=".8" opacity=".6" />

      {/* monogram, pressed into the foil: S on one panel, K on the other */}
      <g style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 600 }} fontSize="50" textAnchor="middle">
        <text x="78" y="118" fill="#fff3cc" opacity=".75">{COUPLE.partnerA[0]}</text>
        <text x="78" y="116.8" fill="#5d3f0f">{COUPLE.partnerA[0]}</text>
        <text x="123" y="118" fill="#fff3cc" opacity=".75">{COUPLE.partnerB[0]}</text>
        <text x="123" y="116.8" fill="#5d3f0f">{COUPLE.partnerB[0]}</text>
      </g>
      <path d="M100 86 L104 100 L100 114 L96 100 Z" fill="#5d3f0f" />
      <circle cx="100" cy="100" r="1.6" fill="#f6e2a8" />

      {/* a slow glint travelling across the foil */}
      <g clipPath={`url(#${id}k)`}>
        <g transform="rotate(18 100 100)">
          <rect className="oc-glint" x="-60" y="-20" width="46" height="240" fill={`url(#${id}s)`} />
        </g>
      </g>
    </svg>
  );
}

/* --------------------------------------------------------------- panels */

function Panel({ side }: { side: "l" | "r" }) {
  return (
    <div className={`oc-door oc-door--${side}`}>
      <div className="oc-face oc-face--front">
        <Buttas />
        <ZariBand horizontal className="oc-zari-top" />
        <ZariBand horizontal className="oc-zari-bottom" />
        <ZariBand className="oc-zari-fold" />
        <span className="oc-edge" />
        <div className="oc-medal">
          <Medallion />
        </div>
        <span className="oc-shade" />
      </div>
      <div className="oc-face oc-face--back" />
    </div>
  );
}

/** Gold dust thrown off the seal when it is pressed. */
const DUST = Array.from({ length: 18 }, (_, i) => {
  const a = (i / 18) * Math.PI * 2 + (i % 3) * 0.21;
  const d = 90 + ((i * 37) % 70);
  return { x: r2(Math.cos(a) * d), y: r2(Math.sin(a) * d), s: 2 + (i % 3), delay: (i % 5) * 40 };
});

export default function OpeningCard({
  onOpen,
  onReveal,
  onDone,
}: {
  /** called inside the tap itself, so audio may start */
  onOpen?: () => void;
  onReveal: () => void;
  onDone: () => void;
}) {
  const [step, setStep] = useState<Step>(0);
  const root = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Pointer parallax: the silk tilts a few degrees and its sheen follows the light.
  useEffect(() => {
    const el = root.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
    };
    const tick = () => {
      x += (tx - x) * 0.06;
      y += (ty - y) * 0.06;
      el.style.setProperty("--px", x.toFixed(4));
      el.style.setProperty("--py", y.toFixed(4));
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = useCallback(() => {
    if (step !== 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const at = (ms: number, fn: () => void) => timers.current.push(window.setTimeout(fn, reduced ? ms * 0.4 : ms));
    onOpen?.();
    setStep(1);
    at(240, () => setStep(2));
    at(1250, () => setStep(3));
    at(5600, () => {
      setStep(4);
      onReveal();
    });
    at(6500, onDone);
  }, [step, onOpen, onReveal, onDone]);

  return (
    <div ref={root} className={`oc ${step ? `s${step}` : ""} ${step >= 2 ? "s2-on" : ""} ${step >= 3 ? "s3-on" : ""}`} role="dialog" aria-label="Sealed invitation">
      {/* what the gatefold opens onto: the mandapam, identical to the top of the page */}
      <div className="oc-inside">
        <MandapamScene on={step >= 3} />
        <span className="oc-hinge-shadow l" />
        <span className="oc-hinge-shadow r" />
      </div>

      <div className="oc-stage">
        <Panel side="l" />
        <Panel side="r" />
      </div>
      <button type="button" className="oc-hit" onClick={open} aria-label="Open the invitation" disabled={step !== 0}>
        <span className="oc-halo" />
      </button>

      <span className="oc-burst" aria-hidden />
      <span className="oc-dust" aria-hidden>
        {DUST.map((d, i) => (
          <i key={i} style={{ "--dx": `${d.x}px`, "--dy": `${d.y}px`, "--ds": `${d.s}px`, "--dd": `${d.delay}ms` } as CSSProperties} />
        ))}
      </span>

      <p className="oc-hint">Tap the seal to open</p>
    </div>
  );
}
