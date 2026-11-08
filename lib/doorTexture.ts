import * as THREE from "three";

/**
 * Procedurally carves a door leaf as a grayscale height map (white = raised),
 * then derives a gold colour map from it. The same height map drives the bump
 * map, so the door stays a single low-poly box with convincing relief.
 */

type Ctx = CanvasRenderingContext2D;

const W = 512;
const H = 1536;

function lotus(c: Ctx, x: number, y: number, r: number, petals = 8, layers = 3) {
  for (let l = 0; l < layers; l++) {
    const rr = r * (1 - l * 0.28);
    const n = petals + l * 0;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (l % 2) * (Math.PI / n);
      c.save();
      c.translate(x, y);
      c.rotate(a);
      const g = c.createLinearGradient(0, 0, 0, -rr);
      g.addColorStop(0, `rgb(${120 + l * 40},${120 + l * 40},${120 + l * 40})`);
      g.addColorStop(1, `rgb(${200 + l * 18},${200 + l * 18},${200 + l * 18})`);
      c.fillStyle = g;
      c.beginPath();
      c.moveTo(0, 0);
      c.bezierCurveTo(rr * 0.42, -rr * 0.3, rr * 0.3, -rr * 0.85, 0, -rr);
      c.bezierCurveTo(-rr * 0.3, -rr * 0.85, -rr * 0.42, -rr * 0.3, 0, 0);
      c.fill();
      c.strokeStyle = "rgba(60,60,60,0.6)";
      c.lineWidth = 1.5;
      c.stroke();
      c.restore();
    }
  }
  const g = c.createRadialGradient(x, y, 0, x, y, r * 0.22);
  g.addColorStop(0, "#fff");
  g.addColorStop(1, "#999");
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r * 0.22, 0, Math.PI * 2);
  c.fill();
}

/** Trishula: spear-tipped centre prong flanked by two crescent prongs, on a banded shaft. */
function trishula(c: Ctx, x: number, y: number, r: number) {
  c.save();
  c.translate(x, y);
  c.lineCap = "round";
  c.lineJoin = "round";
  // Shaft
  c.strokeStyle = "rgb(225,225,225)";
  c.lineWidth = r * 0.13;
  c.beginPath();
  c.moveTo(0, -r * 0.35);
  c.lineTo(0, r * 1.3);
  c.stroke();
  // Side prongs sweep out and curl upward
  c.lineWidth = r * 0.12;
  for (const s of [-1, 1]) {
    c.beginPath();
    c.moveTo(0, -r * 0.2);
    c.bezierCurveTo(s * r * 0.7, -r * 0.2, s * r * 0.75, -r * 0.7, s * r * 0.55, -r * 1.05);
    c.stroke();
    // Barbed tip
    c.fillStyle = "rgb(240,240,240)";
    c.beginPath();
    c.moveTo(s * r * 0.55, -r * 1.25);
    c.lineTo(s * r * 0.66, -r * 0.98);
    c.lineTo(s * r * 0.44, -r * 0.98);
    c.closePath();
    c.fill();
  }
  // Centre spear
  c.fillStyle = "rgb(250,250,250)";
  c.beginPath();
  c.moveTo(0, -r * 1.45);
  c.bezierCurveTo(r * 0.2, -r * 1.05, r * 0.16, -r * 0.6, 0, -r * 0.35);
  c.bezierCurveTo(-r * 0.16, -r * 0.6, -r * 0.2, -r * 1.05, 0, -r * 1.45);
  c.fill();
  c.strokeStyle = "rgba(80,80,80,0.6)";
  c.lineWidth = r * 0.02;
  c.beginPath();
  c.moveTo(0, -r * 1.35);
  c.lineTo(0, -r * 0.45);
  c.stroke();
  // Collar bands where the prongs meet the shaft
  c.fillStyle = "rgb(205,205,205)";
  for (const by of [-0.28, -0.12]) {
    c.beginPath();
    c.ellipse(0, r * by, r * 0.2, r * 0.06, 0, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

/** Damaru: hourglass drum with laced sides, waist band and two knotted beads. */
function damaru(c: Ctx, x: number, y: number, r: number) {
  c.save();
  c.translate(x, y);
  const g = c.createLinearGradient(-r * 0.6, 0, r * 0.6, 0);
  g.addColorStop(0, "#8a8a8a");
  g.addColorStop(0.5, "#f0f0f0");
  g.addColorStop(1, "#8a8a8a");
  c.fillStyle = g;
  // Two cones meeting at the waist
  for (const s of [-1, 1]) {
    c.beginPath();
    c.moveTo(-r * 0.62, s * r * 0.95);
    c.lineTo(r * 0.62, s * r * 0.95);
    c.lineTo(r * 0.1, 0);
    c.lineTo(-r * 0.1, 0);
    c.closePath();
    c.fill();
    // Drum head rim
    c.fillStyle = "rgb(235,235,235)";
    c.beginPath();
    c.ellipse(0, s * r * 0.95, r * 0.62, r * 0.14, 0, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = g;
  }
  // Zig-zag lacing between the heads
  c.strokeStyle = "rgba(70,70,70,0.7)";
  c.lineWidth = r * 0.03;
  c.beginPath();
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const yy = -r * 0.9 + t * r * 1.8;
    const half = r * (0.1 + 0.5 * Math.abs(yy) / (r * 0.95));
    const xx = (i % 2 ? 1 : -1) * half * 0.9;
    if (i === 0) c.moveTo(xx, yy);
    else c.lineTo(xx, yy);
  }
  c.stroke();
  // Waist band and the two striker beads on cords
  c.fillStyle = "rgb(245,245,245)";
  c.fillRect(-r * 0.2, -r * 0.08, r * 0.4, r * 0.16);
  c.strokeStyle = "rgb(200,200,200)";
  c.lineWidth = r * 0.035;
  for (const s of [-1, 1]) {
    c.beginPath();
    c.moveTo(s * r * 0.2, 0);
    c.quadraticCurveTo(s * r * 0.55, r * 0.15, s * r * 0.8, -r * 0.1);
    c.stroke();
    c.fillStyle = "rgb(250,250,250)";
    c.beginPath();
    c.arc(s * r * 0.82, -r * 0.12, r * 0.09, 0, Math.PI * 2);
    c.fill();
  }
  c.restore();
}

/** Shiva Linga on its pitha, marked with tripundra, crowned by a bilva leaf. `dir` sets the spout side. */
function linga(c: Ctx, x: number, y: number, s: number, dir: 1 | -1 = 1) {
  c.save();
  c.translate(x, y);
  c.scale(dir, 1);
  // Pitha (base) with spout to the right
  c.fillStyle = "rgb(200,200,200)";
  c.beginPath();
  c.ellipse(0, s * 0.42, s * 0.62, s * 0.14, 0, 0, Math.PI * 2);
  c.fill();
  c.fillStyle = "rgb(225,225,225)";
  c.beginPath();
  c.moveTo(-s * 0.6, s * 0.3);
  c.lineTo(s * 0.45, s * 0.3);
  c.quadraticCurveTo(s * 0.8, s * 0.28, s * 0.85, s * 0.36);
  c.lineTo(s * 0.55, s * 0.4);
  c.lineTo(-s * 0.6, s * 0.4);
  c.closePath();
  c.fill();
  c.fillStyle = "rgb(210,210,210)";
  c.fillRect(-s * 0.48, s * 0.18, s * 0.96, s * 0.12);
  // Linga: rounded-top column
  const g = c.createLinearGradient(-s * 0.28, 0, s * 0.28, 0);
  g.addColorStop(0, "#9a9a9a");
  g.addColorStop(0.45, "#fafafa");
  g.addColorStop(1, "#9a9a9a");
  c.fillStyle = g;
  c.beginPath();
  c.moveTo(-s * 0.26, s * 0.18);
  c.lineTo(-s * 0.26, -s * 0.2);
  c.arc(0, -s * 0.2, s * 0.26, Math.PI, 0);
  c.lineTo(s * 0.26, s * 0.18);
  c.closePath();
  c.fill();
  // Tripundra: three horizontal lines with a central dot
  c.strokeStyle = "rgb(255,255,255)";
  c.lineWidth = s * 0.03;
  c.lineCap = "round";
  for (let i = 0; i < 3; i++) {
    c.beginPath();
    c.moveTo(-s * 0.18, -s * 0.18 + i * s * 0.07);
    c.lineTo(s * 0.18, -s * 0.18 + i * s * 0.07);
    c.stroke();
  }
  c.fillStyle = "rgb(120,120,120)";
  c.beginPath();
  c.arc(0, -s * 0.11, s * 0.035, 0, Math.PI * 2);
  c.fill();
  // Bilva: three leaves fanned above the linga
  c.fillStyle = "rgb(215,215,215)";
  for (const [a, len] of [[-0.75, 0.32], [0, 0.38], [0.75, 0.32]] as const) {
    c.save();
    c.translate(0, -s * 0.55);
    c.rotate(a);
    c.beginPath();
    c.moveTo(0, 0);
    c.bezierCurveTo(s * 0.13, -s * len * 0.4, s * 0.1, -s * len * 0.85, 0, -s * len);
    c.bezierCurveTo(-s * 0.1, -s * len * 0.85, -s * 0.13, -s * len * 0.4, 0, 0);
    c.fill();
    c.strokeStyle = "rgba(80,80,80,0.5)";
    c.lineWidth = s * 0.012;
    c.beginPath();
    c.moveTo(0, 0);
    c.lineTo(0, -s * len * 0.9);
    c.stroke();
    c.restore();
  }
  c.restore();
}

/** Raised rounded frame used around every panel. */
function frame(c: Ctx, x: number, y: number, w: number, h: number, t: number) {
  c.strokeStyle = "rgb(235,235,235)";
  c.lineWidth = t;
  c.strokeRect(x + t / 2, y + t / 2, w - t, h - t);
  c.strokeStyle = "rgb(70,70,70)";
  c.lineWidth = 2;
  c.strokeRect(x + t + 2, y + t + 2, w - 2 * t - 4, h - 2 * t - 4);
  // Bead moulding
  c.fillStyle = "rgb(220,220,220)";
  const step = 16;
  for (let px = x + t + 10; px < x + w - t - 6; px += step) {
    c.beginPath();
    c.arc(px, y + t + 9, 4, 0, Math.PI * 2);
    c.arc(px, y + h - t - 9, 4, 0, Math.PI * 2);
    c.fill();
  }
  for (let py = y + t + 10; py < y + h - t - 6; py += step) {
    c.beginPath();
    c.arc(x + t + 9, py, 4, 0, Math.PI * 2);
    c.arc(x + w - t - 9, py, 4, 0, Math.PI * 2);
    c.fill();
  }
}

function boss(c: Ctx, x: number, y: number, r: number) {
  const g = c.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r);
  g.addColorStop(0, "#fff");
  g.addColorStop(0.7, "#bbb");
  g.addColorStop(1, "#555");
  c.fillStyle = g;
  c.beginPath();
  c.arc(x, y, r, 0, Math.PI * 2);
  c.fill();
}

function carveHeight(side: "left" | "right") {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;
  c.fillStyle = "rgb(95,95,95)";
  c.fillRect(0, 0, W, H);

  frame(c, 0, 0, W, H, 26);

  // Top: Shiva's Trishula on the left leaf, Damaru on the right
  const topY = 60;
  frame(c, 50, topY, W - 100, 330, 14);
  if (side === "left") trishula(c, W / 2, topY + 170, 100);
  else damaru(c, W / 2, topY + 165, 105);

  // Middle: Shiva Linga with bilva over a lotus field
  const midY = 420;
  frame(c, 50, midY, W - 100, 470, 14);
  lotus(c, W / 2, midY + 340, 100, 12, 3);
  // Spouts point outward on each leaf so the pair mirrors
  linga(c, W / 2 + (side === "left" ? 12 : -12), midY + 190, 175, side === "left" ? -1 : 1);

  // Lower: grid of lotus rosettes with bosses between them
  const lowY = 920;
  frame(c, 50, lowY, W - 100, 560, 14);
  const cols = 2;
  const rows = 3;
  const cw = (W - 160) / cols;
  const rh = 500 / rows;
  for (let r = 0; r < rows; r++) {
    for (let col = 0; col < cols; col++) {
      const cx = 80 + cw * col + cw / 2;
      const cy = lowY + 30 + rh * r + rh / 2;
      lotus(c, cx, cy, Math.min(cw, rh) * 0.4, 8, 2);
    }
  }
  for (let r = 0; r <= rows; r++) {
    for (let col = 0; col <= cols; col++) {
      boss(c, 80 + cw * col, lowY + 30 + rh * r, 11);
    }
  }

  // Soften everything slightly so the bump reads as cast metal, not pixels.
  const soft = document.createElement("canvas");
  soft.width = W;
  soft.height = H;
  const s = soft.getContext("2d")!;
  s.filter = "blur(1.6px)";
  s.drawImage(cv, 0, 0);
  return soft;
}

function goldFromHeight(height: HTMLCanvasElement) {
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const c = cv.getContext("2d")!;
  const src = height.getContext("2d")!.getImageData(0, 0, W, H);
  const out = c.createImageData(W, H);
  // Recesses read as patinated bronze, raised areas as polished gold.
  const lo = [62, 36, 10];
  const mid = [153, 101, 21];
  const hi = [243, 229, 171];
  for (let i = 0; i < src.data.length; i += 4) {
    const h = src.data[i] / 255;
    const n = (Math.random() - 0.5) * 10;
    let col: number[];
    if (h < 0.5) {
      const t = h / 0.5;
      col = lo.map((v, k) => v + (mid[k] - v) * t);
    } else {
      const t = (h - 0.5) / 0.5;
      col = mid.map((v, k) => v + (hi[k] - v) * t);
    }
    out.data[i] = col[0] + n;
    out.data[i + 1] = col[1] + n;
    out.data[i + 2] = col[2] + n * 0.6;
    out.data[i + 3] = 255;
  }
  c.putImageData(out, 0, 0);
  return cv;
}

function roughnessFromHeight(height: HTMLCanvasElement) {
  const cv = document.createElement("canvas");
  cv.width = W / 2;
  cv.height = H / 2;
  const c = cv.getContext("2d")!;
  // Inverted: raised (polished by touch) is smooth, recesses are rough.
  c.filter = "invert(1) contrast(0.6) brightness(0.9)";
  c.drawImage(height, 0, 0, W / 2, H / 2);
  return cv;
}

export type DoorMaps = {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
};

const cache: Partial<Record<"left" | "right", DoorMaps>> = {};

export function doorMaps(side: "left" | "right"): DoorMaps {
  if (cache[side]) return cache[side]!;
  const height = carveHeight(side);
  const map = new THREE.CanvasTexture(goldFromHeight(height));
  map.colorSpace = THREE.SRGBColorSpace;
  map.anisotropy = 8;
  const bumpMap = new THREE.CanvasTexture(height);
  const roughnessMap = new THREE.CanvasTexture(roughnessFromHeight(height));
  cache[side] = { map, bumpMap, roughnessMap };
  return cache[side]!;
}

/** Shaiva tripundra (three bands of vibhuti with a kumkuma dot) for the lintel, on transparent. */
export function tripundraTexture() {
  const cv = document.createElement("canvas");
  cv.width = 512;
  cv.height = 512;
  const c = cv.getContext("2d")!;
  // Three gently curved ash-white bands, like vibhuti drawn with three fingers
  c.strokeStyle = "#FDFBF7";
  c.lineCap = "round";
  c.lineWidth = 40;
  for (let i = 0; i < 3; i++) {
    const y = 170 + i * 82;
    c.beginPath();
    c.moveTo(70, y + 12);
    c.quadraticCurveTo(256, y - 14, 442, y + 12);
    c.stroke();
  }
  // Kumkuma dot at the centre
  const g = c.createRadialGradient(250, 250, 4, 256, 256, 42);
  g.addColorStop(0, "#ff5a3a");
  g.addColorStop(1, "#b3121a");
  c.fillStyle = g;
  c.beginPath();
  c.arc(256, 255, 40, 0, Math.PI * 2);
  c.fill();
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** Ivory marble with faint gold-grey veining, tiled `repeat` times. */
export function marbleTexture(repeat = 1) {
  const S = 512;
  const cv = document.createElement("canvas");
  cv.width = S;
  cv.height = S;
  const c = cv.getContext("2d")!;
  c.fillStyle = "#f7f1e6";
  c.fillRect(0, 0, S, S);
  // Cloudy tone variation
  for (let i = 0; i < 40; i++) {
    const g = c.createRadialGradient(Math.random() * S, Math.random() * S, 0, Math.random() * S, Math.random() * S, 60 + Math.random() * 160);
    g.addColorStop(0, `rgba(${225 + Math.random() * 20},${212 + Math.random() * 20},${190 + Math.random() * 20},0.35)`);
    g.addColorStop(1, "rgba(255,255,255,0)");
    c.fillStyle = g;
    c.fillRect(0, 0, S, S);
  }
  // Veins, drawn three times offset so the tile wraps seamlessly
  c.filter = "blur(0.8px)";
  for (let i = 0; i < 9; i++) {
    const x0 = Math.random() * S;
    const y0 = Math.random() * S;
    const pts = Array.from({ length: 5 }, (_, k) => [x0 + k * 70 + (Math.random() - 0.5) * 60, y0 + (Math.random() - 0.5) * 140]);
    const gold = Math.random() < 0.3;
    c.strokeStyle = gold ? "rgba(190,150,70,0.22)" : `rgba(160,145,125,${0.06 + Math.random() * 0.08})`;
    c.lineWidth = 0.4 + Math.random() * 0.9;
    for (const [ox, oy] of [[0, 0], [-S, 0], [0, -S], [-S, -S]]) {
      c.beginPath();
      c.moveTo(pts[0][0] + ox, pts[0][1] + oy);
      for (let k = 1; k < pts.length - 1; k++) {
        const mx = (pts[k][0] + pts[k + 1][0]) / 2;
        const my = (pts[k][1] + pts[k + 1][1]) / 2;
        c.quadraticCurveTo(pts[k][0] + ox, pts[k][1] + oy, mx + ox, my + oy);
      }
      c.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  return tex;
}
