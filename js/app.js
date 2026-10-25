// Alley Teahouse: learn each item by making it by hand, sell it, grow and decorate the shop, visit friends online.
import { PRODUCTS, ITEMS, SIZES, TABLES, DECOR, WALLS, FLOORS, UPGRADES, TX, CATS } from './data.js?v=3';
import { room, counter, street as streetArt, lights, table, chair, seats, person, cup, dish, makeLook, particles, burst, finish, SLOTS, roomH, roomW, canvasH, spotsFor, spotShown, INK } from './art.js?v=3';
import { make } from './make.js?v=3';
import { Sim } from './sim.js?v=5';
import { EVENTS, shuffled } from './events.js?v=1';
import { street, goOnline, update as netUpdate, like, send, online, waiting } from './net.js?v=3';

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const KEY = 'teahouse.v1', GAME = 'teahouse';
const fresh = () => ({ lang: /^zh/i.test(navigator.language || '') ? 'zh' : 'en', name: '', shop: '', money: 300, rep: 0, day: 1, size: 0, tables: [{ slot: 0, type: 'wood2' }], decor: [], wall: 'cream', floor: 'plank', walls: ['cream'], floors: ['plank'], best: {}, up: { staff: 0, gear: 0, sign: 0, cat: 0 }, likes: 0, liked: {}, stats: { guests: 0, sold: 0, earned: 0 }, seed: Math.floor(Math.random() * 1e6), friends: {}, notes: [], baskets: [], duelWins: 0 });
const load = () => { try { const v = Object.assign(fresh(), JSON.parse(localStorage.getItem(KEY)) || {}); v.up = { ...fresh().up, ...v.up }; return v; } catch (e) { return fresh(); } };
let S = load();
let cloud = null;
const t = () => TX[S.lang];
const BYID = new Map(PRODUCTS.map((p) => [p.id, p])), P = (id) => BYID.get(id);
const menu = () => PRODUCTS.filter((p) => (S.best[p.id] || 0) >= 60);
const money = (v) => 'NT$' + Math.round(v).toLocaleString();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* full */ } if (cloud) cloud.touch(GAME, KEY); netUpdate(snapshot()); }
const ambience = (st = S) => st.tables.reduce((s, x) => s + (TABLES.find((y) => y.id === x.type)?.amb || 0), 0) + (st.decor || []).reduce((s, d) => s + (DECOR.find((y) => y.id === d.id)?.amb || 0), 0) + (st.wall !== 'cream' ? 5 : 0) + (st.floor !== 'plank' ? 4 : 0) + (st.up && st.up.cat ? 6 : 0);
const snapshot = () => ({ n: S.shop || t().defShop(S.name || '?'), owner: S.name, rep: Math.round(S.rep), money: Math.round(S.money), size: S.size, tables: S.tables, decor: S.decor, wall: S.wall, floor: S.floor, menu: menu().map((p) => p.id), day: S.day, amb: ambience(), cat: S.up.cat, seed: S.seed, learned: menu().length, perfect: Object.values(S.best).filter((v) => v >= 100).length, sold: S.stats.sold, baskets: (S.baskets || []).filter((b) => b.day >= S.day - 1) });

// ------------------------------------------------------------------ the day: guests, staff, money
const DAY = 150;
let day = null, fx = [], visit = null, speed = 1, lastT = 0;
// a special order: some sugar and ice their own way (only what the drink has)
function makeSpecial(p) {
  if (p.kind !== 'drink' || Math.random() > 0.16) return null;
  const has = (it) => p.steps.some((s) => s.item === it), T = t(), sw = has('sugar') || has('honey') ? Math.floor(Math.random() * 4) : undefined, ic = has('ice') ? Math.floor(Math.random() * 3) : undefined;
  if (sw === undefined && ic === undefined) return null;
  const parts = [sw !== undefined ? T.sweet[sw] : '', ic !== undefined ? T.iceL[ic] : ''].filter(Boolean);
  return { sweet: sw, ice: ic, label: S.lang === 'zh' ? parts.join('') : parts.join(', ') };
}
const shop = new Sim({
  st: () => S, menu: () => menu(), T: () => t(), lang: () => S.lang, best: (pid) => Math.max(60, S.best[pid] || 60), fx,
  appeal: () => Math.min(day && day.rush ? 0.95 : 0.85, 0.3 + S.rep * 0.0007 + ambience() * 0.006 + S.up.sign * 0.06 + (day && day.rush ? 0.2 : 0)), foot: () => (0.45 + S.up.sign * 0.08 + Math.min(0.3, S.rep * 0.0003)) * (day && day.rush ? day.rush.mult : 1),
  staffN: () => 1 + S.up.staff, gear: () => S.up.gear, cat: () => !!S.up.cat, open: () => !!(day && day.open), special: makeSpecial,
  onEnter: () => { if (day) day.guests++; }, onServe: (g, score, byHand) => serve(g, score, byHand),
  onAngry: (g) => { S.rep = Math.max(0, S.rep - 2); pop(g.x, g.y - 90, '💢', '#a83a3a'); },
});
function newDay() { S.baskets = (S.baskets || []).filter((b) => b.day >= S.day - 1); day = { t: 0, open: true, guests: 0, sold: 0, sales: 0, costs: 0, tips: 0, rep0: S.rep, evs: planEvents(), evDone: 0, evRep: 0, evMoney: 0, rush: null }; shop.reset(); dropCard(); hud(); }
function step(dt) {
  if (visit) { visit.sim.update(dt); return; }
  if (!day) return;
  if (day.open) { day.t += dt; if (day.t >= DAY) { day.open = false; day.closing = true; } }
  shop.update(dt); stepEvents();
  // after closing time the last guests finish, then the day is done
  if (day.closing && !shop.guests.some((g) => !g.gone)) { day.closing = false; dropCard(); setTimeout(summary, 400); }
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
  if (g.vip) vipServed(g, score, byHand); else if (g.friend && !g.self) send('served', { to: g.friend, pid: g.pid, score });
  hud();
}
function pop(x, y, text, color) { fx.push({ kind: 'text', text, color, x, y, vx: 0, vy: -30, t: 0, life: 1.4, rot: 0, spin: 0 }); }
function summary() {
  const T = t(), d = day, profit = d.sales + d.tips - d.costs, newRep = Math.round(S.rep - d.rep0);
  S.stats.guests += d.guests; S.day++; save();
  const unlocks = PRODUCTS.filter((p) => p.unlock > d.rep0 && p.unlock <= S.rep);
  dialog(`<h3>🌙 ${T.summary} · ${T.day(S.day - 1)}</h3><div class="sum"><span>${T.guests}</span><b>${d.guests}</b><span>${T.sold}</span><b>${d.sold}</b><span>${T.earned}</span><b>${money(d.sales)}</b><span>${T.tips}</span><b>${money(d.tips)}</b><span>${T.costs}</span><b>−${money(d.costs)}</b><span>${T.profit}</span><b class="hot">${money(profit)}</b><span>${T.rep}</span><b>${newRep >= 0 ? '+' : ''}${newRep}</b>${d.evDone ? `<span>📣 ${T.ev.today(d.evDone)}</span><b>⭐${d.evRep >= 0 ? '+' : ''}${d.evRep} · 💰${d.evMoney >= 0 ? '+' : ''}${d.evMoney}</b>` : ''}</div>
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
  sim.addFriend({ id: 'me', name: S.name, seed: S.seed, self: true });
  send('visit', { to: other.id, name: S.name, seed: S.seed });
  clearInterval(startVisit.ping); startVisit.ping = setInterval(() => { if (visit && visit.id === other.id) send('ping', { to: other.id, name: S.name, seed: S.seed }); }, 20000);
  const key = other.id + ':' + new Date().toDateString(), T = t();
  closeDialog(); hud(); $('visitBar').hidden = false;
  $('visitBar').innerHTML = `<b>🏮 ${T.visiting(esc(other.n))}</b> <small>${T.rep} ${other.rep} · ${T.amb} ${other.amb || 0}</small><span class="sp"></span>
    <button class="btn hot" id="vOrder">🧋 ${T.orderOne}</button><button class="btn" id="vLike" ${S.liked[key] ? 'disabled' : ''}>${S.liked[key] ? T.liked : T.like}</button><button class="btn" id="vGift">🎁</button><button class="btn" id="vNote">✍️</button><button class="btn" id="vDuel">⚔️</button><button class="btn" id="vBack">${T.back}</button>`;
  $('vLike').onclick = () => { like(other.id, S.shop || T.defShop(S.name)); S.liked[key] = 1; save(); $('vLike').disabled = true; $('vLike').textContent = T.liked; burst(fx, 480, 300, 20); };
  $('vGift').onclick = () => giftDialog(other.id); $('vNote').onclick = () => noteDialog(other.id); $('vDuel').onclick = () => challenge(other.id);
  $('vOrder').onclick = () => {
    const list = ids.map(P).filter(Boolean);
    dialog(`<h3>🧋 ${T.orderAt(esc(other.n))}</h3><div class="cards">${list.slice(0, 60).map((p) => `<div class="pc"><canvas data-oc="${p.id}" width="60" height="60"></canvas><b>${esc(p[S.lang])}</b><small>${money(p.price)}</small><button class="btn hot" data-o="${p.id}">${T.orderOne}</button></div>`).join('')}</div>`);
    document.querySelectorAll('[data-oc]').forEach((c) => { const p = P(c.dataset.oc), g = c.getContext('2d'); if (p.kind === 'food') dish(g, 30, 44, p.dish, 0.95, 0, p); else cup(g, 30, 54, p, 0.95); });
    document.querySelectorAll('[data-o]').forEach((b) => b.onclick = () => { const p = P(b.dataset.o); if (!buy(p.price)) return; sim.friendOrder('me', p.id); send('order', { to: other.id, name: S.name, pid: p.id }); save(); hud(); closeDialog(); toast(T.youOrdered(p[S.lang])); });
  };
  $('vBack').onclick = () => { send('leave', { to: other.id }); clearInterval(startVisit.ping); visit = null; $('visitBar').hidden = true; hud(); };
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
  $('menuBar').innerHTML = `<b>${T.menu} <small>${menu().length}/${PRODUCTS.length}</small></b>` + menu().map((p) => `<span class="mi">${p.kind === 'food' ? '🍜' : '🧋'} ${p[S.lang]} <small>${money(p.price)} · ${S.best[p.id]}</small></span>`).join('');
}
function canvasClick(e) {
  const cv = $('cv'), r = cv.getBoundingClientRect(), x = (e.clientX - r.left) * 960 / r.width, y = (e.clientY - r.top) * cv.height / r.height;
  // placing a decoration: the same boxes as drawn
  if (placing) { const sp = spotsFor(placing.spot); const i = sp.findIndex(([px, py]) => { const top = placing.spot === 'ceil' ? py + 4 : py - 70; return x > px - 34 && x < px + 34 && y > top && y < top + 72; }); placeAt(i); return; }
  const sim = visit ? visit.sim : shop, h = sim.hit(x, y);
  if (!h) return;
  if (!visit && h.guest && shop.pendingSpecial(h.guest)) {
    const g = h.guest; if (g.secret) toast(t().ev.found(g.name)); shop.takeSpecial(g);
    makeDialog(P(g.pid), g.special).then((r) => { if (!r) { shop.releaseSpecial(g); return; } if (shop.handServe(g, r.score) && !g.vip) toast(t().bonus(Math.round(r.score * 0.8))); });
    return;
  }
  sim.poke(h);
}

// ------------------------------------------------------------------ the kitchen: learn and improve recipes
// the kitchen: 500 recipes in their categories; search, filter, a page at a time
let kq = { cat: 'all', q: '', f: 'open', page: 0 };
function kitchen(first) {
  const T = t(), L = S.lang, learned = menu().length, PER = 24;
  const match = (p) => (kq.cat === 'all' || p.cat === kq.cat) && (!kq.q || p.zh.includes(kq.q) || p.en.toLowerCase().includes(kq.q.toLowerCase()))
    && (kq.f === 'all' || (kq.f === 'open' && S.rep >= p.unlock && (S.best[p.id] || 0) < 60) || (kq.f === 'learned' && (S.best[p.id] || 0) >= 60) || (kq.f === 'locked' && S.rep < p.unlock));
  let list = PRODUCTS.filter(match).sort((a, b) => a.unlock - b.unlock);
  const pages = Math.max(1, Math.ceil(list.length / PER)); kq.page = Math.min(kq.page, pages - 1); const shown = list.slice(kq.page * PER, kq.page * PER + PER);
  const catCount = (c) => { const all = PRODUCTS.filter((p) => c === 'all' || p.cat === c); return `${all.filter((p) => (S.best[p.id] || 0) >= 60).length}/${all.length}`; };
  dialog(`<h3>🧑‍🍳 ${T.kitchen} <small class="dim">${T.learnedOf(learned, PRODUCTS.length)}</small></h3>${first ? `<p class="hint">${T.firstHint}</p>` : ''}
    <div class="ktabs"><button class="chip ${kq.cat === 'all' ? 'on' : ''}" data-kc="all">${T.all} <small>${catCount('all')}</small></button>${CATS.map((c) => `<button class="chip ${kq.cat === c.id ? 'on' : ''}" data-kc="${c.id}">${c[L]} <small>${catCount(c.id)}</small></button>`).join('')}</div>
    <div class="kbar"><input id="kQ" placeholder="🔍 ${T.search}" value="${esc(kq.q)}"><span class="sp"></span>${['open', 'learned', 'locked', 'all'].map((f) => `<button class="chip ${kq.f === f ? 'on' : ''}" data-kf="${f}">${T.kf[f]}</button>`).join('')}</div>
    <div class="cards">${shown.map((p) => { const b = S.best[p.id] || 0, locked = S.rep < p.unlock; return `<div class="pc ${locked ? 'locked' : ''}"><canvas data-pc="${p.id}" width="70" height="70"></canvas><b>${esc(p[L])}</b><small>${money(p.price)} · ${CATS.find((c) => c.id === p.cat)[L]}</small>${locked ? `<em>🔒 ${T.locked(p.unlock)}</em>` : `<em>${b >= 60 ? (b === 100 ? '💯 ' : '✅ ') + T.best(b) : b ? T.best(b) : ''}</em><button class="btn ${b >= 60 ? '' : 'hot'}" data-mk="${p.id}">${b >= 60 ? T.retry : T.test}</button>`}</div>`; }).join('') || `<p class="dim">${T.none}</p>`}</div>
    ${pages > 1 ? `<div class="row"><button class="btn" id="kPrev" ${kq.page ? '' : 'disabled'}>◀</button><span>${kq.page + 1} / ${pages}</span><button class="btn" id="kNext" ${kq.page < pages - 1 ? '' : 'disabled'}>▶</button></div>` : ''}`);
  document.querySelectorAll('[data-pc]').forEach((c) => { const p = P(c.dataset.pc), g = c.getContext('2d'); if (p.kind === 'food') dish(g, 35, 52, p.dish, 1.1, 0, p); else cup(g, 35, 62, p, 1.1); });
  document.querySelectorAll('[data-kc]').forEach((b) => b.onclick = () => { kq.cat = b.dataset.kc; kq.page = 0; kitchen(); });
  document.querySelectorAll('[data-kf]').forEach((b) => b.onclick = () => { kq.f = b.dataset.kf; kq.page = 0; kitchen(); });
  $('kQ').oninput = (e) => { kq.q = e.target.value.trim(); kq.page = 0; clearTimeout(kitchen.tm); kitchen.tm = setTimeout(() => { kitchen(); const i = $('kQ'); if (i) { i.focus(); i.setSelectionRange(i.value.length, i.value.length); } }, 250); };
  if ($('kPrev')) $('kPrev').onclick = () => { kq.page--; kitchen(); };
  if ($('kNext')) $('kNext').onclick = () => { kq.page++; kitchen(); };
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
  import('./art.js?v=3').then((A) => document.querySelectorAll('[data-dc]').forEach((c) => { const g = c.getContext('2d'), d = DECOR.find((x) => x.id === c.dataset.dc); A.decor(g, d.id, 40, d.spot === 'ceil' ? 0 : d.spot === 'wall' ? 40 : 76, 0); }));
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

// ------------------------------------------------------------------ the day's events: take them on or let them pass
const EV_LIFE = 40;   // seconds of shop time a card waits before it goes
let evNow = null; const vipEv = {};
const EVBY = new Map(EVENTS.map((e) => [e.id, e]));
function planEvents() { const n = 3 + (Math.random() < 0.4 ? 1 : 0), out = []; for (let k = 0; k < n; k++) out.push(12 + k * (DAY - 30) / n + Math.random() * 18); return out; }
function pickEvent() {
  S.evSeen = S.evSeen || [];
  const ok = (e) => !S.evSeen.includes(e.id) && ((e.kind !== 'vip' && e.kind !== 'rush') || menu().length > 0) && !(e.kind === 'rush' && day.rush);
  let pool = EVENTS.filter(ok); if (!pool.length) { S.evSeen = []; pool = EVENTS.filter(ok); }
  // a fair mix: each kind about as often as it has events
  const e = pool[Math.floor(Math.random() * pool.length)]; S.evSeen.push(e.id); return e;
}
function stepEvents() {
  if (!day || visit) return;
  if (day.rush && day.t >= day.rush.until) { const n = day.sold - day.rush.sold0, bonus = Math.round(n * 0.8); S.rep += bonus; day.evRep += bonus; toast(t().rushDone(n, bonus)); day.rush = null; hud(); }
  if (evNow && day.t > evNow.until) dropCard();
  if (!evNow && day.open && day.evs.length && day.t >= day.evs[0] && !$('dlg').open) { day.evs.shift(); showCard(pickEvent()); }
  if (evNow && $('evBar')) $('evBar').style.width = Math.max(0, (evNow.until - day.t) / EV_LIFE * 100) + '%';
}
const PN = (pid) => (P(pid) ? P(pid)[S.lang] : pid);
function cardText(e) {
  const T = t(), L = S.lang;
  if (e.kind === 'make') return `${e.line[L]}<br>${T.ev.make(PN(e.pid), e.target, e.special ? e.special.label[L] : '')}`;
  if (e.kind === 'order') return T.ev.order(e.n, PN(e.pid), e.target);
  if (e.kind === 'vip') return e.secret ? T.ev.secret(e.who[L]) : T.ev.vip(e.who[L]);
  if (e.kind === 'rush') return T.ev.rush(e.mult);
  return e.line[L];
}
function showCard(e) {
  const T = t(), L = S.lang; evNow = { e, until: day.t + EV_LIFE };
  let el = $('evCard'); if (!el) { el = document.createElement('div'); el.id = 'evCard'; el.className = 'evc'; document.body.appendChild(el); }
  const buttons = e.kind === 'choice' ? e.opts.map((o, i) => `<button class="btn" data-eo="${i}">${o[L]}</button>`).join('')
    : e.kind === 'quiz' ? shuffled(e, S.day + e.id.length).map((i) => `<button class="btn" data-eq="${i}">${e.answers[i][L]}</button>`).join('')
    : `<button class="btn hot" id="evGo">${T.ev.go[e.kind]}</button>`;
  el.innerHTML = `<div class="evh"><span class="evi">${e.icon}</span><b>${esc(e.who[L])}</b><span class="sp"></span><small>${T.ev.kinds[e.kind]}</small></div><p>${cardText(e)}</p><div class="evb">${buttons}<button class="btn" id="evSkip">${T.ev.skip}</button></div><div class="evt"><i id="evBar"></i></div>`;
  el.hidden = false; el.classList.remove('in'); void el.offsetWidth; el.classList.add('in');
  $('evSkip').onclick = dropCard;
  if ($('evGo')) $('evGo').onclick = () => takeOn(e);
  el.querySelectorAll('[data-eo]').forEach((b) => b.onclick = () => choose(e, e.opts[+b.dataset.eo]));
  el.querySelectorAll('[data-eq]').forEach((b) => b.onclick = () => answer(e, +b.dataset.eq));
}
function dropCard() { evNow = null; const el = $('evCard'); if (el) el.hidden = true; }
function reward(rep, money, msg) { rep = Math.round(rep); money = Math.round(money); S.rep += rep; S.money += money; if (day) { day.evDone++; day.evRep += rep; day.evMoney += money; } save(); hud(); burst(fx, 480, 260, 16); toast(msg + (rep || money ? `  ${rep ? `⭐+${rep} ` : ''}${money ? `💰${money > 0 ? '+' : ''}${money}` : ''}` : '')); }
function takeOn(e) {
  const T = t(), L = S.lang; dropCard();
  if (e.kind === 'make' || e.kind === 'order') {
    const p = P(e.pid), sp = e.special ? { sweet: e.special.sweet, label: e.special.label[L] } : null;
    makeDialog(p, sp).then((r) => {
      if (!r) return;
      if (S.rep >= p.unlock && !sp) { S.best[p.id] = Math.max(S.best[p.id] || 0, r.score); }
      if (r.score >= e.target) {
        if (e.kind === 'make') reward(e.rep, e.money, T.ev.won(e.who[L], r.score));
        else { const pay = e.n * (p.price * (0.6 + r.score / 100 * 0.6) - p.cost); reward(e.n / 5, pay, T.ev.orderDone(e.who[L], e.n, PN(e.pid))); }
      } else reward(1, 0, T.ev.short(r.score, e.target));
      closeDialog();
    });
  } else if (e.kind === 'vip') {
    const pid = menu()[Math.floor(Math.random() * menu().length)].id, id = 'vip:' + e.id;
    vipEv[id] = e; const g = shop.addFriend({ id, name: e.who[L], seed: Math.floor(Math.random() * 1e6), vip: true, secret: e.secret, icon: e.secret ? '' : e.icon });
    if (g) shop.friendOrder(id, pid);
    toast(e.secret ? T.ev.secretIn : T.ev.vipIn(e.who[L], PN(pid)));
  } else if (e.kind === 'rush') { day.rush = { until: day.t + 40, mult: e.mult, sold0: day.sold }; toast(T.ev.rushOn(e.who[L])); }
}
function choose(e, o) {
  const T = t(), L = S.lang; dropCard();
  if (Math.random() < o.chance) reward(o.rep, o.money, `${e.icon} ${o.rz && L === 'zh' ? o.rz : o.re}`);
  else reward(Math.max(1, Math.round(o.rep / 2)), Math.min(0, o.money), `${e.icon} ${T.ev.meh}`);
}
function answer(e, i) {
  const T = t(), L = S.lang; dropCard();
  if (i === e.ok) reward(3, 30, `✅ ${T.ev.right} ${e.why[L]}`); else { toast(`💡 ${T.ev.wrong(e.answers[e.ok][L])} ${e.why[L]}`); if (day) day.evDone++; }
}
// a special guest was served: their verdict
function vipServed(g, score, byHand) {
  const e = vipEv[g.friend]; if (!e) return; delete vipEv[g.friend];
  const T = t(), L = S.lang, k = score / 100, rep = byHand ? e.rep * k : e.rep * k * 0.3, money = byHand ? P(g.pid).price * e.mult * k : 0;
  reward(rep, money, byHand ? T.ev.vipWin(e.who[L], score) : T.ev.vipMissed(e.who[L], score));
}

// ------------------------------------------------------------------ Tea Street: shops online, chat, rankings, guestbook, friends
let stTab = 'shops', rankBy = 'rep', unread = 0, duel = null;
const GIFTS = [{ id: 'red100', cost: 100, amt: 100, icon: '🧧' }, { id: 'red500', cost: 500, amt: 500, icon: '🧧' }, { id: 'teabox', cost: 300, icon: '🍵' }, { id: 'basket', cost: 800, icon: '💐' }];
const STICKERS = ['😀', '😂', '🧋', '🍜', '👍', '🎉', '❤️', '🙏', '😋', '🔥'];
const me = () => ({ ...snapshot(), id: street.me, me: true });
const isFriend = (id) => !!(S.friends && S.friends[id]);
function badge() { const b = document.querySelector('[data-d="street"]'); if (b) b.dataset.badge = unread > 0 ? (unread > 9 ? '9+' : unread) : ''; }
function streetDialog() {
  const T = t(), others = street.shops.filter((s) => s.id !== street.me).sort((a, b) => (isFriend(b.id) - isFriend(a.id)) || b.rep - a.rep);
  if (stTab === 'chat' || stTab === 'notes') { unread = 0; badge(); }
  const tabs = ['shops', 'chat', 'rank', 'notes', 'friends'].map((k) => `<button class="chip ${stTab === k ? 'on' : ''}" data-st="${k}">${T.stTabs[k]}${k === 'shops' ? ` <small>${others.length}</small>` : k === 'notes' && (S.notes || []).some((n) => !n.read) ? ' •' : ''}</button>`).join('');
  let body = '';
  if (stTab === 'shops') body = others.length ? others.map((s) => `<div class="line"><span>${isFriend(s.id) ? '💛 ' : '🏮 '}<b>${esc(s.n)}</b> <small>${esc(s.owner || '')} · ⭐ ${s.rep} · 🍵 ${s.learned || (s.menu || []).length} · ${SIZES[s.size || 0][S.lang]}</small></span><span class="acts"><button class="btn hot" data-vis="${s.id}">${T.visit}</button><button class="btn" data-gift="${s.id}" title="${T.gift}">🎁</button><button class="btn" data-duel="${s.id}" title="${T.duel}">⚔️</button><button class="btn" data-fr="${s.id}" title="${T.friendAdd}">${isFriend(s.id) ? '💛' : '🤍'}</button></span></div>`).join('') : `<p>${T.nobody}</p>`;
  if (stTab === 'chat') body = `<div class="chat" id="chatLog">${street.chat.slice(-60).map((m) => `<div class="${m.from === street.me ? 'mine' : ''}"><b>${esc(m.name || '?')}</b> ${esc(m.text)} <small>${new Date(m.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small></div>`).join('') || `<p class="dim">${T.chatEmpty}</p>`}</div>
    <div class="stickers">${STICKERS.map((e) => `<button class="chip" data-stk="${e}">${e}</button>`).join('')}</div><div class="kbar"><input id="chatIn" maxlength="80" placeholder="${T.chatSay}"><button class="btn hot" id="chatGo">${T.send}</button></div>`;
  if (stTab === 'rank') { const all = [...others, me()], key = { rep: (s) => s.rep, money: (s) => s.money, learned: (s) => s.learned || 0, perfect: (s) => s.perfect || 0, sold: (s) => s.sold || 0 }[rankBy]; body = `<div class="kbar">${['rep', 'money', 'learned', 'perfect', 'sold'].map((k) => `<button class="chip ${rankBy === k ? 'on' : ''}" data-rk="${k}">${T.rankBy[k]}</button>`).join('')}</div><ol class="rank">${all.sort((a, b) => key(b) - key(a)).slice(0, 20).map((s) => `<li class="${s.me ? 'me' : ''}">${esc(s.n)}${s.me ? ` (${T.you})` : ''} <small>${rankBy === 'money' ? money(key(s)) : key(s)}</small></li>`).join('')}</ol><p class="dim tiny">${T.rankNote}</p>`; }
  if (stTab === 'notes') { (S.notes || []).forEach((n) => (n.read = true)); save(); body = (S.notes || []).length ? S.notes.map((n) => `<div class="note"><b>${esc(n.from)}</b> <small>${new Date(n.t).toLocaleString()}</small><p>${esc(n.text)}</p></div>`).join('') : `<p class="dim">${T.notesEmpty}</p>`; }
  if (stTab === 'friends') { const ids = Object.keys(S.friends || {}); body = ids.length ? ids.map((id) => { const on = street.shops.find((s) => s.id === id); return `<div class="line"><span>${on ? '🟢' : '⚪'} <b>${esc(S.friends[id])}</b></span><span class="acts">${on ? `<button class="btn hot" data-vis="${id}">${T.visit}</button>` : ''}<button class="btn" data-note="${id}">✍️</button><button class="btn" data-gift="${id}">🎁</button><button class="btn" data-fr="${id}">💔</button></span></div>`; }).join('') + (waiting() ? `<p class="dim tiny">📮 ${T.outbox(waiting())}</p>` : '') : `<p class="dim">${T.friendsEmpty}</p>`; }
  dialog(`<h3>🏘️ ${T.online} <small class="dim">${street.status === 'on' ? '🟢' : '⏳ ' + T.connecting}</small></h3><div class="ktabs">${tabs}</div><div class="stBody">${body}</div>`);
  const L = $('chatLog'); if (L) L.scrollTop = 1e6;
  document.querySelectorAll('[data-st]').forEach((b) => b.onclick = () => { stTab = b.dataset.st; streetDialog(); });
  document.querySelectorAll('[data-rk]').forEach((b) => b.onclick = () => { rankBy = b.dataset.rk; streetDialog(); });
  document.querySelectorAll('[data-vis]').forEach((b) => b.onclick = () => { const s = street.shops.find((x) => x.id === b.dataset.vis); if (s) startVisit(s); });
  document.querySelectorAll('[data-gift]').forEach((b) => b.onclick = () => giftDialog(b.dataset.gift));
  document.querySelectorAll('[data-duel]').forEach((b) => b.onclick = () => challenge(b.dataset.duel));
  document.querySelectorAll('[data-note]').forEach((b) => b.onclick = () => noteDialog(b.dataset.note));
  document.querySelectorAll('[data-fr]').forEach((b) => b.onclick = () => { const id = b.dataset.fr, s = street.shops.find((x) => x.id === id); S.friends = S.friends || {}; if (S.friends[id]) delete S.friends[id]; else S.friends[id] = (s && (s.owner || s.n)) || '?'; save(); streetDialog(); });
  document.querySelectorAll('[data-stk]').forEach((b) => b.onclick = () => sayChat(b.dataset.stk));
  if ($('chatGo')) { const go = () => { const v = $('chatIn').value.trim(); if (v) { sayChat(v); } }; $('chatGo').onclick = go; $('chatIn').onkeydown = (e) => { if (e.key === 'Enter') go(); }; $('chatIn').focus(); }
}
let lastChat = 0;
function sayChat(text) { if (Date.now() - lastChat < 1500) { toast(t().slowDown); return; } lastChat = Date.now(); send('chat', { name: S.name, shop: S.shop, text: text.slice(0, 80) }); stTab = 'chat'; streetDialog(); }
const nameOf = (id) => { const s = street.shops.find((x) => x.id === id); return (s && (s.owner || s.n)) || (S.friends && S.friends[id]) || '?'; };
function giftDialog(to) {
  const T = t();
  dialog(`<h3>🎁 ${T.giftTo(esc(nameOf(to)))}</h3>${GIFTS.map((g) => `<div class="line"><span>${g.icon} <b>${T.gifts[g.id]}</b> <small>${T.giftWhat[g.id]}</small></span><button class="btn hot" data-g="${g.id}">${money(g.cost)}</button></div>`).join('')}<p class="dim tiny">${online(to) ? '' : T.giftLater}</p>`);
  document.querySelectorAll('[data-g]').forEach((b) => b.onclick = () => { const g = GIFTS.find((x) => x.id === b.dataset.g); if (!buy(g.cost)) return; const r = send('gift', { to, name: S.name, gift: g.id, amt: g.amt || 0 }, true); save(); hud(); closeDialog(); toast(r === 'queued' ? T.giftQueued : T.giftSent(T.gifts[g.id])); burst(fx, 480, 300, 14); });
}
function noteDialog(to) {
  const T = t();
  dialog(`<h3>✍️ ${T.noteTo(esc(nameOf(to)))}</h3><textarea id="noteIn" maxlength="140" rows="3" placeholder="${T.notePh}"></textarea><div class="row"><button class="big" id="noteGo">${T.send}</button></div>`);
  $('noteIn').focus();
  $('noteGo').onclick = () => { const v = $('noteIn').value.trim(); if (!v) return; const r = send('note', { to, name: S.name, text: v.slice(0, 140) }, true); closeDialog(); toast(r === 'queued' ? T.noteQueued : T.noteSent); };
}
// a recipe duel: both make the same thing, the better score wins
function challenge(to) {
  const T = t(), pool = menu().filter((p) => p.steps.length >= 5), p = pool.length ? pool[Math.floor(Math.random() * pool.length)] : P('melon');
  duel = { id: Math.random().toString(36).slice(2, 8), other: to, pid: p.id, mine: null, theirs: null, started: false };
  send('duel', { to, name: S.name, id: duel.id, pid: p.id });
  dialog(`<h3>⚔️ ${T.duel}</h3><p>${T.duelAsk(esc(nameOf(to)), esc(p[S.lang]))}</p><p class="dim">${T.duelWait}</p>`);
}
function runDuel() {
  const p = P(duel.pid), d = duel; d.started = true;
  makeDialog(p).then((r) => { d.mine = r ? r.score : 0; send('duelDone', { to: d.other, id: d.id, score: d.mine, name: S.name }); if (r) { const was = S.best[p.id] || 0; S.best[p.id] = Math.max(was, r.score); save(); } duelResult(); });
}
function duelResult() {
  const T = t(), d = duel; if (!d) return;
  if (d.mine === null) return;
  if (d.theirs === null) { dialog(`<h3>⚔️ ${T.duel}</h3><p>${T.duelYours(d.mine)}</p><p class="dim">${T.duelWaitOther(esc(nameOf(d.other)))}</p>`); return; }
  const win = d.mine > d.theirs, tie = d.mine === d.theirs;
  if (win) { S.rep += 10; S.money += 100; S.duelWins = (S.duelWins || 0) + 1; } else if (tie) { S.rep += 5; }
  save(); hud(); burst(fx, 480, 260, win ? 30 : 8);
  dialog(`<h3>⚔️ ${win ? T.duelWin : tie ? T.duelTie : T.duelLose}</h3><div class="sum"><span>${T.you}</span><b>${d.mine}</b><span>${esc(nameOf(d.other))}</span><b>${d.theirs}</b></div><p>${win ? T.duelPrize : ''}</p><div class="row"><button class="big" id="dOk">OK</button></div>`);
  $('dOk').onclick = closeDialog; duel = null;
}
// messages from other players
street.onShops = (list) => {
  const now = new Set(list.map((s) => s.id));
  for (const id of Object.keys(S.friends || {})) if (now.has(id) && !(street.seen || new Set()).has(id)) toast(t().friendOn(S.friends[id]));
  street.seen = now;
  if ($('dlg').open && $('dlgBody').querySelector('.stBody') && stTab !== 'chat') streetDialog();
};
street.on.like = (m) => { S.rep += 5; S.money += 50; S.likes++; save(); hud(); toast(t().youGotLike(m.name || '?')); burst(fx, 480, 260, 26); };
street.on.chat = () => { if ($('dlg').open && $('chatLog')) streetDialog(); else { unread++; badge(); } };
street.on.visit = (m) => { if (visit) return; shop.addFriend({ id: m.from, name: m.name || '?', seed: m.seed }); toast(t().friendIn(m.name || '?')); };
street.on.ping = (m) => { if (!visit && !shop.friend(m.from)) shop.addFriend({ id: m.from, name: m.name || '?', seed: m.seed }); const g = shop.friend(m.from); if (g) g.pingT = Date.now(); };
street.on.leave = (m) => { shop.friendLeave(m.from); };
street.on.order = (m) => { if (shop.friendOrder(m.from, m.pid)) toast(t().friendOrdered(m.name || '?', P(m.pid)[S.lang])); };
street.on.served = (m) => { if (visit && visit.id === m.from) { visit.sim.friendServed('me', m.score); toast(t().servedYou(visit.name, P(m.pid)[S.lang], m.score)); } };
street.on.gift = (m) => {
  const T = t();
  if (m.gift === 'red100' || m.gift === 'red500') S.money += m.amt;
  if (m.gift === 'teabox') S.rep += 5;
  if (m.gift === 'basket') { S.rep += 3; S.baskets = [...(S.baskets || []), { from: m.name || '?', day: S.day }].slice(-8); }
  save(); hud(); toast(T.gotGift(m.name || '?', T.gifts[m.gift])); burst(fx, 480, 300, 30);
};
street.on.note = (m) => { S.notes = [{ from: m.name || '?', text: String(m.text || '').slice(0, 140), t: m.t || Date.now() }, ...(S.notes || [])].slice(0, 40); save(); unread++; badge(); toast(t().gotNote(m.name || '?')); };
street.on.duel = (m) => {
  const T = t(), p = P(m.pid); if (!p) return;
  dialog(`<h3>⚔️ ${T.duel}</h3><p>${T.duelFrom(esc(m.name || '?'), esc(p[S.lang]))}</p><div class="row"><button class="btn" id="dNo">${T.no}</button><button class="big" id="dYes">${T.yes}</button></div>`);
  $('dNo').onclick = () => { send('duelNo', { to: m.from, id: m.id }); closeDialog(); };
  $('dYes').onclick = () => { duel = { id: m.id, other: m.from, pid: m.pid, mine: null, theirs: null }; send('duelOk', { to: m.from, id: m.id }); runDuel(); };
};
street.on.duelOk = (m) => { if (duel && duel.id === m.id && !duel.started) runDuel(); };
street.on.duelNo = (m) => { if (duel && duel.id === m.id) { duel = null; dialog(`<h3>⚔️</h3><p>${t().duelDeclined}</p>`); } };
street.on.duelDone = (m) => { if (duel && duel.id === m.id) { duel.theirs = m.score; if (duel.mine !== null) duelResult(); } };
// friends who stopped pinging have gone home
setInterval(() => { for (const g of shop.guests) if (g.friend && !g.self && g.pingT && Date.now() - g.pingT > 70000) shop.friendLeave(g.friend); }, 10000);

// ------------------------------------------------------------------ small things
function dialog(html) { $('dlg').classList.remove('wide'); $('dlgBody').innerHTML = html; if (!$('dlg').open) $('dlg').showModal(); }
function closeDialog() { if ($('dlg').open) $('dlg').close(); }
$('dlgX').onclick = closeDialog;
function toast(msg) { const n = document.querySelectorAll('.toast').length, d = document.createElement('div'); d.className = 'toast'; d.style.top = 62 + n * 42 + 'px'; d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), msg.length > 30 ? 4200 : 2600); }
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
window.TH = { get S() { return S; }, get guests() { return shop.guests; }, get day() { return day; }, get visit() { return visit; }, shop, step, kitchen, newDay, makeDialog, startVisit, streetDialog, street, send, get evNow() { return evNow; }, showEvent: (id) => showCard(EVBY.get(id)) };
