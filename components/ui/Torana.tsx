"use client";

/**
 * Marigold and mango-leaf torana with hanging brass bells, as strung over
 * doorways for auspicious occasions. Pure SVG; bells and strands sway in CSS.
 */

const W = 1000;

function swag(t: number) {
  // Quadratic curve from (40,22) dipping to the centre and back up to (960,22).
  const x = 40 + t * (W - 80);
  const y = 22 + Math.sin(t * Math.PI) * 70;
  return [x, y] as const;
}

function Strand({ x, count, delay }: { x: number; count: number; delay: number }) {
  return (
    <g className="torana-sway" style={{ transformOrigin: `${x}px 22px`, animationDelay: `${delay}s` }}>
      {Array.from({ length: count }, (_, i) => (
        <use key={i} href={i % 2 ? "#marigold-y" : "#marigold-o"} x={x} y={34 + i * 17} />
      ))}
    </g>
  );
}

function Bell({ x, len, delay }: { x: number; len: number; delay: number }) {
  return (
    <g className="torana-sway" style={{ transformOrigin: `${x}px 26px`, animationDelay: `${delay}s`, animationDuration: "3.4s" }}>
      <line x1={x} y1={26} x2={x} y2={26 + len} stroke="#b08a4a" strokeWidth="1.4" strokeDasharray="3 2" />
      <g transform={`translate(${x} ${26 + len})`}>
        <circle r="3.5" cy="-1" fill="#c9a25a" />
        <path d="M-13 30 Q-12 6 0 4 Q12 6 13 30 Z" fill="url(#brass)" stroke="#8a6a32" strokeWidth="0.8" />
        <rect x="-15" y="29" width="30" height="4" rx="2" fill="#b08a4a" />
        <circle cy="36" r="3" fill="#8a6a32" />
      </g>
    </g>
  );
}

export default function Torana({ className = "" }: { className?: string }) {
  const swagFlowers = 44;
  const leaves = 15;
  return (
    <svg viewBox={`0 0 ${W} 300`} className={className} preserveAspectRatio="xMidYMin meet" aria-hidden>
      <defs>
        <radialGradient id="mg-o" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#ffcc4d" />
          <stop offset="55%" stopColor="#f7931e" />
          <stop offset="100%" stopColor="#d9640a" />
        </radialGradient>
        <radialGradient id="mg-y" cx="45%" cy="40%">
          <stop offset="0%" stopColor="#fff1a8" />
          <stop offset="55%" stopColor="#ffc928" />
          <stop offset="100%" stopColor="#e9a10c" />
        </radialGradient>
        <linearGradient id="leaf" x1="0" x2="1">
          <stop offset="0%" stopColor="#2f7d32" />
          <stop offset="55%" stopColor="#4caf50" />
          <stop offset="100%" stopColor="#2e6b30" />
        </linearGradient>
        <linearGradient id="brass" x1="0" x2="1">
          <stop offset="0%" stopColor="#a07a3a" />
          <stop offset="40%" stopColor="#f3dfae" />
          <stop offset="100%" stopColor="#9a7333" />
        </linearGradient>
        {/* Marigold: dense ruffled bloom from a ring of petal dots around a gradient core */}
        {(["o", "y"] as const).map((k) => (
          <g id={`marigold-${k}`} key={k}>
            <circle r="9.5" fill={`url(#mg-${k})`} />
            {Array.from({ length: 12 }, (_, i) => {
              const a = (i / 12) * Math.PI * 2;
              return <circle key={i} cx={Math.cos(a) * 7.5} cy={Math.sin(a) * 7.5} r="3.2" fill={`url(#mg-${k})`} opacity="0.9" />;
            })}
            <circle r="3" fill={k === "o" ? "#c4520a" : "#d98e0b"} opacity="0.55" />
          </g>
        ))}
        <path id="mango-leaf" d="M0 0 C 9 10, 10 34, 0 52 C -10 34, -9 10, 0 0 Z" />
      </defs>

      {/* Mango leaves hang from the top cord, behind the flowers */}
      {Array.from({ length: leaves }, (_, i) => {
        const t = (i + 0.5) / leaves;
        const x = 70 + t * (W - 140);
        const rot = (t - 0.5) * 16;
        return (
          <g key={i} className="torana-sway" style={{ transformOrigin: `${x}px 24px`, animationDelay: `${i * 0.17}s`, animationDuration: "5s" }}>
            <use href="#mango-leaf" x={x} y={24} fill="url(#leaf)" transform={`rotate(${rot} ${x} 24)`} />
            <line x1={x} y1={28} x2={x} y2={70} stroke="#a5d6a7" strokeWidth="0.8" opacity="0.7" transform={`rotate(${rot} ${x} 24)`} />
          </g>
        );
      })}

      {/* Top cord of marigolds */}
      {Array.from({ length: 52 }, (_, i) => (
        <use key={i} href={i % 2 ? "#marigold-y" : "#marigold-o"} x={20 + (i * (W - 40)) / 51} y={20} />
      ))}

      {/* Swag dipping toward the centre */}
      {Array.from({ length: swagFlowers }, (_, i) => {
        const [x, y] = swag(i / (swagFlowers - 1));
        return <use key={i} href={i % 2 ? "#marigold-o" : "#marigold-y"} x={x} y={y} />;
      })}

      {/* Hanging strands at the sides */}
      <Strand x={24} count={14} delay={0} />
      <Strand x={62} count={10} delay={0.6} />
      <Strand x={W - 62} count={10} delay={0.3} />
      <Strand x={W - 24} count={14} delay={0.9} />

      <Bell x={150} len={70} delay={0.2} />
      <Bell x={W - 150} len={70} delay={1.1} />
      <Bell x={220} len={40} delay={0.7} />
      <Bell x={W - 220} len={40} delay={1.5} />
    </svg>
  );
}
