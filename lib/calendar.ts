import { COUPLE, EVENT, MAPS_LINK } from "./config";

const stamp = (iso: string) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

const title = `${EVENT.occasion}: ${COUPLE.partnerA} & ${COUPLE.partnerB}`;
const location = `${EVENT.venue.name}, ${EVENT.venue.address}`;
const details = `${EVENT.invite} ${COUPLE.partnerA} & ${COUPLE.partnerB}. ${EVENT.time}, ${EVENT.meal.toLowerCase()}.\n${MAPS_LINK}`;

export function googleCalendarUrl() {
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${stamp(EVENT.start)}/${stamp(EVENT.end)}`,
    details,
    location,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

/** Downloads an .ics file (Apple Calendar, Outlook). */
export function downloadIcs() {
  const esc = (s: string) => s.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shreyas & Kruthika//Invitation//EN",
    "BEGIN:VEVENT",
    `UID:engagement-${stamp(EVENT.start)}@shreyas-and-kruthika`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(EVENT.start)}`,
    `DTEND:${stamp(EVENT.end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(details)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "shreyas-kruthika-engagement.ics";
  a.click();
  URL.revokeObjectURL(url);
}
