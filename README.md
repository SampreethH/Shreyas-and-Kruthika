# Shreyas & Kruthika · Engagement Invitation

Engagement invitation for Shreyas & Kruthika (26 November 2026). A red Kanjeevaram-silk gatefold, sealed with a gold S·K medallion, opens onto a lamplit mandapam (dedicated to the family deity Sri Nanjundeshwara Swamy) with the names inside a cusped arch. The page then walks through five rooms: names, families, date, venue and a closing line.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start
```

## Details

Everything personal lives in [lib/config.ts](lib/config.ts).

| What | Where |
| --- | --- |
| Names | `COUPLE` |
| Invitation details, Maps link | `EVENT` |

The WhatsApp link preview is a pre-rendered image at `public/images/share-preview.jpg`.

## Optional files

| File | Effect |
| --- | --- |
| `public/images/venue.jpg` | Real Rajathagiri Palace photo in the venue arch (an illustration shows until then) |
| `public/audio/theme.mp3` | Background music, started on the seal tap, with a mute button |

## Structure

- `components/ui/OpeningCard.tsx`: the silk gatefold, zari borders, gold medallion and the open sequence
- `components/ui/MandapamScene.tsx`: the mandapam (arch, pillars, torana, jasmine, diyas, rangoli); also the first room of the page
- `components/ui/Rooms.tsx`: the five rooms and their scroll reveals
- `lib/arch.ts`: the cusped arch shape shared by every arch frame and the photo mask
- No longer used, kept for reference: the 3D temple gate (`components/canvas`, `GateOverlay`, `CSSGateFallback`, `lib/doorTexture.ts`) and the earlier single card (`Sanctum`, `Invitation`, `EngagementBackdrop`, `VenueMap`)
