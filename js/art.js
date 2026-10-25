// The look: a warm, sepia, hand-drawn teahouse. Soft dark-brown outlines, muted colours, wood everywhere, chibi guests
// with big heads, closed happy eyes and rosy cheeks, cups of tea and plates on wooden tables, a paper grain and a
// warm vignette over everything, lantern light, hearts and confetti when someone is happy. The shop opens onto a
// little street at the bottom: a red-brick pavement and an alley road where people and scooters go by.
// All drawn on a canvas, nothing loaded.
import { WALLS, FLOORS, PRODUCTS } from './data.js?v=2';

export const INK = '#4a3426';
const rnd = (a, b) => a + Math.random() * (b - a);
export const hash = (n, k = 0) => { let h = (n * 374761393 + k * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function path(g, fill, stroke = INK, lw = 2) { if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); } }
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
const ell = (g, x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, Math.PI * 2); };
export const shade = (hex, k) => { const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, gg = (n >> 8) & 255, b = n & 255, f = (v) => Math.max(0, Math.min(255, Math.round(k > 1 ? v + (255 - v) * (k - 1) : v * k))); return `rgb(${f(r)},${f(gg)},${f(b)})`; };

// ------------------------------------------------------------------ paper and light
let PAPER = null;
export function paper() {
  if (PAPER) return PAPER;
  const c = document.createElement('canvas'); c.width = c.height = 256; const g = c.getContext('2d'), d = g.createImageData(256, 256);
  for (let i = 0; i < d.data.length; i += 4) { const v = 128 + (Math.random() - 0.5) * 60; d.data[i] = v + 10; d.data[i + 1] = v; d.data[i + 2] = v - 20; d.data[i + 3] = 28; }
  g.putImageData(d, 0, 0); PAPER = c; return c;
}
export function finish(g, W, H) {
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = g.createPattern(paper(), 'repeat'); g.fillRect(0, 0, W, H);
  const v = g.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.35, W / 2, H / 2, Math.max(W, H) * 0.75); v.addColorStop(0, 'rgba(255,240,210,0)'); v.addColorStop(1, 'rgba(120,80,40,0.45)'); g.fillStyle = v; g.fillRect(0, 0, W, H);
  g.restore();
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(255,200,120,0.25)'; g.fillRect(0, 0, W, H); g.restore();
}

// ------------------------------------------------------------------ the room
// slots for tables (centres) in the order they open up as the shop grows; the floor area each size uses
export const SLOTS = [[400, 330], [620, 330], [400, 480], [620, 480], [840, 330], [840, 480], [180, 480], [400, 630], [620, 630]];
export const roomH = (size) => (size >= 3 ? 740 : 600);
export const roomW = (size) => (size >= 2 ? 960 : 740);
export const STREET = 96, DOOR_X = 200;
export const canvasH = (size) => roomH(size) + STREET;
const WALL_SPOTS = [[372, 70], [478, 70], [700, 70], [830, 70], [918, 70]], CEIL_SPOTS = [[350, 0], [520, 0], [690, 0], [860, 0]];
export const FLOOR_SPOTS = [[300, 560], [510, 236], [930, 548], [720, 560], [930, 262]];
export const spotsFor = (spot) => (spot === 'wall' ? WALL_SPOTS : spot === 'ceil' ? CEIL_SPOTS : FLOOR_SPOTS);
export const spotShown = (st, spot, i) => { const p = spotsFor(spot)[i]; return p && p[0] < roomW(st.size) - (spot === 'wall' ? 30 : 20) && (spot !== 'floor' || p[1] < roomH(st.size) - 30); };

export function room(g, st, t) {
  const W = 960, H = roomH(st.size), RW = roomW(st.size), wall = (WALLS.find((w) => w.id === st.wall) || WALLS[0]).c, floor = (FLOORS.find((f) => f.id === st.floor) || FLOORS[0]).c;
  g.fillStyle = '#3a2a1e'; g.fillRect(0, 0, W, H);
  // back wall with wainscot
  g.fillStyle = wall; g.fillRect(0, 0, RW, 175);
  if (st.wall === 'brick') { g.strokeStyle = 'rgba(90,40,20,0.35)'; g.lineWidth = 1.5; for (let y = 8; y < 140; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); for (let x = (y / 14) % 2 ? 0 : 20; x < RW; x += 40) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 14); g.stroke(); } } }
  if (st.wall === 'wood') { g.strokeStyle = 'rgba(70,40,20,0.35)'; g.lineWidth = 2; for (let x = 0; x < RW; x += 36) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 140); g.stroke(); } }
  if (st.wall === 'cream' || st.wall === 'jade') { g.fillStyle = 'rgba(120,90,50,0.06)'; for (let k = 0; k < 40; k++) { ell(g, hash(k, 1) * RW, hash(k, 2) * 130, 10 + hash(k, 3) * 30, 4 + hash(k, 4) * 8); g.fill(); } }
  g.fillStyle = shade(wall, 0.9); g.fillRect(0, 0, RW, 12); g.fillStyle = '#6a4226'; g.fillRect(0, 10, RW, 4);
  g.fillStyle = '#8a5a34'; g.fillRect(0, 138, RW, 40); g.fillStyle = '#6a4226'; g.fillRect(0, 136, RW, 6); g.fillRect(0, 175, RW, 4);
  for (let x = 0; x < RW; x += 48) { g.strokeStyle = 'rgba(60,30,10,0.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, 142); g.lineTo(x, 176); g.stroke(); }
  // the kitchen door with its noren curtain (top left)
  g.fillStyle = '#5a3a24'; g.fillRect(14, 14, 120, 124); g.fillStyle = '#2a1a10'; g.fillRect(22, 20, 104, 116);
  g.fillStyle = 'rgba(255,200,120,0.25)'; g.fillRect(22, 92, 104, 44);
  const sway = Math.sin(t * 1.2) * 2;
  for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(24 + k * 34, 22); g.lineTo(56 + k * 34, 22); g.lineTo(56 + k * 34 + sway, 96); g.lineTo(24 + k * 34 + sway, 96); g.closePath(); path(g, '#3a5a7a', INK, 1.5); }
  g.fillStyle = '#f4ead4'; g.font = '700 18px "Noto Serif TC", serif'; g.textAlign = 'center'; g.fillText('茶', 74, 64);
  menuBoard(g, st, t);
  // the window onto the back alley, warm afternoon light
  { const x = 545, w = 105; g.fillStyle = '#5a3a24'; g.fillRect(x - 6, 22, w + 12, 98); const lg = g.createLinearGradient(0, 28, 0, 116); lg.addColorStop(0, '#ffe8b8'); lg.addColorStop(1, '#f0b870'); g.fillStyle = lg; g.fillRect(x, 28, w, 86);
    g.fillStyle = 'rgba(150,110,80,0.45)'; g.fillRect(x, 70, 30, 44); g.fillRect(x + 66, 60, 39, 54); g.fillStyle = 'rgba(90,130,70,0.6)'; ell(g, x + 48, 104, 20, 12); g.fill();
    g.fillStyle = '#5a3a24'; g.fillRect(x + w / 2 - 2, 28, 5, 86); g.fillRect(x, 69, w, 4); g.fillStyle = '#6a4226'; g.fillRect(x - 10, 118, w + 20, 7); }
  // the floor
  g.fillStyle = floor; g.fillRect(0, 179, RW, H - 179);
  if (st.floor === 'tile') { for (let y = 179; y < H; y += 34) for (let x = 0; x < RW; x += 34) { g.fillStyle = ((x + y) / 34) % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(60,40,30,0.06)'; g.fillRect(x, y, 34, 34); for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(80,60,50,0.35)'; g.fillRect(x + hash(x * 7 + y, k) * 30, y + hash(x + y * 3, k) * 30, 2, 2); } } }
  else if (st.floor === 'red') { for (let y = 179; y < H; y += 40) for (let x = 0; x < RW; x += 40) { g.fillStyle = hash(x, y) < 0.3 ? 'rgba(255,220,200,0.07)' : 'rgba(0,0,0,0)'; g.fillRect(x, y, 40, 40); g.strokeStyle = 'rgba(70,30,20,0.4)'; g.lineWidth = 2; g.strokeRect(x, y, 40, 40); } }
  else for (let y = 179, k = 0; y < H; y += 26 + k * 0.6, k++) { g.fillStyle = k % 2 ? shade(floor, 0.95) : floor; g.fillRect(0, y, RW, 26 + k * 0.6); g.strokeStyle = 'rgba(70,40,20,0.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); for (let x = hash(k) * 140; x < RW; x += 140 + hash(k, x) * 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 26); g.stroke(); } }
  // soft shadow where the wall meets the floor, a pool of window light, the doormat
  { const ao = g.createLinearGradient(0, 179, 0, 215); ao.addColorStop(0, 'rgba(40,20,10,0.3)'); ao.addColorStop(1, 'rgba(40,20,10,0)'); g.fillStyle = ao; g.fillRect(0, 179, RW, 36); }
  { g.save(); g.globalCompositeOperation = 'lighter'; const lg = g.createLinearGradient(0, 179, 0, 360); lg.addColorStop(0, 'rgba(255,200,120,0.16)'); lg.addColorStop(1, 'rgba(255,200,120,0)'); g.fillStyle = lg; g.beginPath(); g.moveTo(545, 179); g.lineTo(650, 179); g.lineTo(720, 360); g.lineTo(560, 360); g.closePath(); g.fill(); g.restore(); }
  rrect(g, DOOR_X - 34, H - 40, 68, 26, 5); path(g, '#8a4a3a', INK, 1.5); g.strokeStyle = 'rgba(255,220,180,0.4)'; g.lineWidth = 1; for (let k = 1; k < 5; k++) { g.beginPath(); g.moveTo(DOOR_X - 34 + k * 13.6, H - 38); g.lineTo(DOOR_X - 34 + k * 13.6, H - 16); g.stroke(); }
  // the part of the building not yet ours
  if (RW < W) { g.fillStyle = '#5a4434'; g.fillRect(RW, 0, W - RW, H); g.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = RW; x < W; x += 18) g.fillRect(x, 0, 6, H); g.fillStyle = '#f4ead4'; g.font = '700 16px "Noto Sans TC", sans-serif'; g.save(); g.translate(RW + (W - RW) / 2, H / 2); g.rotate(-Math.PI / 2); g.textAlign = 'center'; g.fillText('🔨 ' + (st.lang === 'zh' ? '可以擴建' : 'Room to grow'), 0, 0); g.restore(); }
  // decorations on the wall and the ceiling (floor ones stand among the people)
  (st.decor || []).forEach((d) => { if (!d || d.spot === 'floor' || !spotShown(st, d.spot, d.at)) return; const p = spotsFor(d.spot)[d.at]; decor(g, d.id, p[0], p[1], t); });
}
// the menu: wooden tags hung on the wall above the counter, one per item on sale, and a shelf of jars under them
function menuBoard(g, st, t) {
  const list = (st.menu || []).map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean).slice(0, 6);
  g.fillStyle = '#5a3418'; g.fillRect(146, 16, 162, 5);
  const tags = list.length ? list : [{ short: '準備中', price: '' }];
  tags.forEach((p, i) => {
    const x = 150 + i * 26, sw = Math.sin(t * 1.1 + i) * 0.6;
    g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(x + 11, 20); g.lineTo(x + 11 + sw, 26); g.stroke();
    rrect(g, x + sw, 26, 22, 70, 3); path(g, i % 2 ? '#e8d4a8' : '#f0e0b8', INK, 1.4);
    g.fillStyle = INK; g.font = '700 13px "Noto Serif TC", "Noto Sans TC", serif'; g.textAlign = 'center';
    [...p.short].slice(0, 3).forEach((ch, k) => g.fillText(ch, x + 11 + sw, 42 + k * 15));
    if (p.price) { g.fillStyle = '#a83a2a'; g.font = '800 9px Nunito, sans-serif'; g.fillText(p.price, x + 11 + sw, 92); }
  });
  g.fillStyle = '#6a4226'; g.fillRect(146, 126, 162, 5);
  ['#3a2418', '#f0d890', '#f0d848', '#b898c8', '#e8a030', '#c89048'].forEach((c, k) => { const jx = 152 + k * 26, jy = 104; rrect(g, jx, jy, 20, 22, 5); path(g, 'rgba(240,248,250,0.7)', INK, 1.2); rrect(g, jx + 3, jy + 9, 14, 11, 3); path(g, c, null); rrect(g, jx + 3, jy - 3, 14, 5, 2); path(g, '#a8784a', INK, 1); });
}
// the counter: the register at the right end (where you order), the tea urns, shakers and the sealing machine
export function counter(g, x, y, t, st) {
  rrect(g, x, y, 266, 30, 6); path(g, '#b07a48', INK, 2); rrect(g, x + 6, y + 28, 254, 62, 4); path(g, '#8a5a34', INK, 2);
  g.strokeStyle = 'rgba(255,230,190,0.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(x + 8, y + 6); g.lineTo(x + 258, y + 6); g.stroke();
  for (let k = 0; k < 5; k++) { g.strokeStyle = 'rgba(60,30,10,0.4)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 20 + k * 52, y + 34); g.lineTo(x + 20 + k * 52, y + 86); g.stroke(); }
  // a little paper sign on the front: order here
  rrect(g, x + 196, y + 40, 50, 30, 3); path(g, '#f4ead0', INK, 1.4); g.fillStyle = '#a83a2a'; g.font = '700 12px "Noto Sans TC", sans-serif'; g.textAlign = 'center'; g.fillText(st && st.lang === 'en' ? 'ORDER' : '點餐', x + 221, y + 56); g.fillStyle = INK; g.font = '700 9px Nunito, sans-serif'; g.fillText(st && st.lang === 'en' ? 'here' : 'ORDER', x + 221, y + 66);
  // tea urns with taps, steam rising
  for (const [ux, c] of [[x + 18, '#c8a070'], [x + 52, '#a8b8a0']]) { rrect(g, ux, y - 50, 28, 52, 8); path(g, c, INK, 1.5); g.fillStyle = INK; g.fillRect(ux + 10, y - 8, 8, 4); for (let k = 0; k < 2; k++) { const p = (t * 0.4 + k / 2 + ux * 0.01) % 1; ell(g, ux + 14 + Math.sin(p * 6 + k) * 4, y - 54 - p * 22, 3 + p * 4, 2 + p * 3); g.fillStyle = `rgba(255,250,240,${0.22 * (1 - p) * (1 - p)})`; g.fill(); } }
  // shakers and a row of sealed cups ready to go
  for (let k = 0; k < 2; k++) { rrect(g, x + 90 + k * 16, y - 26, 12, 28, 3); path(g, 'rgba(225,235,240,0.85)', INK, 1.2); g.fillStyle = '#c0c0c8'; g.fillRect(x + 90 + k * 16, y - 30, 12, 5); }
  for (let k = 0; k < 3; k++) cup(g, x + 132 + k * 14, y - 1, { layers: [k === 1 ? '#c8b44a' : '#c8925a'], pearls: k !== 1, sealed: true }, 0.5);
  rrect(g, x + 174, y - 34, 30, 36, 6); path(g, '#d8d0c0', INK, 1.5); g.fillStyle = '#e05a4a'; g.fillRect(x + 179, y - 26, 8, 5); g.fillStyle = '#5a5a60'; g.fillRect(x + 179, y - 12, 20, 4);
  // the register
  rrect(g, x + 214, y - 30, 40, 30, 5); path(g, '#5a5a60', INK, 1.5); rrect(g, x + 218, y - 42, 32, 14, 3); path(g, '#3a4a3a', INK, 1.2); g.fillStyle = '#9ad08a'; g.font = '800 9px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText('NT$', x + 234, y - 32);
  g.fillStyle = '#e8e0d0'; for (let k = 0; k < 6; k++) g.fillRect(x + 220 + (k % 3) * 10, y - 24 + Math.floor(k / 3) * 8, 7, 5);
}

// ------------------------------------------------------------------ the street outside and the shop front
export function street(g, st, t) {
  const H = roomH(st.size), W = 960;
  // the red-brick pavement
  g.fillStyle = '#b86c50'; g.fillRect(0, H, W, 62);
  g.strokeStyle = 'rgba(80,30,20,0.35)'; g.lineWidth = 1.2;
  for (let r = 0, y = H; y < H + 62; y += 12, r++) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); for (let x = r % 2 ? 0 : 14; x < W; x += 28) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 12); g.stroke(); } }
  for (let k = 0; k < 30; k++) { g.fillStyle = 'rgba(255,220,190,0.08)'; g.fillRect(hash(k, 7) * W, H + hash(k, 8) * 60, 28, 12); }
  // the kerb with its red no-parking line, then the alley road
  g.fillStyle = '#d8d0c0'; g.fillRect(0, H + 62, W, 6); g.fillStyle = '#c83a2a'; g.fillRect(0, H + 66, W, 3);
  g.fillStyle = '#5a5a5e'; g.fillRect(0, H + 69, W, STREET - 69); g.fillStyle = 'rgba(255,255,255,0.08)'; for (let k = 0; k < 40; k++) g.fillRect(hash(k, 3) * W, H + 70 + hash(k, 4) * 24, 3, 2);
  g.fillStyle = '#e8e0c0'; for (let x = 0; x < W; x += 60) g.fillRect(x + 10, H + 86, 30, 3);
  // the shop front: a low wooden wall along the pavement with the door (sorted with the people, see frontWall)
}
export function frontWall(g, st, t, ring) {
  const H = roomH(st.size), RW = roomW(st.size), W = 960, a = DOOR_X - 34, b = DOOR_X + 34;
  const seg = (x0, x1, ours) => { if (x1 <= x0) return; g.fillStyle = ours ? '#9a6a40' : '#7a7a78'; g.fillRect(x0, H - 12, x1 - x0, 8); g.fillStyle = ours ? '#6a4226' : '#5a5a58'; g.fillRect(x0, H - 4, x1 - x0, 12); g.strokeStyle = INK; g.lineWidth = 1.5; g.strokeRect(x0, H - 12, x1 - x0, 20); if (ours) { g.fillStyle = 'rgba(200,230,240,0.25)'; g.fillRect(x0, H - 40, x1 - x0, 28); g.strokeStyle = 'rgba(74,52,38,0.6)'; for (let x = x0; x < x1; x += 60) { g.beginPath(); g.moveTo(x, H - 40); g.lineTo(x, H - 12); g.stroke(); } g.beginPath(); g.moveTo(x0, H - 40); g.lineTo(x1, H - 40); g.stroke(); } };
  seg(0, a, true); seg(b, RW, true); seg(RW, W, false);
  // door posts, the slid-open glass door and a wind chime that rings when someone comes through
  for (const px of [a - 6, b]) { rrect(g, px, H - 58, 6, 66, 2); path(g, '#5a3418', INK, 1.5); }
  g.fillStyle = 'rgba(200,230,240,0.35)'; g.fillRect(b + 6, H - 54, 46, 46); g.strokeStyle = INK; g.lineWidth = 1.5; g.strokeRect(b + 6, H - 54, 46, 46);
  const sw = ring > 0 ? Math.sin(t * 18) * 6 * Math.min(1, ring) : Math.sin(t * 1.5) * 1;
  g.strokeStyle = INK; g.lineWidth = 1; g.beginPath(); g.moveTo(b - 3, H - 58); g.lineTo(b - 3 + sw * 0.3, H - 50); g.stroke();
  ell(g, b - 3 + sw * 0.3, H - 46, 5, 5); path(g, 'rgba(200,230,250,0.8)', INK, 1); g.strokeStyle = '#c83a2a'; g.beginPath(); g.moveTo(b - 3 + sw * 0.3, H - 41); g.lineTo(b - 3 + sw, H - 30); g.stroke(); g.fillStyle = '#f4ead0'; g.fillRect(b - 6 + sw, H - 30, 7, 10);
}
// things standing out on the pavement: a menu board and a plant by the door
export function streetProps(st) { const H = roomH(st.size); return [{ id: 'aboard', x: DOOR_X + 96, y: H + 40 }, { id: 'plant', x: DOOR_X - 80, y: H + 40 }]; }
export function aboard(g, x, y, st) {
  g.fillStyle = 'rgba(40,20,10,0.25)'; ell(g, x, y + 2, 24, 5); g.fill();
  g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 18, y); g.lineTo(x - 12, y - 50); g.lineTo(x + 12, y - 50); g.lineTo(x + 18, y); g.stroke();
  rrect(g, x - 15, y - 48, 30, 40, 3); path(g, '#2a3a2e', INK, 2); g.fillStyle = '#f4ead0'; g.font = '700 9px "Noto Sans TC", sans-serif'; g.textAlign = 'center';
  g.fillText(st.lang === 'en' ? 'TEA' : '今日', x, y - 36); g.fillText(st.lang === 'en' ? 'today' : '推薦', x, y - 25); g.fillStyle = '#e8b040'; g.fillText('🧋', x, y - 13);
}
export function scooter(g, x, y, dir, L, t) {
  g.save(); g.translate(x, y); g.scale(dir, 1);
  g.fillStyle = 'rgba(0,0,0,0.25)'; ell(g, 0, 10, 34, 5); g.fill();
  for (const wx of [-22, 22]) { ell(g, wx, 4, 8, 8); path(g, '#2a2a2e', INK, 1.5); ell(g, wx, 4, 3, 3); path(g, '#9a9aa0', null); }
  g.beginPath(); g.moveTo(-30, -2); g.quadraticCurveTo(-30, -16, -10, -16); g.lineTo(14, -16); g.lineTo(22, -34); g.lineTo(28, -34); g.lineTo(26, -4); g.lineTo(-24, 4); g.closePath(); path(g, L.top, INK, 2);
  g.fillStyle = '#f4f0e8'; ell(g, 27, -30, 3, 3); g.fill();
  g.restore();
  person(g, x - dir * 6, y - 34, L, { sit: true, face: dir, helmet: L.helmet, t, noShadow: true, scale: 0.86 });
}
export function cat(g, x, y, o = {}) {
  const f = o.face || 1, s = 1, walk = o.state === 'walk', ph = o.phase || 0, c = '#e0a050', d = '#b8743a';
  g.save(); g.translate(x, y); g.scale(f, 1);
  g.fillStyle = 'rgba(50,30,15,0.22)'; ell(g, 0, 2, 16, 4); g.fill();
  if (o.state === 'sleep') { ell(g, 0, -6, 16, 9); path(g, c, INK, 1.6); g.strokeStyle = d; g.lineWidth = 2; for (let k = -1; k <= 1; k++) { g.beginPath(); g.arc(k * 6, -10, 4, 3.6, 5.8); g.stroke(); } ell(g, 11, -8, 7, 6); path(g, c, INK, 1.5); g.beginPath(); g.moveTo(7, -13); g.lineTo(9, -18); g.lineTo(12, -13); path(g, c, INK, 1.2); g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.arc(13, -8, 2, 0.2, 2.9); g.stroke(); g.fillStyle = INK; g.font = '10px sans-serif'; g.fillText('z', 18 + Math.sin((o.t || 0) * 2) * 2, -20 - ((o.t || 0) * 6) % 8); g.restore(); return; }
  // body, legs, tail, head
  const lg = walk ? Math.sin(ph) * 3 : 0;
  g.strokeStyle = INK; g.lineWidth = 4; for (const [lx, k] of [[-8, 1], [-4, -1], [6, -1], [10, 1]]) { g.beginPath(); g.moveTo(lx, -6); g.lineTo(lx + lg * k, 0); g.stroke(); } g.strokeStyle = c; g.lineWidth = 2.4; for (const [lx, k] of [[-8, 1], [-4, -1], [6, -1], [10, 1]]) { g.beginPath(); g.moveTo(lx, -6); g.lineTo(lx + lg * k, 0); g.stroke(); }
  const sit = o.state === 'sit';
  g.beginPath(); g.ellipse(sit ? -2 : 0, sit ? -10 : -9, sit ? 10 : 14, sit ? 10 : 7, sit ? -0.5 : 0, 0, 7); path(g, c, INK, 1.6);
  g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(-12, -10); g.quadraticCurveTo(-24, -14 + Math.sin((o.t || 0) * 3) * 4, -20, -24); g.stroke(); g.strokeStyle = c; g.lineWidth = 2.4; g.stroke();
  g.strokeStyle = d; g.lineWidth = 1.6; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-6 + k * 5, -15); g.lineTo(-7 + k * 5, -10); g.stroke(); }
  const hx = 13, hy = sit ? -20 : -15; ell(g, hx, hy, 8, 7); path(g, c, INK, 1.5);
  for (const ex of [-4, 4]) { g.beginPath(); g.moveTo(hx + ex - 3, hy - 4); g.lineTo(hx + ex, hy - 11); g.lineTo(hx + ex + 3, hy - 4); path(g, c, INK, 1.2); }
  g.fillStyle = INK; ell(g, hx - 2.5, hy - 1, 1.2, 1.6); g.fill(); ell(g, hx + 3.5, hy - 1, 1.2, 1.6); g.fill(); g.fillStyle = '#e87a7a'; ell(g, hx + 1, hy + 2, 1.4, 1); g.fill();
  g.restore();
}
// a speech bubble over someone's head
export function say(g, x, y, text, a = 1, warm) {
  g.save(); g.globalAlpha = a; g.font = '800 12px Nunito, "Noto Sans TC", sans-serif'; const w = Math.min(170, g.measureText(text).width + 16), h = 22;
  const bx = Math.max(4, Math.min(956 - w, x - w / 2));
  g.fillStyle = warm ? '#fff4c8' : '#fffaf0'; g.strokeStyle = INK; g.lineWidth = 1.6; rrect(g, bx, y - h, w, h, 9); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(x - 4, y - 1); g.lineTo(x, y + 6); g.lineTo(x + 5, y - 1); g.fill(); g.stroke(); g.fillRect(x - 3, y - 3, 7, 3);
  g.fillStyle = INK; g.textAlign = 'center'; g.fillText(text, bx + w / 2, y - 7, w - 8); g.restore();
}
// warm light: a glow around each lantern and a soft pool on the floor under it
export function lights(g, st, t) {
  g.save(); g.globalCompositeOperation = 'lighter';
  (st.decor || []).forEach((d) => { if (d.id !== 'lantern' || !spotShown(st, d.spot, d.at)) return; const [x] = CEIL_SPOTS[d.at], fl = 0.9 + Math.sin(t * 7 + x) * 0.05 + Math.sin(t * 13 + x * 2) * 0.03;
    let gr = g.createRadialGradient(x, 44, 4, x, 44, 70); gr.addColorStop(0, `rgba(255,170,90,${0.32 * fl})`); gr.addColorStop(1, 'rgba(255,170,90,0)'); g.fillStyle = gr; g.fillRect(x - 70, 0, 140, 120);
    gr = g.createRadialGradient(x, 250, 10, x, 250, 150); gr.addColorStop(0, `rgba(255,190,110,${0.1 * fl})`); gr.addColorStop(1, 'rgba(255,190,110,0)'); g.fillStyle = gr; g.save(); g.translate(x, 250); g.scale(1, 0.4); g.translate(-x, -250); g.fillRect(x - 150, 100, 300, 300); g.restore(); });
  g.restore();
}

// ------------------------------------------------------------------ furniture
export function table(g, x, y, type) {
  if (type === 'tatami') {
    g.fillStyle = 'rgba(60,40,20,0.25)'; ell(g, x, y + 30, 95, 18); g.fill();
    rrect(g, x - 92, y - 10, 184, 46, 8); path(g, '#c8b070', INK, 2); for (let k = 1; k < 4; k++) { g.strokeStyle = 'rgba(90,70,30,0.4)'; g.beginPath(); g.moveTo(x - 92 + k * 46, y - 10); g.lineTo(x - 92 + k * 46, y + 36); g.stroke(); }
    g.strokeStyle = '#3a4a3a'; g.lineWidth = 3; g.strokeRect(x - 90, y - 8, 180, 42);
    rrect(g, x - 62, y - 22, 124, 34, 6); path(g, '#7a4a28', INK, 2); g.fillStyle = 'rgba(255,230,190,0.15)'; g.fillRect(x - 58, y - 19, 116, 4); g.fillStyle = '#5a3418'; g.fillRect(x - 56, y + 10, 8, 12); g.fillRect(x + 48, y + 10, 8, 12); return;
  }
  if (type === 'round4') {
    g.fillStyle = 'rgba(60,40,20,0.3)'; ell(g, x, y + 40, 72, 14); g.fill();
    g.fillStyle = '#6a3e1e'; g.fillRect(x - 6, y + 4, 12, 36); ell(g, x, y + 40, 30, 7); path(g, '#6a3e1e', INK, 1.5);
    ell(g, x, y + 4, 76, 30); path(g, '#8a5430', INK, 2.2); ell(g, x, y, 76, 30); path(g, '#b07a48', INK, 2.2);
    g.strokeStyle = 'rgba(120,70,30,0.3)'; g.lineWidth = 1.2; for (let k = 1; k < 4; k++) { ell(g, x, y, 76 - k * 17, 30 - k * 7); g.stroke(); }
    ell(g, x, y - 3, 68, 24); g.strokeStyle = 'rgba(255,230,190,0.25)'; g.lineWidth = 2; g.stroke(); return;
  }
  g.fillStyle = 'rgba(60,40,20,0.3)'; ell(g, x, y + 44, 70, 12); g.fill();
  g.fillStyle = '#6a3e1e'; for (const dx of [-54, 50]) { rrect(g, x + dx, y + 2, 7, 42, 2); path(g, '#6a3e1e', INK, 1.5); }
  rrect(g, x - 66, y - 26, 132, 34, 5); path(g, '#b07a48', INK, 2.2); g.fillStyle = '#9a6438'; g.fillRect(x - 64, y + 2, 128, 8);
  g.strokeStyle = 'rgba(80,40,10,0.3)'; g.lineWidth = 1.2; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x - 66, y - 26 + k * 8); g.lineTo(x + 66, y - 26 + k * 8); g.stroke(); }
  g.fillStyle = 'rgba(200,80,60,0.55)'; g.fillRect(x - 14, y - 26, 28, 34); g.strokeStyle = 'rgba(255,240,220,0.5)'; g.lineWidth = 1; g.strokeRect(x - 12, y - 24, 24, 30);
}
// a chair (or a floor cushion at the low table) for one seat; dir: 'b' behind the table facing out, 'l' / 'r' at the side
export function chair(g, x, y, dir, type) {
  if (type === 'tatami') { g.fillStyle = 'rgba(60,40,20,0.2)'; ell(g, x, y + 20, 24, 7); g.fill(); rrect(g, x - 22, y + 8, 44, 16, 6); path(g, '#a8443a', INK, 1.6); g.strokeStyle = 'rgba(255,220,160,0.5)'; g.lineWidth = 1; g.strokeRect(x - 16, y + 11, 32, 10); return; }
  g.fillStyle = 'rgba(60,40,20,0.22)'; ell(g, x, y + 30, 18, 5); g.fill();
  g.fillStyle = '#6a3e1e'; for (const lx of [-12, 9]) g.fillRect(x + lx, y + 14, 4, 16);
  rrect(g, x - 16, y + 8, 32, 9, 3); path(g, '#9a6438', INK, 1.6);
  if (dir === 'b') { for (const px of [-15, 11]) { rrect(g, x + px, y - 34, 4, 46, 2); path(g, '#7a4a28', INK, 1.2); } rrect(g, x - 17, y - 38, 34, 9, 3); path(g, '#8a5430', INK, 1.5); rrect(g, x - 12, y - 24, 24, 5, 2); path(g, '#8a5430', INK, 1.2); }
  else { const px = dir === 'l' ? x - 17 : x + 13; rrect(g, px, y - 30, 5, 44, 2); path(g, '#7a4a28', INK, 1.4); }
}
// seats around a table: where guests sit, and how (behind the table, or at its left / right end)
export function seats(type, x, y) {
  if (type === 'wood2') return [[x - 82, y - 16, 'l'], [x + 82, y - 16, 'r']];
  if (type === 'tatami') return [[x - 44, y - 40, 'b'], [x + 44, y - 40, 'b'], [x - 104, y - 8, 'l'], [x + 104, y - 8, 'r']];
  return [[x - 42, y - 38, 'b'], [x + 42, y - 38, 'b'], [x - 96, y - 6, 'l'], [x + 96, y - 6, 'r']];
}

// ------------------------------------------------------------------ people
const SKIN = ['#f6dcc0', '#f0cca8', '#e8bc94', '#dcae84', '#c89870'], HAIRC = ['#2a1e18', '#4a3020', '#6a4428', '#8a6040', '#3a3a42', '#1e1a18'];
const TOPS = ['#c85a4a', '#5a7a9a', '#e8d0a0', '#6a8a5a', '#8a6aa0', '#3a3a42', '#d8a040', '#f4f0e8', '#4a6a8a', '#e89a8a', '#7a9ab0'], PANTS = ['#3a3a48', '#4a5a7a', '#5a4a3a', '#2a2a30', '#8a7a68', '#6a3a3a'];
export function makeLook(seed) {
  const h = (k) => hash(seed, k), kid = h(9) < 0.12, old = !kid && h(7) < 0.16;
  return { skin: SKIN[(h(1) * 5) | 0], hair: ['short', 'long', 'bun', 'bald', 'spiky', 'bob', 'cap', 'side', 'pony'][(h(2) * 9) | 0], hairC: HAIRC[(h(3) * 6) | 0], top: TOPS[(h(4) * 11) | 0], pants: PANTS[(h(10) * 6) | 0],
    pattern: h(11) < 0.2 ? 'stripe' : h(11) < 0.3 ? 'collar' : '', bag: h(12) < 0.22 ? ['#8a5a34', '#c85a4a', '#3a5a7a'][(h(13) * 3) | 0] : null, glasses: h(5) < 0.25, shades: h(5) > 0.95, stache: !kid && h(6) < 0.14, old, kid, eyes: h(8) < 0.6 ? 'happy' : 'dot', blink: h(14) * 4, helmet: ['#e8d040', '#c83a2a', '#f4f0e8', '#3a6a9a'][(h(15) * 4) | 0] };
}
// a chibi: big round head, small body. Standing with a proper stride when walking (legs and arms swing with the
// distance covered, the body bobs), turned to the side it walks, seen from the back when walking away; or sitting.
export function person(g, x, y, L, o = {}) {
  const s = (o.scale || 1) * (L.kid ? 0.82 : 1), hr = 21 * s, t = o.t || 0, mv = !!o.moving, ph = o.phase || 0, sw = mv ? Math.sin(ph) : 0;
  const face = o.face || 0, back = !!o.back, by = y - (mv ? Math.abs(Math.cos(ph)) * 2.2 * s : 0) + (L.old && !o.sit ? 2 * s : 0);
  g.save();
  if (!o.noShadow) { g.fillStyle = 'rgba(50,30,15,0.22)'; ell(g, x, y + (o.sit ? 22 : 31) * s, 15 * s, 4.5 * s); g.fill(); }
  // legs and shoes
  if (!o.sit) for (const sd of [-1, 1]) {
    const a = sd * sw * 0.55, hx = x + sd * 4.5 * s, hy = by + 12 * s, len = 17 * s;
    const fx = hx + Math.sin(a) * len * (face ? 0.9 : 0.2), fy = hy + Math.cos(a) * len - (face ? 0 : Math.max(0, sd * sw) * 3 * s);
    g.strokeStyle = INK; g.lineWidth = 7.4 * s; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx, hy); g.lineTo(fx, fy); g.stroke(); g.strokeStyle = L.pants || '#3a3a48'; g.lineWidth = 5 * s; g.stroke();
    ell(g, fx + face * 2 * s, fy + 1.5 * s, 4.6 * s, 3 * s); path(g, '#2a2018', INK, 1.2);
  }
  // the bag strap goes behind
  if (L.bag && !o.sit) { g.strokeStyle = shade(L.bag, 0.8); g.lineWidth = 2.2 * s; g.beginPath(); g.moveTo(x - 10 * s, by - 8 * s); g.lineTo(x + 12 * s, by + 10 * s); g.stroke(); }
  // body
  g.beginPath(); g.moveTo(x - 16 * s, by + 18 * s); g.quadraticCurveTo(x - 18 * s, by - 8 * s, x, by - 10 * s); g.quadraticCurveTo(x + 18 * s, by - 8 * s, x + 16 * s, by + 18 * s); g.closePath(); path(g, L.top, INK, 2);
  g.save(); g.clip();
  if (L.pattern === 'stripe') { g.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 0; k < 4; k++) g.fillRect(x - 18 * s, by - 6 * s + k * 6 * s, 36 * s, 2.4 * s); }
  if (L.apron) { g.fillStyle = L.apron; g.beginPath(); g.moveTo(x - 10 * s, by - 4 * s); g.lineTo(x + 10 * s, by - 4 * s); g.lineTo(x + 13 * s, by + 20 * s); g.lineTo(x - 13 * s, by + 20 * s); g.closePath(); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 1; g.strokeRect(x - 6 * s, by + 4 * s, 12 * s, 7 * s); }
  g.restore();
  if (L.pattern === 'collar' && !back) { g.beginPath(); g.moveTo(x - 7 * s, by - 9 * s); g.lineTo(x, by - 3 * s); g.lineTo(x + 7 * s, by - 9 * s); path(g, '#f4f0e8', INK, 1.2); }
  if (L.top === '#f4f0e8' && !L.apron && !back) { g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, by - 8 * s); g.lineTo(x, by + 16 * s); g.stroke(); }
  // arms: swinging against the legs when walking, resting forward when sitting, up for a cheer, one up to wave
  for (const sd of [-1, 1]) {
    let hx = x + sd * 17 * s, hy = by + 14 * s;
    if (o.sit) { hx = x + sd * 11 * s; hy = by + 4 * s; }
    else if (mv) { if (face) hx += -sd * sw * 6 * s * face; else hy += -sd * sw * 3 * s; }
    if (o.cheer) { hx = x + sd * 20 * s; hy = by - 30 * s; }
    if (o.wave && sd === (face || 1)) { hx = x + sd * 24 * s + Math.sin(t * 14) * 4 * s; hy = by - 26 * s; }
    if (o.carry) { hx = x + (face || 1) * 14 * s + sd * 5 * s; hy = by + 2 * s; }
    g.beginPath(); g.moveTo(x + sd * 13 * s, by - 4 * s); g.quadraticCurveTo(x + sd * 21 * s, (by - 4 * s + hy) / 2 + 4 * s, hx, hy); g.strokeStyle = INK; g.lineWidth = 7 * s; g.stroke(); g.strokeStyle = L.top; g.lineWidth = 4.6 * s; g.stroke();
    ell(g, hx, hy, 4 * s, 4 * s); path(g, L.skin, INK, 1.4);
  }
  if (L.bag && !o.sit) { rrect(g, x + 8 * s, by + 6 * s, 12 * s, 10 * s, 3); path(g, L.bag, INK, 1.4); }
  if (o.carry) o.carry(x + (face || 1) * 14 * s, by);
  // head
  const hy = by - 10 * s - hr * 0.9 + Math.sin(t * 2 + x) * 0.8, hc = L.old ? '#d8d4cc' : L.hairC, fx = face * 4 * s;
  if (back) {
    ell(g, x, hy, hr, hr * 0.95); path(g, L.hair === 'bald' ? L.skin : hc, INK, 2);
    if (L.hair === 'bun') { ell(g, x, hy - hr * 0.95, hr * 0.38, hr * 0.32); path(g, hc, INK, 2); }
    if (L.hair === 'pony') { ell(g, x, hy + hr * 0.7, hr * 0.25, hr * 0.5); path(g, hc, INK, 1.8); }
    if (L.hair === 'cap' || o.helmet) { g.beginPath(); g.arc(x, hy - 2 * s, hr * 1.04, Math.PI, 0); g.closePath(); path(g, o.helmet || '#8a8a90', INK, 2); }
    if (L.scarf) { g.beginPath(); g.arc(x, hy - 2, hr * 1.02, Math.PI * 1.05, -0.05); path(g, L.scarf, INK, 1.8); }
    g.restore(); return;
  }
  if (L.hair === 'long') { ell(g, x, hy + 6 * s, hr * 1.08, hr * 1.1); path(g, hc, INK, 2); }
  if (L.hair === 'pony') { ell(g, x - face * hr * 0.9, hy + hr * 0.2, hr * 0.28, hr * 0.55); path(g, hc, INK, 1.8); }
  ell(g, x, hy, hr, hr * 0.95); path(g, L.skin, INK, 2);
  const top = hy;
  if (o.helmet) { g.beginPath(); g.arc(x, top - 1 * s, hr * 1.08, Math.PI * 1.02, -0.02); g.closePath(); path(g, o.helmet, INK, 2); g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x - 10 * s, top - hr * 0.8, 8 * s, 4 * s); }
  else if (L.hair === 'bald') { g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 2; g.beginPath(); g.arc(x - 6 * s, top - 10 * s, 6 * s, 3.6, 4.6); g.stroke(); if (L.old) { for (const sd of [-1, 1]) { ell(g, x + sd * hr * 0.9, top + 2 * s, 4 * s, 7 * s); path(g, '#d8d4cc', INK, 1.2); } } }
  else if (L.hair === 'cap') { g.beginPath(); g.arc(x, top - 2 * s, hr * 1.02, Math.PI, 0); g.closePath(); path(g, '#8a8a90', INK, 2); g.beginPath(); g.ellipse(x + (face || 0.6) * 12 * s, top - 3 * s, 16 * s, 5 * s, 0, 0, Math.PI * 2); path(g, '#7a7a80', INK, 1.6); }
  else {
    g.beginPath(); g.arc(x, top, hr * 1.03, Math.PI * 1.02, -0.02);
    if (L.hair === 'spiky') { for (let k = 0; k <= 6; k++) { const a = Math.PI + (k / 6) * Math.PI, rr = hr * (k % 2 ? 1.25 : 1.02); g.lineTo(x + Math.cos(a) * rr, top + Math.sin(a) * rr); } }
    const part = face * hr * 0.3;
    g.quadraticCurveTo(x + hr * 0.4 + part, top - hr * 0.1, x + part, top - hr * 0.15); g.quadraticCurveTo(x - hr * 0.5 + part, top + hr * (L.hair === 'side' ? 0.35 : 0.05), x - hr * 1.02, top + hr * 0.1); g.closePath(); path(g, hc, INK, 2);
    if (L.hair === 'bun') { ell(g, x, top - hr * 1.05, hr * 0.38, hr * 0.32); path(g, hc, INK, 2); }
    if (L.hair === 'bob') { for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(x + sd * hr * 0.88, top + hr * 0.25, hr * 0.26, hr * 0.55, 0, 0, Math.PI * 2); path(g, hc, INK, 1.8); } }
  }
  if (L.scarf) { g.beginPath(); g.arc(x, top - 2, hr * 1.04, Math.PI * 1.05, -0.05); path(g, L.scarf, INK, 1.8); g.fillStyle = 'rgba(255,255,255,0.5)'; for (let k = 0; k < 4; k++) { ell(g, x - 12 * s + k * 8 * s, top - hr * 0.55, 1.4 * s, 1.4 * s); g.fill(); } }
  // face: eyes (blinking now and then), glasses, cheeks, mouth
  const ey = top + hr * 0.18, ex = hr * 0.38, blink = ((t + L.blink) % 4) < 0.12;
  if (L.shades) { g.fillStyle = '#1a1a1e'; rrect(g, x + fx - ex - 8 * s, ey - 5 * s, 16 * s, 9 * s, 3); g.fill(); rrect(g, x + fx + ex - 8 * s, ey - 5 * s, 16 * s, 9 * s, 3); g.fill(); g.fillRect(x + fx - 3 * s, ey - 3 * s, 6 * s, 2 * s); }
  else {
    g.strokeStyle = INK; g.lineWidth = 2.2 * s; g.fillStyle = INK;
    const happy = o.mood === 'happy' || (L.eyes === 'happy' && o.mood !== 'wait' && o.mood !== 'sad');
    for (const sd of [-1, 1]) { const cx = x + fx + sd * ex; if (blink && !happy) { g.beginPath(); g.moveTo(cx - 3 * s, ey); g.lineTo(cx + 3 * s, ey); g.stroke(); } else if (happy) { g.beginPath(); g.arc(cx, ey + 2 * s, 4.5 * s, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } else { ell(g, cx, ey, 2.4 * s, 3 * s); g.fill(); g.fillStyle = '#fff'; ell(g, cx + 0.8 * s, ey - 1 * s, 0.8 * s, 0.8 * s); g.fill(); g.fillStyle = INK; } }
    if (o.mood === 'sad') { g.lineWidth = 1.6 * s; for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(x + fx + sd * (ex - 4 * s), ey - 7 * s); g.lineTo(x + fx + sd * (ex + 4 * s), ey - 5 * s); g.stroke(); } }
    if (L.glasses) { g.lineWidth = 1.6 * s; for (const sd of [-1, 1]) { g.beginPath(); g.arc(x + fx + sd * ex, ey, 7 * s, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.moveTo(x + fx - ex + 7 * s, ey); g.lineTo(x + fx + ex - 7 * s, ey); g.stroke(); }
  }
  if (L.old) { g.strokeStyle = 'rgba(74,52,38,0.5)'; g.lineWidth = 1.2; for (const sd of [-1, 1]) { g.beginPath(); g.arc(x + fx + sd * (ex + 6 * s), ey + 2 * s, 3 * s, -0.5, 0.5); g.stroke(); } }
  g.fillStyle = 'rgba(232,120,100,0.35)'; for (const sd of [-1, 1]) { ell(g, x + fx + sd * hr * 0.6, ey + 8 * s, 5 * s, 3.2 * s); g.fill(); }
  g.strokeStyle = INK; g.lineWidth = 1.8 * s;
  const talk = o.talk && Math.sin(t * 16) > 0;
  if (o.mood === 'happy' || o.cheer || talk) { g.beginPath(); g.arc(x + fx, ey + 9 * s, (talk ? 3.5 : 5) * s, 0.15, Math.PI - 0.15); g.closePath(); path(g, '#a83a3a', INK, 1.6); }
  else if (o.mood === 'wait' || o.mood === 'sad') { g.beginPath(); if (o.mood === 'sad') g.arc(x + fx, ey + 13 * s, 4 * s, Math.PI + 0.4, -0.4); else { g.moveTo(x + fx - 3 * s, ey + 11 * s); g.lineTo(x + fx + 3 * s, ey + 11 * s); } g.stroke(); }
  else { g.beginPath(); g.arc(x + fx, ey + 8 * s, 4 * s, 0.3, Math.PI - 0.3); g.stroke(); }
  if (L.stache) { g.fillStyle = L.old ? '#d8d4cc' : L.hairC; g.beginPath(); g.ellipse(x + fx - 4 * s, ey + 6.5 * s, 5 * s, 2.4 * s, 0.2, 0, Math.PI * 2); g.ellipse(x + fx + 4 * s, ey + 6.5 * s, 5 * s, 2.4 * s, -0.2, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// the staff: a cream shirt, a green apron and a red headscarf
export function staffLook(k) { return { ...makeLook(1000 + k * 7), top: '#f4f0e8', pants: '#3a3a42', apron: '#5a7a5a', scarf: '#c8503e', hair: k % 2 ? 'bun' : 'short', glasses: false, shades: false, stache: false, old: false, kid: false, eyes: 'happy', bag: null, pattern: '' }; }
export function staff(g, x, y, k, o = {}) { person(g, x, y, staffLook(k), { ...o, scale: 0.95 }); }

// ------------------------------------------------------------------ cups, plates
export function cup(g, x, y, p, sc = 1, fill = 1) {
  const w = 22 * sc, h = 40 * sc, top = y - h, stripeC = p.stripes === true ? '#6e3c14' : p.stripes;
  g.save();
  g.beginPath(); g.moveTo(x - w / 2, top); g.lineTo(x + w / 2, top); g.lineTo(x + w * 0.4, y); g.lineTo(x - w * 0.4, y); g.closePath(); g.save(); g.clip();
  g.fillStyle = 'rgba(240,248,250,0.5)'; g.fillRect(x - w, top, w * 2, h);
  const lv = top + h * (1 - 0.86 * fill), L = p.layers || ['#c8925a'];
  if (fill > 0) { const lh = (y - lv) / L.length; L.forEach((c, i) => { g.fillStyle = c; g.fillRect(x - w, lv + i * lh, w * 2, lh + 1); }); }
  if (stripeC) { g.strokeStyle = stripeC; g.globalAlpha = 0.75; g.lineWidth = 2.5 * sc; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(x - w * 0.55 + k * w * 0.26, top + h * 0.15); g.quadraticCurveTo(x - w * 0.4 + k * w * 0.26, top + h * 0.55, x - w * 0.5 + k * w * 0.26, y); g.stroke(); } g.globalAlpha = 1; }
  if (p.taroBottom) { g.fillStyle = '#a888c0'; g.fillRect(x - w, y - 9 * sc, w * 2, 9 * sc); }
  if (p.pearls) { g.fillStyle = '#2a1810'; for (let k = 0; k < 9; k++) { ell(g, x - w * 0.35 + (k % 5) * w * 0.17, y - 3 * sc - Math.floor(k / 5) * 4.5 * sc, 2.6 * sc, 2.6 * sc); g.fill(); } g.fillStyle = 'rgba(255,255,255,0.35)'; for (let k = 0; k < 5; k++) { ell(g, x - w * 0.36 + k * w * 0.17, y - 4 * sc, 0.8 * sc, 0.8 * sc); g.fill(); } }
  if (p.seeds && fill > 0) { g.fillStyle = '#3a2a10'; for (let k = 0; k < 12; k++) { ell(g, x + (hash(k) - 0.5) * w * 0.7, lv + hash(k, 2) * (y - lv), 1.2 * sc, 1.2 * sc); g.fill(); } }
  if (p.lemon && fill > 0) { ell(g, x + w * 0.12, lv + 6 * sc, 6 * sc, 6 * sc); path(g, '#f4e070', '#c8a830', 1); g.strokeStyle = 'rgba(200,170,40,0.7)'; g.lineWidth = 0.8; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(x + w * 0.12, lv + 6 * sc); g.lineTo(x + w * 0.12 + Math.cos(k) * 5 * sc, lv + 6 * sc + Math.sin(k) * 5 * sc); g.stroke(); } }
  if (p.ice && fill > 0) for (let k = 0; k < p.ice; k++) { rrect(g, x - w * 0.32 + (k % 3) * w * 0.22, lv + 2 * sc + Math.floor(k / 3) * 7 * sc + (k % 2) * 3 * sc, 6 * sc, 6 * sc, 1.5); path(g, 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.85)', 1); }
  g.restore();
  g.beginPath(); g.moveTo(x - w / 2, top); g.lineTo(x + w / 2, top); g.lineTo(x + w * 0.4, y); g.lineTo(x - w * 0.4, y); g.closePath(); path(g, null, INK, 1.8 * Math.max(0.7, sc));
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x - w * 0.38, top + 3, w * 0.1, h - 8);
  if (p.sealed) { g.fillStyle = 'rgba(255,245,230,0.9)'; g.fillRect(x - w / 2, top - 1, w, 3 * sc); g.fillStyle = '#c83a2a'; g.fillRect(x - w * 0.2, top - 1, w * 0.4, 1.5 * sc); }
  if (fill > 0.5 && !p.noStraw) { g.strokeStyle = INK; g.lineWidth = 4.5 * sc; g.beginPath(); g.moveTo(x + w * 0.1, top + h * 0.5); g.lineTo(x + w * 0.25, top - 12 * sc); g.stroke(); g.strokeStyle = p.pearls ? '#e05a6a' : '#5a9ac8'; g.lineWidth = 2.6 * sc; g.stroke(); }
  g.restore();
}
export function dish(g, x, y, kind, sc = 1, eaten = 0) {
  g.fillStyle = 'rgba(60,40,20,0.25)'; ell(g, x, y + 4 * sc, 26 * sc, 7 * sc); g.fill();
  if (kind === 'noodle') { ell(g, x, y - 4 * sc, 24 * sc, 12 * sc); path(g, '#f4f0e8', INK, 1.8); ell(g, x, y - 6 * sc, 19 * sc, 8 * sc); path(g, '#ece4d0', null); if (eaten < 0.9) { const n = Math.ceil(5 * (1 - eaten)); ell(g, x, y - 6 * sc, 17 * sc * (1 - eaten * 0.6), 7 * sc * (1 - eaten * 0.6)); path(g, '#d8a868', null); g.strokeStyle = '#f0d090'; g.lineWidth = 2 * sc; for (let k = 0; k < n; k++) { g.beginPath(); g.arc(x - 8 * sc + k * 4 * sc, y - 7 * sc, 5 * sc, 3.4, 5.8); g.stroke(); } g.strokeStyle = '#6aa040'; g.lineWidth = 1.6 * sc; for (let k = 0; k < n; k++) { g.beginPath(); g.moveTo(x - 4 * sc + k * 2.5 * sc, y - 12 * sc); g.lineTo(x - 2 * sc + k * 2.5 * sc, y - 8 * sc); g.stroke(); } } return; }
  ell(g, x, y - 2 * sc, 26 * sc, 10 * sc); path(g, '#f4f0e8', INK, 1.8); ell(g, x, y - 2 * sc, 21 * sc, 7 * sc); g.strokeStyle = '#3a6a9a'; g.lineWidth = 1; g.stroke();
  const n = Math.ceil(4 * (1 - eaten));
  for (let k = 0; k < n; k++) { rrect(g, x - 18 * sc + k * 9 * sc, y - 9 * sc + (k % 2) * 3 * sc, 9 * sc, 8 * sc, 2); path(g, '#9a6438', INK, 1.2); }
  if (eaten < 0.6) { ell(g, x + 12 * sc, y - 6 * sc, 6 * sc, 5 * sc); path(g, '#8a5428', INK, 1.2); g.fillStyle = '#e8b030'; ell(g, x + 12 * sc, y - 6 * sc, 2.2 * sc, 2 * sc); g.fill(); }
  g.fillStyle = '#6ab04a'; for (let k = 0; k < n + 1; k++) g.fillRect(x - 12 * sc + k * 5 * sc, y - 11 * sc, 2 * sc, 2 * sc);
}
export function teapot(g, x, y, sc = 1) { ell(g, x, y - 10 * sc, 14 * sc, 11 * sc); path(g, '#8a4a2a', INK, 1.6); g.beginPath(); g.moveTo(x + 12 * sc, y - 12 * sc); g.quadraticCurveTo(x + 24 * sc, y - 16 * sc, x + 24 * sc, y - 22 * sc); path(g, null, INK, 3 * sc); ell(g, x, y - 21 * sc, 6 * sc, 2.5 * sc); path(g, '#6a3a1a', INK, 1.4); }

// ------------------------------------------------------------------ decorations
export function decor(g, id, x, y, t = 0) {
  if (id === 'lantern') { const sw = Math.sin(t * 1.4 + x) * 3; g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw, y + 26); g.stroke(); ell(g, x + sw, y + 44, 18, 20); path(g, '#d83a2a', INK, 2); g.strokeStyle = 'rgba(120,20,10,0.4)'; g.lineWidth = 1; for (const k of [-9, 0, 9]) { g.beginPath(); g.ellipse(x + sw, y + 44, Math.abs(k) + 2, 19, 0, 0, 7); g.stroke(); } g.fillStyle = 'rgba(255,220,120,0.4)'; ell(g, x + sw, y + 44, 10, 14); g.fill(); g.fillStyle = '#e8b040'; g.fillRect(x + sw - 9, y + 24, 18, 5); g.fillRect(x + sw - 9, y + 61, 18, 5); g.strokeStyle = '#e8b040'; g.beginPath(); g.moveTo(x + sw, y + 66); g.lineTo(x + sw, y + 78); g.stroke(); g.fillStyle = '#f4ead4'; g.font = '700 11px "Noto Serif TC", serif'; g.textAlign = 'center'; g.fillText('福', x + sw, y + 48); return; }
  if (id === 'plant') { g.fillStyle = 'rgba(50,30,15,0.22)'; ell(g, x, y + 2, 20, 5); g.fill(); rrect(g, x - 16, y - 24, 32, 26, 6); path(g, '#b8643a', INK, 2); g.fillStyle = 'rgba(255,220,180,0.3)'; g.fillRect(x - 12, y - 20, 24, 3); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.35 + Math.sin(t * 1.2 + k) * 0.03; g.beginPath(); g.ellipse(x + Math.cos(a) * 16, y - 30 + Math.sin(a) * 18, 8, 16, a + Math.PI / 2, 0, Math.PI * 2); path(g, k % 2 ? '#5a8a4a' : '#6a9a52', INK, 1.4); } return; }
  if (id === 'scroll') { g.fillStyle = '#6a4426'; g.fillRect(x - 24, y - 50, 48, 5); g.fillRect(x - 24, y + 46, 48, 6); rrect(g, x - 20, y - 46, 40, 92, 2); path(g, '#f4ead0', INK, 1.6); g.fillStyle = INK; g.font = '700 22px "Noto Serif TC", serif'; g.textAlign = 'center'; g.fillText('茶', x, y - 14); g.fillText('香', x, y + 16); g.fillStyle = '#c83a2a'; g.fillRect(x + 6, y + 28, 7, 7); return; }
  if (id === 'teaset') { rrect(g, x - 40, y - 50, 80, 96, 4); path(g, '#7a4a28', INK, 2); g.fillStyle = '#5a3418'; g.fillRect(x - 36, y - 2, 72, 4); teapot(g, x - 14, y - 6, 0.9); for (let k = 0; k < 3; k++) { rrect(g, x + 6 + k * 10, y - 14, 8, 9, 2); path(g, '#e8dcc4', INK, 1.2); } teapot(g, x + 8, y + 40, 0.8); for (let k = 0; k < 2; k++) { rrect(g, x - 30 + k * 12, y + 30, 8, 9, 2); path(g, '#c8a070', INK, 1.2); } return; }
  if (id === 'umbrella') { g.save(); g.translate(x, y); g.rotate(-0.25); g.beginPath(); g.moveTo(0, -46); for (let k = 0; k <= 8; k++) { const a = Math.PI + (k / 8) * Math.PI; g.lineTo(Math.cos(a) * 46, Math.sin(a) * 30 - 10); } g.closePath(); path(g, '#e8b85a', INK, 2); g.strokeStyle = 'rgba(120,60,20,0.5)'; for (let k = 1; k < 8; k++) { const a = Math.PI + (k / 8) * Math.PI; g.beginPath(); g.moveTo(0, -46); g.lineTo(Math.cos(a) * 46, Math.sin(a) * 30 - 10); g.stroke(); } g.fillStyle = '#c83a2a'; ell(g, -18, -24, 8, 6); g.fill(); g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -46); g.lineTo(0, 40); g.stroke(); g.restore(); return; }
  if (id === 'fish') { g.fillStyle = 'rgba(50,30,15,0.22)'; ell(g, x, y + 4, 26, 5); g.fill(); rrect(g, x - 24, y - 6, 48, 10, 3); path(g, '#7a4a28', INK, 1.6); ell(g, x, y - 28, 26, 24); path(g, 'rgba(170,210,230,0.6)', INK, 2); g.fillStyle = 'rgba(120,180,210,0.5)'; ell(g, x, y - 24, 22, 16); g.fill(); g.fillStyle = '#5a8a4a'; for (let k = 0; k < 3; k++) { ell(g, x - 10 + k * 8, y - 14, 2, 8); g.fill(); } for (let k = 0; k < 2; k++) { const fx = x + Math.sin(t * 1.5 + k * 3) * 10, fy = y - 26 + k * 6, d = Math.cos(t * 1.5 + k * 3) > 0 ? 1 : -1; ell(g, fx, fy, 6, 3.5); path(g, '#e8602a', null); g.beginPath(); g.moveTo(fx - d * 5, fy); g.lineTo(fx - d * 10, fy - 3); g.lineTo(fx - d * 10, fy + 3); g.closePath(); path(g, '#e8602a', null); } g.fillStyle = 'rgba(255,255,255,0.5)'; ell(g, x - 10, y - 38, 4, 6); g.fill(); return; }
  if (id === 'screen') { g.fillStyle = 'rgba(50,30,15,0.22)'; ell(g, x, y + 3, 56, 6); g.fill(); for (let k = 0; k < 3; k++) { rrect(g, x - 51 + k * 34, y - 90, 32, 92, 3); path(g, '#9a6438', INK, 2); rrect(g, x - 46 + k * 34, y - 84, 22, 78, 2); path(g, '#f4e8cc', INK, 1.2); g.strokeStyle = 'rgba(120,80,40,0.6)'; g.lineWidth = 1; for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(x - 46 + k * 34, y - 84 + r * 15.6); g.lineTo(x - 24 + k * 34, y - 84 + r * 15.6); g.stroke(); } } return; }
  if (id === 'radio') { g.fillStyle = '#6a4426'; g.fillRect(x - 34, y + 20, 68, 5); rrect(g, x - 30, y - 16, 60, 36, 8); path(g, '#b07a48', INK, 2); rrect(g, x - 24, y - 10, 30, 24, 4); path(g, '#e8d4a8', INK, 1.2); g.strokeStyle = 'rgba(90,60,30,0.6)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 22, y - 6 + k * 6); g.lineTo(x + 4, y - 6 + k * 6); g.stroke(); } for (let k = 0; k < 2; k++) { ell(g, x + 16, y - 6 + k * 12, 4, 4); path(g, '#5a3418', INK, 1.2); } const n = (t * 2) % 1; g.fillStyle = `rgba(74,52,38,${1 - n})`; g.font = '14px serif'; g.fillText('♪', x + 34 + n * 10, y - 18 - n * 16); return; }
  if (id === 'aboard') return;
}

// ------------------------------------------------------------------ hearts and confetti
export function particles(g, list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i]; p.t += dt; if (p.t > p.life) { list.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.kind === 'heart' ? -10 : p.kind === 'text' ? 0 : 60) * dt; const a = 1 - p.t / p.life;
    g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot + p.t * p.spin);
    if (p.kind === 'heart') { g.fillStyle = '#e84a5a'; g.beginPath(); g.moveTo(0, 4); g.bezierCurveTo(-10, -4, -6, -12, 0, -6); g.bezierCurveTo(6, -12, 10, -4, 0, 4); g.fill(); }
    else if (p.kind === 'coin') { g.fillStyle = '#e8b830'; ell(g, 0, 0, 6, 6); g.fill(); g.strokeStyle = '#a87810'; g.lineWidth = 1.2; g.stroke(); }
    else if (p.kind === 'flash') { g.globalAlpha = a * 0.8; g.fillStyle = '#fffbe8'; ell(g, 0, 0, 30 * (1 - a) + 6, 30 * (1 - a) + 6); g.fill(); }
    else if (p.kind === 'text') { g.rotate(-(p.rot + p.t * p.spin)); g.font = '800 16px Nunito, sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = '#fff8e8'; g.strokeText(p.text, 0, 0); g.fillStyle = p.color || '#a8601a'; g.fillText(p.text, 0, 0); }
    else { g.fillStyle = p.color; g.fillRect(-4, -2.5, 8, 5); }
    g.restore();
  }
}
export function burst(list, x, y, n = 8) {
  const cols = ['#e84a5a', '#5ab8c8', '#e8b830', '#8ac85a', '#c87ad8'];
  for (let k = 0; k < n; k++) list.push({ kind: k % 3 === 0 ? 'heart' : 'conf', x, y, vx: rnd(-50, 50), vy: rnd(-90, -30), t: 0, life: rnd(0.9, 1.6), rot: rnd(0, 6), spin: rnd(-4, 4), color: cols[k % cols.length] });
}
