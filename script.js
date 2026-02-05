// Set current year in footer (globally)
const currentYearGlobalEl = document.getElementById('current-year');
if (currentYearGlobalEl) {
    currentYearGlobalEl.textContent = new Date().getFullYear();
}

// Smooth scroll for navigation links (will only work if #anchors are present)
document.querySelectorAll('nav a[href^="#"], .hero a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) { // Only for internal # links
            e.preventDefault();
            const targetId = href;
            const targetElement = (targetId === '#contact')
                ? document.getElementById('contact')
                : document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = 80; // Adjust if your header height changes
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: "smooth" });
                if (targetId === '#app') targetElement.blur();
            }
            // Close mobile menu if open after clicking a # link
            const nav = document.getElementById('main-nav');
            const menuToggle = document.getElementById('menu-toggle-button'); // Re-fetch here or ensure it's the same global const
            if (nav && nav.classList.contains('active')) {
                nav.classList.remove('active');
                if (menuToggle) menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
        // For non-# links (like privacy.html, terms.html), the menu closure is handled by the logic below
    });
});

// Basic mobile menu toggle functionality (Global)
const menuToggleButton = document.getElementById('menu-toggle-button');
const mainNav = document.getElementById('main-nav');

if (menuToggleButton && mainNav) {
    menuToggleButton.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        menuToggleButton.innerHTML = mainNav.classList.contains('active') ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when a link *inside the nav* leading to another .html page is clicked
    mainNav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            const href = link.getAttribute('href');
            // Check if it's a link to another page (not a # hash link on the same page)
            if (mainNav.classList.contains('active') && href && (href.includes('.html') || !href.startsWith('#'))) {
                mainNav.classList.remove('active');
                menuToggleButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Close menu when clicking outside the nav or toggle button on mobile
    document.addEventListener('click', function(event) {
        if (mainNav.classList.contains('active')) {
            const isClickInsideNav = mainNav.contains(event.target);
            const isClickOnToggle = menuToggleButton.contains(event.target);
            if (!isClickInsideNav && !isClickOnToggle) {
                mainNav.classList.remove('active');
                menuToggleButton.innerHTML = '<i class="fas fa-bars"></i>';
            }
        }
    });
}


// Peacock fan animation — fans open on enter, stacks back on scroll past
(function() {
  const phones = document.querySelector('.app-showcase-phones');
  if (!phones) return;
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        phones.classList.add('fanned');
      } else {
        phones.classList.remove('fanned');
      }
    });
  }, { threshold: 0.15 });
  obs.observe(phones);
})();

// --- Circle Animation Script (v3.2 - Slower Speed, Reduced Quantity) ---
console.log("Circle Animation Script: Starting (v3.2 - Slower Speed, Reduced Quantity)");

const canvas = document.getElementById('animated-bg-canvas'); // Ensure this ID is used in all HTML
if (canvas) {
    console.log("Circle Animation Script: Canvas element found.");
    const ctx = canvas.getContext('2d');
    let circlesArray;
    let animationFrameId;
    let circleSpacing = 70; // Reduced quantity

    let circleBaseColorCSS, circleMinOpacityCSS, circleMaxOpacityCSS, baseBgColorCSS;

    function updateCSSVariables() {
        try {
            circleBaseColorCSS = getComputedStyle(document.documentElement).getPropertyValue('--circle-color').trim();
            circleMinOpacityCSS = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--circle-pulse-min-opacity'));
            circleMaxOpacityCSS = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--circle-pulse-max-opacity'));
            baseBgColorCSS = getComputedStyle(document.documentElement).getPropertyValue('--light-bg').trim();
            if (!circleBaseColorCSS || isNaN(circleMinOpacityCSS) || isNaN(circleMaxOpacityCSS) || !baseBgColorCSS) {
                console.warn("Circle Animation Script: CSS variables not fully loaded.");
            }
        } catch (error) {
            console.error("Circle Animation Script: Error in updateCSSVariables():", error);
        }
    }

    function setupCanvas() {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        updateCSSVariables();
        createCircles();
        animateCircles();
    }

    class Circle {
        constructor(x, y, initialGridStaggerDelay = 0) {
            this.x = x; this.y = y;
            this.nextAnimationCycleDelay = initialGridStaggerDelay;
            this.elapsedDelayForNextCycle = 0;
            this.lineWidth = 1.5;
            this.angleIncreaseRate = (Math.random() * 0.015) + 0.005; // Slower forming
            this.fadeOutRate = 0.005 + (Math.random() * 0.005);    // Slower fading
            this.resetAnimationState();
        }
        resetAnimationState() {
            this.maxRadius = Math.random() * 12 + 6; // Smaller radius: 6 to 18
            this.currentAngle = 0; this.opacity = 0;
            this.isForming = true; this.isFading = false;
            let minOpacity = isNaN(circleMinOpacityCSS) ? 0.2 : circleMinOpacityCSS;
            let maxOpacity = isNaN(circleMaxOpacityCSS) ? 0.7 : circleMaxOpacityCSS;
            this.targetPeakOpacity = Math.random() * (maxOpacity - minOpacity) + minOpacity;
        }
        update() {
            if (this.elapsedDelayForNextCycle < this.nextAnimationCycleDelay) {
                this.elapsedDelayForNextCycle++; return;
            }
            if (this.isForming) {
                this.currentAngle += this.angleIncreaseRate;
                this.opacity = (this.currentAngle < Math.PI) ? (this.currentAngle / Math.PI) * this.targetPeakOpacity : this.targetPeakOpacity;
                this.opacity = Math.min(this.opacity, this.targetPeakOpacity);
                if (this.currentAngle >= Math.PI * 2) {
                    this.currentAngle = Math.PI * 2; this.opacity = this.targetPeakOpacity;
                    this.isForming = false; this.isFading = true;
                }
            } else if (this.isFading) {
                this.opacity -= this.fadeOutRate;
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    this.nextAnimationCycleDelay = Math.random() * 400 + 100;
                    this.elapsedDelayForNextCycle = 0;
                    this.resetAnimationState(); return;
                }
            }
            this.draw();
        }
        draw() {
            if (!ctx || this.opacity <= 0 || this.currentAngle <= 0.001) return;
            let baseColorForStroke = circleBaseColorCSS;
            if (!baseColorForStroke || typeof baseColorForStroke !== 'string' || !baseColorForStroke.startsWith('rgba')) {
                baseColorForStroke = "rgba(251, 113, 133, 1)";
            }
            const match = baseColorForStroke.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
            let r = 251, g = 113, b = 133;
            if (match) { r = match[1]; g = match[2]; b = match[3]; }
            ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${this.opacity})`;
            ctx.lineWidth = this.lineWidth;
            ctx.beginPath(); ctx.arc(this.x, this.y, this.maxRadius, 0, this.currentAngle); ctx.stroke();
        }
    }

    function createCircles() {
        circlesArray = [];
        let currentBgColor = baseBgColorCSS || "rgba(255,255,255,1)";
        ctx.fillStyle = currentBgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
        for (let x = circleSpacing / 2; x < canvas.width + circleSpacing; x += circleSpacing) {
            for (let y = circleSpacing / 2; y < canvas.height + circleSpacing; y += circleSpacing) {
                circlesArray.push(new Circle(x, y, Math.random() * 400));
            }
        }
        console.log(`Circle Animation Script: ${circlesArray.length} circles prepared.`);
    }

    function animateCircles() {
        let currentBgColor = baseBgColorCSS || "rgba(255,255,255,1)";
        ctx.fillStyle = currentBgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (circlesArray) circlesArray.forEach(circle => circle.update());
        animationFrameId = requestAnimationFrame(animateCircles);
    }

    const debouncedSetupCanvas = debounce(setupCanvas, 150);
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => { clearTimeout(timeout); func(...args); };
            clearTimeout(timeout); timeout = setTimeout(later, wait);
        };
    }
    window.addEventListener('resize', debouncedSetupCanvas);

    function initAnimation() {
        console.log("Circle Animation Script: Initializing animation setup.");
        setupCanvas();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAnimation);
    } else {
        initAnimation();
    }
} else {
    console.error("Circle Animation Script: Canvas element with ID 'animated-bg-canvas' NOT FOUND.");
}