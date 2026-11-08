"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import OpeningCard from "@/components/ui/OpeningCard";
import Rooms from "@/components/ui/Rooms";

/**
 * card    the sealed silk gatefold fills the screen
 * reveal  it has opened onto the mandapam; the page (whose first room is
 *         the same mandapam) is mounted beneath it and takes over
 * open    only the page remains
 *
 * The 3D temple gate (components/canvas, GateOverlay, CSSGateFallback) and
 * the earlier single-card invitation (Sanctum, Invitation) are no longer
 * used, but are kept should they be wanted back.
 */
type Stage = "card" | "reveal" | "open";

/** Optional background music: drop a track at public/audio/theme.mp3 to enable it. */
const TRACK = "/audio/theme.mp3";

export default function Home() {
  const [stage, setStage] = useState<Stage>("card");
  const audio = useRef<HTMLAudioElement | null>(null);
  const [hasTrack, setHasTrack] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("gate-locked", stage === "card");
    if (stage === "reveal") window.scrollTo(0, 0);
  }, [stage]);

  useEffect(() => {
    fetch(TRACK, { method: "HEAD" })
      .then((r) => {
        if (!r.ok || !(r.headers.get("content-type") ?? "").startsWith("audio")) return;
        const a = new Audio(TRACK);
        a.loop = true;
        a.volume = 0.45;
        a.preload = "auto";
        audio.current = a;
        setHasTrack(true);
      })
      .catch(() => {});
    return () => audio.current?.pause();
  }, []);

  // Runs inside the tap on the seal, which is what lets mobile browsers start audio.
  const startMusic = useCallback(() => {
    audio.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, []);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    if (a.paused) void a.play().then(() => setPlaying(true));
    else {
      a.pause();
      setPlaying(false);
    }
  };

  return (
    <main className="relative">
      {stage !== "card" && <Rooms />}
      {stage !== "open" && <OpeningCard onOpen={startMusic} onReveal={() => setStage("reveal")} onDone={() => setStage("open")} />}

      {hasTrack && stage !== "card" && (
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Mute music" : "Play music"}
          aria-pressed={playing}
          className="fixed right-4 bottom-4 z-[70] grid size-11 place-items-center rounded-full border border-gold-light/60 bg-bottle-deep/80 text-gold-light shadow-lg backdrop-blur transition hover:bg-bottle-deep"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          {playing ? <Volume2 size={18} /> : <VolumeX size={18} />}
        </button>
      )}
    </main>
  );
}
