"use client";

/**
 * The opening: the whole screen is a sealed envelope.
 *
 * Four flaps of deep maroon paper meet in an X at the centre, each blind-
 * embossed with a spray of lotus, jasmine vine, mango leaves and paisley.
 * A red wax seal struck with a gold-leaf monogram holds them.
 *
 * Tapping the seal runs the sequence, by classes on the root:
 *   p1  the seal lifts away, the hint fades
 *   p2  the side flaps fold outward, their cream undersides catching light
 *   p3  the top and bottom flaps follow; the mandapam beneath lights up
 *   p4  the opening dissolves into the page, whose first room is the same
 *       mandapam, so there is no cut
 */

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { COUPLE } from "@/lib/config";
import MandapamScene from "./MandapamScene";
import "./EnvelopeOpening.css";

type Step = 0 | 1 | 2 | 3 | 4;
const r2 = (n: number) => Math.round(n * 100) / 100;

/* -------------------------------------------------------------- emboss */

/**
 * One spray of South Indian flowers, drawn as flat shapes. It is used three
 * times, offset, to blind-emboss it: a dark copy below-right (the shadow
 * side of the raised paper), a light copy above-left (the lit side), and
 * the face itself in the paper's own colour on top.
 */
function SprayShapes() {
  const jasmine = (x: number, y: number, s: number, rot = 0) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <path key={i} d="M0 0 C3 -3 3 -9 0 -12 C-3 -9 -3 -3 0 0Z" transform={`rotate(${i * 72})`} />
      ))}
      <circle r="2.2" />
    </g>
  );
  const leaf = (x: number, y: number, len: number, rot: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C${len * 0.3} ${-len * 0.22} ${len * 0.75} ${-len * 0.2} ${len} 0 C${len * 0.75} ${len * 0.2} ${len * 0.3} ${len * 0.22} 0 0Z`} />
    </g>
  );
  const bud = (x: number, y: number, s: number, rot: number) => (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <path d="M0 0 C7 -6 7 -20 0 -30 C-7 -20 -7 -6 0 0Z" />
      <path d="M0 0 C-10 -4 -12 -14 -8 -20 C-6 -12 -3 -5 0 0Z" />
      <path d="M0 0 C10 -4 12 -14 8 -20 C6 -12 3 -5 0 0Z" />
    </g>
  );
  return (
    <g>
      {/* main stem rising from the base, two branches */}
      <path d="M150 600 C140 520 168 450 150 380 C134 318 150 262 152 214" fill="none" strokeWidth="5" />
      <path d="M150 430 C110 410 80 370 70 320" fill="none" strokeWidth="3.4" />
      <path d="M156 470 C196 446 226 402 232 352" fill="none" strokeWidth="3.4" />
      <path d="M150 300 C186 284 208 250 214 214" fill="none" strokeWidth="2.6" />
      <path d="M148 520 C110 512 82 492 64 466" fill="none" strokeWidth="2.6" />

      {/* lotus in bloom */}
      <g transform="translate(152 196)">
        {[-62, -38, -14, 14, 38, 62].map((a, i) => (
          <path key={i} d="M0 0 C14 -18 14 -50 0 -70 C-14 -50 -14 -18 0 0Z" transform={`rotate(${a})`} />
        ))}
        <path d="M0 0 C12 -16 12 -44 0 -62 C-12 -44 -12 -16 0 0Z" />
        <path d="M-46 4 C-30 18 30 18 46 4 C30 8 -30 8 -46 4Z" />
      </g>

      {/* buds, leaves, jasmine */}
      {bud(70, 322, 1.1, -24)}
      {bud(232, 354, 1.15, 20)}
      {bud(214, 216, 0.8, 26)}
      {[
        [150, 560, 46, 200], [146, 540, 50, -20], [154, 500, 44, 210], [140, 452, 46, -30],
        [118, 418, 40, 230], [98, 392, 36, -60], [86, 360, 34, 220], [184, 452, 42, -10],
        [206, 428, 38, 190], [222, 396, 34, -40], [160, 400, 40, 15], [140, 350, 42, 200],
        [154, 330, 36, -20], [176, 288, 32, -30], [198, 262, 30, 200], [118, 508, 34, 160], [88, 492, 30, 210],
      ].map(([x, y, l, r], i) => (
        <g key={i}>{leaf(x, y, l, r)}</g>
      ))}
      {[
        [64, 462, 1, 10], [52, 444, 0.8, 40], [80, 300, 0.7, 0], [244, 336, 0.75, 20], [226, 306, 0.6, 50],
        [120, 250, 0.7, 30], [190, 324, 0.65, 10], [104, 448, 0.6, 40], [196, 488, 0.7, 0],
      ].map(([x, y, s, r], i) => (
        <g key={i}>{jasmine(x, y, s, r)}</g>
      ))}
      {/* paisley at the root */}
      <g transform="translate(108 574) rotate(-30) scale(1.4)">
        <path d="M0 -12 C9 -11 13 -2 10 5 C7 11 0 13 -5 11.5 C-10 10 -11 4 -7 0 C-3.5 -3.5 2.5 -2.5 1.2 -7 C0.6 -9.5 -1 -11.2 0 -12Z" />
      </g>
      <g transform="translate(196 580) rotate(30) scale(1.2) scale(-1 1)">
        <path d="M0 -12 C9 -11 13 -2 10 5 C7 11 0 13 -5 11.5 C-10 10 -11 4 -7 0 C-3.5 -3.5 2.5 -2.5 1.2 -7 C0.6 -9.5 -1 -11.2 0 -12Z" />
      </g>
    </g>
  );
}

/** The spray, blind-embossed into paper of colour `paper`. */
function Emboss({ paper, className = "", style }: { paper: string; className?: string; style?: CSSProperties }) {
  const id = `e${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <svg viewBox="0 0 300 600" className={`ev-emboss ${className}`} style={style} aria-hidden>
      <defs>
        <g id={id}>
          <SprayShapes />
        </g>
      </defs>
      <use href={`#${id}`} x="1.6" y="2.2" fill="#1c0306" stroke="#1c0306" opacity=".55" />
      <use href={`#${id}`} x="-1.1" y="-1.3" fill="#c46b6d" stroke="#c46b6d" opacity=".42" />
      <use href={`#${id}`} fill={paper} stroke={paper} />
      {/* fine engraved veins on the face */}
      <use href={`#${id}`} fill="none" stroke="#2a060a" strokeWidth=".6" opacity=".35" />
    </svg>
  );
}

/* ---------------------------------------------------------------- seal */

/** Sealing wax: matt, an uneven spread edge, a pressed well, gold-leaf letters. */
function WaxSeal() {
  const id = `w${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  // An irregular spread of wax: a circle whose radius wanders.
  const blob = Array.from({ length: 48 }, (_, i) => {
    const a = (i / 48) * Math.PI * 2;
    const r = 92 + Math.sin(a * 5) * 3.2 + Math.sin(a * 3 + 1) * 2.4 + Math.cos(a * 7) * 1.6;
    return `${r2(100 + Math.cos(a) * r)},${r2(100 + Math.sin(a) * r)}`;
  }).join(" ");
  const ring = `${COUPLE.partnerA} ✦ ${COUPLE.partnerB} ✦ XXVI · XI · MMXXVI ✦`.toUpperCase();
  return (
    <svg viewBox="0 0 200 200" className="ev-seal-svg" aria-hidden>
      <defs>
        <radialGradient id={`${id}w`} cx="40%" cy="34%" r="74%">
          <stop offset="0" stopColor="#c0383a" />
          <stop offset=".45" stopColor="#9a2226" />
          <stop offset=".8" stopColor="#74151b" />
          <stop offset="1" stopColor="#560c12" />
        </radialGradient>
        <radialGradient id={`${id}p`} cx="50%" cy="42%" r="60%">
          <stop offset="0" stopColor="#8e1f24" />
          <stop offset="1" stopColor="#64111a" />
        </radialGradient>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff0c0" />
          <stop offset=".35" stopColor="#e2bf6e" />
          <stop offset=".7" stopColor="#b98a34" />
          <stop offset="1" stopColor="#f0d690" />
        </linearGradient>
        <path id={`${id}c`} d="M100 100 m-58 0 a58 58 0 1 1 116 0 a58 58 0 1 1 -116 0" />
      </defs>
      <polygon points={blob} fill={`url(#${id}w)`} />
      {/* the rim the stamp squeezed outward */}
      <circle cx="100" cy="100" r="76" fill="none" stroke="#4a0a10" strokeWidth="3" opacity=".45" />
      <circle cx="100" cy="98.6" r="76" fill="none" stroke="#e98a86" strokeWidth="1" opacity=".35" />
      {/* the pressed well */}
      <circle cx="100" cy="100" r="72" fill={`url(#${id}p)`} />
      <circle cx="100" cy="101.5" r="72" fill="none" stroke="#2f0408" strokeWidth="2.4" opacity=".5" />
      {/* struck ring of lotus petals and the names */}
      {Array.from({ length: 24 }, (_, i) => (
        <path key={i} d="M100 33 C103 37 103 41 100 44 C97 41 97 37 100 33Z" fill="#4a0a10" opacity=".55" transform={`rotate(${i * 15} 100 100)`} />
      ))}
      <text fontSize="7.4" letterSpacing="1.2" fill="#e9a8a0" opacity=".75" style={{ fontFamily: "var(--font-jakarta), sans-serif", fontWeight: 600 }}>
        <textPath href={`#${id}c`} textLength="360" lengthAdjust="spacing">
          {ring}
        </textPath>
      </text>
      <circle cx="100" cy="100" r="48" fill="none" stroke="#4a0a10" strokeWidth="1.6" opacity=".6" />
      {/* gold-leaf monogram, struck into the wax */}
      <g style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontWeight: 600 }} fontSize="52" textAnchor="middle">
        <text x="79" y="118" fill="#2f0408" opacity=".6">{COUPLE.partnerA[0]}</text>
        <text x="122" y="118" fill="#2f0408" opacity=".6">{COUPLE.partnerB[0]}</text>
        <text x="78" y="116.5" fill={`url(#${id}g)`}>{COUPLE.partnerA[0]}</text>
        <text x="121" y="116.5" fill={`url(#${id}g)`}>{COUPLE.partnerB[0]}</text>
      </g>
      <path d="M100 86 L103.5 100 L100 114 L96.5 100 Z" fill={`url(#${id}g)`} />
      {/* one soft highlight where the wax caught the light as it set */}
      <ellipse cx="72" cy="56" rx="26" ry="14" fill="#ffd0c8" opacity=".14" transform="rotate(-28 72 56)" />
    </svg>
  );
}

/* --------------------------------------------------------------- flaps */

type Side = "l" | "r" | "t" | "b";

function Flap({ side }: { side: Side }) {
  return (
    <div className={`ev-flap ev-flap--${side}`}>
      <div className="ev-face ev-face--front">
        <div className="ev-cast">
          <div className="ev-cast-in" />
        </div>
        <div className="ev-paper">
          <Emboss paper="var(--ev-paper)" className="ev-emboss--a" />
          {(side === "t" || side === "b") && <Emboss paper="var(--ev-paper)" className="ev-emboss--b" />}
          <span className="ev-light" />
        </div>
      </div>
      <div className="ev-face ev-face--back">
        <div className="ev-liner" />
      </div>
    </div>
  );
}

export default function EnvelopeOpening({
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

  // The light across the paper follows the pointer, a little.
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
    at(420, () => setStep(2));
    at(820, () => setStep(3));
    at(5400, () => {
      setStep(4);
      onReveal();
    });
    at(6300, onDone);
  }, [step, onOpen, onReveal, onDone]);

  return (
    <div
      ref={root}
      className={`ev ${step >= 1 ? "p1" : ""} ${step >= 2 ? "p2" : ""} ${step >= 3 ? "p3" : ""} ${step >= 4 ? "p4" : ""}`}
      role="dialog"
      aria-label="Sealed invitation"
    >
      <div className="ev-inside">
        <MandapamScene on={step >= 3} />
      </div>

      <div className="ev-stage">
        <Flap side="t" />
        <Flap side="b" />
        <Flap side="l" />
        <Flap side="r" />
      </div>

      <button type="button" className="ev-seal" onClick={open} aria-label="Open the invitation" disabled={step !== 0}>
        <WaxSeal />
      </button>
      <p className="ev-hint">Tap to open</p>
    </div>
  );
}
