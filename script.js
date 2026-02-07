// ========================================
// Footer year
// ========================================
const currentYearEl = document.getElementById('current-year');
if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

// ========================================
// Segmented Nav — smooth scroll & mobile toggle
// ========================================
const segNav = document.querySelector('.seg-nav');
const navToggle = document.querySelector('.seg-nav .nav-toggle');
const navLinks = document.querySelector('.seg-nav .nav-links');

// Mobile toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.innerHTML = open
      ? '<i class="fas fa-times"></i>'
      : '<i class="fas fa-bars"></i>';
  });
}

// Smooth scroll for hash links
document.querySelectorAll('.seg-nav a[href^="#"], .scroll-cta[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (!href || href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      closeMobileNav();
      return;
    }
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 60;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      closeMobileNav();
    }
  });
});

function closeMobileNav() {
  if (navLinks && navLinks.classList.contains('open')) {
    navLinks.classList.remove('open');
    if (navToggle) navToggle.innerHTML = '<i class="fas fa-bars"></i>';
  }
}

// Close mobile nav on outside click
document.addEventListener('click', e => {
  if (segNav && navLinks && navLinks.classList.contains('open')) {
    if (!segNav.contains(e.target)) closeMobileNav();
  }
});

// ========================================
// Segmented Nav — active tab tracking
// ========================================
const navTabLinks = document.querySelectorAll('.seg-nav .nav-links a[href^="#"]');
const sections = [];

navTabLinks.forEach(link => {
  const id = link.getAttribute('href').slice(1);
  const section = document.getElementById(id);
  if (section) sections.push({ el: section, link });
});

if (sections.length) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const match = sections.find(s => s.el === entry.target);
      if (match) {
        if (entry.isIntersecting) {
          navTabLinks.forEach(l => l.classList.remove('active'));
          match.link.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(s => navObserver.observe(s.el));
}

// ========================================
// Scroll Reveal (.rv elements)
// ========================================
const revealEls = document.querySelectorAll('.rv');
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('vis');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => revealObserver.observe(el));
}

