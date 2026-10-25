// Alley Teahouse: learn each item by making it by hand, sell it, grow and decorate the shop, visit friends online.
import { PRODUCTS, ITEMS, SIZES, TABLES, DECOR, WALLS, FLOORS, UPGRADES, TX } from './data.js?v=2';
import { room, counter, street as streetArt, lights, table, chair, seats, person, cup, dish, makeLook, particles, burst, finish, SLOTS, roomH, roomW, canvasH, spotsFor, spotShown, INK } from './art.js?v=2';
import { make } from './make.js?v=2';
import { Sim } from './sim.js?v=2';
import { street, goOnline, update as netUpdate, like } from './net.js?v=1';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'teahouse.v1', GAME = 'teahouse';
const fresh = () => ({ lang: /^zh/i.test(navigator.language || '') ? 'zh' : 'en', name: '', shop: '', money: 300, rep: 0, day: 1, size: 0, tables: [{ slot: 0, type: 'wood2' }], decor: [], wall: 'cream', floor: 'plank', walls: ['cream'], floors: ['plank'], best: {}, up: { staff: 0, gear: 0, sign: 0, cat: 0 }, likes: 0, liked: {}, stats: { guests: 0, sold: 0, earned: 0 } });
const load = () => { try { const v = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); v.up = { ...fresh().up, ...v.up }; return v; } catch (e) { return fresh(); } };
let S = load();
let cloud = null;
const t = () => TX[S.lang];
const P = (id) => PRODUCTS.find((p) => p.id === id);
const menu = () => PRODUCTS.filter((p) => (S.best[p.id] || 0) >= 60);
const money = (v) => 'NT$' + Math.round(v).toLocaleString();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* full */ } if (cloud) cloud.touch(GAME, KEY); netUpdate(snapshot()); }
const ambience = (st = S) => st.tables.reduce((s, x) => s + (TABLES.find((y) => y.id === x.type)?.amb || 0), 0) + (st.decor || []).reduce((s, d) => s + (DECOR.find((y) => y.id === d.id)?.amb || 0), 0) + (st.wall !== 'cream' ? 5 : 0) + (st.floor !== 'plank' ? 4 : 0) + (st.up && st.up.cat ? 6 : 0);
const snapshot = () => ({ n: S.shop || t().defShop(S.name || '?'), owner: S.name, rep: Math.round(S.rep), money: Math.round(S.money), size: S.size, tables: S.tables, decor: S.decor, wall: S.wall, floor: S.floor, menu: menu().map((p) => p.id), day: S.day, amb: ambience(), cat: S.up.cat });

// ------------------------------------------------------------------ the day: guests, staff, money
const DAY = 150;
let day = null, fx = [], visit = null, speed = 1, lastT = 0;
// a special order: some sugar and ice their own way (only what the drink has)
function makeSpecial(p) {
  if (p.kind !== 'drink' || Math.random() > 0.16) return null;
  const has = (it) => p.steps.some((s) => s.item === it), T = t(), sw = has('sugar') ? Math.floor(Math.random() * 4) : undefined, ic = has('ice') ? Math.floor(Math.random() * 3) : undefined;
  if (sw === undefined && ic === undefined) return null;
  const parts = [sw !== undefined ? T.sweet[sw] : '', ic !== undefined ? T.iceL[ic] : ''].filter(Boolean);
  return { sweet: sw, ice: ic, label: S.lang === 'zh' ? parts.join('') : parts.join(', ') };
}
const shop = new Sim({
  st: () => S, menu: () => menu(), T: () => t(), lang: () => S.lang, best: (pid) => Math.max(60, S.best[pid] || 60), fx,
  appeal: () => Math.min(0.85, 0.3 + S.rep * 0.0007 + ambience() * 0.006 + S.up.sign * 0.06), foot: () => 0.45 + S.up.sign * 0.08 + Math.min(0.3, S.rep * 0.0003),
  staffN: () => 1 + S.up.staff, gear: () => S.up.gear, cat: () => !!S.up.cat, open: () => !!(day && day.open), special: makeSpecial,
  onEnter: () => { if (day) day.guests++; }, onServe: (g, score, byHand) => serve(g, score, byHand),
  onAngry: (g) => { S.rep = Math.max(0, S.rep - 2); pop(g.x, g.y - 90, '💢', '#a83a3a'); },
});
function newDay() { day = { t: 0, open: true, guests: 0, sold: 0, sales: 0, costs: 0, tips: 0, rep0: S.rep }; shop.reset(); hud(); }
function step(dt) {
  if (visit) { visit.sim.update(dt); return; }
  if (!day) return;
  if (day.open) { day.t += dt; if (day.t >= DAY) { day.open = false; day.closing = true; } }
  shop.update(dt);
  // after closing time the last guests finish, then the day is done
  if (day.closing && !shop.guests.some((g) => !g.gone)) { day.closing = false; setTimeout(summary, 400); }
}
// a guest gets their order: they pay for it (more for a better one), tip by the shop's ambience, and are happy
function serve(g, score, byHand) {
  const p = P(g.pid), q = 0.6 + score / 100 * 0.6, price = Math.round(p.price * q);
  let tip = Math.round(p.price * Math.max(0, (score - 55) / 200 + ambience() / 400) * (0.6 + Math.random() * 0.8));
  if (byHand) tip += Math.round(score * 0.8);
  S.money += price + tip - p.cost; S.rep += score / 80 * (byHand ? 2 : 1);
  Object.assign(day, { sold: day.sold + 1, sales: day.sales + price, costs: day.costs + p.cost, tips: day.tips + tip });
  S.stats.sold++; S.stats.earned += price + tip;
  const x = g.seat && !g.takeaway ? g.seat.x : g.x, y = g.seat && !g.takeaway ? g.seat.y : g.y;
  burst(fx, x, y - 60, byHand ? 14 : 7); pop(x, y - 92, `+${price + tip}`);
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
  const st = visit ? visit.st : S, sim = visit ? visit.sim : shop, H = canvasH(st.size), g = cv.getContext('2d'), time = now / 1000;
  if (cv.height !== H) cv.height = H;
  const view = { ...st, lang: S.lang, menu: visit ? st.menu : menu().map((p) => p.id) };
  g.clearRect(0, 0, 960, H);
  room(g, view, time); streetArt(g, view, time);
  sim.drawBehind(g, time);
  counter(g, 20, 186, time, view);
  sim.drawFront(g, time, view);
  lights(g, view, time);
  sim.drawOver(g, time);
  if (placing) for (const [i, [x, y]] of spotsFor(placing.spot).entries()) { if (!spotShown(st, placing.spot, i)) continue; const busy = S.decor.some((d) => d.spot === placing.spot && d.at === i); g.strokeStyle = busy ? '#a83a3a' : '#3a8a4a'; g.lineWidth = 3; g.setLineDash([6, 4]); g.strokeRect(x - 34, y - (placing.spot === 'ceil' ? -4 : 70), 68, 72); g.setLineDash([]); }
  particles(g, fx, Math.min(0.05, (now - (draw.last || now)) / 1000)); draw.last = now;
  finish(g, 960, H);
}

// ------------------------------------------------------------------ visiting someone else's teahouse (guests are only for show)
function startVisit(other) {
  const st = { ...other, up: { gear: 1, cat: other.cat } }, ids = other.menu && other.menu.length ? other.menu : ['melon'];
  const sim = new Sim({ st: () => st, menu: () => ids.map(P).filter(Boolean), T: () => t(), lang: () => S.lang, best: () => 85, fx, appeal: () => 0.55, foot: () => 0.5, staffN: () => 2, gear: () => 1, cat: () => !!other.cat, open: () => true, special: () => null, onEnter: () => {}, onServe: (g) => burst(fx, g.x, g.y - 60, 5), onAngry: () => {} });
  visit = { st, sim, name: other.n, id: other.id };
  const key = other.id + ':' + new Date().toDateString(), T = t();
  closeDialog(); hud(); $('visitBar').hidden = false;
  $('visitBar').innerHTML = `<b>🏮 ${T.visiting(esc(other.n))}</b> <small>${T.rep} ${other.rep} · ${T.amb} ${other.amb || 0}</small><span class="sp"></span><button class="btn hot" id="vLike" ${S.liked[key] ? 'disabled' : ''}>${S.liked[key] ? T.liked : T.like}</button><button class="btn" id="vBack">${T.back}</button>`;
  $('vLike').onclick = () => { like(other.id, S.shop || T.defShop(S.name)); S.liked[key] = 1; save(); $('vLike').disabled = true; $('vLike').textContent = T.liked; burst(fx, 480, 300, 20); };
  $('vBack').onclick = () => { visit = null; $('visitBar').hidden = true; hud(); };
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
  const g = $('tcv').getContext('2d'), demo = { size: 3, wall: 'brick', floor: 'plank', tables: [{ slot: 0, type: 'round4' }, { slot: 1, type: 'wood2' }, { slot: 2, type: 'tatami' }], decor: [{ id: 'lantern', spot: 'ceil', at: 0 }, { id: 'lantern', spot: 'ceil', at: 2 }, { id: 'scroll', spot: 'wall', at: 1 }, { id: 'umbrella', spot: 'wall', at: 3 }, { id: 'teaset', spot: 'wall', at: 2 }], menu: ['melon', 'boba', 'lemon', 'braise', 'noodle', 'tgy'], lang: S.lang };
  const tick = (now) => { if (!$('tcv')) return; const tm = now / 1000; g.save(); g.clearRect(0, 0, 960, 420); g.translate(0, 8); room(g, demo, tm); counter(g, 20, 186, tm, demo); [[0, 'round4'], [1, 'wood2']].forEach(([s, ty]) => { const [x, y] = SLOTS[s]; seats(ty, x, y).forEach(([sx, sy, dir], k) => { chair(g, sx, sy, dir, ty); person(g, sx, sy, makeLook(s * 10 + k + 3), { sit: true, face: dir === 'l' ? 1 : dir === 'r' ? -1 : 0, t: tm + k, mood: 'happy', cheer: (Math.floor(tm / 2) + k) % 5 === 0 }); }); table(g, x, y, ty); cup(g, x - 20, y - 10, PRODUCTS[1], 0.9); dish(g, x + 22, y - 4, 'noodle', 0.8); }); lights(g, demo, tm); g.restore(); finish(g, 960, 420); if (Math.random() < 0.04) burst(fx, 200 + Math.random() * 500, 120); particles(g, fx, 0.016); requestAnimationFrame(tick); };
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
  const sim = visit ? visit.sim : shop, h = sim.hit(x, y);
  if (!h) return;
  if (!visit && h.guest && shop.pendingSpecial(h.guest)) {
    const g = h.guest; shop.takeSpecial(g);
    makeDialog(P(g.pid), g.special).then((r) => { if (!r) { shop.releaseSpecial(g); return; } if (shop.handServe(g, r.score)) toast(t().bonus(Math.round(r.score * 0.8))); });
    return;
  }
  sim.poke(h);
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
  document.querySelectorAll('[data-upg]').forEach((b) => b.onclick = () => { const x = S.tables[+b.dataset.upg], k = TABLES.findIndex((y) => y.id === x.type); if (shop.guests.some((g) => g.seat && g.seat.ti === +b.dataset.upg && !g.gone)) { toast(S.lang === 'zh' ? '有客人坐著，等他們離開' : 'Someone is sitting there: wait till they leave'); return; } if (buy(TABLES[k + 1].cost)) { x.type = TABLES[k + 1].id; save(); hud(); shopDialog(); } });
  document.querySelectorAll('[data-up]').forEach((b) => b.onclick = () => { const u = UPGRADES.find((x) => x.id === b.dataset.up); if (!buy(u.cost(S.up[u.id]))) return; S.up[u.id]++; if (u.id === 'staff') save(); hud(); shopDialog(); });
}
let placing = null;
function decorDialog() {
  const T = t();
  dialog(`<h3>🎨 ${T.decor}</h3><h4>${T.walls}</h4><div class="swatches">${WALLS.map((w) => `<button class="sw ${S.wall === w.id ? 'on' : ''}" data-wall="${w.id}" style="background:${w.c}">${w[S.lang]}<small>${S.walls.includes(w.id) ? '' : money(w.cost)}</small></button>`).join('')}</div>
    <h4>${T.floors}</h4><div class="swatches">${FLOORS.map((f) => `<button class="sw ${S.floor === f.id ? 'on' : ''}" data-floor="${f.id}" style="background:${f.c}">${f[S.lang]}<small>${S.floors.includes(f.id) ? '' : money(f.cost)}</small></button>`).join('')}</div>
    <h4>${T.items}</h4><div class="cards">${DECOR.map((d) => `<div class="pc"><canvas data-dc="${d.id}" width="80" height="80"></canvas><b>${d[S.lang]}</b><small>${T.amb} +${d.amb}</small><button class="btn" data-dec="${d.id}">${money(d.cost)}</button></div>`).join('')}</div>
    ${S.decor.length ? `<div class="owned">${S.decor.map((d, i) => `<span>${DECOR.find((x) => x.id === d.id)[S.lang]} <button class="mini" data-rm="${i}">✕</button></span>`).join('')}</div>` : ''}`);
  import('./art.js?v=2').then((A) => document.querySelectorAll('[data-dc]').forEach((c) => { const g = c.getContext('2d'), d = DECOR.find((x) => x.id === c.dataset.dc); A.decor(g, d.id, 40, d.spot === 'ceil' ? 0 : d.spot === 'wall' ? 40 : 76, 0); }));
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
  try { cloud = await import('/save.js'); if (await cloud.pull(GAME, KEY)) { S = load(); start(); } } catch (e) { cloud = null; }
})();
window.TH = { get S() { return S; }, get guests() { return shop.guests; }, get day() { return day; }, shop, step, kitchen, newDay, makeDialog, startVisit, street };
