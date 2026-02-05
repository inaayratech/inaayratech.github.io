// Battle Within – v3 JS

// Footer year
const y = document.getElementById('bw-yr');
if (y) y.textContent = new Date().getFullYear();

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const h = this.getAttribute('href');
    if (!h.startsWith('#')) return;
    if (h === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    e.preventDefault();
    const t = document.querySelector(h);
    if (t) {
      window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 60, behavior: 'smooth' });
    }
  });
});

// Segmented nav – highlight active tab on scroll
(function() {
  const tabs = document.querySelectorAll('.seg-tab');
  const brandTab = document.querySelector('.seg-tab-brand');
  const sections = [];
  tabs.forEach(tab => {
    if (tab === brandTab) return;
    const id = tab.getAttribute('href');
    if (id && id.startsWith('#')) {
      const el = document.querySelector(id);
      if (el) sections.push({ el, tab });
    }
  });
  if (!sections.length) return;

  function update() {
    const firstInView = sections[0].el.getBoundingClientRect().top > 120;
    tabs.forEach(t => t.classList.remove('active'));
    if (firstInView) {
      if (brandTab) brandTab.classList.add('active');
      return;
    }
    let active = sections[0];
    for (const s of sections) {
      if (s.el.getBoundingClientRect().top <= 120) active = s;
    }
    active.tab.classList.add('active');
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

// Typewriter
(function() {
  const lines = document.querySelectorAll('.tw');
  if (!lines.length) return;
  let c = 0;

  function type(el, txt, cb) {
    el.classList.add('typing');
    el.textContent = '';
    const cur = document.createElement('span');
    cur.className = 'tw-c';
    el.appendChild(cur);
    let i = 0;
    (function go() {
      if (i < txt.length) {
        el.insertBefore(document.createTextNode(txt[i++]), cur);
        setTimeout(go, 42);
      } else {
        el.classList.replace('typing', 'done');
        setTimeout(() => { cur.remove(); cb?.(); }, 550);
      }
    })();
  }

  function run() {
    if (c >= lines.length) return;
    const el = lines[c];
    const txt = el.dataset.t || el.textContent;
    el.textContent = '';
    type(el, txt, () => { c++; run(); });
  }

  const obs = new IntersectionObserver(en => {
    if (en[0]?.isIntersecting) { obs.disconnect(); setTimeout(run, 400); }
  }, { threshold: 0.3 });

  const hero = document.querySelector('.hero');
  hero ? obs.observe(hero) : setTimeout(run, 400);
})();

// Scroll reveal
(function() {
  const els = document.querySelectorAll('.rv, .sg');
  if (!els.length) return;
  const obs = new IntersectionObserver(en => {
    en.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.06, rootMargin: '0px 0px -20px 0px' });
  els.forEach(el => obs.observe(el));
})();
