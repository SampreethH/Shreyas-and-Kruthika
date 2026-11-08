/** Single place for the couple's names and the invitation details. */

export const COUPLE = {
  partnerA: "Shreyas",
  partnerB: "Kruthika",
};

/** Invitation details, as printed on the invitation card. */
export const EVENT = {
  // Drives the calendar entry.
  start: "2026-11-26T10:30:00+05:30",
  end: "2026-11-26T14:30:00+05:30",
  blessingLine: "|| Shri Ganeshaya Namah ||",
  invite: "Together with our families, we joyfully invite you to the Engagement Ceremony of",
  occasion: "Engagement Ceremony",
  date: "Thursday, 26th November 2026",
  time: "10:30 AM onwards",
  meal: "Followed by Lunch",
  venue: {
    name: "Rajathagiri Palace",
    address: "Kanakapura Road, Bangalore",
    note: "Valet parking available",
  },
  mapsUrl: "https://maps.app.goo.gl/LvzMYxLYdj8hUon57",
  // Place as Google names it for the share link above, used for the embedded map.
  mapsPlace: "Rajathagiri Palace - Vajarahalli, 1, 100 ft Road, Kanakapura Main Rd, Vajarahalli, Bengaluru, Karnataka 560109",
  blessing: "Your presence and blessings will make this day truly special.",
  regards: "Warm Regards: Family & Friends",
};

export const MAPS_LINK = EVENT.mapsUrl;
export const MAPS_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(EVENT.mapsPlace)}&z=16&output=embed`;
