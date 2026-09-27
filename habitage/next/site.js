// Habitage v2 — the page is one evening turning into dawn (ART_DIRECTION.md).
// No framework: one scroll/raf loop drives the sky and the scroll-scrubbed stages;
// IntersectionObservers lazy-load and play/pause every film.
import { mountAurel } from './aurel/aurel.js';

document.documentElement.classList.add('js');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PHONE = matchMedia('(max-width: 800px)').matches;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, t) => a + (b - a) * t;
$('#yr').textContent = new Date().getFullYear();

// ── films: the right source for the screen, set only when near the viewport ──
function dress(v) {           // the poster only — cheap, set well ahead of the viewport
  if (v.dataset.dressed) return;
  v.dataset.dressed = '1';
  const p = (PHONE && v.dataset.posterPhone) || v.dataset.poster;
  if (p) v.poster = p;
}
function arm(v) {             // the film itself — only once it's about to be seen
  dress(v);
  if (v.dataset.armed) return;
  v.dataset.armed = '1';
  const src = (PHONE && v.dataset.srcPhone) || v.dataset.src;
  if (src) { v.src = src; v.preload = 'auto'; }
}
function play(v) {
  if (RM) return;
  arm(v);
  const p = v.play(); if (p && p.catch) p.catch(() => {});
}
function pause(v) { if (!v.paused) v.pause(); }
// the hero's phone poster immediately, so the desktop poster never paints first
{ const h = $('.hero-film video'); if (PHONE && h.dataset.posterPhone) h.poster = h.dataset.posterPhone; }
const dressIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { dress(e.target); dressIO.unobserve(e.target); } }), { rootMargin: PHONE ? '600px 0px' : '1400px 0px' });
$$('video').forEach(v => dressIO.observe(v));

// Simple films (.lazy): play while visible, pause when not.
const filmIO = new IntersectionObserver(es => es.forEach(e => (e.isIntersecting ? play(e.target) : pause(e.target))), { rootMargin: '200px 0px' });
const armIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { arm(e.target); armIO.unobserve(e.target); } }), { rootMargin: PHONE ? '350px 0px' : '700px 0px' });
$$('video.lazy').forEach(v => { filmIO.observe(v); if (!v.hasAttribute('data-eager')) armIO.observe(v); });
// the hero film starts after the page has painted its poster (first paint stays light)
addEventListener('load', () => setTimeout(() => { const h = $('.hero-film video'); if (h && !RM) play(h); }, 300));

// ── reveals ──
const revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
$$('.reveal').forEach(el => revealIO.observe(el));

// ── nav turns to glass once we leave the hero ──
const nav = $('#nav');

// ── the living sky (section 1 of the art direction) ──
const sky = (() => {
  const c = $('#sky'), g = c.getContext('2d');
  // dusk at the top of the page → dawn at the bottom (stops = scroll progress)
  const STOPS = [
    [0.00, ['#070a18', '#0d1030', '#1a1646']],
    [0.30, ['#0b0d24', '#191447', '#2c1f5e']],
    [0.58, ['#120f33', '#2a1e5e', '#4a2f6e']],
    [0.80, ['#1c1440', '#4a2f6e', '#7a4a80']],
    [0.92, ['#3a2a66', '#a0668e', '#e0a38a']],
    [1.00, ['#8fa3d8', '#f2c6a8', '#fff1d8']],
  ];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const S = STOPS.map(([p, cs]) => [p, cs.map(hex)]);
  const mix = (a, b, t) => a.map((v, i) => Math.round(lerp(v, b[i], t)));
  const rgb = (a, al = 1) => `rgba(${a[0]},${a[1]},${a[2]},${al})`;
  let W = 0, H = 0, dpr = 1, stars = [], lanterns = [], shoot = null, nextShoot = 6;
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = innerWidth; H = innerHeight;
    c.width = Math.round(W * dpr); c.height = Math.round(H * dpr);
    const n = Math.round(W * H / 5200);
    stars = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.9, r: Math.random() * 1.1 + 0.25, tw: Math.random() * 6.28, sp: 0.4 + Math.random() * 1.2 }));
    lanterns = Array.from({ length: PHONE ? 7 : 12 }, () => newLantern(true));
  }
  function newLantern(anywhere) {
    return { x: Math.random() * W, y: anywhere ? Math.random() * H : H + 20, v: 6 + Math.random() * 10, r: 2 + Math.random() * 2.6, sw: Math.random() * 6.28, a: 0.35 + Math.random() * 0.4 };
  }
  addEventListener('resize', size); size();
  function colors(p) {
    let i = 0; while (i < S.length - 2 && p > S[i + 1][0]) i++;
    const [p0, a] = S[i], [p1, b] = S[i + 1];
    const t = clamp((p - p0) / (p1 - p0));
    const e = t * t * (3 - 2 * t);
    return a.map((col, k) => mix(col, b[k], e));
  }
  function draw(p, t, dt) {
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const [top, mid, low] = colors(p);
    const gr = g.createLinearGradient(0, 0, 0, H);
    gr.addColorStop(0, rgb(top)); gr.addColorStop(0.62, rgb(mid)); gr.addColorStop(1, rgb(low));
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const night = clamp(1 - (p - 0.78) / 0.18);          // stars and aurora fade as dawn comes
    // aurora ribbons: three soft sine bands, very low contrast
    if (night > 0.02) {
      g.globalCompositeOperation = 'lighter';
      for (let k = 0; k < 3; k++) {
        const y0 = H * (0.16 + k * 0.11), amp = H * 0.05, hue = [150, 190, 280][k];
        g.beginPath();
        for (let x = 0; x <= W; x += 24) {
          const y = y0 + Math.sin(x * 0.0035 + t * 0.07 * (k + 1) + k) * amp + Math.sin(x * 0.009 - t * 0.05) * amp * 0.4;
          x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
        }
        g.lineTo(W, y0 + H * 0.22); g.lineTo(0, y0 + H * 0.22); g.closePath();
        const ag = g.createLinearGradient(0, y0 - amp, 0, y0 + H * 0.22);
        ag.addColorStop(0, `hsla(${hue},70%,62%,0)`); ag.addColorStop(0.25, `hsla(${hue},70%,62%,${0.05 * night})`); ag.addColorStop(1, `hsla(${hue},70%,62%,0)`);
        g.fillStyle = ag; g.fill();
      }
      g.globalCompositeOperation = 'source-over';
      // stars
      for (const s of stars) {
        const a = night * (0.35 + 0.65 * (0.5 + 0.5 * Math.sin(s.tw + t * s.sp)));
        g.fillStyle = `rgba(255,246,230,${a * 0.8})`;
        g.beginPath(); g.arc(s.x, s.y, s.r, 0, 6.283); g.fill();
      }
      // a rare, slow shooting star
      if (!shoot && t > nextShoot) { shoot = { x: Math.random() * W * 0.7 + W * 0.2, y: Math.random() * H * 0.35, life: 0 }; }
      if (shoot) {
        shoot.life += dt;
        const k = shoot.life / 1.4, x = shoot.x - k * 260, y = shoot.y + k * 110;
        const tg = g.createLinearGradient(x, y, x + 120, y - 50);
        tg.addColorStop(0, `rgba(255,244,220,${0.7 * night * Math.sin(Math.PI * clamp(k))})`); tg.addColorStop(1, 'rgba(255,244,220,0)');
        g.strokeStyle = tg; g.lineWidth = 1.4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 120, y - 50); g.stroke();
        if (k >= 1) { shoot = null; nextShoot = t + 9 + Math.random() * 14; }
      }
    }
    // drifting lanterns: warm points rising slowly
    for (const l of lanterns) {
      l.y -= l.v * dt; l.sw += dt * 0.6;
      if (l.y < -20) Object.assign(l, newLantern(false));
      const x = l.x + Math.sin(l.sw) * 12;
      const lg = g.createRadialGradient(x, l.y, 0, x, l.y, l.r * 7);
      lg.addColorStop(0, `rgba(255,214,150,${l.a * (0.6 + 0.4 * night)})`); lg.addColorStop(0.25, `rgba(255,190,120,${l.a * 0.35})`); lg.addColorStop(1, 'rgba(255,190,120,0)');
      g.fillStyle = lg; g.beginPath(); g.arc(x, l.y, l.r * 7, 0, 6.283); g.fill();
    }
  }
  return { draw };
})();

// ── scroll-scrubbed image sequences (days, isles) ──
function sequence(canvas, base, count, name, keyFrame) {
  const g = canvas.getContext('2d');
  const imgs = new Array(count); let loaded = 0, started = false, shown = -1;
  function load() {
    if (started) return; started = true;
    // key frames first (so any scroll position has something close), then fill in
    const order = []; for (let step = 16; step >= 1; step = step >> 1) for (let i = 0; i < count; i += step) if (!order.includes(i)) order.push(i);
    for (let i = 0; i < count; i++) if (!order.includes(i)) order.push(i);
    let q = 0; const next = () => {
      if (q >= order.length) return; const i = order[q++];
      const im = new Image(); im.decoding = 'async';
      im.onload = () => { imgs[i] = im; loaded++; if (shown < 0 || Math.abs(i - want) < Math.abs(shown - want)) draw(want); next(); };
      im.onerror = next; im.src = base + name(i);
    };
    for (let k = 0; k < 4; k++) next();
  }
  let want = RM ? keyFrame : 0;
  function draw(i) {
    want = i;
    let j = -1, best = 1e9;
    for (let k = 0; k < count; k++) if (imgs[k] && Math.abs(k - i) < best) { best = Math.abs(k - i); j = k; }
    if (j < 0 || j === shown) return;
    const im = imgs[j];
    if (canvas.width !== im.naturalWidth) { canvas.width = im.naturalWidth; canvas.height = im.naturalHeight; }
    g.drawImage(im, 0, 0); shown = j;
  }
  new IntersectionObserver(es => { if (es[0].isIntersecting) load(); }, { rootMargin: '120% 0px' }).observe(canvas);
  return { draw, count };
}
const progressIn = el => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight)); };

// Day 1 → 30
const dayPath = $('#dayPath');
for (let d = 1; d <= 30; d++) { const li = document.createElement('li'); dayPath.appendChild(li); }
const dayLis = $$('li', dayPath);
let dayFrames = null, daySeq = null;
fetch('media/footage/seq-day/manifest.json').then(r => r.json()).then(m => {
  // phones scrub every other frame (still ≥ one per day, and always the last)
  dayFrames = PHONE ? m.frames.filter((f, i) => i % 2 === 0 || i === m.frames.length - 1) : m.frames;
  const dir = PHONE ? 'media/footage/seq-day-540/' : 'media/footage/seq-day/';
  daySeq = sequence($('#dayCanvas'), dir, dayFrames.length, i => dayFrames[i].file, dayFrames.length - 1);
  if (RM) daySeq.draw(dayFrames.length - 1);
}).catch(() => {});
let lastDay = 0;
function setDay(d) {
  if (d === lastDay) return; lastDay = d;
  $('#dayNum').textContent = d;
  dayLis.forEach((li, i) => li.classList.toggle('lit', i < d));
}

// Aurel's isles waking
let islesSeq = null;
fetch('media/worlds/seq-isles-wake/manifest.json').then(r => r.json()).then(m => {
  islesSeq = PHONE
    ? sequence($('#islesCanvas'), 'media/worlds/seq-isles-wake-phone/', Math.ceil(m.frames / 2), i => String(i * 2).padStart(4, '0') + '.webp', Math.floor(m.keyFrame / 2))
    : sequence($('#islesCanvas'), 'media/worlds/seq-isles-wake/', m.frames, i => String(i).padStart(4, '0') + '.webp', m.keyFrame);
  if (RM) islesSeq.draw(islesSeq.count - 1);
}).catch(() => {});

// ── five journeys: one glides in as the last moves on ──
const jSec = $('#journeys'), jVids = $$('#journeyPhone .jv'), jItems = $$('#journeyList li');
const jNames = jItems.map(li => $('b', li).textContent);
let jOn = -1, jNear = false;
new IntersectionObserver(es => { jNear = es[0].isIntersecting; const v = jVids[jOn]; if (v) (jNear ? play(v) : pause(v)); }, { rootMargin: '300px 0px' }).observe(jSec);
function setJourney(i) {
  if (i === jOn) return;
  const prev = jOn; jOn = i;
  jVids.forEach((v, k) => {
    v.classList.toggle('on', k === i);
    v.classList.toggle('gone', k < i);
    if (k === i) { dress(v); if (jNear) play(v); } else if (k !== prev) pause(v);
  });
  if (prev >= 0) setTimeout(() => { if (jOn !== prev) pause(jVids[prev]); }, 1200);
  if (jNear && jVids[i + 1]) arm(jVids[i + 1]);
  jItems.forEach((li, k) => li.classList.toggle('on', k === i));
  $('#journeyCaption').textContent = jNames[i];
  $$('#jdots i').forEach((d, k) => d.classList.toggle('on', k === i));
}
jItems.forEach((li, k) => $('button', li).addEventListener('click', () => {
  const r = jSec.getBoundingClientRect(), span = r.height - innerHeight;
  scrollTo({ top: scrollY + r.top + span * ((k + 0.5) / jVids.length), behavior: RM ? 'auto' : 'smooth' });
}));
setJourney(0);

// ── the sky follows the visitor's clock (Home + the crew home) ──
const hour = new Date().getHours();
const nowT = hour >= 5 && hour < 9 ? 'dawn' : hour >= 9 && hour < 17 ? 'noon' : hour >= 17 && hour < 20 ? 'dusk' : 'night';
const T_WORDS = { dawn: 'dawn', noon: 'midday', dusk: 'dusk', night: 'night' };
function timeSwitch(root, t, visible) {
  $$('video', root).forEach(v => {
    const on = v.dataset.t === t; v.classList.toggle('on', on);
    if (on) { dress(v); if (visible) play(v); } else pause(v);
  });
}
const homeWin = $('#homeWindow'), crewScr = $('#crewScreen');
let homeT = nowT, homeVis = false, crewVis = false;
timeSwitch(homeWin, homeT, false); timeSwitch(crewScr, nowT, false);
$$('.times button').forEach(b => {
  b.classList.toggle('on', b.dataset.t === homeT);
  b.addEventListener('click', () => {
    homeT = b.dataset.t; $$('.times button').forEach(x => x.classList.toggle('on', x === b));
    timeSwitch(homeWin, homeT, homeVis);
    $('#clockLine').textContent = homeT === nowT ? clockLine() : `Home at ${T_WORDS[homeT]}.`;
  });
});
function clockLine() {
  const s = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `It’s ${s} where you are — so it’s ${T_WORDS[nowT]} on the road.`;
}
$('#clockLine').textContent = clockLine();
new IntersectionObserver(es => { homeVis = es[0].isIntersecting; timeSwitch(homeWin, homeT, homeVis); }, { rootMargin: '200px 0px' }).observe(homeWin);
new IntersectionObserver(es => { crewVis = es[0].isIntersecting; timeSwitch(crewScr, nowT, crewVis); }, { rootMargin: '200px 0px' }).observe(crewScr);

// ── worlds: six chapter films, each hands over to the next as it ends ──
const cinema = $('#cinema'), cVids = $$('.cinema-frame video'), chapters = $('#chapters');
cVids.forEach((v, k) => {
  const b = document.createElement('button');
  b.type = 'button'; b.setAttribute('role', 'tab'); b.innerHTML = `<i></i>${v.dataset.name}`;
  b.setAttribute('aria-label', `Chapter ${v.dataset.n}: ${v.dataset.name}`);
  b.addEventListener('click', () => setWorld(k));
  chapters.appendChild(b);
});
const cBtns = $$('button', chapters);
let cOn = -1, cVis = false;
function setWorld(k) {
  const prev = cOn; cOn = k;
  cVids.forEach((v, i) => v.classList.toggle('on', i === k));
  cBtns.forEach((b, i) => { b.classList.toggle('on', i === k); b.setAttribute('aria-selected', i === k); $('i', b).style.width = i < k ? '100%' : '0'; });
  const v = cVids[k];
  dress(v);
  if (cVis) { arm(v); v.currentTime = 0; play(v); if (cVids[k + 1]) arm(cVids[k + 1]); }
  const title = $('#cinemaTitle');
  title.style.opacity = 0;
  setTimeout(() => { title.innerHTML = `<span>Chapter ${v.dataset.n}</span>${v.dataset.name}`; title.style.opacity = 1; }, prev < 0 ? 0 : 420);
  if (prev >= 0 && prev !== k) setTimeout(() => pause(cVids[prev]), 1200);
}
cVids.forEach((v, i) => {
  v.addEventListener('ended', () => { if (i === cOn) setWorld((i + 1) % cVids.length); });
  v.addEventListener('timeupdate', () => { if (i === cOn && v.duration) $('i', cBtns[i]).style.width = (100 * v.currentTime / v.duration) + '%'; });
});
setWorld(0);
new IntersectionObserver(es => { cVis = es[0].isIntersecting; const v = cVids[cOn]; if (cVis) { play(v); if (cVids[cOn + 1]) arm(cVids[cOn + 1]); } else pause(v); }, { rootMargin: '100px 0px' }).observe(cinema);

// ── sightings: play in view, sound on request (one at a time) ──
const tiles = $$('.tile');
const tileIO = new IntersectionObserver(es => es.forEach(e => { const v = $('video', e.target); e.isIntersecting ? play(v) : pause(v); }), { threshold: 0.35 });
tiles.forEach(t => {
  tileIO.observe(t); armIO.observe($('video', t));
  const b = $('.sound', t), v = $('video', t);
  b.addEventListener('click', () => {
    const on = v.muted;
    tiles.forEach(o => { $('video', o).muted = true; $('.sound', o).setAttribute('aria-pressed', 'false'); $('.sound', o).setAttribute('aria-label', 'Play sound'); });
    if (on) { v.muted = false; v.currentTime = 0; play(v); b.setAttribute('aria-pressed', 'true'); b.setAttribute('aria-label', 'Mute'); }
  });
});

// ── swipe rows on phones: dots that follow the card in the centre ──
function swipeDots(row, extra) {
  const cards = [...row.children];
  const dots = document.createElement('div'); dots.className = 'dots' + (extra ? ' ' + extra : ''); dots.setAttribute('aria-hidden', 'true');
  cards.forEach(() => dots.appendChild(document.createElement('i')));
  row.after(dots);
  const upd = () => {
    const mid = row.scrollLeft + row.clientWidth / 2; let best = 0, bd = 1e9;
    [...cards].sort((a, b) => a.offsetLeft - b.offsetLeft).forEach((c, k) => { const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (d < bd) { bd = d; best = k; } });
    [...dots.children].forEach((d, k) => d.classList.toggle('on', k === best));
  };
  row.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
}
swipeDots($('#tiles')); swipeDots($('.pair')); swipeDots($('.trio'));

// ── Aurel: meets you, and waves goodbye at dawn ──
try {
  const meet = mountAurel($('#aurelStage'), { poster: 'aurel/poster.webp', loadMargin: PHONE ? '250px 0px' : '800px 0px' });
  $('#aurelStage').addEventListener('click', () => meet.wave && meet.wave());
  let waved = false;
  new IntersectionObserver(es => { if (es[0].isIntersecting && !waved) { waved = true; setTimeout(() => meet.wave(), 2600); } }, { threshold: 0.6 }).observe($('#aurelStage'));
} catch (e) { /* the poster glow stays */ }
let bye = null;
new IntersectionObserver(es => {
  if (es[0].isIntersecting && !bye) {
    try {
      bye = mountAurel($('#aurelBye'), { poster: 'aurel/poster.webp', startAt: 0.2, palette: { skyTop: 0x9fb4e6, skyLow: 0xf6c9a8, ground: 0x6a4c6e, key: 0xfff0dc } });
      setTimeout(() => bye && bye.wave(3), 2400);
    } catch (e) { /* fine */ }
  }
}, { rootMargin: '300px 0px' }).observe($('#aurelBye'));

// ── the one loop ──
let t0 = performance.now(), last = t0, ticking = true;
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000); last = now;
  const t = (now - t0) / 1000;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = clamp(scrollY / Math.max(1, max));
  sky.draw(p, RM ? 0 : t, RM ? 0 : dt);
  nav.classList.toggle('solid', scrollY > innerHeight * 0.6);
  // journeys
  const rj = jSec.getBoundingClientRect();
  if (rj.bottom > 0 && rj.top < innerHeight) setJourney(Math.min(jVids.length - 1, Math.floor(progressIn(jSec) * jVids.length)));
  // days
  const ds = $('#days'), rd = ds.getBoundingClientRect();
  if (daySeq && dayFrames && rd.bottom > 0 && rd.top < innerHeight && !RM) {
    const f = Math.round(progressIn(ds) * (daySeq.count - 1));
    daySeq.draw(f); setDay(dayFrames[f].day);
  }
  // isles
  const is = $('#isles'), ri = is.getBoundingClientRect();
  if (islesSeq && ri.bottom > 0 && ri.top < innerHeight && !RM) islesSeq.draw(Math.round(clamp(progressIn(is) * 1.15) * (islesSeq.count - 1)));
  if (ticking) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
document.addEventListener('visibilitychange', () => {
  if (document.hidden) ticking = false;
  else if (!ticking) { ticking = true; last = performance.now(); requestAnimationFrame(frame); }
});
if (RM) setDay(30);
