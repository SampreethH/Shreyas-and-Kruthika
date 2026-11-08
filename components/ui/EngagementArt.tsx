"use client";

/**
 * Engagement artwork drawn as SVG: interlocked gold rings with a solitaire,
 * and blush-and-sage floral sprays in the style of the printed invitation.
 */

import { useId } from "react";

// Unique, url()-safe ids so several copies of the art can share a page.
const useIds = (prefix: string) => `${prefix}-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

function Blossom({ x, y, r, rot = 0, id }: { x: number; y: number; r: number; rot?: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <path
          key={i}
          d={`M0 0 C ${r * 0.55} ${-r * 0.2}, ${r * 0.62} ${-r * 0.85}, 0 ${-r} C ${-r * 0.62} ${-r * 0.85}, ${-r * 0.55} ${-r * 0.2}, 0 0 Z`}
          transform={`rotate(${i * 72})`}
          fill={`url(#${id}-petal)`}
          stroke="#e7a3b0"
          strokeWidth={r * 0.015}
        />
      ))}
      <circle r={r * 0.2} fill={`url(#${id}-heart)`} />
      {Array.from({ length: 10 }, (_, i) => {
        const a = (i / 10) * Math.PI * 2;
        return <circle key={i} cx={Math.cos(a) * r * 0.27} cy={Math.sin(a) * r * 0.27} r={r * 0.035} fill="#c9962e" />;
      })}
    </g>
  );
}

function Leaf({ x, y, len, rot, id }: { x: number; y: number; len: number; rot: number; id: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d={`M0 0 C ${len * 0.25} ${-len * 0.36}, ${len * 0.72} ${-len * 0.32}, ${len} 0 C ${len * 0.72} ${len * 0.32}, ${len * 0.25} ${len * 0.36}, 0 0 Z`} fill={`url(#${id}-leaf)`} />
      <path d={`M0 0 L ${len * 0.92} 0`} stroke="#5f7a4c" strokeWidth={len * 0.02} opacity="0.5" />
    </g>
  );
}

function Filler({ x, y, s }: { x: number; y: number; s: number }) {
  // Tiny white five-petal flower, like baby's breath / jasmine
  return (
    <g transform={`translate(${x} ${y})`}>
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse key={i} cx="0" cy={-s} rx={s * 0.55} ry={s} transform={`rotate(${i * 72})`} fill="#fffaf4" stroke="#ead9c4" strokeWidth={s * 0.08} />
      ))}
      <circle r={s * 0.35} fill="#e8c46a" />
    </g>
  );
}

function SprayDefs({ id }: { id: string }) {
  return (
    <defs>
      <radialGradient id={`${id}-petal`} cx="50%" cy="85%" r="90%">
        <stop offset="0%" stopColor="#fbe3e7" />
        <stop offset="55%" stopColor="#f6c6cf" />
        <stop offset="100%" stopColor="#eaa2b1" />
      </radialGradient>
      <radialGradient id={`${id}-heart`}>
        <stop offset="0%" stopColor="#f7dd8f" />
        <stop offset="100%" stopColor="#d4a03a" />
      </radialGradient>
      <linearGradient id={`${id}-leaf`} x1="0" x2="1">
        <stop offset="0%" stopColor="#6c8a52" />
        <stop offset="100%" stopColor="#a9bf8c" />
      </linearGradient>
    </defs>
  );
}

/** Corner spray growing from the top-left of its box; rotate/flip with CSS for other corners. */
export function FloralSpray({ className = "" }: { className?: string }) {
  const id = useIds("spray");
  return (
    <svg viewBox="0 0 420 420" className={className} aria-hidden>
      <SprayDefs id={id} />
      <g fill="none" stroke="#7d9566" strokeWidth="3" strokeLinecap="round">
        <path d="M-10 -10 C 80 40, 200 40, 400 110" />
        <path d="M-10 -10 C 40 90, 50 220, 110 400" />
        <path d="M120 40 C 170 10, 230 0, 290 10" opacity="0.8" />
      </g>
      {/* Leaves along the stems */}
      {[
        [60, 30, 46, 10], [130, 42, 52, -20], [210, 55, 48, 18], [300, 80, 44, -12], [360, 100, 38, 25],
        [25, 70, 46, 70], [36, 150, 52, 110], [55, 240, 46, 60], [80, 320, 42, 115],
        [180, 18, 34, -40], [250, 8, 30, 10],
        [100, 36, 40, 160], [170, 48, 44, 200], [260, 66, 40, 165], [340, 92, 34, 200],
        [32, 110, 40, -10], [44, 190, 44, 20], [66, 280, 38, -20], [96, 370, 34, 30],
      ].map(([x, y, l, r], i) => (
        <Leaf key={i} x={x} y={y} len={l} rot={r} id={id} />
      ))}
      <Blossom x={95} y={95} r={62} rot={8} id={id} />
      <Blossom x={225} y={70} r={36} rot={-20} id={id} />
      <Blossom x={65} y={225} r={40} rot={30} id={id} />
      <Blossom x={330} y={92} r={22} rot={12} id={id} />
      <Blossom x={92} y={330} r={22} rot={-10} id={id} />
      {[
        [170, 120, 7], [150, 150, 6], [185, 145, 5], [130, 175, 6], [280, 40, 6], [300, 20, 5], [30, 300, 6], [20, 270, 5], [270, 120, 5],
      ].map(([x, y, s], i) => (
        <Filler key={i} x={x} y={y} s={s} />
      ))}
    </svg>
  );
}

/** Two interlocked gold bands, one set with a solitaire, inside a light leafy wreath. */
export function EngagementRings({ className = "", wreath = true }: { className?: string; wreath?: boolean }) {
  const id = useIds("rings");
  return (
    <svg viewBox="0 0 260 200" className={className} aria-hidden>
      <SprayDefs id={id} />
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#f6e4ae" />
          <stop offset="35%" stopColor="#c99a3a" />
          <stop offset="60%" stopColor="#f3dc9a" />
          <stop offset="100%" stopColor="#8a6116" />
        </linearGradient>
        <linearGradient id={`${id}-gem`} x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#dff1fb" />
          <stop offset="100%" stopColor="#a9cfe6" />
        </linearGradient>
        <clipPath id={`${id}-front`}>
          {/* Lower-left quarter of the right ring, drawn over the left ring to interlock */}
          <rect x="95" y="120" width="60" height="80" />
        </clipPath>
      </defs>

      {wreath && (
        <g>
          <path d="M40 150 C 50 190, 110 200, 130 196 C 150 200, 210 190, 220 150" fill="none" stroke="#8aa070" strokeWidth="2" />
          {[
            [48, 160, 22, 120], [62, 178, 22, 150], [84, 190, 20, 175], [212, 160, 22, 60], [198, 178, 22, 30], [176, 190, 20, 5],
          ].map(([x, y, l, r], i) => (
            <Leaf key={i} x={x} y={y} len={l} rot={r} id={id} />
          ))}
          <Blossom x={130} y={194} r={14} id={id} />
          <Blossom x={36} y={140} r={10} rot={20} id={id} />
          <Blossom x={224} y={140} r={10} rot={-20} id={id} />
        </g>
      )}

      {/* Right band */}
      <circle cx="152" cy="118" r="46" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="10" />
      <circle cx="152" cy="118" r="46" fill="none" stroke="#fff6dc" strokeWidth="1.4" opacity="0.7" strokeDasharray="40 250" />
      {/* Left band with solitaire */}
      <circle cx="104" cy="118" r="46" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="10" />
      <circle cx="104" cy="118" r="46" fill="none" stroke="#fff6dc" strokeWidth="1.4" opacity="0.7" strokeDasharray="50 240" strokeDashoffset="120" />
      {/* Interlock: bring part of the right band back in front */}
      <g clipPath={`url(#${id}-front)`}>
        <circle cx="152" cy="118" r="46" fill="none" stroke={`url(#${id}-gold)`} strokeWidth="10" />
      </g>
      {/* Setting and diamond on top of the left band */}
      <path d="M94 74 L98 64 M114 74 L110 64" stroke="#b8892b" strokeWidth="3" strokeLinecap="round" />
      <g transform="translate(104 52)">
        <polygon points="-16,0 -9,-11 9,-11 16,0 0,18" fill={`url(#${id}-gem)`} stroke="#8fb6cc" strokeWidth="1" />
        <polyline points="-16,0 16,0" stroke="#9cc3d8" strokeWidth="0.8" fill="none" />
        <polyline points="-9,-11 -4,0 0,18 4,0 9,-11" stroke="#9cc3d8" strokeWidth="0.8" fill="none" />
        <polyline points="-4,0 0,-11 4,0" stroke="#b9d9ea" strokeWidth="0.8" fill="none" />
      </g>
      {/* Sparkles */}
      {[
        [134, 40, 7], [76, 34, 5], [196, 70, 6], [58, 88, 4],
      ].map(([x, y, s], i) => (
        <path key={i} d={`M${x} ${y - s} L${x + s * 0.25} ${y - s * 0.25} L${x + s} ${y} L${x + s * 0.25} ${y + s * 0.25} L${x} ${y + s} L${x - s * 0.25} ${y + s * 0.25} L${x - s} ${y} L${x - s * 0.25} ${y - s * 0.25} Z`} fill="#e3be63" />
      ))}
    </svg>
  );
}
