// Tea Street: everyone who is online, over Supabase Realtime (the site's project), no server of our own.
// Each player is present on one channel with a small picture of their teahouse (size, tables, decorations, walls,
// menu, reputation, money…), which is all a visitor needs to see it. Everything else is a message on the same
// channel: street chat for everyone; likes, visits, orders, gifts, guestbook notes and recipe duels to one player.
// A note or a gift for a friend who is offline waits in an outbox here and goes out when they next show up.
const SB_URL = 'https://usoavddhglpbdpwwxium.supabase.co';
const SB_KEY = 'sb_publishable_HbbsnjG0GTwzfRgKyx1Aqg__JUOb24B';   // publishable: safe in the browser
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* full */ } } };
const myId = (() => { let v = store.get('teahouse.netid', null); if (!v) { v = Math.random().toString(36).slice(2, 10); store.set('teahouse.netid', v); } return v; })();
export const street = { me: myId, status: 'off', shops: [], chat: store.get('teahouse.chat', []), onShops: null, on: {} };
let sb = null, ch = null, mine = null, outbox = store.get('teahouse.outbox', []);
const handle = (m) => {
  if (!m || !m.type || m.from === myId) return;
  if (m.to && m.to !== myId) return;
  if (m.type === 'chat') { street.chat.push(m); street.chat = street.chat.slice(-80); store.set('teahouse.chat', street.chat); }
  const f = street.on[m.type]; if (f) f(m);
};
export async function goOnline(snapshot) {
  mine = snapshot;
  if (ch) { ch.track(mine).catch(() => {}); return; }
  street.status = 'connecting';
  try { const { createClient } = await import(SB_LIB); sb = sb || createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); } catch (e) { street.status = 'error'; return; }
  ch = sb.channel('tea:street', { config: { broadcast: { self: false }, presence: { key: myId } } });
  ch.on('presence', { event: 'sync' }, () => {
    street.shops = Object.entries(ch.presenceState()).map(([id, m]) => ({ id, ...(m[m.length - 1] || {}) })).filter((s) => s.n);
    flush();
    if (street.onShops) street.onShops(street.shops);
  }).on('broadcast', { event: 'm' }, ({ payload }) => handle(payload))
    .on('broadcast', { event: 'like' }, ({ payload }) => handle(payload && { ...payload, type: 'like' }))   // from older versions
    .subscribe((s) => { if (s === 'SUBSCRIBED') { street.status = 'on'; ch.track(mine).catch(() => {}); } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') street.status = 'error'; });
}
// keep my picture up to date (not too often)
let lastT = 0, pending = null;
export function update(snapshot) { mine = snapshot; if (!ch || street.status !== 'on') return; const now = Date.now(); if (now - lastT < 5000) { clearTimeout(pending); pending = setTimeout(() => update(mine), 5000 - (now - lastT)); return; } lastT = now; ch.track(mine).catch(() => {}); }
export const online = (id) => street.shops.some((s) => s.id === id);
// send a message: to everyone (chat), or to one player; `keep` holds it until they are online
export function send(type, data = {}, keep = false) {
  const m = { ...data, type, from: myId, t: Date.now() };
  if (m.to && keep && !online(m.to)) { outbox.push(m); outbox = outbox.slice(-60); store.set('teahouse.outbox', outbox); return 'queued'; }
  if (type === 'chat') { street.chat.push(m); street.chat = street.chat.slice(-80); store.set('teahouse.chat', street.chat); }
  if (ch && street.status === 'on') ch.send({ type: 'broadcast', event: 'm', payload: m }).catch(() => {});
  return 'sent';
}
function flush() {
  if (!outbox.length || !ch || street.status !== 'on') return;
  const ready = outbox.filter((m) => online(m.to)); if (!ready.length) return;
  outbox = outbox.filter((m) => !online(m.to)); store.set('teahouse.outbox', outbox);
  ready.forEach((m) => ch.send({ type: 'broadcast', event: 'm', payload: m }).catch(() => {}));
}
export const waiting = () => outbox.length;
export function like(to, from) { send('like', { to, name: from }); }
