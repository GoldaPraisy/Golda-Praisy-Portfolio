/* ═══════════════════════════════════════════════════════════
   ALEX MORGAN PORTFOLIO — script.js
═══════════════════════════════════════════════════════════ */

/* ─── LOADER ─────────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Trigger hero animations
    document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 100 + i * 100);
    });
    startCounters();
  }, 2200);
});

/* ─── CUSTOM CURSOR ──────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let cursorX = 0, cursorY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  cursorX = e.clientX;
  cursorY = e.clientY;
  dot.style.left = cursorX + 'px';
  dot.style.top  = cursorY + 'px';
});

// Smooth ring follow
(function animateRing() {
  ringX += (cursorX - ringX) * 0.12;
  ringY += (cursorY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

// On mobile, hide cursor elements
if ('ontouchstart' in window) {
  dot.style.display = ring.style.display = 'none';
  document.body.style.cursor = 'auto';
}

/* ─── BUBBLE CANVAS ──────────────────────────────────────── */
const canvas = document.getElementById('bubble-canvas');
const ctx    = canvas.getContext('2d');
let bubbles  = [];

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Bubble {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = canvas.height + Math.random() * 200;
    this.r  = 6 + Math.random() * 28;
    this.sp = 0.3 + Math.random() * 0.7;
    this.op = 0.04 + Math.random() * 0.12;
    this.dx = (Math.random() - 0.5) * 0.4;
    this.hue = 210 + Math.random() * 40;
  }
  update() {
    this.y  -= this.sp;
    this.x  += this.dx;
    if (this.y + this.r < 0) this.reset();
  }
  draw() {
    ctx.beginPath();
    const grad = ctx.createRadialGradient(
      this.x - this.r * 0.3, this.y - this.r * 0.3, this.r * 0.1,
      this.x, this.y, this.r
    );
    grad.addColorStop(0, `hsla(${this.hue},30%,75%,${this.op * 1.5})`);
    grad.addColorStop(1, `hsla(${this.hue},20%,60%,${this.op * 0.2})`);
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.strokeStyle = `hsla(${this.hue},25%,65%,${this.op})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }
}

// Create bubbles
for (let i = 0; i < 55; i++) {
  const b = new Bubble();
  b.y = Math.random() * canvas.height; // scatter initially
  bubbles.push(b);
}

function animateBubbles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  bubbles.forEach(b => { b.update(); b.draw(); });
  requestAnimationFrame(animateBubbles);
}
animateBubbles();

/* ─── NAVBAR ─────────────────────────────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');
const navAnchors = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);

  // Scroll-to-top button
  const scrollTop = document.getElementById('scroll-top');
  if (window.scrollY > 400) {
    scrollTop.hidden = false;
  } else {
    scrollTop.hidden = true;
  }

  // Active nav link
  const sections = document.querySelectorAll('section[id]');
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
  });
  navAnchors.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
});

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navAnchors.forEach(a => {
  a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

/* ─── SCROLL REVEAL ──────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const observer  = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

/* ─── TYPING TEXT ────────────────────────────────────────── */
const words = [
  'CSE Student @ Grace College',
  'Full-Stack Developer',
  'MERN Stack Developer',
  'AI & Data Science Enthusiast',
  'Spring Boot Developer',
  'UI/UX Designer'
];
let wIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const word = words[wIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) {
      deleting = true;
      setTimeout(type, 1600);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
    }
  }
  setTimeout(type, deleting ? 55 : 85);
}
setTimeout(type, 2600); // Start after loader

/* ─── SKILL BAR ANIMATION ────────────────────────────────── */
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const w = fill.getAttribute('data-width');
        setTimeout(() => fill.style.width = w + '%', 200);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const skillSection = document.getElementById('skill-bars');
if (skillSection) skillObserver.observe(skillSection);

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
function startCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.getAttribute('data-target'));
    let cur = 0;
    const step = Math.ceil(target / 30);
    const timer = setInterval(() => {
      cur = Math.min(cur + step, target);
      el.textContent = cur;
      if (cur >= target) clearInterval(timer);
    }, 50);
  });
}

/* ─── CERTIFICATE SLIDER ─────────────────────────────────── */
(function initCertSlider() {
  const track   = document.getElementById('cert-track');
  const prevBtn = document.getElementById('cert-prev');
  const nextBtn = document.getElementById('cert-next');
  const dots    = document.querySelectorAll('.cert-dot');
  if (!track || !prevBtn || !nextBtn) return;

  const slides  = track.querySelectorAll('.cert-slide');
  const total   = slides.length;
  let current   = 0;
  let autoTimer = null;

  function goTo(idx, animate) {
    if (animate === undefined) animate = true;
    current = ((idx % total) + total) % total;
    track.style.transition = animate
      ? 'transform 0.55s cubic-bezier(0.4,0,0.2,1)' : 'none';
    track.style.transform = 'translateX(-' + (current * 100) + '%)';
    dots.forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  function startAuto() {
    stopAuto();
    autoTimer = setInterval(function() { goTo(current + 1); }, 4500);
  }
  function stopAuto() {
    if (autoTimer) clearInterval(autoTimer);
  }

  prevBtn.addEventListener('click', function() { goTo(current - 1); stopAuto(); startAuto(); });
  nextBtn.addEventListener('click', function() { goTo(current + 1); stopAuto(); startAuto(); });

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(dot.getAttribute('data-idx')));
      stopAuto(); startAuto();
    });
  });

  // Keyboard arrows when certs section is visible
  document.addEventListener('keydown', function(e) {
    var sec  = document.getElementById('certificates');
    var rect = sec ? sec.getBoundingClientRect() : null;
    if (!rect || rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (e.key === 'ArrowLeft')  { goTo(current - 1); stopAuto(); startAuto(); }
    if (e.key === 'ArrowRight') { goTo(current + 1); stopAuto(); startAuto(); }
  });

  // Swipe support
  var touchStartX = 0;
  track.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(dx) > 50) { goTo(dx < 0 ? current + 1 : current - 1); stopAuto(); startAuto(); }
  });

  // Pause on hover
  var wrap = document.querySelector('.cert-slider-wrap');
  if (wrap) {
    wrap.addEventListener('mouseenter', stopAuto);
    wrap.addEventListener('mouseleave', startAuto);
  }

  goTo(0, false);
  startAuto();
}());

/* ─── THEME TOGGLE ───────────────────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = themeToggle.querySelector('.theme-icon');
let isDark = false;

// Respect system preference
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  isDark = true;
  document.documentElement.setAttribute('data-theme', 'dark');
  themeIcon.textContent = '☀';
}

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.textContent = isDark ? '☀' : '☽';
});

/* ─── SCROLL TO TOP ──────────────────────────────────────── */
document.getElementById('scroll-top').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ─── CONTACT FORM ───────────────────────────────────────── */
const contactForm = document.getElementById('contact-form');
const formSuccess = document.getElementById('form-success');

contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = contactForm.querySelector('#name').value.trim();
  const email = contactForm.querySelector('#email').value.trim();
  const msg   = contactForm.querySelector('#message').value.trim();
  if (!name || !email || !msg) return;

  // Simulate send
  const btn = contactForm.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;
  setTimeout(() => {
    formSuccess.hidden = false;
    contactForm.reset();
    btn.textContent = 'Send Message';
    btn.disabled = false;
    setTimeout(() => formSuccess.hidden = true, 4000);
  }, 1200);
});

/* ─── SMOOTH NAV SCROLL ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.offsetTop - document.getElementById('navbar').offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── STAGGER CARD REVEALS ───────────────────────────────── */
// Add delay to sibling reveal-up cards for stagger effect
document.querySelectorAll('.projects-grid, .about-grid, .achieve-grid, .certs-grid').forEach(grid => {
  grid.querySelectorAll('.reveal-up').forEach((card, i) => {
    card.style.transitionDelay = (i * 0.08) + 's';
  });
});

/* ─── PARALLAX HERO ──────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const heroText = document.querySelector('.hero-text');
  if (heroText && scrolled < window.innerHeight) {
    heroText.style.transform = `translateY(${scrolled * 0.08}px)`;
  }
});

/* ─── HOVER: PROFILE RING SPEED UP ON HOVER ─────────────── */
const profileRing = document.querySelector('.profile-glow');
const heroImage   = document.querySelector('.hero-image');
if (heroImage && profileRing) {
  heroImage.addEventListener('mouseenter', () => {
    profileRing.style.animationDuration = '1.2s';
  });
  heroImage.addEventListener('mouseleave', () => {
    profileRing.style.animationDuration = '4s';
  });
}

/* ─── DARK-MODE BUBBLE COLOR ADAPTATION ─────────────────── */
const darkMQ = window.matchMedia('(prefers-color-scheme: dark)');
function adaptBubbles(dark) {
  canvas.style.opacity = dark ? '0.25' : '0.5';
}
adaptBubbles(darkMQ.matches);
darkMQ.addEventListener('change', e => adaptBubbles(e.matches));

themeToggle.addEventListener('click', () => {
  canvas.style.opacity = isDark ? '0.25' : '0.5';
});

console.log('%c🚀 Golda Praisy R — Portfolio', 'font-size:18px;font-weight:bold;color:#5c6bc0;');
console.log('%cBuilt with ♡ using HTML, CSS & Vanilla JS · Thoothukudi, Tamil Nadu', 'color:#8a8a96;');
