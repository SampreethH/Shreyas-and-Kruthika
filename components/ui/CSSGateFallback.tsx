"use client";

import { useEffect, useRef } from "react";
import { gate } from "@/lib/gateState";

/**
 * CSS 3D version of the gate for devices without WebGL. Reads the same
 * shared gate state so gestures and the opening timeline still drive it.
 */
export default function CSSGateFallback() {
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const deg = gate.progress * 100;
      if (left.current) left.current.style.transform = `rotateY(${deg}deg)`;
      if (right.current) right.current.style.transform = `rotateY(${-deg}deg)`;
      if (stage.current)
        stage.current.style.transform = `scale(${1 + gate.push * 1.8}) rotateX(${gate.tiltY * -4}deg) rotateY(${gate.tiltX * 6}deg)`;
      if (glow.current) glow.current.style.opacity = String(0.35 + gate.progress * 0.65);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, []);

  const leaf =
    "absolute top-0 h-full w-1/2 border border-[#f3e5ab]/30 bg-[linear-gradient(135deg,#7a5414,#d4af37_30%,#996515_55%,#f3e5ab_75%,#7a5414)] shadow-[inset_0_0_50px_rgba(90,60,10,0.45),0_20px_50px_-20px_rgba(122,85,18,0.6)] [backface-visibility:hidden]";
  const panels = (
    <div className="absolute inset-[6%] grid grid-rows-[1fr_1.4fr_1.6fr] gap-[4%]">
      {[0, 1, 2].map((i) => (
        <div key={i} className="grid place-items-center rounded-sm border-2 border-[#f3e5ab]/60 shadow-[inset_0_0_20px_rgba(60,30,0,0.7)]">
          <div className="size-1/2 rounded-full border-4 border-dotted border-[#f3e5ab]/70" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-0 grid place-items-center overflow-hidden bg-[radial-gradient(ellipse_at_center,#fffaf0,#f4ead9_70%)] [perspective:1400px]">
      <div ref={stage} className="relative h-[70vh] w-[min(70vh,90vw)] [transform-style:preserve-3d]" style={{ aspectRatio: "2 / 3" }}>
        <div ref={glow} className="absolute inset-[4%] bg-[radial-gradient(ellipse_at_center,#fff6d8,#ffbf5a_40%,transparent_75%)] blur-md" />
        <div ref={left} className={`${leaf} left-0 origin-left`}>
          {panels}
        </div>
        <div ref={right} className={`${leaf} right-0 origin-right`}>
          {panels}
        </div>
        <div className="absolute -inset-x-[8%] -top-[8%] h-[8%] rounded-t-md bg-gradient-to-b from-[#f3e5ab] to-[#996515]" />
      </div>
    </div>
  );
}
