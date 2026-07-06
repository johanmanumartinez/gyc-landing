/* ========================================
   GROW YOUR CLINIC — v5
   ======================================== */

// Preloader 3D
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const letters = preloader.querySelectorAll('.p3d');

  letters.forEach((l, i) => {
    setTimeout(() => l.classList.add('visible'), 300 + i * 300);
  });

  setTimeout(() => preloader.classList.add('glow-active'), 1300);
  setTimeout(() => preloader.classList.add('burst'), 2200);
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.querySelectorAll('.hero .anim-fade').forEach(el => {
      const d = parseFloat(el.dataset.d || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), d);
    });
  }, 2700);
});

// Nav
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', scrollY > 50);
}, { passive: true });

// Cursor
const glow = document.getElementById('cursor-glow');
if (matchMedia('(hover:hover)').matches) {
  document.addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 240}px,${e.clientY - 240}px)`;
  });
}

// Reveals
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const d = parseFloat(e.target.dataset.d || 0) * 1000;
      setTimeout(() => e.target.classList.add('visible'), d);
      obs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

// Counter
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
