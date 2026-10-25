// Tea Street: everyone who is online, over Supabase Realtime presence (the site's project), no server.
// Each player is present on one channel with a small picture of their teahouse (size, tables, decorations, walls,
// menu, reputation, money), which is all a visitor needs to see it; a like is a broadcast to that player.
const SB_URL = 'https://usoavddhglpbdpwwxium.supabase.co';
const SB_KEY = 'sb_publishable_HbbsnjG0GTwzfRgKyx1Aqg__JUOb24B';   // publishable: safe in the browser
const SB_LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.49.4/+esm';
const myId = (() => { try { let v = localStorage.getItem('teahouse.netid'); if (!v) { v = Math.random().toString(36).slice(2, 10); localStorage.setItem('teahouse.netid', v); } return v; } catch (e) { return Math.random().toString(36).slice(2, 10); } })();
export const street = { me: myId, status: 'off', shops: [], onShops: null, onLike: null };
let sb = null, ch = null, mine = null;
export async function goOnline(snapshot) {
  mine = snapshot;
  if (ch) { ch.track(mine).catch(() => {}); return; }
  street.status = 'connecting';
  try { const { createClient } = await import(SB_LIB); sb = sb || createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false } }); } catch (e) { street.status = 'error'; return; }
  ch = sb.channel('tea:street', { config: { broadcast: { self: false }, presence: { key: myId } } });
  ch.on('presence', { event: 'sync' }, () => {
    street.shops = Object.entries(ch.presenceState()).map(([id, m]) => ({ id, ...(m[m.length - 1] || {}) })).filter((s) => s.n);
    if (street.onShops) street.onShops(street.shops);
  }).on('broadcast', { event: 'like' }, ({ payload }) => { if (payload && payload.to === myId && street.onLike) street.onLike(payload); })
    .subscribe((s) => { if (s === 'SUBSCRIBED') { street.status = 'on'; ch.track(mine).catch(() => {}); } else if (s === 'CHANNEL_ERROR' || s === 'TIMED_OUT') street.status = 'error'; });
}
// keep my picture up to date (not too often)
let lastT = 0, pending = null;
export function update(snapshot) { mine = snapshot; if (!ch || street.status !== 'on') return; const now = Date.now(); if (now - lastT < 5000) { clearTimeout(pending); pending = setTimeout(() => update(mine), 5000 - (now - lastT)); return; } lastT = now; ch.track(mine).catch(() => {}); }
export function like(to, from) { if (ch && street.status === 'on') ch.send({ type: 'broadcast', event: 'like', payload: { to, from, n: from } }).catch(() => {}); }
