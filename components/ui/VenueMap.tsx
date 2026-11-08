"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { EVENT, MAPS_EMBED, MAPS_LINK } from "@/lib/config";

export default function VenueMap() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1 }}
      className="grid overflow-hidden rounded-3xl border border-gold/30 bg-pearl/85 shadow-[0_40px_90px_-40px_rgba(122,85,18,0.55)] backdrop-blur-md md:grid-cols-[1fr_1.4fr]"
    >
      <div className="flex flex-col justify-center gap-4 p-7 sm:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-[#f6e3ae] via-gold to-gold-deep text-pearl">
          <MapPin size={22} />
        </span>
        <div>
          <p className="font-display text-2xl font-bold tracking-wide text-gold-deep">{EVENT.venue.name}</p>
          <p className="mt-1 text-ink/70">{EVENT.venue.address}</p>
          <p className="mt-1 font-serif text-lg italic text-ink/70">({EVENT.venue.note})</p>
        </div>
        <div className="border-t border-gold/20 pt-4 text-sm text-ink/70">
          <p>{EVENT.date}</p>
          <p className="text-ink/55">
            {EVENT.time} · {EVENT.meal}
          </p>
        </div>
        <a
          href={MAPS_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-gold-deep via-gold to-[#c99a3a] px-5 py-3 text-sm font-medium text-pearl shadow-[0_12px_30px_-12px_rgba(122,85,18,0.8)] transition hover:brightness-110"
        >
          <Navigation size={16} />
          Get Directions
        </a>
      </div>
      <iframe
        title={`${EVENT.venue.name} map`}
        src={MAPS_EMBED}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-80 w-full border-0 sepia-[0.25] md:h-full md:min-h-[26rem]"
      />
    </motion.div>
  );
}
