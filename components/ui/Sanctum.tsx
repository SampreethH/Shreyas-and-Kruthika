"use client";

import { motion } from "framer-motion";
import { COUPLE, EVENT, MAPS_LINK } from "@/lib/config";
import Invitation from "./Invitation";
import EngagementBackdrop from "./EngagementBackdrop";
import VenueMap from "./VenueMap";

function Divider() {
  return (
    <div className="mx-auto mt-5 flex w-56 items-center gap-3 text-gold" aria-hidden>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-gold/70" />
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1.5 3 4 4.5 4 8a4 4 0 0 1-8 0c0-3.5 2.5-5 4-8Zm-7 9c2 0 4 1.5 5 4-2.5.5-5 0-6.5-2 .5-1.2.9-2 1.5-2Zm14 0c.6 0 1 .8 1.5 2-1.5 2-4 2.5-6.5 2 1-2.5 3-4 5-4ZM12 16c2 0 3.5 1.5 4 4H8c.5-2.5 2-4 4-4Z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-gold/70" />
    </div>
  );
}

export default function Sanctum() {
  return (
    <div className="relative">
      <EngagementBackdrop />
      <div className="relative z-10">
        <Invitation />

        <section id="venue" className="relative overflow-hidden px-4 py-24 sm:px-8">
          <div className="relative mx-auto max-w-6xl">
            <motion.header
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 1.1 }}
              className="mx-auto mb-12 max-w-2xl text-center"
            >
              <p className="eyebrow">Join Us</p>
              <h2 className="font-display text-gold-gradient mt-3 text-4xl font-bold leading-snug sm:text-5xl">The Venue</h2>
              <Divider />
              <p className="mt-4 font-serif text-xl italic text-ink/65">We look forward to welcoming you.</p>
            </motion.header>
            <VenueMap />
          </div>
        </section>

        <footer className="relative border-t border-gold/20 bg-sandal/70 px-4 py-16 text-center backdrop-blur-sm">
          <p className="font-display text-gold-gradient text-3xl font-bold">
            {COUPLE.partnerA} &amp; {COUPLE.partnerB}
          </p>
          <a href={MAPS_LINK} target="_blank" rel="noopener noreferrer" className="group mt-3 inline-block">
            <span className="block text-sm text-ink/65 underline decoration-gold/40 underline-offset-4 group-hover:text-gold-deep">
              {EVENT.date} · {EVENT.venue.name}, {EVENT.venue.address}
            </span>
          </a>
          <p className="mt-4 font-serif text-lg italic text-ink/55">{EVENT.regards}</p>
        </footer>
      </div>
    </div>
  );
}
