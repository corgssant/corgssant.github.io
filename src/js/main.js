// ============================================
// CNO Pole Barns - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // --- Scroll-based nav styling ---
  const nav = document.querySelector('header.site');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Mobile menu toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      toggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        toggle.classList.remove('active');
      });
    });
  }

  // --- Scroll reveal (fade/rise, staggered children, image settle) ---
  const revealEls = document.querySelectorAll('.reveal, .stagger, .riv, .ohero');
  if (revealEls.length) {
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
      revealEls.forEach(el => observer.observe(el));
    } else {
      revealEls.forEach(el => el.classList.add('in'));
    }
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = nav ? nav.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- FAQ accordion ---
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq');
      if (item) item.classList.toggle('open');
    });
  });
});

// --- Estimate form: send to Google Forms in the background ---
// Google's reply is opaque (no-cors), so only a network failure or timeout is
// detectable. On either, the visitor stays on the page with their answers and
// sees the call/text/email fallback instead of a dead error page.
// Anti-spam: the Google Form requires a 'Key' answer that only this code adds,
// so bots posting straight to Google are rejected. Honeypot hits and sends
// faster than 3s after page load are dropped quietly.
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form[data-lead]');
  const cfgEl = document.getElementById('lead-config');
  if (!form || !cfgEl || !window.fetch || !window.URLSearchParams) return;
  let cfg;
  try { cfg = JSON.parse(cfgEl.textContent); } catch (err) { return; }
  const loadedAt = Date.now();

  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = false; // ships disabled so a no-JS bot can't post the raw form
  const status = form.querySelector('.form-status');
  const label = btn ? btn.textContent : '';
  let busy = false;

  const fail = (reason) => {
    busy = false;
    if (btn) { btn.disabled = false; btn.textContent = label; }
    try { sessionStorage.removeItem('cno_lead'); } catch (err) {}
    if (typeof window.gtag === 'function') window.gtag('event', 'form_error', { reason: reason });
    if (status) { status.hidden = false; status.focus(); }
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const honey = form.querySelector('[name="_honey"]');
    if ((honey && honey.value) || Date.now() - loadedAt < 3000) { window.location.href = '/thanks/'; return; } // bot

    busy = true;
    if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
    if (status) status.hidden = true;

    const body = new URLSearchParams();
    form.querySelectorAll('[data-f]').forEach(el => { if (el.value) body.append(el.name, el.value); });
    body.append(cfg.keyField, cfg.key);

    const ctrl = window.AbortController ? new AbortController() : null;
    const timer = setTimeout(() => { if (ctrl) ctrl.abort(); }, 15000);

    fetch(cfg.action, { method: 'POST', mode: 'no-cors', body: body, signal: ctrl ? ctrl.signal : undefined })
      .then(() => { clearTimeout(timer); window.location.href = '/thanks/'; })
      .catch((err) => { clearTimeout(timer); fail(err && err.name === 'AbortError' ? 'timeout' : 'network'); });
  });
});
