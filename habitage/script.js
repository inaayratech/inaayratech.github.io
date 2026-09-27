/* Habitage — quiet motion. Scroll drives state; nothing shouts. See ART_DIRECTION.md. */
(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  const mqRM = matchMedia('(prefers-reduced-motion: reduce)');
  let RM = mqRM.matches;
  mqRM.addEventListener?.('change', e => { RM = e.matches; onResize(); });

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();

  // ── reveals ──
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); io.unobserve(e.target); } }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  $$('.rv').forEach(el => io.observe(el));

  // ── motes: a few soft lights drifting up (≤ 36, ~30fps, paused when hidden) ──
  const motes = (() => {
    const cv = $('#lanterns'); if (!cv) return { resize() {} };
    const ctx = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, P = [], last = 0, running = false;
    const sprite = (() => {
      const s = document.createElement('canvas'); s.width = s.height = 64;
      const g = s.getContext('2d'), rg = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      rg.addColorStop(0, 'rgba(255,248,236,1)'); rg.addColorStop(.18, 'rgba(240,226,204,.55)'); rg.addColorStop(1, 'rgba(210,200,235,0)');
      g.fillStyle = rg; g.fillRect(0, 0, 64, 64); return s;
    })();
    const spawn = (y) => ({ x: Math.random() * W, y: y ?? H + 20, r: 5 + Math.random() * 12, v: 6 + Math.random() * 12, ph: Math.random() * 6.28, sw: 8 + Math.random() * 22, a: .12 + Math.random() * .32 });
    function resize() {
      dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight;
      cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(clamp(W * H / 42000, 14, 36));
      P = Array.from({ length: n }, () => spawn(Math.random() * H));
      if (!RM && !running) { running = true; requestAnimationFrame(tick); }
    }
    function tick(t) {
      if (RM) { running = false; ctx.clearRect(0, 0, W, H); return; }
      requestAnimationFrame(tick);
      if (document.hidden || t - last < 33) return;
      const dt = Math.min(.1, (t - last) / 1000); last = t;
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of P) {
        p.y -= p.v * dt; p.ph += dt * .4;
        if (p.y < -30) Object.assign(p, spawn());
        const x = p.x + Math.sin(p.ph) * p.sw, tw = .75 + .25 * Math.sin(p.ph * 2.3);
        ctx.globalAlpha = p.a * tw * smooth(-30, 120, p.y);
        ctx.drawImage(sprite, x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
    }
    return { resize };
  })();

  // ── the soft light that follows the pointer (fine pointers only) ──
  const glow = $('#glowFollow');
  if (glow && matchMedia('(pointer: fine)').matches) {
    let tx = innerWidth / 2, ty = innerHeight * .4, x = tx, y = ty, on = false;
    addEventListener('pointermove', e => { tx = e.clientX; ty = e.clientY; if (!on) { on = true; requestAnimationFrame(follow); } }, { passive: true });
    function follow() {
      x = lerp(x, tx, .06); y = lerp(y, ty, .06);
      glow.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (Math.abs(x - tx) + Math.abs(y - ty) > .5 && !RM) requestAnimationFrame(follow); else on = false;
    }
  } else if (glow) glow.remove();

  // ── nav ──
  const nav = $('#nav');

  // ── the story: day 1 → day 30 ──
  const story = $('#journey'), dayNum = $('#dayNum'), trail = $('#trail');
  const layers = $$('.story-layers picture'), beats = $$('#beats .beat');
  const LAYER_FROM = [1, 3, 10, 15, 20, 28];              // the day each world arrives
  const beatDays = beats.map(b => +b.dataset.day);
  let trailPts = [], trailDots = [], trailLit = null, lastDay = 0;
  function buildTrail() {
    if (!trail) return;
    const w = trail.clientWidth || 600, h = 40, pad = 8;
    trail.setAttribute('viewBox', `0 0 ${w} ${h}`);
    trailPts = Array.from({ length: 30 }, (_, i) => [pad + i * (w - pad * 2) / 29, h / 2 + Math.sin(i * .55) * 9]);
    const d = trailPts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    trail.innerHTML = `<path class="t-path" d="${d}"/><path class="t-lit" d=""/>` + trailPts.map(p => `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${w < 500 ? 2.4 : 3}"/>`).join('');
    trailDots = $$('circle', trail); trailLit = $('.t-lit', trail); lastDay = 0;
  }
  function setDay(day) {
    if (day === lastDay) return; lastDay = day;
    dayNum.textContent = day;
    trailDots.forEach((c, i) => { c.classList.toggle('lit', i < day); c.classList.toggle('now', i === day - 1); });
    if (trailLit) trailLit.setAttribute('d', trailPts.slice(0, day).map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' '));
    let li = 0; LAYER_FROM.forEach((d, i) => { if (day >= d) li = i; });
    layers.forEach((l, i) => l.classList.toggle('on', i === li));
    let bi = 0; beatDays.forEach((d, i) => { if (day >= d) bi = i; });
    beats.forEach((b, i) => b.classList.toggle('on', i === bi));
  }
  function storyTick(vh) {
    if (!story) return;
    const r = story.getBoundingClientRect(), span = r.height - vh;
    const p = clamp(-r.top / span, 0, 1);
    const dayF = clamp(p / .9, 0, 1);
    setDay(Math.max(1, Math.ceil(dayF * 30)));
    if (!RM && r.top < vh && r.bottom > 0) {
      // each world pushes in slowly while it is on screen
      let li = 0; LAYER_FROM.forEach((d, i) => { if (lastDay >= d) li = i; });
      const a = (LAYER_FROM[li] - 1) / 30, b = ((LAYER_FROM[li + 1] || 31) - 1) / 30;
      const k = clamp((dayF - a) / (b - a), 0, 1);
      const img = layers[li] && layers[li].querySelector('img');
      if (img) img.style.setProperty('--z', (1.08 - .07 * k).toFixed(4));
    }
  }

  // ── thirty chapters: pinned sideways travel on wide screens ──
  const chapters = $('#chapters'), strip = $('#strip'), track = $('#stripTrack');
  let pinTravel = 0;
  function setupChapters() {
    if (!chapters) return;
    const wide = matchMedia('(min-width: 900px)').matches && !RM;
    chapters.classList.toggle('pinned', wide);
    if (!wide) { chapters.style.height = ''; track.style.transform = ''; return; }
    pinTravel = Math.max(0, track.scrollWidth - innerWidth);
    chapters.style.height = (innerHeight + pinTravel * .8) + 'px';
  }
  function chaptersTick(vh) {
    if (!chapters || !chapters.classList.contains('pinned')) return;
    const r = chapters.getBoundingClientRect(), span = r.height - vh;
    if (r.top > vh || r.bottom < 0) return;
    const p = clamp(-r.top / span, 0, 1);
    track.style.transform = `translate3d(${(-p * pinTravel).toFixed(1)}px,0,0)`;
  }

  // ── the mist lifts ──
  const mist = $('#mist'), awake = $('#mistAwake'), mistState = $('#mistState'), meter = $('#mistMeter');
  const STAGES = ['Asleep', 'Stirring', 'Working', 'Radiant'];
  let lastStage = -1;
  function mistTick(vh) {
    if (!mist) return;
    const r = mist.getBoundingClientRect();
    if (r.top > vh || r.bottom < 0) return;
    const p = clamp(-r.top / (r.height - vh), 0, 1), k = smooth(.12, .78, p);
    awake.style.opacity = k.toFixed(3);
    if (!RM) awake.style.filter = `blur(${((1 - k) * 8).toFixed(2)}px)`;
    meter.style.transform = `scaleX(${k.toFixed(3)})`;
    const st = k < .12 ? 0 : k < .5 ? 1 : k < .92 ? 2 : 3;
    if (st !== lastStage) { lastStage = st; mistState.textContent = STAGES[st]; }
  }

  // ── gentle parallax on the full-bleed media ──
  const para = $$('[data-parallax]');
  function paraTick(vh) {
    if (RM) return;
    para.forEach(el => {
      const r = el.parentElement.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh) return;
      el.style.transform = `translate3d(0, ${(-r.top * +el.dataset.parallax).toFixed(1)}px, 0)`;
    });
  }

  // ── the scroll loop: one rAF per frame, only when something moved ──
  let queued = false;
  function frame() {
    queued = false;
    const vh = innerHeight;
    nav.classList.toggle('scrolled', scrollY > 24);
    storyTick(vh); chaptersTick(vh); mistTick(vh); paraTick(vh);
  }
  const request = () => { if (!queued) { queued = true; requestAnimationFrame(frame); } };
  addEventListener('scroll', request, { passive: true });
  function onResize() { buildTrail(); setupChapters(); motes.resize(); if (RM) para.forEach(el => { el.style.transform = ''; }); request(); }
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(onResize, 120); });
  onResize();
  addEventListener('load', () => { setupChapters(); request(); });

  // ── Home's sky, for the visitor's real hour ──
  // Colours from the app's own sky keys (the isles' clock), set to ordinary hours.
  const SKY = [
    // hour, top, mid, horizon, sea, far mountains, near mountains, land, stars, name
    [0, '#020412', '#080e2e', '#15193f', '#101438', '#262a58', '#1a1d45', '#0d1030', 1, 'night'],
    [5, '#050821', '#141c48', '#2a2c5e', '#161b44', '#2f3162', '#22244f', '#111434', .9, 'night'],
    [6.3, '#0a1238', '#2a3a7a', '#e6b8c6', '#4a4f8a', '#6a6aa8', '#4d4f88', '#262a58', .4, 'dawn'],
    [8, '#2a5ab0', '#6a96d8', '#dfe6f4', '#6d8fc4', '#8fa3cf', '#6e7fb0', '#3d4a70', 0, 'morning'],
    [12, '#3a6ec8', '#7aa6e8', '#e2ecfa', '#6f9ad6', '#97aedb', '#7488bb', '#43507a', 0, 'midday'],
    [16, '#3a66be', '#80a4e0', '#f1e6dc', '#7596cc', '#9aa9d4', '#7a86b6', '#454f7a', 0, 'afternoon'],
    [18.2, '#4a5aa8', '#b08ac8', '#ffcf9e', '#8a7ab0', '#b096c0', '#8a74a8', '#4a3f70', 0, 'golden hour'],
    [19.3, '#1a1a50', '#5a4a98', '#d88aa8', '#4a4488', '#7a6aa8', '#554a8a', '#2e2860', .35, 'dusk'],
    [20.6, '#030617', '#0c1236', '#1b1e46', '#12163c', '#2b2f5c', '#1d2049', '#0e1131', .95, 'night'],
    [24, '#020412', '#080e2e', '#15193f', '#101438', '#262a58', '#1a1d45', '#0d1030', 1, 'night'],
  ];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const mix = (a, b, t) => { const A = hex(a), B = hex(b); return '#' + A.map((v, i) => Math.round(lerp(v, B[i], t)).toString(16).padStart(2, '0')).join(''); };
  function roadSky() {
    const svg = $('#roadScene svg'); if (!svg) return;
    const d = new Date(), h = d.getHours() + d.getMinutes() / 60;
    let i = 0; while (i < SKY.length - 2 && SKY[i + 1][0] <= h) i++;
    const A = SKY[i], B = SKY[i + 1], t = smooth(0, 1, (h - A[0]) / (B[0] - A[0]));
    const c = k => mix(A[k], B[k], t);
    const set = (id, attr, v) => { const el = svg.getElementById ? svg.getElementById(id) : svg.querySelector('#' + id); if (el) el.setAttribute(attr, v); };
    set('rsS0', 'stop-color', c(1)); set('rsS1', 'stop-color', c(2)); set('rsS2', 'stop-color', c(3));
    set('rsW0', 'stop-color', mix(c(4), c(3), .25)); set('rsW1', 'stop-color', mix(c(4), '#070a1e', .55));
    set('rsM3', 'fill', c(5)); set('rsM2', 'fill', c(6)); set('rsLand', 'fill', c(7));
    const stars = lerp(A[8], B[8], t);
    const sg = svg.querySelector('#rsStars');
    if (sg && !sg.childElementCount) {
      let s = ''; for (let k = 0; k < 70; k++) { const x = (k * 137.5) % 800, y = (k * 71.3) % 210; s += `<circle cx="${x.toFixed(0)}" cy="${y.toFixed(0)}" r="${(k % 3 ? .7 : 1.2)}" opacity="${(.35 + (k % 5) / 8).toFixed(2)}"/>`; }
      sg.innerHTML = s;
    }
    if (sg) sg.setAttribute('opacity', stars.toFixed(2));
    // the sun by day, the moon by night, on one arc
    const day = h >= 6 && h < 20.2, u = day ? (h - 6) / 14.2 : ((h + 24 - 20.2) % 24) / 9.8;
    const x = 80 + u * 640, y = 250 - Math.sin(u * Math.PI) * 190;
    const sun = svg.querySelector('#rsSun'); if (sun) sun.setAttribute('transform', `translate(${x.toFixed(0)} ${y.toFixed(0)})`);
    set('rsDisc', 'fill', day ? (h > 17.5 ? '#ffe2c4' : '#fff6e6') : '#e8ecff');
    set('rsDisc', 'r', day ? 16 : 12);
    const shine = svg.querySelector('#rsShine'); if (shine) shine.setAttribute('transform', `translate(${(x - 410).toFixed(0)} 0)`);
    const name = t < .5 ? A[9] : B[9];
    const now = $('#roadNow'), chip = $('#roadChip');
    if (now) now.textContent = `Right now it’s ${name} where you are, so this is how your Home looks.`;
    if (chip) chip.textContent = `Your sky · ${name}`;
  }
  roadSky(); setInterval(roadSky, 60000);

  // ── the live isles (loaded only on request) ──
  const dlg = $('#islesDialog'), openBtn = $('#openIsles');
  if (dlg && openBtn) {
    const world = $('#idWorld'), loading = $('#idLoading'), list = $('#idWonders'), hint = $('#idHint'), glowEl = $('#idGlow');
    let frameEl = null, HW = null, CAT = null, state = {}, busy = false, lastFocus = null, readyTimer = 0;
    const name = id => (CAT.wonders.find(w => w.id === id) || {}).name || id;
    const glowOf = () => Object.values(state).reduce((a, b) => a + (b | 0), 0);
    const isOpen = w => { const need = CAT.mist[String(w.isle)]; return need === undefined || glowOf() >= need; };
    // the fairground and the famous ones first, then the rest in catalogue order
    const FIRST = ['windmill', 'lantern_gate', 'music_box', 'sky_loom', 'bell_tower', 'kite_reel', 'balloon_swings', 'prism_fountain', 'lighthouse', 'big_top', 'sky_carousel', 'teacup_spinner', 'orrery', 'star_wheel', 'observatory'];
    function order() {
      const ws = CAT.wonders.slice();
      return ws.sort((a, b) => {
        const ia = FIRST.indexOf(a.id), ib = FIRST.indexOf(b.id);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
      });
    }
    function renderList() {
      const g = glowOf();
      glowEl.textContent = g;
      list.innerHTML = '';
      order().forEach(w => {
        const st = state[w.id] | 0, open = isOpen(w);
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'id-w'; b.dataset.id = w.id;
        b.disabled = busy || st >= 3 || !open;
        const need = CAT.mist[String(w.isle)];
        const label = !open ? `In the mist until glow ${need}` : st >= 3 ? 'Radiant' : st === 0 ? 'Give sunlight' : `Give sunlight · ${['', 'Stirring', 'Working'][st]}`;
        b.innerHTML = `<strong>${w.name.replace(/^The /, '')}</strong><span class="pips">${[1, 2, 3].map(k => `<i class="${st >= k ? 'on' : ''}"></i>`).join('')}</span><small>${label}</small>`;
        b.setAttribute('aria-label', `${w.name}: ${st >= 3 ? 'radiant' : open ? 'give sunlight' : 'still in the mist'}`);
        list.appendChild(b);
      });
    }
    function push(quiet) {
      if (!HW) return;
      if (quiet) HW.quietNext(quiet);
      HW.setHome({ wonders: Object.assign({}, state) }, 999, {});
    }
    function wake(id) {
      const w = CAT.wonders.find(q => q.id === id); if (!w || busy) return;
      const st = state[id] | 0; if (st >= 3) return;
      busy = true; renderList();
      HW.overview(false); ovBtn.setAttribute('aria-pressed', 'false');
      HW.flyTo(id);
      hint.innerHTML = `<b>${w.name}</b> · ${w.stages[st]}`;
      setTimeout(() => {
        const before = glowOf();
        state[id] = st + 1; push();
        const after = glowOf();
        const lifted = Object.entries(CAT.mist).filter(([, n]) => before < n && after >= n).length;
        if (lifted) setTimeout(() => { hint.innerHTML = 'The mist lifts off another isle, and its bridge mends.'; }, 3200);
        setTimeout(() => { busy = false; renderList(); }, 3000);
      }, 1500);
    }
    list.addEventListener('click', e => { const b = e.target.closest('.id-w'); if (b && !b.disabled) wake(b.dataset.id); });
    $$('.id-hours button', dlg).forEach(b => b.addEventListener('click', () => {
      $$('.id-hours button', dlg).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      if (HW) HW.setHour(+b.dataset.h);
    }));
    const ovBtn = $('#idOverview');
    ovBtn.addEventListener('click', () => { const on = ovBtn.getAttribute('aria-pressed') !== 'true'; ovBtn.setAttribute('aria-pressed', String(on)); if (HW) { HW.setTags(false); HW.overview(on); } });
    $('#idAll').addEventListener('click', () => {
      if (!HW || busy) return;
      CAT.wonders.forEach(w => { state[w.id] = 3; });
      push('wakes'); renderList();
      HW.setTags(false); HW.overview(true); ovBtn.setAttribute('aria-pressed', 'true');
      hint.innerHTML = 'Every wonder is awake. <b>The isles glow.</b>';
    });
    addEventListener('message', e => {
      if (e.origin !== location.origin || !e.data || !e.data.isles) return;
      const m = e.data.isles;
      if (m.ready) reveal();
      if (m.select && CAT) {
        const w = CAT.wonders.find(q => q.id === m.select);
        if (w) {
          const st = state[w.id] | 0;
          hint.innerHTML = `<b>${w.name}</b> · ${st >= 3 ? w.stages[2] : isOpen(w) ? 'Give it sunlight below.' : 'Still in the mist.'}`;
          const chip = list.querySelector(`[data-id="${w.id}"]`); if (chip) chip.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', inline: 'center', block: 'nearest' });
        }
      }
    });
    function reveal() { clearTimeout(readyTimer); loading.classList.add('gone'); }
    function open() {
      lastFocus = document.activeElement;
      dlg.hidden = false; document.body.classList.add('dialog-open');
      requestAnimationFrame(() => dlg.classList.add('open'));
      loading.classList.remove('gone');
      state = {}; busy = false; hint.textContent = 'Give a wonder sunlight to wake it. Drag in the world to walk Aurel.';
      $$('.id-hours button', dlg).forEach(x => x.setAttribute('aria-pressed', String(x.dataset.h === '17.05')));
      ovBtn.setAttribute('aria-pressed', 'false');
      frameEl = document.createElement('iframe');
      frameEl.title = 'Aurel’s Home, live 3D';
      frameEl.src = 'world/isles.html';
      frameEl.setAttribute('allow', 'autoplay');
      frameEl.addEventListener('load', () => {
        try {
          HW = frameEl.contentWindow.HW; CAT = HW && HW.CATALOGUE;
          if (!HW || !CAT) throw new Error('isles did not start');
          HW.setHour(17.05); HW.setTags(false);
          push('all'); renderList();
          readyTimer = setTimeout(reveal, 4000);
        } catch (err) { loading.querySelector('p').textContent = 'The isles could not load here. Try again on a newer browser.'; }
      });
      world.appendChild(frameEl);
      $('#idClose').focus();
    }
    function close() {
      try { HW && HW.shutdown && HW.shutdown(); } catch (e) { /* the world is going anyway */ }
      HW = null; CAT = null;
      dlg.classList.remove('open'); document.body.classList.remove('dialog-open');
      setTimeout(() => { if (frameEl) { frameEl.remove(); frameEl = null; } dlg.hidden = true; list.innerHTML = ''; }, 500);
      if (lastFocus) lastFocus.focus();
    }
    openBtn.addEventListener('click', open);
    $('#idClose').addEventListener('click', close);
    addEventListener('keydown', e => {
      if (dlg.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'Tab') {   // keep focus inside the dialog's own controls
        const f = $$('button:not([disabled])', dlg).filter(b => b.offsetParent !== null);
        if (!f.length) return;
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
  }
})();
