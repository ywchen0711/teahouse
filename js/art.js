// The look: a warm, sepia, hand-drawn teahouse. Soft dark-brown outlines, muted colours, wood everywhere, chibi guests
// with big heads, closed happy eyes and rosy cheeks, cups of tea and plates on wooden tables, a paper grain and a
// warm vignette over everything, hearts and confetti when someone is happy. All drawn on a canvas, nothing loaded.
import { WALLS, FLOORS } from './data.js?v=1';

export const INK = '#4a3426';
const rnd = (a, b) => a + Math.random() * (b - a);
export const hash = (n, k = 0) => { let h = (n * 374761393 + k * 668265263) | 0; h = (h ^ (h >>> 13)) * 1274126177; return ((h ^ (h >>> 16)) >>> 0) / 4294967296; };
function path(g, fill, stroke = INK, lw = 2) { if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.lineJoin = 'round'; g.lineCap = 'round'; g.stroke(); } }
function rrect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
const ell = (g, x, y, rx, ry) => { g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); };
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
const WALL_SPOTS = [[330, 70], [470, 70], [610, 70], [760, 70], [880, 70]], FLOOR_SPOTS = [[300, 560], [720, 400], [930, 590], [140, 600], [930, 700]], CEIL_SPOTS = [[350, 0], [520, 0], [690, 0], [860, 0]];
export function room(g, st, t) {
  const W = 960, H = roomH(st.size), RW = roomW(st.size), wall = (WALLS.find((w) => w.id === st.wall) || WALLS[0]).c, floor = (FLOORS.find((f) => f.id === st.floor) || FLOORS[0]).c;
  g.fillStyle = '#3a2a1e'; g.fillRect(0, 0, W, H);
  // back wall with wainscot, windows of warm light, a shelf of jars
  g.fillStyle = wall; g.fillRect(0, 0, RW, 175);
  if (st.wall === 'brick') { g.strokeStyle = 'rgba(90,40,20,0.35)'; g.lineWidth = 1.5; for (let y = 8; y < 140; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); for (let x = (y / 14) % 2 ? 0 : 20; x < RW; x += 40) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 14); g.stroke(); } } }
  if (st.wall === 'wood') { g.strokeStyle = 'rgba(70,40,20,0.35)'; g.lineWidth = 2; for (let x = 0; x < RW; x += 36) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, 140); g.stroke(); } }
  g.fillStyle = shade(wall, 0.92); g.fillRect(0, 0, RW, 14);
  g.fillStyle = '#8a5a34'; g.fillRect(0, 138, RW, 40); g.fillStyle = '#6a4226'; g.fillRect(0, 136, RW, 6); g.fillRect(0, 175, RW, 4);
  for (let x = 0; x < RW; x += 48) { g.strokeStyle = 'rgba(60,30,10,0.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, 142); g.lineTo(x, 176); g.stroke(); }
  // the noren curtain at the door (top left) and the window
  g.fillStyle = '#5a3a24'; g.fillRect(14, 14, 120, 124); g.fillStyle = '#f2d8a0'; g.fillRect(22, 20, 104, 116);
  const sway = Math.sin(t * 1.2) * 2;
  for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(24 + k * 34, 22); g.lineTo(56 + k * 34, 22); g.lineTo(56 + k * 34 + sway, 92); g.lineTo(24 + k * 34 + sway, 92); g.closePath(); path(g, '#3a5a7a', INK, 1.5); }
  g.fillStyle = '#f4ead4'; g.font = '700 18px "Noto Serif TC", serif'; g.textAlign = 'center'; g.fillText('茶', 74, 64);
  if (RW >= 740) { g.fillStyle = '#5a3a24'; g.fillRect(RW - 200, 26, 150, 90); const lg = g.createLinearGradient(0, 30, 0, 110); lg.addColorStop(0, '#ffe8b0'); lg.addColorStop(1, '#f0b870'); g.fillStyle = lg; g.fillRect(RW - 192, 32, 134, 78); g.fillStyle = '#5a3a24'; g.fillRect(RW - 127, 32, 5, 78); g.fillRect(RW - 192, 69, 134, 4); }
  // the floor
  g.fillStyle = floor; g.fillRect(0, 179, RW, H - 179);
  if (st.floor === 'tile') { for (let y = 179; y < H; y += 34) for (let x = 0; x < RW; x += 34) { g.fillStyle = ((x + y) / 34) % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(60,40,30,0.06)'; g.fillRect(x, y, 34, 34); for (let k = 0; k < 4; k++) { g.fillStyle = 'rgba(80,60,50,0.35)'; g.fillRect(x + hash(x * 7 + y, k) * 30, y + hash(x + y * 3, k) * 30, 2, 2); } } }
  else if (st.floor === 'red') { for (let y = 179; y < H; y += 40) for (let x = 0; x < RW; x += 40) { g.strokeStyle = 'rgba(70,30,20,0.4)'; g.lineWidth = 2; g.strokeRect(x, y, 40, 40); } }
  else for (let y = 179, k = 0; y < H; y += 26 + k * 0.6, k++) { g.fillStyle = k % 2 ? shade(floor, 0.95) : floor; g.fillRect(0, y, RW, 26 + k * 0.6); g.strokeStyle = 'rgba(70,40,20,0.35)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(0, y); g.lineTo(RW, y); g.stroke(); for (let x = hash(k) * 140; x < RW; x += 140 + hash(k, x) * 60) { g.beginPath(); g.moveTo(x, y); g.lineTo(x, y + 26); g.stroke(); } }
  // the part of the building not yet ours
  if (RW < W) { g.fillStyle = '#5a4434'; g.fillRect(RW, 0, W - RW, H); g.fillStyle = 'rgba(0,0,0,0.25)'; for (let x = RW; x < W; x += 18) g.fillRect(x, 0, 6, H); g.fillStyle = '#f4ead4'; g.font = '700 16px "Noto Sans TC", sans-serif'; g.save(); g.translate(RW + (W - RW) / 2, H / 2); g.rotate(-Math.PI / 2); g.fillText('🔨 ' + (st.lang === 'zh' ? '可以擴建' : 'Room to grow'), 0, 0); g.restore(); }
  // decorations on the wall, the ceiling and the floor
  (st.decor || []).forEach((d, i) => { if (!d) return; const sp = d.spot === 'wall' ? WALL_SPOTS : d.spot === 'ceil' ? CEIL_SPOTS : FLOOR_SPOTS, p = sp[d.at]; if (!p || (p[0] > RW - 30)) return; if (d.spot !== 'floor') decor(g, d.id, p[0], p[1], t); });
}
export function floorDecor(g, st, t) { const RW = roomW(st.size); (st.decor || []).forEach((d) => { if (!d || d.spot !== 'floor') return; const p = FLOOR_SPOTS[d.at]; if (p && p[0] < RW - 20 && p[1] < roomH(st.size) - 10) decor(g, d.id, p[0], p[1], t); }); }
export const spotsFor = (spot) => (spot === 'wall' ? WALL_SPOTS : spot === 'ceil' ? CEIL_SPOTS : FLOOR_SPOTS);
export function counter(g, x, y, t, st) {
  // shelf of jars behind
  g.fillStyle = '#7a4e2e'; g.fillRect(x + 140, 40, 120, 8); g.fillRect(x + 140, 90, 120, 8);
  const jars = ['#3a2418', '#e8c070', '#f0d848', '#b898c8', '#e8a030', '#7a9a3a'];
  jars.forEach((c, k) => { const jx = x + 150 + (k % 3) * 38, jy = 40 + Math.floor(k / 3) * 50 - 26; rrect(g, jx, jy, 26, 26, 6); path(g, 'rgba(240,248,250,0.7)', INK, 1.5); rrect(g, jx + 3, jy + 10, 20, 14, 4); path(g, c, null); rrect(g, jx + 4, jy - 4, 18, 6, 2); path(g, '#a8784a', INK, 1.2); });
  // the counter top and front
  rrect(g, x, y, 250, 30, 6); path(g, '#b07a48', INK, 2); g.fillStyle = '#8a5a34'; rrect(g, x + 6, y + 28, 238, 60, 4); path(g, '#8a5a34', INK, 2);
  for (let k = 0; k < 5; k++) { g.strokeStyle = 'rgba(60,30,10,0.4)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + 20 + k * 48, y + 34); g.lineTo(x + 20 + k * 48, y + 84); g.stroke(); }
  // a sealing machine and a row of cups, a tea urn with steam
  rrect(g, x + 170, y - 34, 40, 36, 6); path(g, '#d8d0c0', INK, 1.5); g.fillStyle = '#e05a4a'; g.fillRect(x + 176, y - 26, 10, 6);
  rrect(g, x + 20, y - 48, 40, 50, 10); path(g, '#c8a070', INK, 1.5); g.fillStyle = 'rgba(255,255,255,0.4)'; for (let k = 0; k < 3; k++) { const p = (t * 0.4 + k / 3) % 1; ell(g, x + 40 + Math.sin(p * 6 + k) * 6, y - 52 - p * 40, 6 + p * 6, 4 + p * 4); g.fillStyle = `rgba(255,255,255,${0.35 * (1 - p)})`; g.fill(); }
  for (let k = 0; k < 4; k++) { cup(g, x + 82 + k * 20, y - 2, { layers: ['#c8925a'], pearls: k % 2 === 0 }, 0.55); }
}

// ------------------------------------------------------------------ furniture
export function table(g, x, y, type) {
  if (type === 'tatami') {
    g.fillStyle = 'rgba(60,40,20,0.25)'; ell(g, x, y + 30, 95, 18); g.fill();
    rrect(g, x - 92, y - 10, 184, 46, 8); path(g, '#c8b070', INK, 2); for (let k = 1; k < 4; k++) { g.strokeStyle = 'rgba(90,70,30,0.4)'; g.beginPath(); g.moveTo(x - 92 + k * 46, y - 10); g.lineTo(x - 92 + k * 46, y + 36); g.stroke(); }
    rrect(g, x - 62, y - 22, 124, 34, 6); path(g, '#7a4a28', INK, 2); g.fillStyle = '#5a3418'; g.fillRect(x - 56, y + 10, 8, 12); g.fillRect(x + 48, y + 10, 8, 12); return;
  }
  if (type === 'round4') {
    g.fillStyle = 'rgba(60,40,20,0.3)'; ell(g, x, y + 40, 72, 14); g.fill();
    g.fillStyle = '#6a3e1e'; g.fillRect(x - 6, y + 4, 12, 36); ell(g, x, y + 40, 30, 7); path(g, '#6a3e1e', INK, 1.5);
    ell(g, x, y, 76, 30); path(g, '#b07a48', INK, 2.2); ell(g, x, y - 3, 68, 24); g.strokeStyle = 'rgba(255,230,190,0.25)'; g.lineWidth = 2; g.stroke(); return;
  }
  g.fillStyle = 'rgba(60,40,20,0.3)'; ell(g, x, y + 44, 70, 12); g.fill();
  g.fillStyle = '#6a3e1e'; for (const dx of [-54, 50]) { rrect(g, x + dx, y + 2, 7, 42, 2); path(g, '#6a3e1e', INK, 1.5); }
  rrect(g, x - 66, y - 26, 132, 34, 5); path(g, '#b07a48', INK, 2.2); g.fillStyle = '#9a6438'; g.fillRect(x - 64, y + 2, 128, 8);
  g.strokeStyle = 'rgba(80,40,10,0.3)'; g.lineWidth = 1.2; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(x - 66, y - 26 + k * 8); g.lineTo(x + 66, y - 26 + k * 8); g.stroke(); }
}
export function chair(g, x, y, flip) { rrect(g, x - 16, y - 34, 32, 40, 5); path(g, '#8a5430', INK, 2); g.fillStyle = '#6a3e1e'; g.fillRect(x - 13, y + 4, 5, 18); g.fillRect(x + 8, y + 4, 5, 18); }
// seats around a table: where guests sit (x, y, behind the table or not)
export function seats(type, x, y) {
  if (type === 'wood2') return [[x - 70, y - 16, true], [x + 70, y - 16, true]];
  if (type === 'tatami') return [[x - 44, y - 40, true], [x + 44, y - 40, true], [x - 100, y - 8, true], [x + 100, y - 8, true]];
  return [[x - 42, y - 38, true], [x + 42, y - 38, true], [x - 92, y - 6, true], [x + 92, y - 6, true]];
}

// ------------------------------------------------------------------ people
const SKIN = ['#f6dcc0', '#f0cca8', '#e8bc94', '#dcae84'], HAIRC = ['#2a1e18', '#4a3020', '#6a4428', '#8a6040', '#cfc8c0', '#3a3a42'], TOPS = ['#c85a4a', '#5a7a9a', '#e8d0a0', '#6a8a5a', '#8a6aa0', '#3a3a42', '#d8a040', '#f4f0e8', '#4a6a8a'];
export function makeLook(seed) {
  const h = (k) => hash(seed, k);
  return { skin: SKIN[(h(1) * 4) | 0], hair: ['short', 'long', 'bun', 'bald', 'spiky', 'bob', 'cap', 'side'][(h(2) * 8) | 0], hairC: HAIRC[(h(3) * 6) | 0], top: TOPS[(h(4) * 9) | 0], glasses: h(5) < 0.25, shades: h(5) > 0.93, stache: h(6) < 0.15, old: h(7) < 0.18, eyes: h(8) < 0.6 ? 'happy' : 'dot', kid: h(9) < 0.12 };
}
// a chibi: big round head, small body; sitting (arms on the table) or walking (legs swinging)
export function person(g, x, y, L, o = {}) {
  const s = (o.scale || 1) * (L.kid ? 0.82 : 1), hr = 21 * s, by = y, walk = o.walk ? Math.sin(o.t * 9) : 0;
  g.save();
  // body
  if (!o.sit) { g.fillStyle = '#3a3a42'; rrect(g, x - 9 * s + walk * 3, by + 14 * s, 7 * s, 16 * s, 3); path(g, '#4a4a54', INK, 1.5); rrect(g, x + 2 * s - walk * 3, by + 14 * s, 7 * s, 16 * s, 3); path(g, '#4a4a54', INK, 1.5); }
  g.beginPath(); g.moveTo(x - 16 * s, by + 18 * s); g.quadraticCurveTo(x - 18 * s, by - 8 * s, x, by - 10 * s); g.quadraticCurveTo(x + 18 * s, by - 8 * s, x + 16 * s, by + 18 * s); g.closePath(); path(g, L.top, INK, 2);
  if (L.top === '#f4f0e8') { g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.moveTo(x, by - 8 * s); g.lineTo(x, by + 16 * s); g.stroke(); }
  // arms
  const ay = by + (o.sit ? 2 : 0) * s, cheer = o.cheer ? -1 : 0;
  for (const sd of [-1, 1]) { g.beginPath(); g.moveTo(x + sd * 13 * s, by - 4 * s); g.quadraticCurveTo(x + sd * 22 * s, ay + (cheer ? -18 : 6) * s, x + sd * (o.sit ? 12 : 18) * s, ay + (cheer ? -30 : 16) * s); g.strokeStyle = INK; g.lineWidth = 7 * s; g.stroke(); g.strokeStyle = L.top; g.lineWidth = 4.6 * s; g.stroke(); ell(g, x + sd * (o.sit ? 12 : 18) * s, ay + (cheer ? -30 : 16) * s, 4 * s, 4 * s); path(g, L.skin, INK, 1.4); }
  // head
  const hy = by - 10 * s - hr * 0.9, bob = o.t ? Math.sin(o.t * 2 + x) * 1.2 : 0;
  if (o.back) { ell(g, x, hy + bob, hr, hr * 0.95); path(g, L.hair === 'bald' ? L.skin : L.hairC, INK, 2); g.restore(); return; }
  if (L.hair === 'long') { g.beginPath(); g.ellipse(x, hy + bob + 6 * s, hr * 1.08, hr * 1.1, 0, 0, Math.PI * 2); path(g, L.hairC, INK, 2); }
  ell(g, x, hy + bob, hr, hr * 0.95); path(g, L.skin, INK, 2);
  // hair on top
  g.beginPath();
  const hc = L.old ? '#d8d4cc' : L.hairC, top = hy + bob;
  if (L.hair === 'bald') { g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 2; g.beginPath(); g.arc(x - 6 * s, top - 10 * s, 6 * s, 3.6, 4.6); g.stroke(); }
  else if (L.hair === 'cap') { g.beginPath(); g.arc(x, top - 2 * s, hr * 1.02, Math.PI, 0); g.closePath(); path(g, '#8a8a90', INK, 2); g.beginPath(); g.ellipse(x + 10 * s, top - 3 * s, 16 * s, 5 * s, 0, 0, Math.PI * 2); path(g, '#7a7a80', INK, 1.6); }
  else {
    g.beginPath(); g.arc(x, top, hr * 1.03, Math.PI * 1.02, -0.02);
    if (L.hair === 'spiky') { for (let k = 0; k <= 6; k++) { const a = Math.PI + (k / 6) * Math.PI, rr = hr * (k % 2 ? 1.25 : 1.02); g.lineTo(x + Math.cos(a) * rr, top + Math.sin(a) * rr); } }
    g.quadraticCurveTo(x + hr * 0.4, top - hr * 0.1, x, top - hr * 0.15); g.quadraticCurveTo(x - hr * 0.5, top + hr * (L.hair === 'side' ? 0.35 : 0.05), x - hr * 1.02, top + hr * 0.1); g.closePath(); path(g, hc, INK, 2);
    if (L.hair === 'bun') { ell(g, x, top - hr * 1.05, hr * 0.38, hr * 0.32); path(g, hc, INK, 2); }
    if (L.hair === 'bob') { for (const sd of [-1, 1]) { g.beginPath(); g.ellipse(x + sd * hr * 0.88, top + hr * 0.25, hr * 0.26, hr * 0.55, 0, 0, Math.PI * 2); path(g, hc, INK, 1.8); } }
  }
  // face
  const ey = top + hr * 0.18, ex = hr * 0.38;
  if (L.shades) { g.fillStyle = '#1a1a1e'; rrect(g, x - ex - 8 * s, ey - 5 * s, 16 * s, 9 * s, 3); g.fill(); rrect(g, x + ex - 8 * s, ey - 5 * s, 16 * s, 9 * s, 3); g.fill(); g.fillRect(x - 3 * s, ey - 3 * s, 6 * s, 2 * s); }
  else {
    g.strokeStyle = INK; g.lineWidth = 2.2 * s; g.fillStyle = INK;
    const happy = o.mood === 'happy' || (L.eyes === 'happy' && o.mood !== 'wait');
    for (const sd of [-1, 1]) { if (happy) { g.beginPath(); g.arc(x + sd * ex, ey + 2 * s, 4.5 * s, Math.PI * 1.15, Math.PI * 1.85); g.stroke(); } else { ell(g, x + sd * ex, ey, 2.4 * s, 3 * s); g.fill(); } }
    if (L.glasses) { g.lineWidth = 1.6 * s; for (const sd of [-1, 1]) { g.beginPath(); g.arc(x + sd * ex, ey, 7 * s, 0, Math.PI * 2); g.stroke(); } g.beginPath(); g.moveTo(x - ex + 7 * s, ey); g.lineTo(x + ex - 7 * s, ey); g.stroke(); }
  }
  if (L.old) { g.strokeStyle = 'rgba(74,52,38,0.5)'; g.lineWidth = 1.2; for (const sd of [-1, 1]) { g.beginPath(); g.arc(x + sd * (ex + 6 * s), ey + 2 * s, 3 * s, -0.5, 0.5); g.stroke(); } }
  g.fillStyle = 'rgba(232,120,100,0.35)'; for (const sd of [-1, 1]) { ell(g, x + sd * hr * 0.6, ey + 8 * s, 5 * s, 3.2 * s); g.fill(); }
  // mouth: a smile, an open laugh, a little line while waiting, a moustache sometimes
  g.strokeStyle = INK; g.lineWidth = 1.8 * s;
  if (o.mood === 'happy' || o.cheer) { g.beginPath(); g.arc(x, ey + 9 * s, 5 * s, 0.15, Math.PI - 0.15); g.closePath(); path(g, '#a83a3a', INK, 1.6); }
  else if (o.mood === 'wait') { g.beginPath(); g.moveTo(x - 3 * s, ey + 11 * s); g.lineTo(x + 3 * s, ey + 11 * s); g.stroke(); }
  else { g.beginPath(); g.arc(x, ey + 8 * s, 4 * s, 0.3, Math.PI - 0.3); g.stroke(); }
  if (L.stache) { g.fillStyle = L.old ? '#d8d4cc' : L.hairC; g.beginPath(); g.ellipse(x - 4 * s, ey + 6.5 * s, 5 * s, 2.4 * s, 0.2, 0, Math.PI * 2); g.ellipse(x + 4 * s, ey + 6.5 * s, 5 * s, 2.4 * s, -0.2, 0, Math.PI * 2); g.fill(); }
  g.restore();
}
// the staff: an apron and a headscarf
export function staff(g, x, y, k, o = {}) {
  const L = { ...makeLook(1000 + k), top: '#f4f0e8', hair: k % 2 ? 'bun' : 'short', glasses: false, shades: false, stache: false, old: false, kid: false, eyes: 'happy' };
  person(g, x, y, L, { ...o, scale: 0.95 });
  g.fillStyle = '#5a7a5a'; g.beginPath(); g.moveTo(x - 11, y - 2); g.lineTo(x + 11, y - 2); g.lineTo(x + 13, y + 18); g.lineTo(x - 13, y + 18); g.closePath(); path(g, '#5a7a5a', INK, 1.6);
  g.beginPath(); g.arc(x, y - 47, 21, Math.PI * 1.05, -0.05); path(g, '#c8503e', INK, 1.8);
}

// ------------------------------------------------------------------ cups, plates
export function cup(g, x, y, p, sc = 1, fill = 1) {
  const w = 22 * sc, h = 40 * sc, top = y - h;
  g.save();
  // liquid layers, pearls, ice
  g.beginPath(); g.moveTo(x - w / 2, top); g.lineTo(x + w / 2, top); g.lineTo(x + w * 0.4, y); g.lineTo(x - w * 0.4, y); g.closePath(); g.save(); g.clip();
  g.fillStyle = 'rgba(240,248,250,0.5)'; g.fillRect(x - w, top, w * 2, h);
  const lv = top + h * (1 - 0.86 * fill), L = p.layers || ['#c8925a'];
  if (fill > 0) { const lh = (y - lv) / L.length; L.forEach((c, i) => { g.fillStyle = c; g.fillRect(x - w, lv + i * lh, w * 2, lh + 1); }); }
  if (p.stripes && fill > 0) { g.strokeStyle = 'rgba(110,60,20,0.75)'; g.lineWidth = 2.5 * sc; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - w * 0.5 + k * w * 0.3, lv); g.quadraticCurveTo(x - w * 0.35 + k * w * 0.3, (lv + y) / 2, x - w * 0.45 + k * w * 0.3, y); g.stroke(); } }
  if (p.pearls && fill > 0) { g.fillStyle = '#2a1810'; for (let k = 0; k < 9; k++) { ell(g, x - w * 0.35 + (k % 5) * w * 0.17, y - 3 * sc - Math.floor(k / 5) * 4.5 * sc, 2.6 * sc, 2.6 * sc); g.fill(); } }
  if (p.seeds && fill > 0) { g.fillStyle = '#3a2a10'; for (let k = 0; k < 10; k++) { ell(g, x + (hash(k) - 0.5) * w * 0.7, lv + hash(k, 2) * (y - lv), 1.2 * sc, 1.2 * sc); g.fill(); } }
  if (p.ice && fill > 0) for (let k = 0; k < p.ice; k++) { rrect(g, x - w * 0.3 + k * w * 0.2, lv + 2 * sc + (k % 2) * 4 * sc, 6 * sc, 6 * sc, 1.5); path(g, 'rgba(255,255,255,0.6)', 'rgba(255,255,255,0.8)', 1); }
  g.restore();
  g.beginPath(); g.moveTo(x - w / 2, top); g.lineTo(x + w / 2, top); g.lineTo(x + w * 0.4, y); g.lineTo(x - w * 0.4, y); g.closePath(); path(g, null, INK, 1.8 * Math.max(0.7, sc));
  g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x - w * 0.38, top + 3, w * 0.1, h - 8);
  if (fill > 0.5 && !p.noStraw) { g.strokeStyle = INK; g.lineWidth = 4.5 * sc; g.beginPath(); g.moveTo(x + w * 0.1, top + h * 0.5); g.lineTo(x + w * 0.25, top - 12 * sc); g.stroke(); g.strokeStyle = '#e05a6a'; g.lineWidth = 2.6 * sc; g.stroke(); }
  if (p.sealed) { g.fillStyle = 'rgba(255,240,220,0.8)'; g.fillRect(x - w / 2, top - 1, w, 3 * sc); }
  g.restore();
}
export function dish(g, x, y, kind, sc = 1) {
  g.fillStyle = 'rgba(60,40,20,0.25)'; ell(g, x, y + 4 * sc, 26 * sc, 7 * sc); g.fill();
  if (kind === 'noodle') { ell(g, x, y - 4 * sc, 24 * sc, 12 * sc); path(g, '#f4f0e8', INK, 1.8); ell(g, x, y - 6 * sc, 19 * sc, 8 * sc); path(g, '#c8a070', null); g.strokeStyle = '#f0dc9a'; g.lineWidth = 2 * sc; for (let k = 0; k < 5; k++) { g.beginPath(); g.arc(x - 8 * sc + k * 4 * sc, y - 7 * sc, 5 * sc, 3.4, 5.8); g.stroke(); } ell(g, x + 8 * sc, y - 9 * sc, 5 * sc, 4 * sc); path(g, '#c8905a', INK, 1.2); g.fillStyle = '#6ab04a'; for (let k = 0; k < 6; k++) g.fillRect(x - 10 * sc + k * 3.5 * sc, y - 10 * sc + (k % 2) * 3, 2 * sc, 2 * sc); return; }
  ell(g, x, y - 2 * sc, 26 * sc, 10 * sc); path(g, '#f4f0e8', INK, 1.8);
  for (let k = 0; k < 4; k++) { rrect(g, x - 18 * sc + k * 9 * sc, y - 9 * sc + (k % 2) * 3 * sc, 9 * sc, 8 * sc, 2); path(g, '#9a6438', INK, 1.2); }
  ell(g, x + 12 * sc, y - 6 * sc, 6 * sc, 5 * sc); path(g, '#8a5428', INK, 1.2); g.fillStyle = '#6ab04a'; for (let k = 0; k < 5; k++) g.fillRect(x - 12 * sc + k * 5 * sc, y - 11 * sc, 2 * sc, 2 * sc);
}
export function teapot(g, x, y, sc = 1) { ell(g, x, y - 10 * sc, 14 * sc, 11 * sc); path(g, '#8a4a2a', INK, 1.6); g.beginPath(); g.moveTo(x + 12 * sc, y - 12 * sc); g.quadraticCurveTo(x + 24 * sc, y - 16 * sc, x + 24 * sc, y - 22 * sc); path(g, null, INK, 3 * sc); ell(g, x, y - 21 * sc, 6 * sc, 2.5 * sc); path(g, '#6a3a1a', INK, 1.4); }

// ------------------------------------------------------------------ decorations
export function decor(g, id, x, y, t = 0) {
  if (id === 'lantern') { const sw = Math.sin(t * 1.4 + x) * 3; g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw, y + 26); g.stroke(); ell(g, x + sw, y + 44, 18, 20); path(g, '#d83a2a', INK, 2); g.fillStyle = 'rgba(255,220,120,0.35)'; ell(g, x + sw, y + 44, 10, 14); g.fill(); g.fillStyle = '#e8b040'; g.fillRect(x + sw - 9, y + 24, 18, 5); g.fillRect(x + sw - 9, y + 61, 18, 5); g.strokeStyle = '#e8b040'; g.beginPath(); g.moveTo(x + sw, y + 66); g.lineTo(x + sw, y + 78); g.stroke(); return; }
  if (id === 'plant') { rrect(g, x - 16, y - 24, 32, 26, 6); path(g, '#b8643a', INK, 2); for (let k = 0; k < 7; k++) { const a = -Math.PI / 2 + (k - 3) * 0.35; g.beginPath(); g.ellipse(x + Math.cos(a) * 16, y - 30 + Math.sin(a) * 18, 8, 16, a + Math.PI / 2, 0, Math.PI * 2); path(g, k % 2 ? '#5a8a4a' : '#6a9a52', INK, 1.4); } return; }
  if (id === 'scroll') { g.fillStyle = '#6a4426'; g.fillRect(x - 24, y - 50, 48, 5); g.fillRect(x - 24, y + 46, 48, 6); rrect(g, x - 20, y - 46, 40, 92, 2); path(g, '#f4ead0', INK, 1.6); g.fillStyle = INK; g.font = '700 22px "Noto Serif TC", serif'; g.textAlign = 'center'; g.fillText('茶', x, y - 14); g.fillText('香', x, y + 16); g.fillStyle = '#c83a2a'; g.fillRect(x + 6, y + 28, 7, 7); return; }
  if (id === 'teaset') { rrect(g, x - 40, y - 50, 80, 96, 4); path(g, '#7a4a28', INK, 2); g.fillStyle = '#5a3418'; g.fillRect(x - 36, y - 2, 72, 4); teapot(g, x - 14, y - 6, 0.9); for (let k = 0; k < 3; k++) { rrect(g, x + 6 + k * 10, y - 14, 8, 9, 2); path(g, '#e8dcc4', INK, 1.2); } teapot(g, x + 8, y + 40, 0.8); for (let k = 0; k < 2; k++) { rrect(g, x - 30 + k * 12, y + 30, 8, 9, 2); path(g, '#c8a070', INK, 1.2); } return; }
  if (id === 'umbrella') { g.save(); g.translate(x, y); g.rotate(-0.25); g.beginPath(); g.moveTo(0, -46); for (let k = 0; k <= 8; k++) { const a = Math.PI + (k / 8) * Math.PI; g.lineTo(Math.cos(a) * 46, Math.sin(a) * 30 - 10); } g.closePath(); path(g, '#e8b85a', INK, 2); g.strokeStyle = 'rgba(120,60,20,0.5)'; for (let k = 1; k < 8; k++) { const a = Math.PI + (k / 8) * Math.PI; g.beginPath(); g.moveTo(0, -46); g.lineTo(Math.cos(a) * 46, Math.sin(a) * 30 - 10); g.stroke(); } g.strokeStyle = INK; g.lineWidth = 3; g.beginPath(); g.moveTo(0, -46); g.lineTo(0, 40); g.stroke(); g.restore(); return; }
  if (id === 'fish') { rrect(g, x - 24, y - 6, 48, 10, 3); path(g, '#7a4a28', INK, 1.6); ell(g, x, y - 28, 26, 24); path(g, 'rgba(170,210,230,0.6)', INK, 2); g.fillStyle = 'rgba(120,180,210,0.5)'; ell(g, x, y - 24, 22, 16); g.fill(); for (let k = 0; k < 2; k++) { const fx = x + Math.sin(t * 1.5 + k * 3) * 10, fy = y - 26 + k * 6; ell(g, fx, fy, 6, 3.5); path(g, '#e8602a', null); g.beginPath(); g.moveTo(fx + 5, fy); g.lineTo(fx + 10, fy - 3); g.lineTo(fx + 10, fy + 3); g.closePath(); path(g, '#e8602a', null); } return; }
  if (id === 'screen') { for (let k = 0; k < 3; k++) { rrect(g, x - 51 + k * 34, y - 90, 32, 92, 3); path(g, '#9a6438', INK, 2); rrect(g, x - 46 + k * 34, y - 84, 22, 78, 2); path(g, '#f4e8cc', INK, 1.2); g.strokeStyle = 'rgba(120,80,40,0.6)'; g.lineWidth = 1; for (let r = 1; r < 5; r++) { g.beginPath(); g.moveTo(x - 46 + k * 34, y - 84 + r * 15.6); g.lineTo(x - 24 + k * 34, y - 84 + r * 15.6); g.stroke(); } } return; }
  if (id === 'radio') { g.fillStyle = '#6a4426'; g.fillRect(x - 34, y + 20, 68, 5); rrect(g, x - 30, y - 16, 60, 36, 8); path(g, '#b07a48', INK, 2); rrect(g, x - 24, y - 10, 30, 24, 4); path(g, '#e8d4a8', INK, 1.2); g.strokeStyle = 'rgba(90,60,30,0.6)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(x - 22, y - 6 + k * 6); g.lineTo(x + 4, y - 6 + k * 6); g.stroke(); } for (let k = 0; k < 2; k++) { ell(g, x + 16, y - 6 + k * 12, 4, 4); path(g, '#5a3418', INK, 1.2); } const n = (t * 2) % 1; g.fillStyle = `rgba(74,52,38,${1 - n})`; g.font = '14px serif'; g.fillText('♪', x + 34 + n * 10, y - 18 - n * 16); return; }
}

// ------------------------------------------------------------------ hearts and confetti
export function particles(g, list, dt) {
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i]; p.t += dt; if (p.t > p.life) { list.splice(i, 1); continue; }
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += (p.kind === 'heart' ? -10 : 60) * dt; const a = 1 - p.t / p.life;
    g.save(); g.globalAlpha = a; g.translate(p.x, p.y); g.rotate(p.rot + p.t * p.spin);
    if (p.kind === 'heart') { g.fillStyle = '#e84a5a'; g.beginPath(); g.moveTo(0, 4); g.bezierCurveTo(-10, -4, -6, -12, 0, -6); g.bezierCurveTo(6, -12, 10, -4, 0, 4); g.fill(); }
    else if (p.kind === 'coin') { g.fillStyle = '#e8b830'; ell(g, 0, 0, 6, 6); g.fill(); g.strokeStyle = '#a87810'; g.lineWidth = 1.2; g.stroke(); }
    else if (p.kind === 'text') { g.rotate(-(p.rot + p.t * p.spin)); g.font = '800 16px Nunito, sans-serif'; g.textAlign = 'center'; g.lineWidth = 3; g.strokeStyle = '#fff8e8'; g.strokeText(p.text, 0, 0); g.fillStyle = p.color || '#a8601a'; g.fillText(p.text, 0, 0); }
    else { g.fillStyle = p.color; g.fillRect(-4, -2.5, 8, 5); }
    g.restore();
  }
}
export function burst(list, x, y, n = 8) {
  const cols = ['#e84a5a', '#5ab8c8', '#e8b830', '#8ac85a', '#c87ad8'];
  for (let k = 0; k < n; k++) list.push({ kind: k % 3 === 0 ? 'heart' : 'conf', x, y, vx: rnd(-50, 50), vy: rnd(-90, -30), t: 0, life: rnd(0.9, 1.6), rot: rnd(0, 6), spin: rnd(-4, 4), color: cols[k % cols.length] });
}
