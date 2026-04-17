// Habitage — JS

// Year
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Generate subtle starfield
(function() {
  const c = document.getElementById('stars-bg');
  if (!c) return;
  for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 's';
    const size = 0.8 + Math.random() * 1.5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + '%';
    s.style.top = Math.random() * 100 + '%';
    s.style.setProperty('--d', (3 + Math.random() * 4) + 's');
    s.style.setProperty('--o1', (0.05 + Math.random() * 0.15).toFixed(2));
    s.style.setProperty('--o2', (0.25 + Math.random() * 0.35).toFixed(2));
    s.style.animationDelay = (Math.random() * 4) + 's';
    c.appendChild(s);
  }
})();

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const h = this.getAttribute('href');
    if (h === '#') { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    const t = document.querySelector(h);
    if (t) { e.preventDefault(); window.scrollTo({ top: t.getBoundingClientRect().top + window.pageYOffset - 70, behavior: 'smooth' }); }
  });
});

// Scroll reveal
(function() {
  const els = document.querySelectorAll('.rv');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  els.forEach(el => obs.observe(el));
})();
