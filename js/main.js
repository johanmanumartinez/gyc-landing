/* ========================================
   GROW YOUR CLINIC — v4b
   ======================================== */

// Preloader
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  const letters = preloader.querySelectorAll('.preloader__letter');

  // Letters appear one by one
  letters.forEach((l, i) => {
    setTimeout(() => l.classList.add('visible'), 300 + i * 250);
  });

  // Glow activates after all letters visible
  setTimeout(() => preloader.classList.add('glow-active'), 1100);

  // Burst and fade out
  setTimeout(() => preloader.classList.add('burst'), 1800);
  setTimeout(() => {
    preloader.classList.add('hidden');
    document.querySelectorAll('.hero .anim-fade').forEach(el => {
      const d = parseFloat(el.dataset.d || 0) * 1000;
      setTimeout(() => el.classList.add('visible'), d);
    });
  }, 2300);
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
// COUNTRY CODE SELECTOR
// ========================
const countries = [
  { code: '+54', flag: '🇦🇷', name: 'Argentina', iso: 'AR' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia', iso: 'BO' },
  { code: '+56', flag: '🇨🇱', name: 'Chile', iso: 'CL' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia', iso: 'CO' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica', iso: 'CR' },
  { code: '+53', flag: '🇨🇺', name: 'Cuba', iso: 'CU' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador', iso: 'EC' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador', iso: 'SV' },
  { code: '+34', flag: '🇪🇸', name: 'España', iso: 'ES' },
  { code: '+240', flag: '🇬🇶', name: 'Guinea Ecuatorial', iso: 'GQ' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala', iso: 'GT' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras', iso: 'HN' },
  { code: '+52', flag: '🇲🇽', name: 'México', iso: 'MX' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua', iso: 'NI' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá', iso: 'PA' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay', iso: 'PY' },
  { code: '+51', flag: '🇵🇪', name: 'Perú', iso: 'PE' },
  { code: '+1787', flag: '🇵🇷', name: 'Puerto Rico', iso: 'PR' },
  { code: '+1809', flag: '🇩🇴', name: 'Rep. Dominicana', iso: 'DO' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay', iso: 'UY' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela', iso: 'VE' }
];

let selectedCode = '+58';
const codeSelect = document.getElementById('code-select');
const codeBtn = document.getElementById('code-btn');
const codeFlag = document.getElementById('code-flag');
const codeVal = document.getElementById('code-val');
const codeDropdown = document.getElementById('code-dropdown');

// Build dropdown
countries.forEach(c => {
  const item = document.createElement('div');
  item.className = 'code-item' + (c.code === selectedCode ? ' selected' : '');
  item.innerHTML = `<span class="code-item__flag">${c.flag}</span><span class="code-item__name">${c.name}</span><span class="code-item__code">${c.code}</span>`;
  item.addEventListener('click', () => selectCountry(c));
  codeDropdown.appendChild(item);
});

function selectCountry(c) {
  selectedCode = c.code;
  codeFlag.textContent = c.flag;
  codeVal.textContent = c.code;
  codeSelect.classList.remove('open');
  codeDropdown.querySelectorAll('.code-item').forEach(i => i.classList.remove('selected'));
  const idx = countries.findIndex(x => x.code === c.code);
  if (idx >= 0) codeDropdown.children[idx].classList.add('selected');
}

codeBtn.addEventListener('click', (e) => {
  e.preventDefault();
  codeSelect.classList.toggle('open');
});

// Close dropdown on outside click
document.addEventListener('click', (e) => {
  if (!codeSelect.contains(e.target)) codeSelect.classList.remove('open');
});

// Keyboard search in dropdown
let searchBuf = '';
let searchTimer = null;
document.addEventListener('keydown', (e) => {
  if (!codeSelect.classList.contains('open')) return;
  if (e.key === 'Escape') { codeSelect.classList.remove('open'); return; }
  if (e.key.length === 1 && e.key.match(/[a-záéíóúñü]/i)) {
    clearTimeout(searchTimer);
    searchBuf += e.key.toLowerCase();
    searchTimer = setTimeout(() => { searchBuf = ''; }, 800);
    const match = countries.find(c => c.name.toLowerCase().startsWith(searchBuf));
    if (match) {
      const idx = countries.indexOf(match);
      const item = codeDropdown.children[idx];
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
        codeDropdown.querySelectorAll('.code-item').forEach(i => i.style.background = '');
        item.style.background = 'rgba(201,168,76,0.12)';
      }
    }
  }
  if (e.key === 'Enter') {
    const match = countries.find(c => c.name.toLowerCase().startsWith(searchBuf));
    if (match) selectCountry(match);
    searchBuf = '';
  }
});

// Auto-detect country via timezone
function detectCountry() {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
  const tzMap = {
    'America/Argentina': 'AR', 'America/Buenos_Aires': 'AR',
    'America/La_Paz': 'BO',
    'America/Sao_Paulo': 'BR', 'America/Fortaleza': 'BR', 'America/Manaus': 'BR',
    'America/Santiago': 'CL',
    'America/Bogota': 'CO',
    'America/Costa_Rica': 'CR',
    'America/Havana': 'CU',
    'America/Santo_Domingo': 'DO',
    'America/Guayaquil': 'EC',
    'America/El_Salvador': 'SV',
    'Europe/Madrid': 'ES',
    'America/New_York': 'US', 'America/Chicago': 'US', 'America/Denver': 'US', 'America/Los_Angeles': 'US',
    'America/Guatemala': 'GT',
    'America/Tegucigalpa': 'HN',
    'America/Mexico_City': 'MX', 'America/Monterrey': 'MX', 'America/Cancun': 'MX', 'America/Tijuana': 'MX',
    'America/Managua': 'NI',
    'America/Panama': 'PA',
    'America/Asuncion': 'PY',
    'America/Lima': 'PE',
    'America/Puerto_Rico': 'PR',
    'America/Montevideo': 'UY',
    'America/Caracas': 'VE'
  };

  let iso = null;
  for (const [key, val] of Object.entries(tzMap)) {
    if (tz.startsWith(key) || tz === key) { iso = val; break; }
  }

  if (iso) {
    const country = countries.find(c => c.iso === iso);
    if (country) selectCountry(country);
  }
}
detectCountry();

// ========================
// SURVEY MODAL
// ========================
const modal = document.getElementById('modal');
const barFill = document.getElementById('bar-fill');
let cur = 1;

document.querySelectorAll('.open-survey').forEach(b => {
  b.addEventListener('click', e => { e.preventDefault(); openM(); });
});

function openM() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  go(1);
  setTimeout(() => {
    const i = modal.querySelector('.step.active input[type="text"]');
    if (i) i.focus();
  }, 400);
}
function closeM() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('modal-x').addEventListener('click', closeM);
document.getElementById('modal-bg').addEventListener('click', closeM);

document.querySelectorAll('.next-btn').forEach(b => {
  b.addEventListener('click', () => { if (valid(cur)) go(+b.dataset.go); });
});
document.querySelectorAll('.back-btn').forEach(b => {
  b.addEventListener('click', () => go(+b.dataset.go));
});

function go(step) {
  document.querySelectorAll('.step').forEach(s => s.classList.remove('active'));
  const t = document.querySelector(`.step[data-step="${step}"]`);
  if (t) { t.classList.add('active'); cur = step; barFill.style.width = `${(step / 4) * 100}%`; }
}

function valid(step) {
  if (step === 1 && !document.getElementById('s-name').value.trim()) { shake(document.getElementById('s-name')); return false; }
  if (step === 2) {
    const em = document.getElementById('s-email');
    const ph = document.getElementById('s-phone');
    if (!em.value.trim()) { shake(em); return false; }
    if (!ph.value.trim()) { shake(ph); return false; }
  }
  if (step === 3 && !document.querySelector('input[name="s-fac"]:checked')) { shake(document.querySelector('.opts')); return false; }
  return true;
}

function shake(el) {
  el.style.animation = 'none'; el.offsetHeight;
  el.style.animation = 'shake 0.4s ease';
  setTimeout(() => el.style.animation = '', 450);
}
const ss = document.createElement('style');
ss.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}';
document.head.appendChild(ss);

document.querySelectorAll('.inp').forEach(i => {
  i.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); const n = i.closest('.step').querySelector('.next-btn'); if (n) n.click(); }
  });
});

document.querySelectorAll('input[name="s-fac"]').forEach(r => {
  r.addEventListener('change', () => setTimeout(() => go(4), 250));
});

// Submit
document.getElementById('submit-btn').addEventListener('click', async () => {
  const btn = document.getElementById('submit-btn');
  btn.textContent = 'Enviando...'; btn.disabled = true; btn.style.opacity = '0.6';

  const full = document.getElementById('s-name').value.trim();
  const parts = full.split(' ');
  const first = parts[0] || '';
  const last = parts.slice(1).join(' ') || '';
  const email = document.getElementById('s-email').value.trim();
  const phone = selectedCode + document.getElementById('s-phone').value.trim();
  const fac = document.querySelector('input[name="s-fac"]:checked')?.value || '';
  const retos = [...document.querySelectorAll('input[name="s-reto"]:checked')].map(c => c.value);

  // Redirect a WhatsApp primero (no depende de GHL)
  const msg = encodeURIComponent(`Hola Johan, soy ${full}. Tengo una clínica y quiero validar si califica para uno de los cupos.`);
  window.open(`https://wa.me/584141932869?text=${msg}`, '_blank');

  // Enviar a GHL en background (sin bloquear)
  fetch('https://services.leadconnectorhq.com/contacts/upsert', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer pit-b9e24a66-b06c-4d3c-8db6-fde110f03459',
      'Version': '2021-07-28',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      locationId: 'rxoCRbTMfVLFuPrj9fde',
      firstName: first, lastName: last, email, phone,
      source: 'Landing GYC',
      customFields: [
        { id: '0NSBaf60xgI7pY9WxRFk', value: fac },
        { id: 'wmvAZZ6P7pPb0PjVpsSr', value: retos }
      ]
    })
  }).catch(err => console.error('GHL:', err));

  closeM();
  btn.textContent = 'Enviar y hablar por WhatsApp'; btn.disabled = false; btn.style.opacity = '1';
});
