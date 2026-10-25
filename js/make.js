// The counter: make one drink or dish by hand, the way a tea shop really does. Take the leaves, heat the water to the
// right temperature (hold the kettle, let go at the number), brew for the right minutes, strain, add syrup by the pump,
// pour to the line in ml, ice by the scoop, shake, seal. Every action is written down, then judged against the recipe:
// the right thing, the right amount, in the right order (steps in one box may go any way round), nothing extra.
import { ITEMS } from './data.js?v=2';
import { cup, INK } from './art.js?v=2';

const SWEET = [0, 0.3, 0.5, 0.7, 1], ICE = [0, 0.3, 0.7, 1];
export const SHELVES = {
  drink: { leaf: ['black', 'green', 'oolong'], jar: ['pearl', 'bpearl', 'sugar', 'ice', 'lemon', 'passion', 'taro'], pour: ['tea', 'milk', 'creamer', 'melon', 'cold'], do: ['strain', 'swirl', 'smear'] },
  food: { leaf: ['noodle', 'braise'], jar: ['tofu', 'kelp', 'egg', 'sesame', 'soy', 'vinegar', 'garlic', 'cucumber', 'scallion'], pour: ['juice'], do: ['drain', 'cut', 'toss'] },
};
const CUP = 700, HEAT_RATE = 15, ROOM_T = 25;
const steepMax = (s) => Math.max(5, (s ? s.min : 8) * 1.6);
const r1 = (v) => Math.round(v * 10) / 10;

// the recipe for this order (a special order changes the sugar and the ice; a step that becomes zero goes away)
export function recipeFor(p, special) {
  const out = []; let headGone = false;
  for (const s0 of p.steps) {
    const s = { ...s0 };
    if (special && s.kind === 'scoop') {
      if (s.item === 'sugar' && special.sweet !== undefined) s.n = Math.round(s.n * SWEET[special.sweet]);
      if (s.item === 'ice' && special.ice !== undefined) s.n = Math.round(s.n * ICE[special.ice]);
      if (s.n === 0) { if (!s.w) headGone = true; continue; }
    }
    if (s.w && headGone) s.w = 0;   // the first step of a box went away: the next one starts the box
    headGone = false; out.push(s);
  }
  return out;
}
// a step's match in the actions: the same kind and item (any shake is a shake)
// the steps that make or break it count for more: the water, the time, the hand steps
const WEIGHT = { heat: 2, steep: 2, do: 1.5, pick: 1.5, pour: 1.5, scoop: 1, shake: 1, serve: 0.5 };
const same = (st, a) => a.kind === st.kind && (st.kind === 'shake' || a.item === st.item);
// judge a list of actions against a recipe: a score from 0 to 100 and what went wrong, in words a cook would use
export function judge(recipe, acts, T, lang, kind = 'drink') {
  const nm = (it) => (ITEMS[it] ? ITEMS[it][lang] : it), un = (it) => (ITEMS[it] && ITEMS[it].unit ? ITEMS[it].unit[lang] : ''), J = T.judge, msgs = [], used = new Set();
  let total = 0, weight = 0, penalty = 0, prevMax = -1, allMax = -1;
  const near = (v, t, tol) => { const e = Math.abs(v - t); return e <= tol * 0.35 ? 1 : Math.max(0, 1 - (e - tol * 0.35) / (tol * 2.2)); };
  recipe.forEach((st, si) => {
    if (si > 0 && !st.w) prevMax = allMax;   // a new box: everything matched so far must come before it
    const w = WEIGHT[st.kind] || 1; weight += w;
    if (st.kind === 'serve') { total += w; return; }
    if (st.kind === 'shake' && st.n === 0) { const sh = acts.findIndex((a) => a.kind === 'shake'); if (sh >= 0) { used.add(sh); msgs.push(J.shook); } else total += w; return; }
    const k = acts.findIndex((a, i) => !used.has(i) && same(st, a));
    if (k < 0) {
      if (st.kind === 'pick') { const wrong = acts.findIndex((a, i) => !used.has(i) && a.kind === 'pick'); if (wrong >= 0) { used.add(wrong); msgs.push(J.wrongItem(nm(st.item), nm(acts[wrong].item))); return; } }
      penalty += 10; msgs.push(J.missing(st.kind === 'shake' ? T.tools.shake : st.kind === 'heat' ? T.d.heat(st.target) : nm(st.item), ITEMS[st.item] && ITEMS[st.item].why ? ITEMS[st.item].why[lang] : '')); return;
    }
    used.add(k); const a = acts[k]; let s = 1;
    if (st.kind === 'heat') { s = near(a.v, st.target, st.tol); if (s < 0.95) msgs.push(a.v > st.target ? J.hot(Math.round(a.v), st.target) : st.target >= 100 && kind === 'food' ? J.boil(Math.round(a.v)) : J.cool(Math.round(a.v), st.target)); }
    else if (st.kind === 'steep') {
      s = near(a.v, st.min, st.tol);
      if (s < 0.95) { const v = r1(a.v), hi = a.v > st.min; msgs.push(st.item === 'noodle' ? (hi ? J.mushy(v, st.min) : J.raw(v, st.min)) : st.item === 'braise' ? (hi ? J.salty(v, st.min) : J.coldFood(v, st.min)) : hi ? J.bitter(v, st.min) : J.weak(v, st.min)); }
    } else if (st.kind === 'pour') { s = near(a.v, st.ml, st.tol); if (s < 0.95) msgs.push(a.v > st.ml ? J.pourMore(nm(st.item), Math.round(a.v), st.ml) : J.pourLess(nm(st.item), Math.round(a.v), st.ml)); }
    else if (st.kind === 'scoop') { const d = Math.abs(a.n - st.n); s = [1, 0.6, 0.25][d] ?? 0; if (d) msgs.push(a.n > st.n ? J.scoopMore(nm(st.item), a.n, st.n, un(st.item)) : J.scoopLess(nm(st.item), a.n, st.n, un(st.item))); }
    else if (st.kind === 'shake') { s = Math.max(0, 1 - Math.abs(a.n - st.n) / Math.max(4, st.n * 0.8)); if (s < 0.9) msgs.push(a.n > st.n ? J.shakeMore(a.n, st.n) : J.shakeLess(a.n, st.n)); }
    if (k < prevMax) { s *= 0.7; if (!msgs.includes(J.order)) msgs.push(J.order); }
    allMax = Math.max(allMax, k); total += s * w;
  });
  acts.forEach((a, i) => { if (!used.has(i) && a.kind !== 'serve') { penalty += 8; msgs.push(J.extra(a.kind === 'shake' ? T.tools.shake : a.kind === 'heat' ? T.tools.heat : nm(a.item))); } });
  const score = Math.max(0, Math.min(100, Math.round((total / weight) * 100 - penalty)));
  if (!msgs.length) msgs.push(J.perfect);
  return { score, msgs };
}
// a step in words
export function describe(s, T, lang, food) {
  const n = ITEMS[s.item] ? ITEMS[s.item][lang] : '';
  if (s.kind === 'pick') return T.d.pick(n);
  if (s.kind === 'heat') return T.d.heat(s.target);
  if (s.kind === 'steep') return s.item === 'noodle' ? T.d.noodle(s.min) : s.item === 'braise' ? T.d.braise(s.min) : T.d.brew(s.min);
  if (s.kind === 'scoop') return T.d.scoop(n, s.n, ITEMS[s.item].unit ? ITEMS[s.item].unit[lang] : '');
  if (s.kind === 'pour') return T.d.pour(n, s.ml);
  if (s.kind === 'do') return n;
  if (s.kind === 'shake') return s.n ? T.d.shake(s.n) : T.d.noShake;
  return food ? T.tools.serveFood : T.tools.serve;
}

// colour helpers for what is in the cup
const rgb = (h) => { const v = parseInt(h.slice(1), 16); return [(v >> 16) & 255, (v >> 8) & 255, v & 255]; };
const hex = ([r, g, b]) => '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
export const mix = (parts) => { const tot = parts.reduce((s, p) => s + p[1], 0) || 1; const c = [0, 0, 0]; parts.forEach(([h, w]) => rgb(h).forEach((v, i) => (c[i] += v * w / tot))); return hex(c); };

// the counter screen; resolves with { score, msgs } when served, or null if closed
export function make(host, p, T, lang, special) {
  const recipe = recipeFor(p, special), food = p.kind === 'food', K = food ? 'food' : 'drink', SH = SHELVES[K];
  const groups = []; recipe.forEach((s, i) => { if (i === 0 || !s.w) groups.push([]); groups[groups.length - 1].push(s); });
  const toolBtn = (attr, it) => `<button class="tool" ${attr}="${it}"><i style="background:${ITEMS[it].color}"></i>${ITEMS[it][lang]}</button>`;
  return new Promise((done) => {
    let acts = [], hold = null, raf = 0, shakeT = 0, closed = false, note = null, meter = null;
    const fresh = () => ({ base: null, temp: ROOM_T, brewed: 0, strained: false, vol: 0, pours: [], pourStart: {}, scoops: {}, did: {}, shakes: 0, drained: false });
    let st = fresh();
    host.innerHTML = `<div class="mk"><div class="mkCard"><h4>📜 ${T.recipe} · ${p[lang]}${special ? `<small>${special.label}</small>` : ''}</h4>
        <p class="about">${p.about ? p.about[lang] : ''}</p>
        <ol class="steps">${groups.map((gr) => `<div class="grp ${gr.length > 1 ? 'multi' : ''}">${gr.map((s) => `<li>${describe(s, T, lang, food)}${s.note ? `<small>💡 ${s.note[lang]}</small>` : ''}</li>`).join('')}</div>`).join('')}</ol>
        ${groups.some((gr) => gr.length > 1) ? `<p class="dim tiny">▯ ${T.anyOrder}</p>` : ''}
        <h4>✍️ ${T.youDid}</h4><ol id="mkLog" class="log"></ol></div>
      <div class="mkMid"><canvas id="mkCv" width="340" height="320"></canvas></div>
      <div class="mkTools"><div class="shelf"><h5>🫙 ${T.tools.pick}</h5>${SH.leaf.map((b) => toolBtn('data-pick', b)).join('')}</div>
        <div class="shelf"><h5>🔥 ${T.tools.heat} · ⏱ ${food ? T.tools.cook : T.tools.steep}</h5><button class="tool big" id="mkHeat">🫖 ${T.hold} · ${T.tools.heat}</button><button class="tool big" id="mkSteep">⏱ ${T.hold} · ${food ? T.tools.cook : T.tools.steep}</button></div>
        <div class="shelf"><h5>🥄 ${T.tools.scoop}</h5>${SH.jar.map((b) => toolBtn('data-scoop', b)).join('')}</div>
        <div class="shelf"><h5>🫗 ${T.tools.pour} (${T.hold})</h5>${SH.pour.map((b) => toolBtn('data-pour', b)).join('')}</div>
        <div class="shelf"><h5>✋ ${T.tools.do}</h5>${SH.do.map((b) => toolBtn('data-do', b)).join('')}</div>
        <div class="shelf row2">${food ? '' : `<button class="tool big" id="mkShake">🥤 ${T.tools.shake} <b id="mkShN">0</b></button>`}<button class="tool" id="mkReset">🗑️ ${T.reset}</button><button class="tool serve" id="mkServe">✅ ${food ? T.tools.serveFood : T.tools.serve}</button></div></div></div>`;
    const $ = (id) => host.querySelector('#' + id), cv = $('mkCv'), g = cv.getContext('2d');
    const say = (text) => { note = { text, t: 1.8 }; };
    const actText = (a) => a.kind === 'shake' ? T.d.shake(a.n) : a.kind === 'pick' ? T.d.pick(ITEMS[a.item][lang]) : a.kind === 'heat' ? T.d.heat(Math.round(a.v)) : a.kind === 'steep' ? describe({ kind: 'steep', item: a.item, min: r1(a.v) }, T, lang, food) : a.kind === 'scoop' ? T.d.scoop(ITEMS[a.item][lang], a.n, ITEMS[a.item].unit ? ITEMS[a.item].unit[lang] : '') : a.kind === 'pour' ? T.d.pour(ITEMS[a.item][lang], Math.round(a.v)) : ITEMS[a.item][lang];
    const log = () => { $('mkLog').innerHTML = acts.map((a) => `<li>${actText(a)}</li>`).join(''); $('mkLog').scrollTop = 1e6; };
    // runs of the same thing count as one action: scoops add up, a second hold of the kettle carries on heating,
    // more brewing carries on brewing, topping up a pour adds to it
    const act = (a) => {
      const l = acts[acts.length - 1];
      if (l && l.kind === a.kind && (a.kind === 'shake' || l.item === a.item) && a.kind !== 'pick' && a.kind !== 'do') { if (a.kind === 'scoop' || a.kind === 'shake') l.n++; else if (a.kind === 'pour') l.v += a.v; else l.v = a.v; }
      else acts.push(a);
      log();
    };
    host.querySelectorAll('[data-pick]').forEach((b) => b.onclick = () => { st.base = b.dataset.pick; st.brewed = 0; st.strained = false; act({ kind: 'pick', item: st.base }); });
    host.querySelectorAll('[data-scoop]').forEach((b) => b.onclick = () => { const it = b.dataset.scoop, I = ITEMS[it]; if (!food && st.vol + (I.vol || 0) > CUP) { say(T.full); return; } st.scoops[it] = (st.scoops[it] || 0) + 1; st.vol += I.vol || 0; act({ kind: 'scoop', item: it, n: 1 }); b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 150); });
    host.querySelectorAll('[data-do]').forEach((b) => b.onclick = () => { const it = b.dataset.do; if (it === 'strain') st.strained = true; if (it === 'drain') st.drained = true; st.did[it] = true; act({ kind: 'do', item: it }); b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 150); });
    // holding: the kettle heats, the brew or the pot counts the minutes, a pour fills the cup
    const startHold = (kind, item) => {
      if (hold) return;
      if (kind === 'steep' && !st.base) { say(T.needBase); return; }
      if (kind === 'pour' && item === 'tea' && !(st.base && ITEMS[st.base].brew && st.brewed > 0.3)) { say(T.needTea); return; }
      if (kind === 'pour' && item === 'juice' && st.base !== 'braise') { say(T.needPot); return; }
      if (kind === 'pour' && st.pourStart[item] === undefined) st.pourStart[item] = st.vol;
      hold = { kind, item: kind === 'heat' ? 'water' : kind === 'steep' ? st.base : item, v: 0 };
      meter = kind === 'heat' || kind === 'steep' ? { kind, t: 0 } : null;
    };
    const endHold = () => {
      if (!hold) return; const h = hold; hold = null; if (meter) meter.t = 1.4;
      if (h.kind === 'heat') act({ kind: 'heat', item: 'water', v: Math.round(st.temp) });
      else if (h.kind === 'steep') act({ kind: 'steep', item: h.item, v: st.brewed });
      else if (h.v > 0) { st.pours.push([h.item, h.v]); act({ kind: 'pour', item: h.item, v: h.v }); }
    };
    const hookHold = (el, kind, item) => { el.onpointerdown = (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('down'); startHold(kind, item); }; const up = () => { el.classList.remove('down'); endHold(); }; el.onpointerup = up; el.onpointercancel = up; };
    hookHold($('mkHeat'), 'heat'); hookHold($('mkSteep'), 'steep');
    host.querySelectorAll('[data-pour]').forEach((b) => hookHold(b, 'pour', b.dataset.pour));
    if ($('mkShake')) $('mkShake').onclick = () => { st.shakes++; shakeT = 0.25; $('mkShN').textContent = st.shakes; act({ kind: 'shake', n: 1 }); };
    $('mkReset').onclick = () => { acts = []; st = fresh(); if ($('mkShN')) $('mkShN').textContent = 0; log(); };
    $('mkServe').onclick = () => { closed = true; cancelAnimationFrame(raf); done(judge(recipe, acts, T, lang, K)); };

    // the line to pour to: where this item should bring the cup up to
    const pourLine = () => {
      const it = hold && hold.kind === 'pour' ? hold.item : (recipe.find((s) => s.kind === 'pour' && st.pourStart[s.item] === undefined) || {}).item;
      const s = recipe.find((x) => x.kind === 'pour' && x.item === it); if (!s) return null;
      return { item: it, at: (st.pourStart[it] ?? st.vol) + s.ml, ml: s.ml };
    };
    const tStep = recipe.find((s) => s.kind === 'heat'), sStep = recipe.find((s) => s.kind === 'steep');
    let last = performance.now();
    const frame = (now) => {
      if (closed || !cv.isConnected) { if (!closed) done(null); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (hold) {
        if (hold.kind === 'heat') st.temp = Math.min(100, st.temp + HEAT_RATE * dt);
        else if (hold.kind === 'steep') st.brewed += dt * steepMax(sStep) / 4;
        else { const add = ITEMS[hold.item].rate * dt; if (food || st.vol + add <= CUP) { st.vol += food ? 0 : add; hold.v += add; } else say(T.full); }
      } else if (st.temp > ROOM_T) st.temp = Math.max(ROOM_T, st.temp - dt * 0.4);   // the kettle cools, slowly
      if (meter && !hold) { meter.t -= dt; if (meter.t <= 0) meter = null; }
      if (note) { note.t -= dt; if (note.t <= 0) note = null; }
      draw(now / 1000, dt);
      raf = requestAnimationFrame(frame);
    };
    function draw(time, dt) {
      const W = 340, H = 320;
      g.clearRect(0, 0, W, H); g.fillStyle = '#ead6ae'; g.fillRect(0, 0, W, H); g.fillStyle = '#c8a070'; g.fillRect(0, 0, W, 8);
      g.fillStyle = '#b07a48'; g.fillRect(0, 250, W, 70); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 250); g.lineTo(W, 250); g.stroke();
      g.strokeStyle = 'rgba(80,40,10,0.25)'; g.lineWidth = 1; for (let y = 262; y < H; y += 14) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
      const sx = shakeT > 0 ? Math.sin(time * 50) * 8 : 0; shakeT = Math.max(0, shakeT - dt);
      kettle(g, 52, 120, st.temp, time, hold && hold.kind === 'heat');
      pot(g, 70, 244, time);
      if (food) bowl(g, 230 + sx, 244, time); else drinkCup(g, 232 + sx, 246);
      // the meters: temperature or minutes, with the green zone
      if (meter) {
        const heat = meter.kind === 'heat', v = heat ? st.temp : st.brewed, lo = heat ? ROOM_T : 0, hi = heat ? 100 : steepMax(sStep), tgt = heat ? tStep : sStep;
        const x = 128, y0 = 40, h = 190, f = (q) => y0 + h - ((Math.max(lo, Math.min(hi, q)) - lo) / (hi - lo)) * h;
        g.fillStyle = '#fffaf0'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.roundRect(x, y0, 22, h, 11); g.fill(); g.stroke();
        if (tgt) { const a = heat ? tgt.target : tgt.min, tol = tgt.tol; g.fillStyle = 'rgba(90,160,70,0.55)'; g.fillRect(x + 2, f(a + tol), 18, f(a - tol) - f(a + tol)); }
        g.fillStyle = heat ? '#d8503a' : '#b07040'; const yy = f(v); g.beginPath(); g.roundRect(x + 4, yy, 14, Math.max(2, y0 + h - yy - 2), 6); g.fill();
        g.fillStyle = INK; g.font = '800 15px Nunito, "Noto Sans TC", sans-serif'; g.textAlign = 'center'; g.fillText(heat ? `${Math.round(v)}°C` : `${r1(v).toFixed(1)} ${T.unitMin}`, x + 11, y0 - 8);
      }
      if (!food) { g.fillStyle = INK; g.font = '800 14px Nunito, sans-serif'; g.textAlign = 'right'; g.fillText(`${Math.round(st.vol)} / ${CUP} ml`, W - 10, 26); }
      if (note) { g.globalAlpha = Math.min(1, note.t * 2); g.fillStyle = '#fff4c8'; g.strokeStyle = INK; g.lineWidth = 2; g.font = '800 14px Nunito, "Noto Sans TC", sans-serif'; const w = g.measureText(note.text).width + 24; g.beginPath(); g.roundRect(W / 2 - w / 2, 280, w, 30, 10); g.fill(); g.stroke(); g.fillStyle = '#a83a2a'; g.textAlign = 'center'; g.fillText(note.text, W / 2, 300); g.globalAlpha = 1; }
    }
    function kettle(g, x, y, temp, time, on) {
      // a stove ring, an old enamel kettle, steam as it gets hot, a dial thermometer
      g.fillStyle = '#5a5a60'; g.fillRect(x - 34, y + 28, 68, 8);
      if (on) { g.fillStyle = 'rgba(80,140,255,0.7)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x - 25 + k * 10, y + 26, 3, 5 + Math.sin(time * 30 + k) * 1.5, 0, 0, 7); g.fill(); } }
      g.beginPath(); g.moveTo(x - 30, y + 26); g.quadraticCurveTo(x - 36, y - 18, x, y - 22); g.quadraticCurveTo(x + 36, y - 18, x + 30, y + 26); g.closePath(); g.fillStyle = '#e8e0d0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      g.beginPath(); g.moveTo(x + 26, y); g.quadraticCurveTo(x + 46, y - 6, x + 50, y - 24); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.lineWidth = 3.5; g.strokeStyle = '#e8e0d0'; g.stroke();
      g.beginPath(); g.arc(x, y - 24, 20, Math.PI * 1.1, Math.PI * 1.9); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
      g.fillStyle = '#c83a2a'; g.beginPath(); g.ellipse(x, y - 22, 8, 3, 0, 0, 7); g.fill();
      const k = (temp - ROOM_T) / (100 - ROOM_T);
      for (let i = 0; i < 4; i++) { if (k < 0.3) break; const ph = (time * (0.5 + k) + i / 4) % 1; g.fillStyle = `rgba(255,255,255,${0.6 * k * (1 - ph)})`; g.beginPath(); g.ellipse(x + 52 + Math.sin(ph * 6 + i) * 5, y - 28 - ph * 46, 5 + ph * 8, 4 + ph * 5, 0, 0, 7); g.fill(); }
      g.fillStyle = '#fffaf0'; g.strokeStyle = INK; g.lineWidth = 1.5; g.beginPath(); g.arc(x - 8, y + 4, 11, 0, 7); g.fill(); g.stroke();
      const a = Math.PI * 0.75 + k * Math.PI * 1.5; g.strokeStyle = '#c83a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 8, y + 4); g.lineTo(x - 8 + Math.cos(a) * 8, y + 4 + Math.sin(a) * 8); g.stroke();
      g.fillStyle = INK; g.font = '800 11px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText(`${Math.round(temp)}°`, x - 8, y + 30);
    }
    function pot(g, x, y, time) {
      if (!st.base) { g.fillStyle = 'rgba(60,40,20,0.25)'; g.beginPath(); g.ellipse(x, y, 34, 7, 0, 0, 7); g.fill(); return; }
      const I = ITEMS[st.base];
      if (I.brew) {
        // a glass brewing pot: leaves swirling, the tea darkening with the minutes, leaves gone once strained
        const k = Math.min(1, st.brewed / 9), col = mix([['#f0f4f4', 1 - k], [I.brew, k + 0.05]]);
        g.save(); g.beginPath(); g.ellipse(x, y - 30, 34, 32, 0, 0, 7); g.clip(); g.fillStyle = 'rgba(230,245,250,0.5)'; g.fillRect(x - 40, y - 70, 80, 80);
        if (st.temp > 40 || st.brewed > 0) { g.fillStyle = col; g.fillRect(x - 40, y - 46, 80, 60); }
        if (!st.strained) { g.fillStyle = I.color; for (let i = 0; i < 14; i++) { const a = time * (st.brewed > 0 ? 1.2 : 0.2) + i * 2.1; g.beginPath(); g.ellipse(x + Math.cos(a) * 18 * (i % 3 + 1) / 3, y - 12 - (i % 4) * 7 + Math.sin(a * 1.3) * 3, 4, 2, a, 0, 7); g.fill(); } }
        g.restore(); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y - 30, 34, 32, 0, 0, 7); g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(x - 24, y - 50, 5, 30); g.strokeStyle = INK; g.beginPath(); g.moveTo(x + 32, y - 40); g.lineTo(x + 46, y - 52); g.stroke();
        if (st.strained) { g.fillStyle = '#5a8a4a'; g.font = '800 13px Nunito, sans-serif'; g.textAlign = 'center'; g.fillText('✓', x, y - 66); }
        return;
      }
      // a steel pot on the fire: noodles in boiling water, or the braising pot with the pieces in it
      g.fillStyle = '#6a6a70'; g.fillRect(x - 36, y - 2, 72, 6);
      g.beginPath(); g.moveTo(x - 36, y - 50); g.lineTo(x + 36, y - 50); g.lineTo(x + 32, y); g.lineTo(x - 32, y); g.closePath(); g.fillStyle = '#b8b8c0'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      g.fillStyle = st.base === 'braise' ? '#4a2214' : 'rgba(200,225,235,0.95)'; g.beginPath(); g.ellipse(x, y - 50, 36, 8, 0, 0, 7); g.fill(); g.stroke();
      if (st.base === 'braise') { let k = 0; ['tofu', 'kelp', 'egg'].forEach((it) => { for (let i = 0; i < (st.scoops[it] || 0) && !st.did.cut; i++, k++) { g.fillStyle = ITEMS[it].color; g.beginPath(); g.ellipse(x - 24 + (k % 5) * 12, y - 51 + (k % 2) * 3, it === 'egg' ? 6 : 5, 4, 0, 0, 7); g.fill(); } }); }
      else if (!st.drained) { g.strokeStyle = '#f0dc9a'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(x - 18 + i * 7, y - 50, 6, 3.4, 5.9); g.stroke(); } }
      const boil = st.base === 'braise' ? st.brewed > 0 : st.temp >= 96;
      if (boil || (hold && hold.kind === 'steep')) { g.fillStyle = 'rgba(255,255,255,0.6)'; for (let i = 0; i < 5; i++) { const ph = (time * 1.4 + i / 5) % 1; g.beginPath(); g.arc(x - 24 + i * 12, y - 56 - ph * 30, 3 + ph * 6, 0, 7); g.globalAlpha = 1 - ph; g.fill(); } g.globalAlpha = 1; }
    }
    function drinkCup(g, x, y) {
      // what is in it: poured layers (unshaken, they sit in the order poured), one colour once shaken
      const parts = st.pours.slice(); if (hold && hold.kind === 'pour' && hold.v > 0) parts.push([hold.item, hold.v]);
      const colOf = (it) => (it === 'tea' && st.base && ITEMS[st.base].brew ? mix([[ITEMS[st.base].brew, Math.min(1, st.brewed / 8) + 0.2], ['#f0f0e8', Math.max(0, 1 - st.brewed / 8)]]) : it === 'cold' ? '#dcecf0' : ITEMS[it].color);
      let layers;
      if (st.shakes > 0 && parts.length) layers = [mix(parts.map(([it, v]) => [colOf(it), v * (it === 'cold' ? 0.4 : it === 'creamer' ? 3 : 1)]))];
      else layers = parts.length ? parts.map(([it]) => colOf(it)).reverse() : ['rgba(0,0,0,0)'];
      const fill = Math.min(1, st.vol / CUP);
      cup(g, x, y, { layers, pearls: !!(st.scoops.pearl || st.scoops.bpearl), ice: Math.min(5, st.scoops.ice || 0), stripes: st.did.swirl && st.scoops.bpearl ? '#6e3c14' : st.did.smear && st.scoops.taro ? '#a888c0' : null, taroBottom: !!(st.scoops.taro && !st.did.smear), seeds: !!st.scoops.passion, lemon: !!st.scoops.lemon, noStraw: true }, 5, fill);
      const pl = pourLine();
      if (pl) {
        const h = 40 * 5, top = y - h, ly = top + h * (1 - 0.86 * Math.min(1, pl.at / CUP));
        g.setLineDash([6, 5]); g.strokeStyle = '#c83a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 58, ly); g.lineTo(x + 58, ly); g.stroke(); g.setLineDash([]);
        g.fillStyle = '#c83a2a'; g.font = '800 12px Nunito, "Noto Sans TC", sans-serif'; g.textAlign = 'right'; g.fillText(`${ITEMS[pl.item][lang]} ${pl.ml}ml`, x + 100, ly - 4);
      }
      if (hold && hold.kind === 'pour') { g.strokeStyle = colOf(hold.item); g.lineWidth = hold.item === 'creamer' || hold.item === 'melon' ? 4 : 7; g.beginPath(); g.moveTo(x + 10, 0); g.quadraticCurveTo(x + 4, 30, x + 2, 70); g.stroke(); }
    }
    function bowl(g, x, y, time) {
      if (p.dish === 'noodle') {
        g.fillStyle = 'rgba(60,40,20,0.25)'; g.beginPath(); g.ellipse(x, y + 2, 66, 10, 0, 0, 7); g.fill();
        g.beginPath(); g.moveTo(x - 66, y - 46); g.quadraticCurveTo(x - 60, y, x, y); g.quadraticCurveTo(x + 60, y, x + 66, y - 46); g.closePath(); g.fillStyle = '#f4f0e8'; g.fill(); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
        g.strokeStyle = '#3a6a9a'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 60, y - 30); g.quadraticCurveTo(x, y - 18, x + 60, y - 30); g.stroke();
        g.fillStyle = '#ece4d0'; g.strokeStyle = INK; g.beginPath(); g.ellipse(x, y - 46, 66, 14, 0, 0, 7); g.fill(); g.stroke();
        // the sauces sit in the bowl; the noodles go in once drained; tossing mixes it all to one colour
        const sauces = [['sesame', '#c8945a'], ['soy', '#3a1a0e'], ['vinegar', '#2a140c'], ['garlic', '#f4eccc']];
        if (!st.did.toss) sauces.forEach(([it, c], i) => { for (let k = 0; k < (st.scoops[it] || 0); k++) { g.fillStyle = c; g.beginPath(); g.ellipse(x - 30 + i * 18 + k * 6, y - 46 + (i % 2) * 4, it === 'sesame' ? 12 : 7, it === 'sesame' ? 5 : 3, 0, 0, 7); g.fill(); } });
        if (st.drained) { const c = st.did.toss ? '#d8a868' : '#f0dc9a'; g.strokeStyle = c; g.lineWidth = 3; for (let i = 0; i < 12; i++) { g.beginPath(); g.arc(x - 40 + i * 7, y - 48 + (i % 3) * 2, 9, 3.3, 6); g.stroke(); } }
        if (st.scoops.cucumber) { g.strokeStyle = '#6aa040'; g.lineWidth = 3; for (let i = 0; i < 6 * st.scoops.cucumber; i++) { g.beginPath(); g.moveTo(x - 14 + (i % 6) * 5, y - 58); g.lineTo(x - 8 + (i % 6) * 5, y - 48); g.stroke(); } }
        if (st.scoops.scallion) { g.fillStyle = '#5aa040'; for (let i = 0; i < 8; i++) g.fillRect(x - 24 + i * 6, y - 52 + (i % 2) * 4, 3, 3); }
        if (st.drained) { g.fillStyle = 'rgba(255,255,255,0.45)'; for (let i = 0; i < 3; i++) { const ph = (time * 0.6 + i / 3) % 1; g.beginPath(); g.ellipse(x - 14 + i * 14, y - 64 - ph * 30, 5 + ph * 6, 3 + ph * 4, 0, 0, 7); g.globalAlpha = 1 - ph; g.fill(); } g.globalAlpha = 1; }
        return;
      }
      // the braised platter: pieces appear on the plate once cut; the liquid glazes them; spring onion on top
      g.fillStyle = 'rgba(60,40,20,0.25)'; g.beginPath(); g.ellipse(x, y - 4, 76, 16, 0, 0, 7); g.fill();
      g.fillStyle = '#f4f0e8'; g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.ellipse(x, y - 12, 74, 20, 0, 0, 7); g.fill(); g.stroke();
      g.strokeStyle = '#3a6a9a'; g.lineWidth = 1.5; g.beginPath(); g.ellipse(x, y - 12, 62, 15, 0, 0, 7); g.stroke();
      if (st.did.cut) {
        const k = Math.min(1, st.brewed / 3), dark = (c) => mix([[c, 1], ['#4a2214', k * 0.7]]); let i = 0;
        const at = (j) => [x - 50 + (j % 6) * 18, y - 20 + Math.floor(j / 6) * 9];
        for (let n = 0; n < (st.scoops.tofu || 0) * 2; n++, i++) { const [px, py] = at(i); g.fillStyle = dark('#c8a070'); g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.roundRect(px - 7, py - 5, 14, 9, 2); g.fill(); g.stroke(); }
        for (let n = 0; n < (st.scoops.kelp || 0); n++, i++) { const [px, py] = at(i); g.strokeStyle = '#2a3a1a'; g.lineWidth = 4; g.beginPath(); g.arc(px, py, 5, 0, 5.5); g.stroke(); }
        for (let n = 0; n < (st.scoops.egg || 0) * 2; n++, i++) { const [px, py] = at(i); g.fillStyle = dark('#e8c890'); g.strokeStyle = INK; g.lineWidth = 1.2; g.beginPath(); g.ellipse(px, py, 8, 6, 0, 0, 7); g.fill(); g.stroke(); g.fillStyle = '#e8b030'; g.beginPath(); g.arc(px, py, 3.2, 0, 7); g.fill(); }
        const juice = st.pours.filter(([it]) => it === 'juice').reduce((s, [, v]) => s + v, 0) + (hold && hold.item === 'juice' ? hold.v : 0);
        if (juice > 0) { g.fillStyle = `rgba(90,42,20,${Math.min(0.5, juice / 60)})`; g.beginPath(); g.ellipse(x, y - 10, Math.min(60, 20 + juice), Math.min(14, 6 + juice / 4), 0, 0, 7); g.fill(); }
        if (st.scoops.scallion) { g.fillStyle = '#5aa040'; for (let n = 0; n < 10 * st.scoops.scallion; n++) g.fillRect(x - 40 + (n * 37 % 80), y - 22 + (n * 13 % 16), 3, 3); }
      }
      if (hold && hold.item === 'juice') { g.strokeStyle = '#5a2a14'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 6, 40); g.lineTo(x + 2, y - 14); g.stroke(); }
    }
    raf = requestAnimationFrame(frame);
    log();
  });
}
