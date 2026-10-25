// The life of the shop. People walk along the pavement; some turn in at the door, queue at the register, order and
// pay, then find their seat along a real path around the tables (or wait by the counter for a drink to go). The staff
// take the orders at the register, make each one at the counter, carry it over, and clear the table afterwards.
// Friends chat, raise a toast, take a photo of their drinks; on the way out they wave and the staff thank them.
// Everyone walks with a stride that matches the ground they cover, along A* paths over a grid of the floor.
import { SLOTS, seats, roomH, roomW, STREET, DOOR_X, FLOOR_SPOTS, spotShown, makeLook, staffLook, person, table, chair, cup, dish, teapot, decor, cat, scooter, say, frontWall, streetProps, aboard, burst } from './art.js?v=2';
import { PRODUCTS } from './data.js?v=2';

const CELL = 20, LANE_Y = 198, EXIT = [300, 216], LANE_END = 276, REG_X = 236;
const QUEUE = [[244, 306], [244, 350], [244, 394]], PICKUP = [[92, 306], [150, 316]];   // pickup: in front of the counter's left end
const P = (id) => PRODUCTS.find((p) => p.id === id);
const rnd = (a, b) => a + Math.random() * (b - a);
const pickOne = (a) => a[Math.floor(Math.random() * a.length)];

// ------------------------------------------------------------------ the floor as a grid, and paths over it
function buildGrid(st) {
  const H = roomH(st.size), RW = roomW(st.size), cols = Math.ceil(960 / CELL), rows = Math.ceil((H + STREET) / CELL), b = new Uint8Array(cols * rows), rects = [];
  st.tables.forEach((tb) => { const [x, y] = SLOTS[tb.slot]; rects.push(tb.type === 'tatami' ? [x - 92, y - 24, x + 92, y + 36] : tb.type === 'round4' ? [x - 74, y - 28, x + 74, y + 42] : [x - 66, y - 28, x + 66, y + 44]); });
  (st.decor || []).forEach((d, i) => { if (d.spot !== 'floor' || !spotShown(st, 'floor', d.at)) return; const [x, y] = FLOOR_SPOTS[d.at]; rects.push([x - 32, y - 28, x + 32, y + 10]); });
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = c * CELL + CELL / 2, y = r * CELL + CELL / 2; let bl = false;
    if (y < 206) bl = true;
    else if (y < H - 12) bl = x > RW - 12 || (x < 292 && y < 290) || rects.some(([a, b2, c2, d]) => x > a && x < c2 && y > b2 && y < d);
    else if (y < H + 12) bl = Math.abs(x - DOOR_X) > 28;
    else bl = y > H + 60;
    b[r * cols + c] = bl ? 1 : 0;
  }
  return { b, cols, rows };
}
const blockedAt = (G, x, y) => { const c = Math.floor(x / CELL), r = Math.floor(y / CELL); return c < 0 || r < 0 || c >= G.cols || r >= G.rows || G.b[r * G.cols + c] === 1; };
function freeCell(G, c, r) {
  if (!G.b[r * G.cols + c]) return [c, r];
  for (let d = 1; d < 12; d++) for (let dr = -d; dr <= d; dr++) for (let dc = -d; dc <= d; dc++) { if (Math.max(Math.abs(dr), Math.abs(dc)) !== d) continue; const nc = c + dc, nr = r + dr; if (nc >= 0 && nr >= 0 && nc < G.cols && nr < G.rows && !G.b[nr * G.cols + nc]) return [nc, nr]; }
  return [c, r];
}
const DIRS = [[1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1], [1, 1, 1.414], [1, -1, 1.414], [-1, 1, 1.414], [-1, -1, 1.414]];
function route(G, sx, sy, tx, ty) {
  const { cols, rows, b } = G, N = cols * rows, cl = (v, n) => Math.max(0, Math.min(n - 1, v));
  const [sc, sr] = freeCell(G, cl(Math.floor(sx / CELL), cols), cl(Math.floor(sy / CELL), rows)), [tc, tr] = freeCell(G, cl(Math.floor(tx / CELL), cols), cl(Math.floor(ty / CELL), rows));
  const start = sr * cols + sc, goal = tr * cols + tc, gS = new Float32Array(N).fill(Infinity), from = new Int32Array(N).fill(-1), done = new Uint8Array(N);
  const hf = (n) => { const dc = Math.abs((n % cols) - tc), dr = Math.abs(((n / cols) | 0) - tr); return Math.max(dc, dr) + 0.414 * Math.min(dc, dr); };
  const heap = []; const push = (f, n) => { heap.push([f, n]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  gS[start] = 0; push(hf(start), start);
  while (heap.length) {
    const [, cur] = pop(); if (cur === goal) break; if (done[cur]) continue; done[cur] = 1;
    const cc = cur % cols, cr = (cur / cols) | 0;
    for (const [dc, dr, cost] of DIRS) {
      const nc = cc + dc, nr = cr + dr; if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue; const n = nr * cols + nc; if (b[n]) continue;
      if (dc && dr && (b[cr * cols + nc] || b[nr * cols + cc])) continue;   // no cutting corners round a table
      const ng = gS[cur] + cost; if (ng < gS[n]) { gS[n] = ng; from[n] = cur; push(ng + hf(n), n); }
    }
  }
  if (goal !== start && from[goal] < 0) return [[tx, ty]];
  const cells = []; for (let n = goal; n !== start && n >= 0; n = from[n]) cells.push(n); cells.reverse();
  const pts = [[sx, sy], ...cells.map((n) => [(n % cols) * CELL + CELL / 2, ((n / cols) | 0) * CELL + CELL / 2]), [tx, ty]];
  // pull the string tight: go straight wherever the floor between two points is clear
  const los = (a, c) => { const d = Math.hypot(c[0] - a[0], c[1] - a[1]); for (let s = 14; s < d - 14; s += 5) { const k = s / d; if (blockedAt(G, a[0] + (c[0] - a[0]) * k, a[1] + (c[1] - a[1]) * k)) return false; } return true; };
  const out = []; let i = 0;
  while (i < pts.length - 1) { let j = pts.length - 1; while (j > i + 1 && !los(pts[i], pts[j])) j--; out.push(pts[j]); i = j; }
  return out;
}
// move along a path; the stride follows the distance actually walked, so feet never skate
function walk(e, dt, sp) {
  let left = sp * dt; e.moving = e.path.length > 0;
  while (left > 0 && e.path.length) {
    const [tx, ty] = e.path[0], dx = tx - e.x, dy = ty - e.y, d = Math.hypot(dx, dy);
    if (d > 0.5) { if (Math.abs(dx) > Math.abs(dy) * 0.35) e.face = Math.sign(dx); e.back = dy < -Math.abs(dx) * 0.8; if (Math.abs(dy) > Math.abs(dx) * 2.5) e.face = 0; }
    const m = Math.min(d, left); e.x += d ? dx / d * m : 0; e.y += d ? dy / d * m : 0; e.phase = (e.phase || 0) + m / 4.6; left -= m;
    if (m >= d) e.path.shift();
  }
  return !e.path.length;
}

// ------------------------------------------------------------------ the shop's day
export class Sim {
  // o: st(), menu(), T(), best(pid), appeal(), foot(), staffN(), gear(), cat(), open(), special(p), onServe(g, score, byHand), onAngry(g), onEnter(g), fx
  constructor(o) { this.o = o; this.reset(); }
  reset() { this.guests = []; this.walkers = []; this.crew = []; this.orders = []; this.queue = []; this.seatSt = {}; this.says = []; this.scoots = []; this.catE = null; this.later = []; this.t = 0; this.ring = 0; this.gridKey = ''; this.nextWalk = 0.5; this.nextScoot = 2; this.syncCrew(); }
  get fx() { return this.o.fx; }
  syncCrew() { const n = this.o.staffN(); while (this.crew.length < n) { const k = this.crew.length; this.crew.push({ k, look: staffLook(k), x: 60 + k * 44, y: LANE_Y, plan: [], path: [], face: 0, phase: 0, home: 60 + k * 44 }); } }
  grid() { const st = this.o.st(), key = JSON.stringify([st.size, st.tables, (st.decor || []).filter((d) => d.spot === 'floor')]); if (key !== this.gridKey) { this.gridKey = key; this.G = buildGrid(st); } return this.G; }
  route(x, y, tx, ty) { return route(this.grid(), x, y, tx, ty); }
  // the nearest open bit of floor to a point (so nobody ends up standing in a table)
  freePoint(x, y) { const G = this.grid(); if (!blockedAt(G, x, y)) return [x, y]; const [c, r] = freeCell(G, Math.max(0, Math.min(G.cols - 1, Math.floor(x / CELL))), Math.max(0, Math.min(G.rows - 1, Math.floor(y / CELL)))); return [c * CELL + CELL / 2, r * CELL + CELL / 2]; }
  seatList() { const out = []; this.o.st().tables.forEach((tb, ti) => { const [x, y] = SLOTS[tb.slot]; seats(tb.type, x, y).forEach(([sx, sy, dir], si) => out.push({ key: ti + ':' + si + ':' + tb.type, ti, si, x: sx, y: sy, dir, tx: x, ty: y, type: tb.type })); }); return out; }
  seatState(s) { return this.seatSt[s.key] || (this.seatSt[s.key] = { by: null, dirty: null }); }
  after(sec, f) { this.later.push({ at: this.t + sec, f }); }
  say(e, text, life = 2.4, warm) { this.says = this.says.filter((s) => s.e !== e); this.says.push({ e, text, t: 0, life, warm }); }
  doorY() { return roomH(this.o.st().size); }

  update(dt) {
    this.t += dt; this.ring = Math.max(0, this.ring - dt); this.grid(); this.syncCrew();
    if (this.later.length) { const due = this.later.filter((x) => x.at <= this.t); this.later = this.later.filter((x) => x.at > this.t); due.forEach((x) => x.f()); }
    const H = this.doorY(), T = this.o.T();
    // the street: people go by, now and then in twos and threes; scooters on the road
    this.nextWalk -= dt;
    if (this.nextWalk <= 0) { this.nextWalk = rnd(1.0, 2.2) / Math.max(0.2, this.o.foot()); this.spawnWalkers(); }
    this.nextScoot -= dt;
    if (this.nextScoot <= 0) { this.nextScoot = rnd(5, 12); const dir = Math.random() < 0.5 ? 1 : -1; this.scoots.push({ x: dir > 0 ? -60 : 1020, y: H + (dir > 0 ? 82 : 76), dir, sp: rnd(150, 220), look: makeLook(Math.random() * 1e6 | 0) }); }
    for (const s of this.scoots) s.x += s.dir * s.sp * dt; this.scoots = this.scoots.filter((s) => s.x > -80 && s.x < 1040);
    for (const w of this.walkers) {
      if (w.path && w.path.length) { walk(w, dt, w.sp); continue; }
      w.x += w.dir * w.sp * dt; w.phase += w.sp * dt / 4.6; w.moving = true; w.face = w.dir; w.back = false;
      if (w.lead && !w.decided && Math.abs(w.x - DOOR_X) < 30) { w.decided = true; this.decide(w.group); }
    }
    this.walkers = this.walkers.filter((w) => !w.inside && w.x > -60 && w.x < 1020);
    // guests
    for (const g of this.guests) this.stepGuest(g, dt, H, T);
    this.guests = this.guests.filter((g) => !g.gone);
    // the queue moves up
    this.queue = this.queue.filter((g) => !g.gone && (g.state === 'enter' || g.state === 'toQueue' || g.state === 'queue' || g.state === 'atReg'));
    this.queue.forEach((g, i) => { g.qi = i; });
    // staff
    for (const c of this.crew) this.stepCrew(c, dt, T);
    // the cat
    this.stepCat(dt);
    for (const s of this.says) s.t += dt; this.says = this.says.filter((s) => s.t < s.life && !(s.e && s.e.gone));
  }
  spawnWalkers() {
    const H = this.doorY(), dir = Math.random() < 0.5 ? 1 : -1, n = Math.random() < 0.6 ? 1 : Math.random() < 0.75 ? 2 : 3, lane = H + rnd(4, 16), group = [];
    for (let j = 0; j < n; j++) { const L = makeLook(Math.random() * 1e6 | 0); const w = { look: L, x: (dir > 0 ? -30 : 990) - dir * j * 30, y: lane + (j % 2 ? 9 : 0), dir, sp: L.old ? rnd(42, 52) : L.kid ? rnd(72, 84) : rnd(58, 74), phase: Math.random() * 6, face: dir, lead: j === 0, group }; group.push(w); this.walkers.push(w); }
    group.forEach((w) => { w.sp = group[0].sp; });   // friends keep pace with each other
  }
  // a group at the door: do they come in? Only if there's something on the menu, room in the queue and seats (or it's to go)
  decide(group) {
    const o = this.o, m = o.menu(); if (!m.length || !o.open() || Math.random() > o.appeal()) return;
    if (this.queue.length + group.length > QUEUE.length) return;
    const drinks = m.filter((p) => p.kind === 'drink'), pickups = this.guests.filter((g) => g.takeaway && !g.gone).length;
    let seatsFor = null, takeaway = false;
    const free = this.seatList().filter((s) => { const ss = this.seatState(s); return !ss.by && !ss.dirty; });
    const byTable = {}; free.forEach((s) => (byTable[s.ti] = byTable[s.ti] || []).push(s));
    const tableFit = Object.values(byTable).find((list) => list.length >= group.length);
    if (group.length === 1 && drinks.length && pickups < 2 && Math.random() < 0.28) takeaway = true;
    else if (tableFit) seatsFor = tableFit.slice(0, group.length);
    else if (group.length === 1 && drinks.length && pickups < 2) takeaway = true;
    else return;
    const H = this.doorY(), T = o.T();
    group.forEach((w, j) => {
      w.inside = true;
      const p = takeaway ? pickOne(drinks) : pickOne(m), seat = seatsFor ? seatsFor[j] : null;
      const g = { id: Math.random(), look: w.look, x: w.x, y: w.y, face: w.dir, phase: w.phase, sp: w.sp, path: [[DOOR_X + (w.x - DOOR_X) * 0.2, H + 30], [DOOR_X, H + 4], [DOOR_X, H - 26]], state: 'enter', pid: p.id, takeaway, seat, group: null, pat: 0, eat: 0, mood: 'wait' };
      if (seat) this.seatState(seat).by = g;
      w.guest = g; this.guests.push(g); this.queue.push(g); o.onEnter(g);
    });
    const members = group.map((w) => w.guest); members.forEach((g) => { g.group = members; });
    this.ring = 1.6;
    const c = this.crew.find((x) => x.y <= LANE_Y + 4) || this.crew[0]; if (c) this.say(c, T.say.welcome(), 2);
  }
  limit(g) { return g.special ? 75 : 55; }
  stepGuest(g, dt, H, T) {
    const o = this.o;
    if (g.state === 'enter' || g.state === 'toQueue' || g.state === 'queue' || g.state === 'atReg') g.pat += dt * 0.5;
    else if (g.state === 'toSeat' || g.state === 'sit' || g.state === 'wait' || g.state === 'toPickup' || g.state === 'pickup') g.pat += dt;
    if (!g.served && !g.angry && g.pat > this.limit(g)) { this.angry(g, T); }
    if (g.wave > 0) g.wave -= dt; if (g.cheerT > 0) g.cheerT -= dt;
    switch (g.state) {
      case 'enter': if (walk(g, dt, g.sp)) { g.state = 'toQueue'; const q = QUEUE[Math.min(g.qi ?? 0, QUEUE.length - 1)]; g.path = this.route(g.x, g.y, q[0], q[1]); } break;
      case 'toQueue': if (walk(g, dt, g.sp)) g.state = 'queue'; break;
      case 'queue': {
        const q = QUEUE[Math.min(g.qi ?? 0, QUEUE.length - 1)];
        if (Math.hypot(q[0] - g.x, q[1] - g.y) > 2) { if (!g.path.length) g.path = [q.slice()]; walk(g, dt, g.sp * 0.8); }
        else { g.moving = false; g.back = true; g.face = 0; if (g.qi === 0) g.state = 'atReg'; }
        break;
      }
      case 'atReg': g.moving = false; g.back = true; break;
      case 'toSeat': if (walk(g, dt, g.sp)) { g.state = 'sit'; g.sitT = 0.35; g.x = g.seat.x; g.y = g.seat.y; } break;
      case 'sit': g.sitT -= dt; if (g.sitT <= 0) g.state = g.served ? 'drink' : 'wait'; break;
      case 'wait': g.chatT = (g.chatT ?? rnd(3, 7)) - dt; if (g.chatT <= 0) { g.chatT = rnd(5, 10); if (g.group.length > 1 && Math.random() < 0.6) this.say(g, T.say.chat(), 2.2); } break;
      case 'toPickup': if (walk(g, dt, g.sp)) { g.state = 'pickup'; g.face = 0; g.back = true; } break;
      case 'pickup': g.moving = false; g.face = 0; g.back = true; break;
      case 'drink': {
        g.eat += dt; g.chatT = (g.chatT ?? rnd(2, 5)) - dt;
        if (g.chatT <= 0) { g.chatT = rnd(4, 9); if (g.group.length > 1 && Math.random() < 0.7) this.say(g, T.say.chat(), 2.2); }
        if (g.eat >= g.dur) {
          g.finished = true;
          const all = g.group.every((x) => x.finished || x.gone || x.angry || x.takeaway), late = g.eat > g.dur + 18;
          if (all || late) this.leaveSeat(g, H, T);
        }
        break;
      }
      case 'leave': {
        if (walk(g, dt, g.sp)) {
          if (!g.outside) { g.outside = true; g.path = [[DOOR_X, H + 6], [DOOR_X + (g.dir || 1) * 16, H + 30]]; this.ring = 1.4; g.wave = 1.2; if (!g.angry) this.say(g, T.say.bye(), 1.8); const c = this.crew.find((x) => x.y <= LANE_Y + 4); if (c && !g.angry && Math.random() < 0.7) this.say(c, T.say.thanks(), 2); }
          else { g.gone = true; this.walkers.push({ look: g.look, x: g.x, y: g.y, dir: g.dir || 1, sp: g.sp, phase: g.phase, face: g.dir || 1, decided: true }); }
        }
        break;
      }
    }
  }
  leaveSeat(g, H, T) {
    if (g.seat) { const ss = this.seatState(g.seat); ss.by = null; if (g.served) ss.dirty = g.pid; }
    g.state = 'leave'; g.dir = Math.random() < 0.5 ? 1 : -1; g.mood = g.angry ? 'sad' : 'happy';
    g.path = this.route(g.x, g.y + (g.seat ? 8 : 0), DOOR_X, H - 26);
  }
  angry(g, T) {
    g.angry = true; g.mood = 'sad'; this.say(g, T.say.angry(), 2);
    this.orders = this.orders.filter((x) => x.g !== g || x.taken);
    if (g.cashier) { g.cashier.plan = []; g.cashier.path = []; g.cashier = null; }
    this.queue = this.queue.filter((x) => x !== g);
    this.o.onAngry(g); this.leaveSeat(g, this.doorY(), T);
  }
  // after paying: to the seat, or to wait by the counter
  ordered(g, T) {
    g.cashier = null; this.queue = this.queue.filter((x) => x !== g);
    if (g.special === undefined) g.special = this.o.special(P(g.pid));
    this.orders.push({ g, pid: g.pid, t: this.t, taken: null });
    if (g.takeaway) { const used = this.guests.filter((x) => x !== g && x.takeaway && (x.state === 'pickup' || x.state === 'toPickup')).map((x) => x.spot); g.spot = used.includes(0) ? 1 : 0; const q = PICKUP[g.spot]; g.state = 'toPickup'; g.path = this.route(g.x, g.y, q[0], q[1]); }
    else { g.state = 'toSeat'; g.path = this.route(g.x, g.y, g.seat.x, g.seat.y + (g.seat.dir === 'b' ? 0 : 6)); }
  }
  // the guest gets it: from the staff, or from your own hands
  deliver(g, score, byHand, T) {
    if (g.served || g.angry || g.gone) return false;
    this.orders = this.orders.filter((x) => x.g !== g);
    g.served = true; g.mood = 'happy'; g.score = score; g.eat = 0; g.dur = P(g.pid).kind === 'food' ? rnd(15, 20) : rnd(11, 16); g.chatT = rnd(1.5, 3);
    if (g.state === 'wait') g.state = 'drink';
    this.o.onServe(g, score, byHand);
    this.after(0.9, () => { if (!g.gone && !g.takeaway) { if (Math.random() < 0.2) { this.say(g, T.say.photo, 1.6); this.fx.push({ kind: 'flash', x: g.x, y: g.y - 30, vx: 0, vy: 0, t: 0, life: 0.4, rot: 0, spin: 0 }); } else this.say(g, T.say.yum(g.pid), 2); } });
    if (!g.takeaway && g.group.length > 1 && g.group.every((x) => x.served || x.gone || x.angry)) this.after(2.2, () => { const live = g.group.filter((x) => !x.gone && !x.angry); live.forEach((x) => { x.cheerT = 1.4; }); if (live[0]) this.say(live[0], T.say.cheers, 1.8); burst(this.fx, g.x, g.y - 70, 10); });
    if (g.takeaway) { g.wave = 0.8; this.after(0.7, () => { if (!g.gone && g.state !== 'leave') this.leaveSeat(g, this.doorY(), T); }); }
    return true;
  }
  // the player makes a special order: who could be clicked
  handServe(g, score) { const T = this.o.T(); return this.deliver(g, score, true, T); }

  // ------------------------------------------------------------------ staff
  stepCrew(c, dt, T) {
    if (!c.plan.length) this.planFor(c, T);
    const s = c.plan[0];
    if (!s) { c.moving = false; c.face = 0; c.back = false; return; }
    if (!s.begun) { s.begun = true; if (s.start) s.start(); c.path = s.lane !== undefined ? [[s.lane, LANE_Y]] : s.to ? [s.to.slice()] : s.go ? this.route(c.x, c.y, s.go[0], s.go[1]) : []; s.left = s.wait || 0; }
    if (c.path.length) { walk(c, dt, 118); return; }
    c.moving = false; if (s.face !== undefined) { c.face = s.face; c.back = !!s.back; }
    if (s.left > 0) { s.left -= dt; if (s.left > 0) return; }
    c.plan.shift(); if (s.end) s.end();
  }
  planFor(c, T) {
    const o = this.o, behind = c.y <= LANE_Y + 4;
    if (!behind) { c.plan = [{ go: EXIT }, { to: [LANE_END, LANE_Y] }]; return; }
    // 1. someone is at the register
    const g = this.queue.find((x) => x.state === 'atReg' && !x.cashier);
    if (g) {
      g.cashier = c;
      c.plan = [{ lane: REG_X }, { wait: 1.2, face: 0, back: false, start: () => { if (g.special === undefined) g.special = o.special(P(g.pid)); this.say(g, T.say.order(P(g.pid)[o.lang()], g.special ? g.special.label : '', P(g.pid).kind === 'food', g.takeaway), 1.8); c.talk = 1.5; }, end: () => { if (g.cashier === c && !g.angry) { this.fx.push({ kind: 'coin', x: REG_X, y: 150, vx: 0, vy: -40, t: 0, life: 0.8, rot: 0, spin: 0 }); this.ordered(g, T); } } }];
      return;
    }
    // 2. an order to make (special orders wait a little for you to make them yourself)
    const ord = this.orders.filter((x) => !x.taken && (!x.g.special || this.t - x.t > 16)).sort((a, b) => a.t - b.t)[0];
    if (ord) {
      ord.taken = c; const p = P(ord.pid), food = p.kind === 'food', mk = (food ? 6 : 4.5) / (1 + o.gear() * 0.3);
      const station = food ? 74 : 120 + (c.k % 2) * 30;
      c.plan = [{ lane: station }, { wait: mk, face: food ? 0 : 0, back: food, make: true, total: mk, start: () => { c.making = ord; }, end: () => { c.making = null; c.carry = { pid: ord.pid }; this.afterMake(c, ord, T); } }];
      return;
    }
    // 3. a table to clear
    const dirty = this.seatList().find((s) => { const ss = this.seatState(s); return ss.dirty && !ss.clearing; });
    if (dirty) {
      const ss = this.seatState(dirty); ss.clearing = c;
      c.plan = [{ lane: LANE_END }, { to: EXIT }, { go: this.standBy(dirty) }, { wait: 0.8, face: dirty.dir === 'l' ? 1 : dirty.dir === 'r' ? -1 : 0, end: () => { c.carry = { dirty: ss.dirty }; ss.dirty = null; ss.clearing = null; } }, { go: EXIT }, { to: [LANE_END, LANE_Y] }, { lane: 92 }, { wait: 0.6, end: () => { c.carry = null; } }];
      return;
    }
    // 4. nothing to do: back to their spot, and now and then a tidy-up
    if (Math.abs(c.x - c.home) > 4) c.plan = [{ lane: c.home }];
  }
  afterMake(c, ord, T) {
    const g = ord.g;
    if (g.gone || g.angry || g.served) { c.plan = [{ wait: 0.4, end: () => { c.carry = null; } }]; return; }
    if (g.takeaway) { c.plan = [{ lane: PICKUP[g.spot || 0][0] }, { wait: 0.5, face: 0, end: () => { c.carry = null; this.say(c, T.say.here(), 1.6); this.deliver(g, this.o.best(g.pid), false, T); } }]; return; }
    c.plan = [{ lane: LANE_END }, { to: EXIT }, { go: this.standBy(g.seat) }, { wait: 0.6, face: g.seat.dir === 'l' ? 1 : g.seat.dir === 'r' ? -1 : 0, end: () => { c.carry = null; if (!g.gone && !g.angry) { this.say(c, T.say.here(), 1.6); this.deliver(g, this.o.best(g.pid), false, T); } } }, { go: EXIT }, { to: [LANE_END, LANE_Y] }];
  }
  // where the staff stand to serve or clear a seat
  standBy(s) { return this.freePoint(...(s.dir === 'b' ? [s.x + 30, s.y + 4] : [s.x + (s.dir === 'l' ? -30 : 30), s.y + 34])); }

  // ------------------------------------------------------------------ the shop cat
  stepCat(dt) {
    if (!this.o.cat()) { this.catE = null; return; }
    const st = this.o.st(), H = roomH(st.size), RW = roomW(st.size);
    if (!this.catE) this.catE = { x: 520, y: 300, state: 'sit', t: 3, path: [], face: 1, phase: 0 };
    const k = this.catE; k.tt = (k.tt || 0) + dt;
    if (k.state === 'walk') { if (walk(k, dt, 38)) { k.state = k.next || 'sit'; k.t = rnd(6, 14); if (k.target && !k.target.gone && k.target.state === 'drink') { this.say(k.target, this.o.T().say.petCat(), 2); burst(this.fx, k.x, k.y - 30, 4); k.target = null; } } return; }
    k.t -= dt; if (k.t > 0) return;
    const sitters = this.guests.filter((g) => g.state === 'drink' && g.seat);
    const r = Math.random();
    if (r < 0.3 && sitters.length) { const g = pickOne(sitters); k.target = g; k.next = 'sit'; const [cx, cy] = this.freePoint(g.seat.x + (g.seat.dir === 'r' ? 26 : -26), g.seat.y + 30); k.path = this.route(k.x, k.y, cx, cy); }
    else if (r < 0.5) { k.next = 'sleep'; const [cx, cy] = this.freePoint(600, 232); k.path = this.route(k.x, k.y, cx, cy); }
    else { k.next = Math.random() < 0.5 ? 'sit' : 'sleep'; let x, y, n = 0; do { x = rnd(310, RW - 40); y = rnd(230, H - 40); n++; } while (blockedAt(this.grid(), x, y) && n < 20); k.path = this.route(k.x, k.y, x, y); }
    k.state = 'walk';
  }

  // ------------------------------------------------------------------ clicks
  hit(x, y) {
    if (this.catE && Math.abs(x - this.catE.x) < 22 && y > this.catE.y - 30 && y < this.catE.y + 6) return { cat: this.catE };
    const g = this.guests.filter((g) => !g.gone && Math.abs(g.x - x) < 24 && y > g.y - 80 && y < g.y + 30).sort((a, b) => b.y - a.y)[0]; if (g) return { guest: g };
    const c = this.crew.find((c) => Math.abs(c.x - x) < 22 && y > c.y - 78 && y < c.y + 30); if (c) return { crew: c };
    return null;
  }
  poke(h) {
    const T = this.o.T();
    if (h.cat) { this.say(h.cat, T.say.meow, 1.4); burst(this.fx, h.cat.x, h.cat.y - 24, 3); return; }
    if (h.crew) { this.say(h.crew, T.say.staff(), 1.4); return; }
    const g = h.guest; g.wave = 1.2; this.say(g, T.say.hello(), 1.6); burst(this.fx, g.x, g.y - 70, 2);
  }
  pendingSpecial(g) { return g.special && !g.served && !g.angry && (g.state === 'wait' || g.state === 'pickup' || g.state === 'sit') && this.orders.some((x) => x.g === g && !x.taken); }
  takeSpecial(g) { const o = this.orders.find((x) => x.g === g && !x.taken); if (o) o.taken = 'you'; return !!o; }
  releaseSpecial(g) { const o = this.orders.find((x) => x.g === g && x.taken === 'you'); if (o) o.taken = null; }

  // ------------------------------------------------------------------ drawing
  drawBehind(g, time) { for (const c of this.crew) if (c.y <= LANE_Y + 4) this.drawCrew(g, c, time); }
  drawCrew(g, c, time) {
    if (c.talk > 0) c.talk -= 0.016;
    person(g, c.x, c.y, c.look, { t: time, moving: c.moving, phase: c.phase, face: c.face, back: c.back, mood: c.making ? 'wait' : 'happy', talk: c.talk > 0, scale: 0.95, carry: c.carry ? (hx, hy) => { if (c.carry.dirty) { const p = P(c.carry.dirty); if (p.kind === 'food') dish(g, hx, hy + 6, p.dish, 0.6, 1); else cup(g, hx, hy + 8, { ...p, layers: ['#d8c8a8'] }, 0.55, 0.08); } else { const p = P(c.carry.pid); if (p.kind === 'food') dish(g, hx, hy + 6, p.dish, 0.65); else cup(g, hx, hy + 8, { ...p, sealed: true }, 0.6); } } : null });
  }
  drawFront(g, time, view) {
    const st = this.o.st(), H = roomH(st.size), items = [];
    for (const s of this.seatList()) items.push({ y: s.y - 2, f: () => chair(g, s.x, s.y, s.dir, s.type) });
    st.tables.forEach((tb, ti) => {
      const [x, y] = SLOTS[tb.slot];
      items.push({ y, f: () => {
        table(g, x, y, tb.type);
        if (tb.type !== 'wood2') teapot(g, x + 16, y - 6, 0.75);
        for (const s of this.seatList()) {
          if (s.ti !== ti) continue; const ss = this.seatState(s), gu = ss.by, cx = s.x + (x - s.x) * (s.dir === 'b' ? 0.2 : 0.5), cy = y - (tb.type === 'round4' ? 6 : tb.type === 'tatami' ? 4 : 10) + (s.dir === 'b' ? -6 : 0);
          if (gu && gu.served && !gu.takeaway && (gu.state === 'drink' || gu.state === 'sit')) { const p = P(gu.pid), k = Math.min(1, gu.eat / gu.dur); if (p.kind === 'food') dish(g, cx, cy, p.dish, 0.9, k * 0.95); else cup(g, cx, cy, p, 0.9, Math.max(0.08, 1 - k * 0.92)); }
          else if (ss.dirty) { const p = P(ss.dirty); if (p.kind === 'food') dish(g, cx, cy, p.dish, 0.9, 1); else cup(g, cx, cy, { ...p, layers: ['#d8c8a8'] }, 0.9, 0.08); }
        }
      } });
    });
    for (const gu of this.guests) {
      const seated = gu.state === 'sit' || gu.state === 'wait' || gu.state === 'drink';
      items.push({ y: seated ? gu.seat.y - 1 : gu.y + 30, f: () => person(g, seated ? gu.seat.x : gu.x, seated ? gu.seat.y : gu.y, gu.look, { t: time + gu.id * 9, sit: seated, moving: !seated && gu.moving, phase: gu.phase, face: seated ? (gu.seat.dir === 'l' ? 1 : gu.seat.dir === 'r' ? -1 : 0) : gu.face, back: !seated && gu.back, mood: gu.state === 'drink' ? 'happy' : gu.mood, cheer: gu.cheerT > 0 || (gu.state === 'drink' && gu.eat < 1), wave: gu.wave > 0, talk: this.says.some((s) => s.e === gu && s.t < 1.2) }) });
    }
    for (const w of this.walkers) items.push({ y: w.y + 30, f: () => person(g, w.x, w.y, w.look, { t: time, moving: true, phase: w.phase, face: w.face }) });
    for (const c of this.crew) if (c.y > LANE_Y + 4) items.push({ y: c.y + 30, f: () => this.drawCrew(g, c, time) });
    if (this.catE) { const k = this.catE; items.push({ y: k.y, f: () => cat(g, k.x, k.y, { state: k.state, face: k.face || 1, phase: k.phase, t: time }) }); }
    (st.decor || []).forEach((d) => { if (d.spot !== 'floor' || !spotShown(st, 'floor', d.at)) return; const [x, y] = FLOOR_SPOTS[d.at]; items.push({ y, f: () => decor(g, d.id, x, y, time) }); });
    items.push({ y: H + 8, f: () => frontWall(g, st, time, this.ring) });
    for (const pr of streetProps(st)) items.push({ y: pr.y, f: () => (pr.id === 'aboard' ? aboard(g, pr.x, pr.y, view || st) : decor(g, 'plant', pr.x, pr.y, time)) });
    for (const s of this.scoots) items.push({ y: s.y + 10, f: () => scooter(g, s.x, s.y, s.dir, s.look, time) });
    items.sort((a, b) => a.y - b.y).forEach((it) => it.f());
  }
  drawOver(g, time) {
    const T = this.o.T();
    // order bubbles over the ones waiting for theirs; making rings over busy staff; speech
    for (const gu of this.guests) {
      if (gu.served || gu.angry || !(gu.state === 'wait' || gu.state === 'pickup' || gu.state === 'sit')) continue;
      const seated = gu.state !== 'pickup', x = (seated ? gu.seat.x : gu.x) + 20, y = (seated ? gu.seat.y : gu.y) - 78 + Math.sin(time * 3 + gu.id * 9) * 2, p = P(gu.pid), sp = gu.special, w = sp ? 96 : gu.takeaway ? 72 : 44;
      g.fillStyle = sp ? '#fff4c8' : '#fffaf0'; g.strokeStyle = '#4a3426'; g.lineWidth = 2; g.beginPath(); g.roundRect(x - 6, y - 36, w, 40, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x - 8, y + 12); g.lineTo(x + 8, y + 4); g.fill();
      if (p.kind === 'food') dish(g, x + 16, y - 6, p.dish, 0.55); else cup(g, x + 16, y - 2, p, 0.6);
      g.fillStyle = '#a8601a'; g.font = '800 11px Nunito, "Noto Sans TC", sans-serif'; g.textAlign = 'left';
      if (sp) { g.fillText('⭐ ' + sp.label.slice(0, 7), x + 32, y - 20); g.fillText(T.special('').replace(/[:：]\s*$/, '').slice(0, 6), x + 32, y - 6); }
      else if (gu.takeaway) g.fillText(T.takeaway, x + 32, y - 12);
      const k = 1 - gu.pat / this.limit(gu); g.fillStyle = k > 0.5 ? '#7ab04a' : k > 0.25 ? '#e8b040' : '#d84a3a'; g.fillRect(x - 2, y + 6, (w - 8) * Math.max(0, k), 4);
    }
    for (const c of this.crew) { const s = c.plan[0]; if (!s || !s.make || !s.begun || c.path.length) continue; const k = 1 - s.left / s.total; g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(c.x, c.y - 96, 12, 0, 7); g.fill(); g.strokeStyle = '#c8503e'; g.lineWidth = 3; g.beginPath(); g.arc(c.x, c.y - 96, 9, -1.57, -1.57 + 6.28 * k); g.stroke(); }
    for (const s of this.says) {
      const e = s.e, seated = e.seat && (e.state === 'sit' || e.state === 'wait' || e.state === 'drink'), x = seated ? e.seat.x : e.x, y = (seated ? e.seat.y : e.y) - (e === this.catE ? 34 : seated ? 72 : 80);
      say(g, x, y, s.text, Math.min(1, (s.life - s.t) * 3, s.t * 8), s.warm);
    }
  }
}
