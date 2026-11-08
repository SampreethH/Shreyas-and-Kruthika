"use client";

/**
 * The mandapam the gatefold opens onto, and the first screen of the page.
 *
 * A bottle-green painted wall with a gold stencil, a carved sandstone arch
 * whose cusped opening glows with lamplight, the names read inside that
 * light, jasmine strung across the arch, carved pillars either side,
 * marigold and mango-leaf torana overhead, and a polished floor with a
 * rangoli and a row of brass diyas that light one after another.
 *
 * `on` runs the arrival (lamps light, the glow rises, the names are read in
 * turn). `still` renders the arrived state with no transitions, so the page
 * can sit exactly under the opening card and take over without a cut.
 */

import { type CSSProperties } from "react";
import { archPath } from "@/lib/arch";
import { COUPLE, EVENT } from "@/lib/config";
import Torana from "./Torana";
import "./MandapamScene.css";

const r2 = (n: number) => Math.round(n * 100) / 100;

/* ------------------------------------------------------------ ornaments */

export function Kalasha({ className = "", ...box }: { className?: string; x?: number; y?: number; width?: number; height?: number }) {
  return (
    <svg viewBox="0 0 40 50" className={className} {...box} aria-hidden>
      <defs>
        <linearGradient id="kal-g" x1="0" x2="1">
          <stop offset="0" stopColor="#8a6118" />
          <stop offset=".45" stopColor="#f2dc9c" />
          <stop offset="1" stopColor="#9a6f22" />
        </linearGradient>
      </defs>
      {[-58, -30, 0, 30, 58].map((a) => (
        <ellipse key={a} cx="20" cy="12" rx="3.2" ry="10" fill="#2f6b45" stroke="#1d4630" strokeWidth=".5" transform={`rotate(${a} 20 20)`} />
      ))}
      <circle cx="20" cy="15" r="6.5" fill="#9a6532" />
      <path d="M13 15 Q20 12 27 15" stroke="#6b4422" strokeWidth=".8" fill="none" />
      <path d="M12 22 h16 l-2 3 Q36 30 33 40 Q30 48 20 48 Q10 48 7 40 Q4 30 14 25 Z" fill="url(#kal-g)" stroke="#7a5512" strokeWidth=".6" />
      <path d="M9 34 Q20 38 31 34" stroke="#7a1a14" strokeWidth="1.2" fill="none" />
      <circle cx="20" cy="41" r="1.6" fill="#7a1a14" />
    </svg>
  );
}

/** Brass diya. The flame and its halo flicker on their own clocks. */
export function Diya({ style, delay = 0 }: { style?: CSSProperties; delay?: number }) {
  return (
    <span className="mdp-diya" style={{ ...style, "--fd": `${delay}ms` } as CSSProperties} aria-hidden>
      <svg viewBox="0 0 60 60">
        <defs>
          <radialGradient id="dy-flame" cx="50%" cy="70%" r="60%">
            <stop offset="0" stopColor="#fffbe6" />
            <stop offset=".45" stopColor="#ffd25a" />
            <stop offset="1" stopColor="#ea6a1c" />
          </radialGradient>
          <radialGradient id="dy-glow">
            <stop offset="0" stopColor="#ffd98a" stopOpacity=".75" />
            <stop offset="1" stopColor="#ffd98a" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="dy-brass" x1="0" x2="1">
            <stop offset="0" stopColor="#6e4a14" />
            <stop offset=".4" stopColor="#e9c873" />
            <stop offset=".7" stopColor="#b8862f" />
            <stop offset="1" stopColor="#5e3f10" />
          </linearGradient>
        </defs>
        <g className="mdp-diya-light">
          <circle cx="30" cy="22" r="26" fill="url(#dy-glow)" className="mdp-diya-glow" />
          <path className="mdp-diya-flame" d="M30 5 C35.5 15 37.5 22 34 28.5 C32 31.5 28 31.5 26 28.5 C22.5 22 24.5 15 30 5Z" fill="url(#dy-flame)" />
        </g>
        <line x1="30" y1="29" x2="30" y2="34" stroke="#3a2414" strokeWidth="1.2" />
        <ellipse cx="30" cy="34.5" rx="21" ry="3.6" fill="#3a2414" />
        <path d="M7 34 Q9 47 30 48.5 Q51 47 53 34 Q52 39 30 40 Q8 39 7 34Z" fill="url(#dy-brass)" />
        <path d="M7 34 Q30 41 53 34" stroke="#f4dc98" strokeWidth=".8" fill="none" opacity=".8" />
        <ellipse cx="30" cy="50" rx="9" ry="2.2" fill="url(#dy-brass)" />
      </svg>
    </span>
  );
}

/** A hanging string of jasmine buds, with an orange kanakambara every few. */
export function JasmineStrand({ length = 360, className = "", style }: { length?: number; className?: string; style?: CSSProperties }) {
  const n = Math.floor((length - 30) / 9);
  return (
    <svg viewBox={`0 0 20 ${length}`} className={className} style={style} aria-hidden>
      <line x1="10" y1="0" x2="10" y2={length - 22} stroke="#c9b48a" strokeWidth=".6" />
      {Array.from({ length: n }, (_, i) => {
        const y = 8 + i * 9;
        const orange = i % 7 === 6;
        return (
          <g key={i} transform={`translate(10 ${y}) rotate(${i % 2 ? 24 : -24})`}>
            <ellipse rx={orange ? 3.4 : 2.6} ry={orange ? 3 : 4.4} fill={orange ? "#f08a24" : "#fffdf6"} stroke={orange ? "#c25d12" : "#e2d5b8"} strokeWidth=".5" />
          </g>
        );
      })}
      {/* tassel: a marigold and a rose bud */}
      <circle cx="10" cy={length - 16} r="6.5" fill="#f7a823" stroke="#d9780a" strokeWidth=".6" />
      <circle cx="10" cy={length - 16} r="3" fill="#e2850e" />
      <ellipse cx="10" cy={length - 5} rx="3" ry="4.5" fill="#9b1b1b" />
    </svg>
  );
}

export function MarigoldStrand({ length = 300, className = "", style }: { length?: number; className?: string; style?: CSSProperties }) {
  const n = Math.floor((length - 20) / 12);
  return (
    <svg viewBox={`0 0 20 ${length}`} className={className} style={style} aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(10 ${8 + i * 12})`}>
          <circle r="7" fill={i % 2 ? "#ffc21f" : "#f58a16"} />
          {Array.from({ length: 8 }, (_, k) => {
            const a = (k / 8) * Math.PI * 2;
            return <circle key={k} cx={r2(Math.cos(a) * 5.2)} cy={r2(Math.sin(a) * 5.2)} r="2.4" fill={i % 2 ? "#ffd458" : "#ffa63a"} />;
          })}
          <circle r="2.2" fill={i % 2 ? "#e39a07" : "#cf5e08"} />
        </g>
      ))}
      <path d={`M6 ${length - 12} q4 10 8 0`} fill="#2f6b45" />
    </svg>
  );
}

function Pillar({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 1000" className={className} preserveAspectRatio="xMidYMax meet" aria-hidden>
      <defs>
        <linearGradient id="pl-stone" x1="0" x2="1">
          <stop offset="0" stopColor="#4a3018" />
          <stop offset=".3" stopColor="#b8894c" />
          <stop offset=".5" stopColor="#e6c88c" />
          <stop offset=".72" stopColor="#a17338" />
          <stop offset="1" stopColor="#3e2812" />
        </linearGradient>
        <linearGradient id="pl-gold" x1="0" x2="1">
          <stop offset="0" stopColor="#7a5512" />
          <stop offset=".45" stopColor="#f6e2a6" />
          <stop offset="1" stopColor="#7a5512" />
        </linearGradient>
      </defs>
      {/* bracket (potika) and capital */}
      <path d="M-14 60 H134 V84 H118 L108 104 H12 L2 84 H-14 Z" fill="url(#pl-stone)" />
      <rect x="-14" y="56" width="148" height="6" fill="url(#pl-gold)" />
      <path d="M12 104 H108 Q112 150 92 176 H28 Q8 150 12 104Z" fill="url(#pl-stone)" />
      {Array.from({ length: 7 }, (_, i) => (
        <path key={i} d={`M${22 + i * 12.6} 108 Q${28 + i * 12.6} 140 ${28 + i * 12.6} 172`} stroke="#5a3c1d" strokeWidth="1.2" fill="none" opacity=".45" />
      ))}
      <rect x="22" y="176" width="76" height="10" fill="url(#pl-gold)" />
      {/* upper block with a lotus medallion */}
      <rect x="18" y="186" width="84" height="104" fill="url(#pl-stone)" />
      <rect x="26" y="194" width="68" height="88" fill="none" stroke="#5a3c1d" strokeWidth="1.2" opacity=".55" />
      <g transform="translate(60 238)" fill="none" stroke="#f2dc9c" strokeWidth="1.3">
        {Array.from({ length: 8 }, (_, i) => (
          <ellipse key={i} cx="0" cy="-12" rx="6" ry="12" transform={`rotate(${i * 45})`} opacity=".85" />
        ))}
        <circle r="5" fill="#f2dc9c" />
      </g>
      {/* fluted octagonal shaft between gold bands */}
      <rect x="28" y="290" width="64" height="420" fill="url(#pl-stone)" />
      {[38, 50, 60, 70, 82].map((x) => (
        <line key={x} x1={x} y1="300" x2={x} y2="700" stroke="#5a3c1d" strokeWidth="1.1" opacity=".35" />
      ))}
      {[290, 498, 700].map((y) => (
        <g key={y}>
          <rect x="22" y={y - 7} width="76" height="14" fill="url(#pl-gold)" />
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx={28 + i * 8} cy={y} r="2" fill="#7a5512" opacity=".7" />
          ))}
        </g>
      ))}
      {/* lower block and base */}
      <rect x="18" y="707" width="84" height="190" fill="url(#pl-stone)" />
      <rect x="26" y="716" width="68" height="172" fill="none" stroke="#5a3c1d" strokeWidth="1.2" opacity=".55" />
      <path d="M60 740 L82 800 L60 860 L38 800Z" fill="none" stroke="#f2dc9c" strokeWidth="1.3" />
      <circle cx="60" cy="800" r="6" fill="#f2dc9c" />
      <rect x="10" y="897" width="100" height="16" fill="url(#pl-gold)" />
      <rect x="2" y="913" width="116" height="87" fill="url(#pl-stone)" />
    </svg>
  );
}

/** The carved arch: sandstone band, gold mouldings, a lamplit opening, jasmine strung across it. */
function ArchFrame({ bottom, className }: { bottom: number; className: string }) {
  const id = `af${bottom}`;
  const opening = archPath({ bottom });
  const band = archPath({ x0: -11, x1: 111, top: -13, spring: 50, bottom });
  const mould = archPath({ x0: -3.2, x1: 103.2, top: -3.8, spring: 50, bottom });
  // Jasmine swag across the head of the arch, and two strands down the jambs.
  const swag = Array.from({ length: 30 }, (_, i) => {
    const t = i / 29;
    return [r2(9 + t * 82), r2(30 + Math.sin(t * Math.PI) * 10)] as const;
  });
  return (
    <svg viewBox={`-14 -30 128 ${bottom + 30}`} className={className} aria-hidden>
      <defs>
        <radialGradient id={`${id}-glow`} cx="50%" cy="46%" r="62%">
          <stop offset="0" stopColor="#fffaf0" />
          <stop offset=".42" stopColor="#fbefd2" />
          <stop offset=".78" stopColor="#efd59c" />
          <stop offset="1" stopColor="#d8b26a" />
        </radialGradient>
        <linearGradient id={`${id}-stone`} x1="0" x2="1">
          <stop offset="0" stopColor="#7c5629" />
          <stop offset=".18" stopColor="#d2ab6c" />
          <stop offset=".5" stopColor="#ecd3a0" />
          <stop offset=".82" stopColor="#c99e5d" />
          <stop offset="1" stopColor="#6e4b22" />
        </linearGradient>
        <linearGradient id={`${id}-gold`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f6e2a6" />
          <stop offset=".5" stopColor="#c99a3a" />
          <stop offset="1" stopColor="#8a6118" />
        </linearGradient>
      </defs>
      <path d={band} fill={`url(#${id}-stone)`} />
      <path d={band} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.1" />
      {/* carved bead line in the band */}
      <path d={archPath({ x0: -7.2, x1: 107.2, top: -8.6, spring: 50, bottom })} fill="none" stroke="#7a5512" strokeWidth=".7" strokeDasharray=".2 2.2" strokeLinecap="round" opacity=".9" />
      <path d={mould} fill="#7a5512" opacity=".5" />
      <path d={opening} fill={`url(#${id}-glow)`} className="mdp-opening" />
      <path d={opening} fill="none" stroke={`url(#${id}-gold)`} strokeWidth="1.3" />
      <path d={mould} fill="none" stroke="#f6e2a6" strokeWidth=".45" opacity=".9" />

      {/* faint lotus mandala painted on the back wall of the shrine */}
      <g transform={`translate(50 ${bottom * 0.5})`} fill="none" stroke="#c99a3a" strokeWidth=".35" opacity=".28">
        {Array.from({ length: 16 }, (_, i) => (
          <ellipse key={i} cy="-19" rx="6.5" ry="19" transform={`rotate(${i * 22.5})`} />
        ))}
        <circle r="40" strokeDasharray=".3 1.6" strokeLinecap="round" />
        <circle r="43" />
      </g>

      {/* jasmine swag and jamb strands */}
      <path d={`M${swag.map(([x, y]) => `${x} ${y}`).join(" L")}`} stroke="#c9b48a" strokeWidth=".35" fill="none" />
      {swag.map(([x, y], i) => (
        <ellipse key={i} cx={x} cy={y} rx=".95" ry="1.6" fill={i % 6 === 3 ? "#f08a24" : "#fffdf6"} stroke="#d9cbaa" strokeWidth=".18" transform={`rotate(${(i - 15) * 4} ${x} ${y})`} />
      ))}
      {[9, 91].map((x) =>
        Array.from({ length: 14 }, (_, i) => (
          <ellipse key={`${x}-${i}`} cx={x} cy={33 + i * 3.4} rx=".95" ry="1.6" fill={i % 5 === 4 ? "#f08a24" : "#fffdf6"} stroke="#d9cbaa" strokeWidth=".18" />
        )),
      )}

      {/* kalasha finial on the apex */}
      <Kalasha x={42.5} y={-31.5} width={15} height={18.75} />
    </svg>
  );
}

/** Blind arch on the side walls of a wide screen, a brass lamp hung in it. */
function SideArch({ className }: { className: string }) {
  return (
    <svg viewBox="-8 -12 116 156" className={className} aria-hidden>
      <defs>
        <radialGradient id="sa-in" cx="50%" cy="38%" r="70%">
          <stop offset="0" stopColor="#2d6450" />
          <stop offset="1" stopColor="#0e271f" />
        </radialGradient>
      </defs>
      <path d={archPath({ x0: -6, x1: 106, top: -9, spring: 50, bottom: 140 })} fill="#c99e5d" opacity=".55" />
      <path d={archPath({ bottom: 140 })} fill="url(#sa-in)" stroke="#e9cd86" strokeWidth=".9" />
      <line x1="50" y1="2" x2="50" y2="58" stroke="#b8862f" strokeWidth=".8" strokeDasharray="2 1.2" />
      <g transform="translate(50 58)">
        <path d="M-14 0 H14 L10 8 H-10 Z" fill="#c99a3a" />
        <path d="M-10 8 Q0 18 10 8" fill="#8a6118" />
        {[-9, 0, 9].map((x) => (
          <g key={x} className="mdp-lamp-flame" style={{ animationDelay: `${x * 40}ms` }}>
            <circle cx={x} cy="-5" r="7" fill="#ffd98a" opacity=".25" />
            <path d={`M${x} -9 C${x + 2.6} -4 ${x + 2.6} -1 ${x} 0 C${x - 2.6} -1 ${x - 2.6} -4 ${x} -9Z`} fill="#ffcf5a" />
          </g>
        ))}
      </g>
    </svg>
  );
}

function Rangoli() {
  return (
    <svg viewBox="-100 -100 200 200" aria-hidden>
      <circle r="96" fill="none" stroke="#fff7e6" strokeWidth="1.6" strokeDasharray=".1 6" strokeLinecap="round" />
      <circle r="88" fill="none" stroke="#e8c46a" strokeWidth="1" />
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cy="-58" rx="14" ry="28" fill="#f2a12e" stroke="#fff7e6" strokeWidth="1.2" transform={`rotate(${i * 30})`} />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <ellipse key={i} cy="-36" rx="9" ry="18" fill="#b8231c" stroke="#fff7e6" strokeWidth="1" transform={`rotate(${i * 30 + 15})`} />
      ))}
      <circle r="22" fill="#1f5a44" stroke="#fff7e6" strokeWidth="1.2" />
      <circle r="11" fill="#f6d36b" />
      {Array.from({ length: 24 }, (_, i) => {
        const a = (i / 24) * Math.PI * 2;
        return <circle key={i} cx={r2(Math.cos(a) * 78)} cy={r2(Math.sin(a) * 78)} r="2.2" fill="#fff7e6" />;
      })}
    </svg>
  );
}

/* ---------------------------------------------------------------- scene */

const DIYAS = [
  { x: -0.4, row: "back", d: 0 },
  { x: 0.4, row: "back", d: 140 },
  { x: -0.15, row: "back", d: 280 },
  { x: 0.15, row: "back", d: 420 },
  { x: -0.34, row: "front", d: 560 },
  { x: 0.34, row: "front", d: 700 },
] as const;

const MOTES = Array.from({ length: 12 }, (_, i) => ({
  x: 18 + ((i * 47) % 64),
  d: (i * 0.83) % 7,
  t: 7 + ((i * 3) % 5),
  s: 2 + (i % 3),
}));

export default function MandapamScene({ on = false, still = false, children }: { on?: boolean; still?: boolean; children?: React.ReactNode }) {
  const { partnerA: a, partnerB: b } = COUPLE;
  const line = (i: number) => ({ "--i": i }) as CSSProperties;
  return (
    <div className={`mdp ${on || still ? "mdp--on" : ""} ${still ? "mdp--still" : ""}`}>
      <div className="mdp-wall" />
      <div className="mdp-lintel" />

      <SideArch className="mdp-side l" />
      <SideArch className="mdp-side r" />

      <Pillar className="mdp-pillar l" />
      <Pillar className="mdp-pillar r" />

      <JasmineStrand className="mdp-strand j l" length={420} />
      <JasmineStrand className="mdp-strand j r" length={420} />

      <div className="mdp-floor">
        <div className="mdp-rangoli">
          <Rangoli />
        </div>
      </div>

      <div className="mdp-arch">
        <span className="mdp-halo" />
        <ArchFrame bottom={175} className="mdp-frame tall" />
        <ArchFrame bottom={140} className="mdp-frame wide" />
        <div className="mdp-motes" aria-hidden>
          {MOTES.map((m, i) => (
            <i key={i} style={{ left: `${m.x}%`, animationDelay: `${m.d}s`, animationDuration: `${m.t}s`, width: m.s, height: m.s }} />
          ))}
        </div>
        <div className="mdp-text">
          <p className="mdp-l mdp-bless" style={line(0)}>{EVENT.blessingLine.replace(/\|\|/g, "॥")}</p>
          <p className="mdp-l mdp-deity" style={line(1)}>With the blessings of Sri Nanjundeshwara Swamy</p>
          <p className="mdp-l mdp-kicker" style={line(2)}>The {EVENT.occasion} of</p>
          <h1 className="mdp-names" aria-label={`${a} and ${b}`}>
            <span className="mdp-l" style={line(3)}>{a}</span>
            <i className="mdp-l" style={line(4)}>&amp;</i>
            <span className="mdp-l" style={line(5)}>{b}</span>
          </h1>
          <p className="mdp-l mdp-when" style={line(6)}>26 · November · 2026</p>
        </div>
      </div>

      {DIYAS.map((d, i) => (
        <span key={i} className={`mdp-diya-slot ${d.row}`} style={{ "--dx": d.x } as CSSProperties}>
          <Diya delay={d.d} />
        </span>
      ))}

      <Torana className="mdp-torana" />
      <div className="mdp-vignette" />
      {children}
    </div>
  );
}
