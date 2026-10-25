// The counter: make one drink or dish by hand. Take a base from the shelf, brew it (hold, let go in the green), add
// scoops, pour to the line, shake, serve. Every action is written down, then judged against the recipe step by step:
// the right thing, the right amount, in the right order, nothing extra. 60 or more is a pass.
import { ITEMS } from './data.js?v=1';
import { cup, dish, INK } from './art.js?v=1';

const BASES = ['black', 'green', 'oolong', 'melon', 'noodle', 'braise'], JARS = ['pearl', 'sugar', 'brown', 'ice', 'lemon', 'passion', 'taro', 'tofu', 'egg', 'scallion'], POURS = ['milk', 'water', 'sauce'];
const SWEET = [0, 0.34, 0.67, 1, 1.34], ICE = [0, 0.34, 0.67, 1];

// the recipe for this order (a special order changes the sugar and ice)
export function recipeFor(p, special) {
  return p.steps.map((s) => {
    if (!special || s.kind !== 'scoop') return { ...s };
    if (s.item === 'sugar' && special.sweet !== undefined) return { ...s, n: Math.round(s.n * SWEET[special.sweet]) };
    if (s.item === 'ice' && special.ice !== undefined) return { ...s, n: Math.round(s.n * ICE[special.ice]) };
    return { ...s };
  }).filter((s) => !(s.kind === 'scoop' && s.n === 0));
}
// judge a list of actions against a recipe: a score from 0 to 100 and what went wrong
export function judge(recipe, acts, T, lang) {
  const nm = (it) => ITEMS[it][lang], J = T.judge, msgs = [], used = new Set();
  let total = 0, last = -1, penalty = 0;
  for (const st of recipe) {
    if (st.kind === 'serve') { total += 1; continue; }
    if (st.kind === 'shake' && st.n === 0) { const sh = acts.findIndex((a) => a.kind === 'shake'); if (sh >= 0) { used.add(sh); msgs.push(J.shook); } else total += 1; continue; }
    const k = acts.findIndex((a, i) => !used.has(i) && a.kind === st.kind && (st.kind === 'shake' || a.item === st.item));
    if (k < 0) {
      if (st.kind === 'pick') { const wrong = acts.findIndex((a, i) => !used.has(i) && a.kind === 'pick'); if (wrong >= 0) { used.add(wrong); msgs.push(J.wrongItem(nm(st.item), nm(acts[wrong].item))); continue; } }
      msgs.push(J.missing(st.kind === 'shake' ? T.tools.shake : nm(st.item))); continue;
    }
    used.add(k); const a = acts[k]; let s = 1;
    if (st.kind === 'steep' || st.kind === 'pour') {
      const err = Math.abs(a.v - st.target); s = err <= st.tol * 0.35 ? 1 : Math.max(0, 1 - (err - st.tol * 0.35) / (st.tol * 2.2));
      if (s < 0.95) msgs.push(a.v > st.target ? (st.kind === 'steep' ? J.tooLong(nm(st.item)) : J.tooMuch(nm(st.item))) : st.kind === 'steep' ? J.tooShort(nm(st.item)) : J.tooLittle(nm(st.item)));
    } else if (st.kind === 'scoop') { const d = Math.abs(a.n - st.n); s = [1, 0.6, 0.25][d] ?? 0; if (d) msgs.push(a.n > st.n ? J.tooMuch(nm(st.item)) : J.tooLittle(nm(st.item))); }
    else if (st.kind === 'shake') { s = Math.max(0, 1 - Math.abs(a.n - st.n) / Math.max(4, st.n * 0.8)); if (s < 0.9) msgs.push(a.n > st.n ? J.tooMuch(T.tools.shake) : J.tooLittle(T.tools.shake)); }
    if (k < last) { s *= 0.7; if (!msgs.includes(J.order)) msgs.push(J.order); }
    last = Math.max(last, k); total += s;
  }
  acts.forEach((a, i) => { if (!used.has(i) && a.kind !== 'serve') { penalty += 8; msgs.push(J.extra(a.kind === 'shake' ? T.tools.shake : nm(a.item))); } });
  const score = Math.max(0, Math.min(100, Math.round((total / recipe.length) * 100 - penalty)));
  if (!msgs.length) msgs.push(J.perfect);
  return { score, msgs };
}

// the counter screen; resolves with { score, msgs } when served, or null if closed
export function make(host, p, T, lang, special) {
  const recipe = recipeFor(p, special), food = p.kind === 'food';
  const desc = (s) => {
    const n = ITEMS[s.item] ? ITEMS[s.item][lang] : '';
    if (s.kind === 'pick') return `${T.tools.pick} ${n}`;
    if (s.kind === 'steep') return `${food ? T.steepFood : T.tools.steep} ${n} → ${lang === 'zh' ? '綠色區' : 'the green zone'} (${Math.round(s.target * 100)}%)`;
    if (s.kind === 'scoop') return `${T.tools.scoop} ${n} × ${s.n}`;
    if (s.kind === 'pour') return `${T.tools.pour} ${n} → ${lang === 'zh' ? '到線' : 'to the line'} (${Math.round(s.target * 100)}%)`;
    if (s.kind === 'shake') return s.n ? `${T.tools.shake} × ${s.n}` : (lang === 'zh' ? '不要搖！' : 'Don’t shake!');
    return food ? T.tools.serveFood : T.tools.serve;
  };
  return new Promise((done) => {
    let acts = [], hold = null, raf = 0, shakeT = 0, closed = false;
    const st = { base: null, steep: 0, pour: 0, pourItem: null, scoops: {}, shakes: 0 };
    host.innerHTML = `<div class="mk"><div class="mkCard"><h4>📜 ${T.recipe} · ${p[lang]}${special ? `<small>${special.label}</small>` : ''}</h4><ol>${recipe.map((s) => `<li>${desc(s)}</li>`).join('')}</ol><h4>✍️ ${lang === 'zh' ? '你做了' : 'You did'}</h4><ol id="mkLog" class="log"></ol></div>
      <div class="mkMid"><canvas id="mkCv" width="260" height="300"></canvas><div class="gauge" id="mkGauge" hidden><i id="mkZone"></i><b id="mkLvl"></b></div></div>
      <div class="mkTools"><div class="shelf"><h5>🫙 ${T.tools.pick}</h5>${BASES.map((b) => `<button class="tool" data-pick="${b}"><i style="background:${ITEMS[b].color}"></i>${ITEMS[b][lang]}</button>`).join('')}</div>
        <div class="shelf"><h5>🔥 ${food ? T.steepFood : T.tools.steep}</h5><button class="tool big" id="mkSteep">${T.hold}</button></div>
        <div class="shelf"><h5>🥄 ${T.tools.scoop}</h5>${JARS.map((b) => `<button class="tool" data-scoop="${b}"><i style="background:${ITEMS[b].color}"></i>${ITEMS[b][lang]}</button>`).join('')}</div>
        <div class="shelf"><h5>🫗 ${T.tools.pour}</h5>${POURS.map((b) => `<button class="tool" data-pour="${b}"><i style="background:${ITEMS[b].color}"></i>${ITEMS[b][lang]}</button>`).join('')}</div>
        <div class="shelf row2"><button class="tool big" id="mkShake">🥤 ${T.tools.shake} <b id="mkShN">0</b></button><button class="tool" id="mkReset">🗑️ ${T.reset}</button><button class="tool serve" id="mkServe">✅ ${food ? T.tools.serveFood : T.tools.serve}</button></div></div></div>`;
    const $ = (id) => host.querySelector('#' + id), cv = $('mkCv'), g = cv.getContext('2d');
    const log = () => { $('mkLog').innerHTML = acts.map((a) => `<li>${a.kind === 'shake' ? `${T.tools.shake} × ${a.n}` : a.kind === 'pick' ? `${T.tools.pick} ${ITEMS[a.item][lang]}` : a.kind === 'scoop' ? `${T.tools.scoop} ${ITEMS[a.item][lang]} × ${a.n}` : `${a.kind === 'steep' ? (food ? T.steepFood : T.tools.steep) : T.tools.pour} ${ITEMS[a.item][lang]} ${Math.round(a.v * 100)}%`}</li>`).join(''); $('mkLog').scrollTop = 1e6; };
    // consecutive scoops of one thing, and a run of shakes, count as one action
    const act = (a) => { const l = acts[acts.length - 1]; if (l && a.kind === 'scoop' && l.kind === 'scoop' && l.item === a.item) l.n++; else if (l && a.kind === 'shake' && l.kind === 'shake') l.n++; else if (l && a.kind === 'pour' && l.kind === 'pour' && l.item === a.item) l.v = a.v; else acts.push(a); log(); };
    host.querySelectorAll('[data-pick]').forEach((b) => b.onclick = () => { st.base = b.dataset.pick; act({ kind: 'pick', item: st.base }); });
    host.querySelectorAll('[data-scoop]').forEach((b) => b.onclick = () => { const it = b.dataset.scoop; st.scoops[it] = (st.scoops[it] || 0) + 1; act({ kind: 'scoop', item: it, n: 1 }); b.classList.add('pop'); setTimeout(() => b.classList.remove('pop'), 150); });
    // holding: brewing fills the meter, pouring fills the cup
    const startHold = (kind, item) => { if (hold) return; hold = { kind, item: item || st.base, v: 0, t0: performance.now() }; if (kind === 'steep') { $('mkGauge').hidden = false; const tgt = recipe.find((s) => s.kind === 'steep'); const z = $('mkZone'); if (tgt) { z.style.bottom = (tgt.target - tgt.tol) * 100 + '%'; z.style.height = tgt.tol * 200 + '%'; z.hidden = false; } else z.hidden = true; } };
    const endHold = () => { if (!hold) return; const h = hold; hold = null; if (h.kind === 'steep') { if (h.item) act({ kind: 'steep', item: h.item, v: h.v }); setTimeout(() => { $('mkGauge').hidden = true; }, 500); } else { st.pourItem = h.item; act({ kind: 'pour', item: h.item, v: st.pour }); } };
    const hookHold = (el, kind, item) => { el.onpointerdown = (e) => { e.preventDefault(); el.setPointerCapture(e.pointerId); el.classList.add('down'); startHold(kind, item); }; const up = () => { el.classList.remove('down'); endHold(); }; el.onpointerup = up; el.onpointercancel = up; };
    hookHold($('mkSteep'), 'steep');
    host.querySelectorAll('[data-pour]').forEach((b) => hookHold(b, 'pour', b.dataset.pour));
    $('mkShake').onclick = () => { st.shakes++; shakeT = 0.25; $('mkShN').textContent = st.shakes; act({ kind: 'shake', n: 1 }); };
    $('mkReset').onclick = () => { acts = []; Object.assign(st, { base: null, steep: 0, pour: 0, pourItem: null, scoops: {}, shakes: 0 }); $('mkShN').textContent = 0; log(); };
    $('mkServe').onclick = () => { closed = true; cancelAnimationFrame(raf); done(judge(recipe, acts, T, lang)); };
    // the picture: the cup (or bowl) filling, the brewing meter rising
    let last = performance.now();
    const frame = (now) => {
      if (closed || !cv.isConnected) { if (!closed) done(null); return; }
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (hold) { if (hold.kind === 'steep') { hold.v = Math.min(1.1, hold.v + dt / 3.2); st.steep = hold.v; $('mkLvl').style.height = Math.min(100, hold.v * 100) + '%'; } else { st.pour = Math.min(1, st.pour + dt / 2.6); hold.v = st.pour; } }
      g.clearRect(0, 0, 260, 300); g.fillStyle = '#e8d4ae'; g.fillRect(0, 0, 260, 300); g.fillStyle = '#b07a48'; g.fillRect(0, 230, 260, 70); g.strokeStyle = INK; g.lineWidth = 2; g.beginPath(); g.moveTo(0, 230); g.lineTo(260, 230); g.stroke();
      const sx = shakeT > 0 ? Math.sin(now / 20) * 8 : 0; shakeT = Math.max(0, shakeT - dt);
      if (food) {
        dish(g, 130 + sx, 220, p.dish, 2.6);
        if (st.base) { g.fillStyle = 'rgba(255,255,255,0.4)'; g.font = '14px sans-serif'; }
      } else {
        const base = st.base ? ITEMS[st.base].color : null, layers = [], fill = Math.min(1, (st.base ? 0.35 : 0) + st.pour * 0.6 + (st.scoops.taro || 0) * 0.08 + (st.scoops.brown ? 0.05 : 0));
        if (st.pourItem === 'milk' || (hold && hold.item === 'milk')) layers.push('#f4ecdc'); if (base) layers.push(st.base === 'melon' ? '#c89048' : base === ITEMS.green.color ? '#c8c060' : '#b07040');
        if (st.scoops.taro) layers.unshift('#c8b0d8');
        cup(g, 130 + sx, 226, { layers: layers.length ? layers : ['rgba(0,0,0,0)'], pearls: !!st.scoops.pearl, ice: Math.min(4, st.scoops.ice || 0), stripes: !!st.scoops.brown, seeds: !!st.scoops.passion, noStraw: true }, 4.6, layers.length ? fill : 0);
        // the line to pour to
        const pt = recipe.find((s) => s.kind === 'pour');
        if (pt) { const top = 226 - 40 * 4.6, ly = top + 40 * 4.6 * (1 - 0.86 * Math.min(1, 0.35 + pt.target * 0.6)); g.setLineDash([6, 5]); g.strokeStyle = '#c83a2a'; g.lineWidth = 2; g.beginPath(); g.moveTo(70, ly); g.lineTo(190, ly); g.stroke(); g.setLineDash([]); }
        if (hold && hold.kind === 'pour') { g.strokeStyle = ITEMS[hold.item].color; g.lineWidth = 6; g.beginPath(); g.moveTo(150, 0); g.lineTo(140, 120); g.stroke(); }
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
  });
}
