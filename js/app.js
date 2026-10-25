// Alley Teahouse: learn each item by making it by hand, sell it, grow and decorate the shop, visit friends online.
import { PRODUCTS, ITEMS, SIZES, TABLES, DECOR, WALLS, FLOORS, UPGRADES, TX } from './data.js?v=1';
import { room, counter, floorDecor, table, seats, person, staff, cup, dish, teapot, makeLook, particles, burst, finish, SLOTS, roomH, roomW, spotsFor, hash, INK } from './art.js?v=1';
import { make } from './make.js?v=1';
import { street, goOnline, update as netUpdate, like } from './net.js?v=1';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'teahouse.v1', GAME = 'teahouse';
const fresh = () => ({ lang: /^zh/i.test(navigator.language || '') ? 'zh' : 'en', name: '', shop: '', money: 300, rep: 0, day: 1, size: 0, tables: [{ slot: 0, type: 'wood2' }], decor: [], wall: 'cream', floor: 'plank', walls: ['cream'], floors: ['plank'], best: {}, up: { staff: 0, gear: 0, sign: 0 }, likes: 0, liked: {}, stats: { guests: 0, sold: 0, earned: 0 } });
let S = (() => { try { return Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); } catch (e) { return fresh(); } })();
let cloud = null;
const t = () => TX[S.lang];
const P = (id) => PRODUCTS.find((p) => p.id === id);
const menu = () => PRODUCTS.filter((p) => (S.best[p.id] || 0) >= 60);
const money = (v) => 'NT$' + Math.round(v).toLocaleString();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* full */ } if (cloud) cloud.touch(GAME, KEY); netUpdate(snapshot()); }
const ambience = (st = S) => st.tables.reduce((s, x) => s + (TABLES.find((y) => y.id === x.type)?.amb || 0), 0) + (st.decor || []).reduce((s, d) => s + (DECOR.find((y) => y.id === d.id)?.amb || 0), 0) + (st.wall !== 'cream' ? 5 : 0) + (st.floor !== 'plank' ? 4 : 0);
const snapshot = () => ({ n: S.shop || t().defShop(S.name || '?'), owner: S.name, rep: Math.round(S.rep), money: Math.round(S.money), size: S.size, tables: S.tables, decor: S.decor, wall: S.wall, floor: S.floor, menu: menu().map((p) => p.id), day: S.day, amb: ambience() });

// ------------------------------------------------------------------ the day: guests, staff, money
const DAY = 150;
let day = null, guests = [], crew = [], fx = [], visit = null, speed = 1, lastT = 0, view = { k: 1, ox: 0, oy: 0 };
function newDay() {
  day = { t: 0, open: true, guests: 0, sold: 0, sales: 0, costs: 0, tips: 0, rep0: S.rep };
  guests = []; crew = Array.from({ length: 1 + S.up.staff }, (_, k) => ({ k, state: 'idle', x: 70 + k * 46, y: 198, job: null, t: 0 }));
  hud();
}
function seatList(st = S) { const out = []; st.tables.forEach((tb, ti) => { const [x, y] = SLOTS[tb.slot]; seats(tb.type, x, y).forEach(([sx, sy], si) => out.push({ ti, si, x: sx, y: sy, tx: x, ty: y })); }); return out; }
const DOOR = [75, 200];
function spawn() {
  const free = seatList().filter((s) => !guests.some((g) => g.seat && g.seat.ti === s.ti && g.seat.si === s.si));
  if (!free.length || !menu().length) return;
  const seat = free[Math.floor(Math.random() * free.length)], m = menu(), p = m[Math.floor(Math.random() * m.length)];
  // now and then a guest wants it their own way
  const special = p.kind === 'drink' && Math.random() < 0.16 ? (() => { const sw = Math.floor(Math.random() * 4), ic = Math.floor(Math.random() * 3); return { sweet: sw, ice: ic, label: S.lang === 'zh' ? t().sweet[sw] + t().iceL[ic] : `${t().sweet[sw]}, ${t().iceL[ic]}` }; })() : null;
  guests.push({ id: Math.random(), look: makeLook(Math.floor(Math.random() * 1e6)), seat, p: p.id, special, state: 'walk', x: DOOR[0], y: DOOR[1], wait: 0, eat: 0, served: false, mood: 'wait' });
  day.guests++;
}
function step(dt) {
  if (visit) { stepVisit(dt); return; }
  if (!day) return;
  if (day.open) {
    day.t += dt;
    const rate = 0.05 + Math.min(0.25, S.rep * 0.0004) + ambience() * 0.002 + S.up.sign * 0.025;
    if (Math.random() < rate * dt * 4) spawn();
    if (day.t >= DAY) { day.open = false; setTimeout(summary, 400); }
  }
  for (const g of guests) {
    if (g.state === 'walk' || g.state === 'leave') {
      const tx = g.state === 'walk' ? g.seat.x : DOOR[0], ty = g.state === 'walk' ? g.seat.y : DOOR[1] - 30;
      const dx = tx - g.x, dy = ty - g.y, d = Math.hypot(dx, dy), sp = 120 * dt;
      if (d < sp) { g.x = tx; g.y = ty; if (g.state === 'walk') { g.state = 'order'; } else g.gone = true; }
      else { g.x += (dx / d) * sp; g.y += (dy / d) * sp; }
    } else if (g.state === 'order') { g.wait += dt; if (g.wait > (g.special ? 40 : 28)) { g.state = 'leave'; g.mood = 'sad'; S.rep = Math.max(0, S.rep - 2); pop(g.x, g.y - 70, '💢', '#a83a3a'); } }
    else if (g.state === 'drink') { g.eat += dt; if (g.eat > 9) { g.state = 'leave'; g.mood = 'happy'; } }
  }
  guests = guests.filter((g) => !g.gone);
  // staff: take the oldest order (special orders wait a little for you, then the staff make them as usual)
  for (const c of crew) {
    if (c.state === 'idle') {
      const g = guests.filter((x) => x.state === 'order' && !x.taken && (!x.special || x.wait > 14)).sort((a, b) => b.wait - a.wait)[0];
      if (g) { g.taken = true; c.job = g; c.state = 'make'; c.t = 5.5 / (1 + S.up.gear * 0.3); }
    } else if (c.state === 'make') { c.t -= dt; if (c.t <= 0) { c.state = 'carry'; } }
    else if (c.state === 'carry' || c.state === 'back') {
      const g = c.job, tx = c.state === 'carry' ? (g ? g.seat.x + (g.seat.x < g.seat.tx ? 30 : -30) : 90) : 70 + c.k * 46, ty = c.state === 'carry' ? (g ? g.seat.y + 30 : 198) : 198;
      const dx = tx - c.x, dy = ty - c.y, d = Math.hypot(dx, dy), sp = 160 * dt;
      if (d < sp) { c.x = tx; c.y = ty; if (c.state === 'carry') { if (g && g.state === 'order') serve(g, S.best[g.p] || 60, false); c.state = 'back'; } else { c.state = 'idle'; c.job = null; } }
      else { c.x += (dx / d) * sp; c.y += (dy / d) * sp; }
    }
  }
}
// a guest gets their order: they pay for it (more for a better one), tip by the shop's ambience, and are happy
function serve(g, score, byHand) {
  const p = P(g.p), q = 0.6 + score / 100 * 0.6, price = Math.round(p.price * q);
  let tip = Math.round(p.price * Math.max(0, (score - 55) / 200 + ambience() / 400) * (0.6 + Math.random() * 0.8));
  if (byHand) tip += Math.round(score * 0.8);
  g.state = 'drink'; g.served = true; g.mood = 'happy'; g.score = score;
  S.money += price + tip - p.cost; S.rep += score / 80 * (byHand ? 2 : 1);
  Object.assign(day, { sold: day.sold + 1, sales: day.sales + price, costs: day.costs + p.cost, tips: day.tips + tip });
  S.stats.sold++; S.stats.earned += price + tip;
  burst(fx, g.x, g.y - 60, byHand ? 14 : 7); pop(g.x, g.y - 80, `+${price + tip}`);
  hud();
}
function pop(x, y, text, color) { fx.push({ kind: 'text', text, color, x, y, vx: 0, vy: -30, t: 0, life: 1.4, rot: 0, spin: 0 }); }
function summary() {
  const T = t(), d = day, profit = d.sales + d.tips - d.costs, newRep = Math.round(S.rep - d.rep0);
  S.stats.guests += d.guests; S.day++; save();
  const unlocks = PRODUCTS.filter((p) => p.unlock > d.rep0 && p.unlock <= S.rep);
  dialog(`<h3>🌙 ${T.summary} · ${T.day(S.day - 1)}</h3><div class="sum"><span>${T.guests}</span><b>${d.guests}</b><span>${T.sold}</span><b>${d.sold}</b><span>${T.earned}</span><b>${money(d.sales)}</b><span>${T.tips}</span><b>${money(d.tips)}</b><span>${T.costs}</span><b>−${money(d.costs)}</b><span>${T.profit}</span><b class="hot">${money(profit)}</b><span>${T.rep}</span><b>${newRep >= 0 ? '+' : ''}${newRep}</b></div>
    ${unlocks.map((p) => `<p class="new">✨ ${T.unlockedNew(p[S.lang])}</p>`).join('')}<div class="row"><button class="big" id="dNext">☀️ ${T.nextDay}</button></div>`);
  $('dNext').onclick = () => { closeDialog(); newDay(); toast(T.newDay); };
}

// ------------------------------------------------------------------ drawing the shop (mine, or the one I'm visiting)
function draw(now) {
  const cv = $('cv'); if (!cv) return;
  const st = visit ? visit.st : S, H = roomH(st.size), g = cv.getContext('2d'), time = now / 1000;
  if (cv.height !== H) cv.height = H;
  g.clearRect(0, 0, 960, H);
  room(g, { ...st, lang: S.lang }, time);
  const people = visit ? visit.guests : guests, workers = visit ? visit.crew : crew;
  // staff behind the counter, then the counter
  for (const c of workers) if (c.state === 'idle' || c.state === 'make') staff(g, c.x, c.y, c.k, { t: time, sit: true, mood: c.state === 'make' ? 'wait' : 'happy' });
  counter(g, 20, 186, time, st);
  for (const c of workers) if (c.state === 'make') { g.fillStyle = 'rgba(255,255,255,0.8)'; g.beginPath(); g.arc(c.x, c.y - 92, 12, 0, 7); g.fill(); g.strokeStyle = '#c8503e'; g.lineWidth = 3; g.beginPath(); g.arc(c.x, c.y - 92, 9, -1.57, -1.57 + 6.28 * (1 - c.t / (5.5 / (1 + (st.up ? st.up.gear : 0) * 0.3)))); g.stroke(); }
  // everything else, back to front
  const items = [];
  st.tables.forEach((tb, ti) => { const [x, y] = SLOTS[tb.slot]; items.push({ y, f: () => { table(g, x, y, tb.type); for (const gu of people) if (gu.seat && gu.seat.ti === ti && (gu.state === 'drink' || gu.served)) { const cx = gu.seat.x + (x - gu.seat.x) * 0.45, cy = y - (tb.type === 'round4' ? 6 : tb.type === 'tatami' ? -2 : -12); const p = P(gu.p); if (p.kind === 'food') dish(g, cx, cy, p.dish, 0.9); else cup(g, cx, cy, p, 0.9, Math.max(0.25, 1 - gu.eat / 10)); } if (tb.type !== 'wood2') teapot(g, x + 18, y - 4, 0.8); } }); });
  for (const gu of people) items.push({ y: gu.y + (gu.state === 'walk' || gu.state === 'leave' ? 30 : -1), f: () => { person(g, gu.x, gu.y, gu.look, { sit: gu.state === 'order' || gu.state === 'drink', walk: gu.state === 'walk' || gu.state === 'leave', t: time + gu.id * 9, mood: gu.state === 'drink' ? 'happy' : gu.mood, cheer: gu.state === 'drink' && gu.eat < 1.2 }); if (gu.state === 'order') bubble(g, gu, time); } });
  for (const c of workers) if (c.state === 'carry' || c.state === 'back') items.push({ y: c.y + 30, f: () => { staff(g, c.x, c.y, c.k, { walk: true, t: time }); if (c.state === 'carry' && c.job) { const p = P(c.job.p); if (p.kind === 'food') dish(g, c.x + 18, c.y - 4, p.dish, 0.7); else cup(g, c.x + 18, c.y - 2, p, 0.7); } } });
  items.sort((a, b) => a.y - b.y).forEach((it) => it.f());
  floorDecor(g, st, time);
  if (placing) for (const [i, [x, y]] of spotsFor(placing.spot).entries()) { if (x > roomW(st.size) - 20 || y > roomH(st.size)) continue; const busy = S.decor.some((d) => d.spot === placing.spot && d.at === i); g.strokeStyle = busy ? '#a83a3a' : '#3a8a4a'; g.lineWidth = 3; g.setLineDash([6, 4]); g.strokeRect(x - 34, y - (placing.spot === 'ceil' ? -4 : 70), 68, 72); g.setLineDash([]); }
  particles(g, fx, Math.min(0.05, (now - (draw.last || now)) / 1000)); draw.last = now;
  finish(g, 960, H);
}
function bubble(g, gu, time) {
  const x = gu.x + 22, y = gu.y - 82 + Math.sin(time * 3 + gu.id) * 2, p = P(gu.p), w = gu.special ? 92 : 44;
  g.fillStyle = gu.special ? '#fff4c8' : '#fffaf0'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.roundRect(x - 6, y - 36, w, 40, 10); g.fill(); g.stroke(); g.beginPath(); g.moveTo(x, y + 4); g.lineTo(x - 8, y + 12); g.lineTo(x + 8, y + 4); g.fill();
  if (p.kind === 'food') dish(g, x + 16, y - 6, p.dish, 0.55); else cup(g, x + 16, y - 2, p, 0.6);
  if (gu.special) { g.fillStyle = '#a8601a'; g.font = '800 12px Nunito, "Noto Sans TC", sans-serif'; g.textAlign = 'left'; g.fillText('⭐', x + 32, y - 20); g.fillText(gu.special.label.slice(0, 6), x + 32, y - 4); }
  // patience
  const k = 1 - gu.wait / (gu.special ? 40 : 28); g.fillStyle = k > 0.5 ? '#7ab04a' : k > 0.25 ? '#e8b040' : '#d84a3a'; g.fillRect(x - 2, y + 6, (w - 8) * Math.max(0, k), 4);
}

// ------------------------------------------------------------------ visiting someone else's teahouse (guests are only for show)
function startVisit(shop) {
  visit = { st: { ...shop, up: { gear: 1 } }, guests: [], crew: [{ k: 0, state: 'idle', x: 70, y: 198 }], name: shop.n, id: shop.id, t: 0 };
  closeDialog(); hud(); $('visitBar').hidden = false;
  $('visitBar').innerHTML = `<b>🏮 ${t().visiting(esc(shop.n))}</b> <small>${t().rep} ${shop.rep} · ${t().amb} ${shop.amb || 0}</small><span class="sp"></span><button class="btn hot" id="vLike" ${S.liked[shop.id + ':' + new Date().toDateString()] ? 'disabled' : ''}>${S.liked[shop.id + ':' + new Date().toDateString()] ? t().liked : t().like}</button><button class="btn" id="vBack">${t().back}</button>`;
  $('vLike').onclick = () => { like(shop.id, S.shop || t().defShop(S.name)); S.liked[shop.id + ':' + new Date().toDateString()] = 1; save(); $('vLike').disabled = true; $('vLike').textContent = t().liked; burst(fx, 480, 300, 20); };
  $('vBack').onclick = () => { visit = null; $('visitBar').hidden = true; hud(); };
}
function stepVisit(dt) {
  const v = visit, menuIds = v.st.menu && v.st.menu.length ? v.st.menu : ['melon'];
  v.t += dt;
  if (Math.random() < dt * 0.5) { const free = seatList(v.st).filter((s) => !v.guests.some((g) => g.seat.ti === s.ti && g.seat.si === s.si)); if (free.length) v.guests.push({ id: Math.random(), look: makeLook(Math.floor(Math.random() * 1e6)), seat: free[Math.floor(Math.random() * free.length)], p: menuIds[Math.floor(Math.random() * menuIds.length)], state: 'walk', x: DOOR[0], y: DOOR[1], wait: 0, eat: 0, mood: 'wait' }); }
  for (const g of v.guests) {
    if (g.state === 'walk' || g.state === 'leave') { const tx = g.state === 'walk' ? g.seat.x : DOOR[0], ty = g.state === 'walk' ? g.seat.y : DOOR[1] - 30, dx = tx - g.x, dy = ty - g.y, d = Math.hypot(dx, dy), sp = 120 * dt; if (d < sp) { g.x = tx; g.y = ty; if (g.state === 'walk') g.state = 'order'; else g.gone = true; } else { g.x += dx / d * sp; g.y += dy / d * sp; } }
    else if (g.state === 'order') { g.wait += dt; if (g.wait > 3) { g.state = 'drink'; g.served = true; g.mood = 'happy'; burst(fx, g.x, g.y - 60, 5); } }
    else if (g.state === 'drink') { g.eat += dt; if (g.eat > 8) g.state = 'leave'; }
  }
  v.guests = v.guests.filter((g) => !g.gone);
}

// ------------------------------------------------------------------ the screens
function start() {
  const T = t();
  document.documentElement.lang = S.lang === 'zh' ? 'zh-Hant' : 'en';
  if (!S.name) { titleScreen(); return; }
  $('app').innerHTML = `<header class="top"><b class="shopName">🏮 ${esc(S.shop || T.defShop(S.name))}</b><span class="pill" id="hDay"></span><span class="pill" id="hMoney"></span><span class="pill" id="hRep"></span><span class="pill" id="hAmb"></span>
      <span class="sp"></span><button class="btn" data-d="kitchen">🧑‍🍳 ${T.kitchen}</button><button class="btn" data-d="shop">🔨 ${T.shop}</button><button class="btn" data-d="decor">🎨 ${T.decor}</button><button class="btn" data-d="street">🏘️ ${T.street}</button><button class="btn" id="hSpeed">⏩ ×1</button><button class="btn" id="hHelp">❓</button><button class="btn" id="hLang">${T.lang}</button></header>
    <div class="visitBar" id="visitBar" hidden></div>
    <main class="stage"><canvas id="cv" width="960" height="600"></canvas><div class="dayBar"><i id="hProg"></i></div></main>
    <footer class="menuBar" id="menuBar"></footer>`;
  document.querySelectorAll('[data-d]').forEach((b) => b.onclick = () => ({ kitchen, shop: shopDialog, decor: decorDialog, street: streetDialog })[b.dataset.d]());
  $('hSpeed').onclick = () => { speed = speed === 1 ? 2 : speed === 2 ? 3 : 1; $('hSpeed').textContent = '⏩ ×' + speed; };
  $('hHelp').onclick = () => dialog(`<h3>❓</h3><p class="help">${T.help}</p>`);
  $('hLang').onclick = () => { S.lang = S.lang === 'zh' ? 'en' : 'zh'; save(); start(); };
  $('cv').onclick = canvasClick;
  if (!day) newDay(); hud();
  goOnline(snapshot());
  // the very first time: learn the first drink before opening
  if (!menu().length) setTimeout(() => kitchen(true), 500);
}
function titleScreen() {
  const T = t();
  $('app').innerHTML = `<div class="title"><canvas id="tcv" width="960" height="420"></canvas><div class="tbox"><h1>${T.title}</h1><p class="sub">${T.sub}</p><p>${T.tag}</p>
    <input id="tName" maxlength="10" placeholder="${T.name}"><input id="tShop" maxlength="14" placeholder="${T.shopName}"><button class="big" id="tGo">🍵 ${T.play}</button><button class="btn" id="tLang">${T.lang}</button></div></div>`;
  $('tGo').onclick = () => { const n = $('tName').value.trim(); if (!n) { $('tName').focus(); return; } S.name = n; S.shop = $('tShop').value.trim() || T.defShop(n); save(); start(); };
  $('tLang').onclick = () => { S.lang = S.lang === 'zh' ? 'en' : 'zh'; save(); titleScreen(); };
  // a busy little scene on the title screen
  const g = $('tcv').getContext('2d'), demo = { size: 3, wall: 'brick', floor: 'plank', tables: [{ slot: 0, type: 'round4' }, { slot: 1, type: 'wood2' }, { slot: 2, type: 'tatami' }], decor: [{ id: 'lantern', spot: 'ceil', at: 0 }, { id: 'lantern', spot: 'ceil', at: 2 }, { id: 'scroll', spot: 'wall', at: 1 }, { id: 'plant', spot: 'floor', at: 1 }, { id: 'umbrella', spot: 'wall', at: 3 }], lang: S.lang };
  const tick = (now) => { if (!$('tcv')) return; const tm = now / 1000; g.save(); g.scale(1, 1); g.clearRect(0, 0, 960, 420); g.translate(0, 8); room(g, demo, tm); counter(g, 20, 186, tm, demo); [[0, 'round4'], [1, 'wood2']].forEach(([s, ty]) => { const [x, y] = SLOTS[s]; seats(ty, x, y).forEach(([sx, sy], k) => person(g, sx, sy, makeLook(s * 10 + k + 3), { sit: true, t: tm + k, mood: 'happy', cheer: (Math.floor(tm / 2) + k) % 5 === 0 })); table(g, x, y, ty); cup(g, x - 20, y - 10, PRODUCTS[1], 0.9); dish(g, x + 22, y - 4, 'noodle', 0.8); }); g.restore(); finish(g, 960, 420); if (Math.random() < 0.04) burst(fx, 200 + Math.random() * 500, 120); particles(g, fx, 0.016); requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
}
function hud() {
  if (!$('hDay')) return; const T = t();
  $('hDay').textContent = '📅 ' + T.day(S.day) + (day && !day.open ? ' · ' + T.closed : '');
  $('hMoney').textContent = '💰 ' + money(S.money); $('hRep').textContent = '⭐ ' + Math.round(S.rep); $('hAmb').textContent = '🏮 ' + ambience();
  $('menuBar').innerHTML = `<b>${T.menu}</b>` + PRODUCTS.map((p) => { const b = S.best[p.id] || 0; return b >= 60 ? `<span class="mi">${p.kind === 'food' ? '🍜' : '🧋'} ${p[S.lang]} <small>${money(p.price)} · ${b}</small></span>` : ''; }).join('') || '';
}
function canvasClick(e) {
  const cv = $('cv'), r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 960 / r.width, y = (e.clientY - r.top) * cv.height / r.height;
  // placing a decoration: the same boxes as drawn
  if (placing) { const sp = spotsFor(placing.spot); const i = sp.findIndex(([px, py]) => { const top = placing.spot === 'ceil' ? py + 4 : py - 70; return x > px - 34 && x < px + 34 && y > top && y < top + 72; }); placeAt(i); return; }
  if (visit) return;
  // a special order: make it yourself for a big tip
  const g = guests.find((gu) => gu.state === 'order' && gu.special && !gu.taken && Math.abs(gu.x + 40 - x) < 60 && Math.abs(gu.y - 60 - y) < 60);
  if (g) { g.taken = true; makeDialog(P(g.p), g.special).then((r) => { if (!r) { g.taken = false; return; } if (g.state === 'order') { serve(g, r.score, true); toast(t().bonus(Math.round(r.score * 0.8))); } }); }
}

// ------------------------------------------------------------------ the kitchen: learn and improve recipes
function kitchen(first) {
  const T = t();
  dialog(`<h3>🧑‍🍳 ${T.kitchen}</h3>${first ? `<p class="hint">${S.lang === 'zh' ? '開店前，先親手做出一杯及格的飲料！從冬瓜茶開始吧。' : 'Before you open, make your first drink by hand and pass! Start with winter melon tea.'}</p>` : ''}
    <div class="cards">${PRODUCTS.map((p) => { const b = S.best[p.id] || 0, locked = S.rep < p.unlock; return `<div class="pc ${locked ? 'locked' : ''}"><canvas data-pc="${p.id}" width="70" height="70"></canvas><b>${p[S.lang]}</b><small>${money(p.price)}</small>${locked ? `<em>🔒 ${T.locked(p.unlock)}</em>` : `<em>${b >= 60 ? '✅ ' + T.learned + ' · ' + T.best(b) : b ? T.best(b) : ''}</em><button class="btn ${b >= 60 ? '' : 'hot'}" data-mk="${p.id}">${b >= 60 ? T.retry : T.test}</button>`}</div>`; }).join('')}</div>`);
  document.querySelectorAll('[data-pc]').forEach((c) => { const p = P(c.dataset.pc), g = c.getContext('2d'); if (p.kind === 'food') dish(g, 35, 52, p.dish, 1.1); else cup(g, 35, 62, p, 1.1); });
  document.querySelectorAll('[data-mk]').forEach((b) => b.onclick = () => { const p = P(b.dataset.mk); makeDialog(p).then((r) => { if (!r) { kitchen(); return; } const was = S.best[p.id] || 0; S.best[p.id] = Math.max(was, r.score); save(); hud(); result(p, r, was); }); });
}
function makeDialog(p, special) {
  return new Promise((ok) => {
    const d = $('dlg'); d.classList.add('wide'); $('dlgBody').innerHTML = '<div id="mkHost"></div>'; if (!d.open) d.showModal();
    let settled = false;
    const close = () => { if (!settled) { settled = true; d.classList.remove('wide'); ok(null); } };
    d.addEventListener('close', close, { once: true });
    make($('mkHost'), p, t(), S.lang, special).then((r) => { if (settled) return; settled = true; d.removeEventListener('close', close); d.classList.remove('wide'); if (r) { if (special) closeDialog(); ok(r); } else ok(null); });
  });
}
function result(p, r, was) {
  const T = t(), pass = r.score >= 60;
  dialog(`<h3>${pass ? '🎉' : '😣'} ${p[S.lang]} · ${r.score} ${S.lang === 'zh' ? '分' : ''}</h3><div class="grade ${pass ? 'ok' : 'bad'}">${T.grade(r.score)}</div><ul class="msgs">${r.msgs.map((m) => `<li>${esc(m)}</li>`).join('')}</ul>
    <p>${pass ? (was < 60 ? T.pass : T.best(Math.max(was, r.score))) : T.fail}</p><div class="row"><button class="btn" id="rAgain">${T.retry}</button><button class="big" id="rOk">${S.lang === 'zh' ? '好' : 'OK'}</button></div>`);
  if (pass) burst(fx, 480, 260, 24);
  $('rAgain').onclick = () => makeDialog(p).then((r2) => { if (!r2) { kitchen(); return; } const w = S.best[p.id] || 0; S.best[p.id] = Math.max(w, r2.score); save(); hud(); result(p, r2, w); });
  $('rOk').onclick = () => { closeDialog(); if (!menu().length || !pass) kitchen(); };
}

// ------------------------------------------------------------------ growing the shop
function buy(cost) { if (S.money < cost) { toast(t().noMoney); return false; } S.money -= cost; return true; }
function shopDialog() {
  const T = t(), nextSize = SIZES[S.size + 1], slots = SIZES[S.size].tables, used = S.tables.length;
  dialog(`<h3>🔨 ${T.shop}</h3>
    <h4>${T.size}: ${SIZES[S.size][S.lang]} (${used}/${slots} ${T.tables})</h4>${nextSize ? `<div class="line"><span>${T.expand} → ${nextSize[S.lang]} (${nextSize.tables} ${T.tables})</span><button class="btn hot" id="sSize">${money(nextSize.cost)}</button></div>` : ''}
    <h4>${T.tables}</h4>${TABLES.map((tb) => `<div class="line"><span>${tb[S.lang]} · ${T.seats(tb.seats)} · ${T.amb} +${tb.amb}</span><button class="btn" data-tb="${tb.id}" ${used >= slots ? 'disabled' : ''}>${money(tb.cost)}</button></div>`).join('')}
    <div class="owned">${S.tables.map((x, i) => `<span>${TABLES.find((y) => y.id === x.type)[S.lang]} ${TABLES.findIndex((y) => y.id === x.type) < TABLES.length - 1 ? `<button class="mini" data-upg="${i}">⬆ ${money(TABLES[TABLES.findIndex((y) => y.id === x.type) + 1].cost)}</button>` : ''}</span>`).join('')}</div>
    <h4>${T.upgrades}</h4>${UPGRADES.map((u) => { const n = S.up[u.id]; return `<div class="line"><span>${u[S.lang]} · ${T.level(n)}</span>${n < u.max ? `<button class="btn" data-up="${u.id}">${money(u.cost(n))}</button>` : '✅'}</div>`; }).join('')}`);
  if ($('sSize')) $('sSize').onclick = () => { if (buy(nextSize.cost)) { S.size++; save(); hud(); shopDialog(); burst(fx, 480, 300, 20); } };
  document.querySelectorAll('[data-tb]').forEach((b) => b.onclick = () => { const tb = TABLES.find((x) => x.id === b.dataset.tb), slot = [...Array(slots).keys()].find((s) => !S.tables.some((x) => x.slot === s)); if (slot === undefined || !buy(tb.cost)) return; S.tables.push({ slot, type: tb.id }); save(); hud(); shopDialog(); });
  document.querySelectorAll('[data-upg]').forEach((b) => b.onclick = () => { const x = S.tables[+b.dataset.upg], k = TABLES.findIndex((y) => y.id === x.type); if (guests.some((g) => g.seat && g.seat.ti === +b.dataset.upg)) { toast(S.lang === 'zh' ? '有客人坐著，等他們離開' : 'Someone is sitting there: wait till they leave'); return; } if (buy(TABLES[k + 1].cost)) { x.type = TABLES[k + 1].id; save(); hud(); shopDialog(); } });
  document.querySelectorAll('[data-up]').forEach((b) => b.onclick = () => { const u = UPGRADES.find((x) => x.id === b.dataset.up); if (!buy(u.cost(S.up[u.id]))) return; S.up[u.id]++; if (u.id === 'staff') crew.push({ k: crew.length, state: 'idle', x: 70 + crew.length * 46, y: 198, job: null }); save(); hud(); shopDialog(); });
}
let placing = null;
function decorDialog() {
  const T = t();
  dialog(`<h3>🎨 ${T.decor}</h3><h4>${T.walls}</h4><div class="swatches">${WALLS.map((w) => `<button class="sw ${S.wall === w.id ? 'on' : ''}" data-wall="${w.id}" style="background:${w.c}">${w[S.lang]}<small>${S.walls.includes(w.id) ? '' : money(w.cost)}</small></button>`).join('')}</div>
    <h4>${T.floors}</h4><div class="swatches">${FLOORS.map((f) => `<button class="sw ${S.floor === f.id ? 'on' : ''}" data-floor="${f.id}" style="background:${f.c}">${f[S.lang]}<small>${S.floors.includes(f.id) ? '' : money(f.cost)}</small></button>`).join('')}</div>
    <h4>${T.items}</h4><div class="cards">${DECOR.map((d) => `<div class="pc"><canvas data-dc="${d.id}" width="80" height="80"></canvas><b>${d[S.lang]}</b><small>${T.amb} +${d.amb}</small><button class="btn" data-dec="${d.id}">${money(d.cost)}</button></div>`).join('')}</div>
    ${S.decor.length ? `<div class="owned">${S.decor.map((d, i) => `<span>${DECOR.find((x) => x.id === d.id)[S.lang]} <button class="mini" data-rm="${i}">✕</button></span>`).join('')}</div>` : ''}`);
  import('./art.js?v=1').then((A) => document.querySelectorAll('[data-dc]').forEach((c) => { const g = c.getContext('2d'), d = DECOR.find((x) => x.id === c.dataset.dc); A.decor(g, d.id, 40, d.spot === 'ceil' ? 0 : d.spot === 'wall' ? 40 : 76, 0); }));
  document.querySelectorAll('[data-wall]').forEach((b) => b.onclick = () => { const w = WALLS.find((x) => x.id === b.dataset.wall); if (!S.walls.includes(w.id)) { if (!buy(w.cost)) return; S.walls.push(w.id); } S.wall = w.id; save(); hud(); decorDialog(); });
  document.querySelectorAll('[data-floor]').forEach((b) => b.onclick = () => { const f = FLOORS.find((x) => x.id === b.dataset.floor); if (!S.floors.includes(f.id)) { if (!buy(f.cost)) return; S.floors.push(f.id); } S.floor = f.id; save(); hud(); decorDialog(); });
  document.querySelectorAll('[data-dec]').forEach((b) => b.onclick = () => { const d = DECOR.find((x) => x.id === b.dataset.dec); if (S.money < d.cost) { toast(T.noMoney); return; } placing = d; closeDialog(); toast(S.lang === 'zh' ? '點一個綠色框框放上去' : 'Tap a green box to put it there'); });
  document.querySelectorAll('[data-rm]').forEach((b) => b.onclick = () => { S.decor.splice(+b.dataset.rm, 1); save(); hud(); decorDialog(); });
}
function placeAt(i) {
  const d = placing; if (!d) return;
  if (i < 0 || S.decor.some((x) => x.spot === d.spot && x.at === i)) { placing = null; return; }
  if (buy(d.cost)) { S.decor.push({ id: d.id, spot: d.spot, at: i }); burst(fx, spotsFor(d.spot)[i][0], spotsFor(d.spot)[i][1] + 20, 12); save(); hud(); }
  placing = null;
}

// ------------------------------------------------------------------ Tea Street
function streetDialog() {
  const T = t(), others = street.shops.filter((s) => s.id !== street.me), all = [...street.shops.filter((s) => s.id !== street.me), { ...snapshot(), id: street.me, me: true }].sort((a, b) => b.rep - a.rep);
  dialog(`<h3>🏘️ ${T.online}</h3><p class="dim">${street.status === 'on' ? '🟢' : '⏳ ' + T.connecting}</p>
    ${others.length ? `<div class="shops">${others.map((s) => `<div class="line"><span>🏮 <b>${esc(s.n)}</b> <small>${esc(s.owner || '')} · ⭐ ${s.rep} · ${SIZES[s.size || 0][S.lang]} · 🏮 ${s.amb || 0}</small></span><button class="btn hot" data-vis="${s.id}">${T.visit}</button></div>`).join('')}</div>` : `<p>${T.nobody}</p>`}
    <h4>🏆 ${T.rank}</h4><ol class="rank">${all.slice(0, 10).map((s) => `<li class="${s.me ? 'me' : ''}">${esc(s.n)}${s.me ? ` (${T.you})` : ''} <small>⭐ ${s.rep} · ${money(s.money)}</small></li>`).join('')}</ol>`);
  document.querySelectorAll('[data-vis]').forEach((b) => b.onclick = () => startVisit(street.shops.find((s) => s.id === b.dataset.vis)));
}
street.onShops = () => { if ($('dlg').open && $('dlgBody').querySelector('.rank')) streetDialog(); };
street.onLike = (m) => { S.rep += 5; S.money += 50; S.likes++; save(); hud(); toast(t().youGotLike(m.from || '?')); burst(fx, 480, 260, 26); };

// ------------------------------------------------------------------ small things
function dialog(html) { $('dlg').classList.remove('wide'); $('dlgBody').innerHTML = html; if (!$('dlg').open) $('dlg').showModal(); }
function closeDialog() { if ($('dlg').open) $('dlg').close(); }
$('dlgX').onclick = closeDialog;
function toast(msg) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.05, (now - (lastT || now)) / 1000); lastT = now;
  if ($('cv')) { for (let k = 0; k < speed; k++) step(dt); draw(now); if (day && $('hProg')) $('hProg').style.width = Math.min(100, day.t / DAY * 100) + '%'; if (Math.random() < 0.02) hud(); }
}
requestAnimationFrame(loop);
setInterval(() => { if (S.name) save(); }, 30000);

(async () => {
  start();
  try { cloud = await import('/save.js'); if (await cloud.pull(GAME, KEY)) { S = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); start(); } } catch (e) { cloud = null; }
})();
window.TH = { get S() { return S; }, get guests() { return guests; }, get day() { return day; }, step, kitchen, serve, newDay, makeDialog, startVisit, street };
