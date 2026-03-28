// Habitage — JS

// Year
const yr = document.getElementById('yr');
if (yr) yr.textContent = new Date().getFullYear();

// Generate starfield
(function() {
  const container = document.getElementById('stars');
  if (!container) return;
  const count = 80;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star-dot';
    const size = 1 + Math.random() * 2;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.setProperty('--dur', (2 + Math.random() * 3) + 's');
    star.style.setProperty('--o1', (0.1 + Math.random() * 0.3).toFixed(2));
    star.style.setProperty('--o2', (0.5 + Math.random() * 0.5).toFixed(2));
    star.style.animationDelay = (Math.random() * 3) + 's';
    container.appendChild(star);
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
