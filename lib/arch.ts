/**
 * Cusped (multifoil) temple arch geometry, shared by the mandapam, the
 * room frames and the venue photo mask so every arch on the site is the
 * same arch.
 *
 * The opening is two straight jambs and a round head. The head is cut into
 * `lobes` scallops: each is a small arc that bulges outward, so the cusps
 * between them point in towards the opening, as in carved stone.
 */

const r2 = (n: number) => Math.round(n * 100) / 100;

export function archPath({
  x0 = 0,
  x1 = 100,
  top = 0,
  spring = 50,
  bottom = 140,
  lobes = 7,
}: { x0?: number; x1?: number; top?: number; spring?: number; bottom?: number; lobes?: number } = {}) {
  const cx = (x0 + x1) / 2;
  const rx = (x1 - x0) / 2;
  const ry = spring - top;
  const pts = Array.from({ length: lobes + 1 }, (_, i) => {
    const t = Math.PI - (i * Math.PI) / lobes;
    return [cx + rx * Math.cos(t), spring - ry * Math.sin(t)] as const;
  });
  let d = `M${r2(x0)} ${r2(bottom)} L${r2(x0)} ${r2(spring)}`;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1];
    const [bx, by] = pts[i];
    const r = Math.hypot(bx - ax, by - ay) * 0.62;
    d += ` A${r2(r)} ${r2(r)} 0 0 1 ${r2(bx)} ${r2(by)}`;
  }
  return `${d} L${r2(x1)} ${r2(bottom)} Z`;
}

/**
 * The arch inset within a 100-wide box so the outward-bulging scallops stay
 * inside it. Use this for anything that has to fill a box edge to edge
 * (a mask), and draw its outline with the same geometry.
 */
export const boxedArch = (bottom: number) => archPath({ x0: 5, x1: 95, top: 6, spring: 50, bottom });

/** The arch as a CSS mask, stretched to whatever box it is applied to. */
export function archMask(bottom = 140) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 ${bottom}' preserveAspectRatio='none'><path d='${boxedArch(bottom)}'/></svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
