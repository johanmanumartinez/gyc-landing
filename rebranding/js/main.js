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
// STICKY TIMELINE (sistema)
// ========================
(function() {
  const stlItems = document.querySelectorAll('.stl__item');
  const stlFill = document.getElementById('stl-fill');
  const mcards = document.querySelectorAll('.mcard[data-phase]');
  if (!stlItems.length || !stlFill || !mcards.length) return;

  const starItem = document.getElementById('stl-star');
  const phaseItems = [...stlItems].filter(el => el.dataset.phase !== undefined);
  const totalPhases = phaseItems.length - 1; // 0-3

  function activatePhase(phase) {
    phaseItems.forEach(item => {
      const p = parseInt(item.dataset.phase);
      item.classList.toggle('active', p <= phase);
    });
    // Fill: 0% at phase 0, fills toward star as phases progress
    const pct = phase === 0 ? 8 : Math.round((phase / totalPhases) * 88);
    stlFill.style.height = pct + '%';
    // Star lights up only when all 4 phases complete
    if (starItem) starItem.classList.toggle('active', phase >= totalPhases);
  }

  const phaseObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        activatePhase(parseInt(e.target.dataset.phase));
      }
    });
  }, { threshold: 0.4, rootMargin: '0px 0px -20% 0px' });

  mcards.forEach(card => phaseObs.observe(card));
})();
