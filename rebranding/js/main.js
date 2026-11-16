/* ========================================
   GROW YOUR CLINIC — v6 PREMIUM
   ======================================== */

// Preloader — isotipo animado
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const dots = preloader.querySelectorAll('.p-dot');
  const line = preloader.querySelector('.p-line');

  // Círculos aparecen uno a uno con bounce
  dots.forEach((d, i) => {
    setTimeout(() => d.classList.add('visible'), 200 + i * 320);
  });

  // Línea se dibuja tras el último círculo
  setTimeout(() => line.classList.add('draw'), 200 + 3 * 320);

  // Glow + texto
  setTimeout(() => preloader.classList.add('glow-active'), 1550);

  // Burst
  setTimeout(() => preloader.classList.add('burst'), 2500);

  // Hidden
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.querySelectorAll('.hero .anim-fade').forEach(el => {
      const d = parseFloat(el.dataset.d || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), d);
    });
  }, 3100);
});

// Nav scroll
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
}, { passive: true });

// Cursor glow
const glow = document.getElementById('cursor-glow');
if (matchMedia('(hover:hover)').matches) {
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  (function lerpCursor() {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.transform = `translate(${cx - 60}px,${cy - 60}px)`;
    requestAnimationFrame(lerpCursor);
  })();
}

// Scroll reveals with stagger
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = parseFloat(e.target.dataset.d || 0) * 1000;
      setTimeout(() => e.target.classList.add('visible'), d);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.06, rootMargin: '0px 0px -60px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Counter animation
const cEl = document.getElementById('excl-counter');
let cDone = false;
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting && !cDone) {
      cDone = true;
      const s = performance.now();
      (function t(n) {
        const p = Math.min((n - s) / 1200, 1);
        cEl.textContent = Math.round(3 * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(t);
      })(s);
    }
  });
}, { threshold: 0.5 });
if (cEl) cObs.observe(cEl);

// Card spotlight hover (mouse-tracking radial glow)
document.querySelectorAll('.card, .mcard, .icard, .bcard, .plus-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100) + '%');
  });
});

// ========================
// SURVEY MODAL
// ========================
const modal = document.getElementById('modal');

document.addEventListener('click', e => {
  const btn = e.target.closest('.open-survey');
  if (btn) { e.preventDefault(); openM(); }
});

function openM() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeM() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-x').addEventListener('click', closeM);
document.getElementById('modal-bg').addEventListener('click', closeM);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeM(); });

// ========================
// SCROLL TIMELINE (sistema)
// ========================
(function() {
  const fill = document.getElementById('stl-fill');
  const star = document.getElementById('stl-star');
  const mcards = [...document.querySelectorAll('.mcard[data-phase]')];
  const dots  = [...document.querySelectorAll('.srow__dot[data-phase]')];
  if (!fill || !mcards.length || !dots.length) return;

  let lastPhase = -1;

  function activatePhase(phase) {
    if (phase === lastPhase) return;
    lastPhase = phase;

    // Iluminar dots acumulativamente
    dots.forEach(d => d.classList.toggle('active', parseInt(d.dataset.phase) <= phase));

    // Altura dinámica: del centro del primer dot al centro del dot activo
    const container = fill.parentElement;
    const cr = container.getBoundingClientRect();
    const firstDot = dots[0].querySelector('.stl__dot');
    const activeDot = dots[phase].querySelector('.stl__dot');
    if (firstDot && activeDot) {
      const fr = firstDot.getBoundingClientRect();
      const ar = activeDot.getBoundingClientRect();
      const startY = fr.top + fr.height / 2 - cr.top;
      // Si es la última fase, llegar hasta el centro de la estrella
      let endY = ar.top + ar.height / 2 - cr.top;
      if (phase >= dots.length - 1 && star) {
        const sr = star.getBoundingClientRect();
        endY = sr.top + sr.height / 2 - cr.top;
      }
      fill.style.top    = startY + 'px';
      fill.style.height = Math.max(0, endY - startY) + 'px';
    }

    // Estrella cuando se completan las 4 fases
    if (star) star.classList.toggle('active', phase >= dots.length - 1);
  }

  function onScroll() {
    const trigger = window.innerHeight * 0.62;
    let current = -1;
    mcards.forEach(card => {
      const r = card.getBoundingClientRect();
      if (r.top + r.height * 0.35 < trigger) {
        current = Math.max(current, parseInt(card.dataset.phase));
      }
    });
    if (current >= 0) activatePhase(current);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  setTimeout(onScroll, 250);
})();
