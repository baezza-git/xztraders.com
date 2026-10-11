/* ==========================================================================
   XZ TRADERS · Landing
   ========================================================================== */

/*
 * ENLACES DEL SITIO
 * Cambia aquí tus enlaces y se actualizan en toda la página.
 * Si dejas un enlace vacío (''), los botones de redes que lo usan se ocultan.
 */
const LINKS = {
  lbank: 'https://www.lbank.com/ref/62R2M', // Enlace de referido de LBANK
  telegram: '', // Telegram para enviar el UID (ej. https://t.me/usuario)
  instagram: '',
  tiktok: '',
  youtube: '',
  x: '',
};

// Redes que se ocultan si no tienen enlace. Los botones principales (LBANK y
// Telegram) nunca se ocultan: sin enlace llevan a la sección "Cómo entrar".
const OPTIONAL_LINKS = ['instagram', 'tiktok', 'youtube', 'x'];

function applyLinks() {
  document.querySelectorAll('[data-link]').forEach((el) => {
    const key = el.dataset.link;
    const url = LINKS[key];

    if (url) {
      el.href = url;
      el.target = '_blank';
      el.rel = 'noopener';
      return;
    }

    if (OPTIONAL_LINKS.includes(key)) {
      el.remove();
      return;
    }

    // Sin enlace todavía: bajar a la sección de pasos.
    el.href = '#como-entrar';
  });
}

function initNav() {
  const nav = document.getElementById('nav');
  const mobileCta = document.getElementById('mobile-cta');
  const hero = document.querySelector('.hero');
  const finalCta = document.querySelector('.cta-final');
  let finalVisible = false;

  const update = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-scrolled', y > 24);
    const pastHero = y > hero.offsetHeight * 0.75;
    mobileCta.classList.toggle('is-visible', pastHero && !finalVisible);
  };

  // Ocultar la barra fija cuando el CTA final ya está en pantalla.
  if ('IntersectionObserver' in window && finalCta) {
    new IntersectionObserver(([entry]) => {
      finalVisible = entry.isIntersecting;
      update();
    }).observe(finalCta);
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  // Escalonar elementos hermanos (tarjetas en una misma fila).
  items.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
    const index = siblings.indexOf(el);
    if (siblings.length > 1) el.style.setProperty('--delay', `${Math.min(index, 5) * 0.07}s`);
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  const animate = (el) => {
    const target = Number(el.dataset.count);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((el) => io.observe(el));
}

// Brillo que sigue al cursor en las tarjetas de "Qué incluye".
function initFeatureGlow() {
  document.querySelectorAll('.feature').forEach((card) => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });
}

// Gráfico de ejemplo del indicador chino (velas + línea + señales).
function drawChart() {
  const svg = document.getElementById('chart');
  if (!svg) return;

  const NS = 'http://www.w3.org/2000/svg';
  const W = 560;
  const H = 280;
  const PAD_T = 44;
  const PAD_B = 44;
  const N = 46;

  // Generador pseudoaleatorio con semilla: el gráfico siempre es el mismo.
  let seed = 7;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const candles = [];
  let price = 100;
  for (let i = 0; i < N; i++) {
    const trend = Math.sin(i / 4.2) * 2 + 0.3;
    const open = price;
    const close = open + trend + (rand() - 0.5) * 2.6;
    const high = Math.max(open, close) + rand() * 1.6;
    const low = Math.min(open, close) - rand() * 1.6;
    candles.push({ open, close, high, low });
    price = close;
  }

  // Línea suavizada (media móvil exponencial).
  const k = 2 / (6 + 1);
  let ema = candles[0].close;
  const line = candles.map((c) => (ema = c.close * k + ema * (1 - k)));

  const min = Math.min(...candles.map((c) => c.low));
  const max = Math.max(...candles.map((c) => c.high));
  const y = (v) => PAD_T + (1 - (v - min) / (max - min)) * (H - PAD_T - PAD_B);
  const step = W / N;
  const x = (i) => i * step + step / 2;

  const el = (tag, attrs) => {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([a, v]) => node.setAttribute(a, v));
    return node;
  };

  // Rejilla
  for (let g = 1; g < 4; g++) {
    const gy = PAD_T + ((H - PAD_T - PAD_B) / 4) * g;
    svg.appendChild(el('line', { x1: 0, x2: W, y1: gy, y2: gy, stroke: 'rgba(255,255,255,0.06)', 'stroke-dasharray': '3 5' }));
  }

  // Velas
  candles.forEach((c, i) => {
    const color = c.close >= c.open ? '#22c55e' : '#f05252';
    const cx = x(i);
    svg.appendChild(el('line', { x1: cx, x2: cx, y1: y(c.high), y2: y(c.low), stroke: color, 'stroke-width': 1.2, opacity: 0.85 }));
    const top = y(Math.max(c.open, c.close));
    const h = Math.max(Math.abs(y(c.open) - y(c.close)), 1.5);
    svg.appendChild(el('rect', { x: cx - step * 0.32, y: top, width: step * 0.64, height: h, rx: 1, fill: color, opacity: 0.9 }));
  });

  // Línea del indicador
  const d = line.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  svg.appendChild(el('path', { d, fill: 'none', stroke: '#b4b8ff', 'stroke-width': 2, 'stroke-linejoin': 'round', opacity: 0.95 }));

  // Señales: cruces del precio con la línea (con separación mínima entre ellas).
  let last = -10;
  for (let i = 2; i < N; i++) {
    const prevAbove = candles[i - 1].close > line[i - 1];
    const nowAbove = candles[i].close > line[i];
    if (prevAbove === nowAbove || i - last < 5) continue;
    last = i;

    const buy = nowAbove;
    const cx = x(i);
    const color = buy ? '#22c55e' : '#f05252';
    const tipY = buy ? y(candles[i].low) + 8 : y(candles[i].high) - 8;
    const dir = buy ? 1 : -1;
    svg.appendChild(el('path', { d: `M${cx},${tipY} l-6,${dir * 9} h12 Z`, fill: color }));

    const labelY = tipY + dir * 14;
    const label = buy ? 'COMPRA' : 'VENTA';
    const lw = label.length * 6.4 + 10;
    svg.appendChild(el('rect', { x: cx - lw / 2, y: labelY - (buy ? 0 : 14), width: lw, height: 14, rx: 3, fill: color, opacity: 0.16 }));
    const t = el('text', {
      x: cx,
      y: labelY + (buy ? 10.5 : -3.5),
      'text-anchor': 'middle',
      fill: color,
      'font-size': 9.5,
      'font-family': 'Geist Mono, monospace',
      'font-weight': 600,
    });
    t.textContent = label;
    svg.appendChild(t);
  }
}

function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

applyLinks();
initNav();
initReveal();
initCounters();
initFeatureGlow();
drawChart();
initYear();
