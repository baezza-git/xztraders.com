/* ==========================================================================
   XZ TRADERS · Landing
   ========================================================================== */

/*
 * ENLACES DEL SITIO
 * Cambia aquí tus enlaces y se actualizan en toda la página.
 */
const LINKS = {
  lbank: 'https://www.lbank.com/ref/XZTRADERS', // Enlace de referido de LBANK
  telegram: 'https://t.me/xztraders_aibot', // Bot de Telegram para enviar el UID y entrar
};

function applyLinks() {
  document.querySelectorAll('[data-link]').forEach((el) => {
    const url = LINKS[el.dataset.link];
    if (!url) return; // Sin enlace: el botón se queda apuntando a "Cómo entrar".
    el.href = url;
    el.target = '_blank';
    el.rel = 'noopener';
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
    // Las páginas legales no tienen hero ni barra fija en móvil.
    if (!hero || !mobileCta) return;
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

// Tarjeta VIP del hero: se inclina siguiendo el cursor y, en reposo, se balancea sola.
function initVipCard() {
  const scene = document.getElementById('vip-card');
  if (!scene) return;
  const zone = scene.closest('.hero') || scene;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v) => Math.max(-1, Math.min(1, v));

  // Posición de la "luz" de -1 a 1 en cada eje.
  const pos = { x: -0.45, y: -0.3 };
  const target = { ...pos };
  let pointer = false;
  let visible = true;
  let raf = 0;
  let idle;

  const apply = () => {
    const { x, y } = pos;
    const set = (name, value) => scene.style.setProperty(name, value);
    set('--rx', `${(-y * 10).toFixed(2)}deg`);
    set('--ry', `${(x * 13).toFixed(2)}deg`);
    set('--lx', `${(50 + x * 45).toFixed(1)}%`);
    set('--ly', `${(30 + y * 30).toFixed(1)}%`);
    set('--edge', (220 + x * 80 + y * 30).toFixed(1));
    set('--sx', `${(x * 55).toFixed(1)}%`);
    set('--so', (0.35 + Math.abs(x) * 0.55).toFixed(2));
    set('--ex', `${(-x * 1.4).toFixed(2)}px`);
    set('--ey', `${(-y * 1.4).toFixed(2)}px`);
    set('--tx', `${(x * 4).toFixed(1)}px`);
    set('--ty', `${(y * 3).toFixed(1)}px`);
    set('--shx', `${(-x * 18).toFixed(1)}px`);
    set('--shy', `${(24 - y * 10).toFixed(1)}px`);
  };

  if (reduce) {
    apply();
    return;
  }

  const tick = (t) => {
    if (!pointer) {
      target.x = Math.sin(t / 2600) * 0.6;
      target.y = Math.cos(t / 3400) * 0.4;
    }
    pos.x += (target.x - pos.x) * 0.08;
    pos.y += (target.y - pos.y) * 0.08;
    apply();
    raf = visible ? requestAnimationFrame(tick) : 0;
  };

  zone.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const r = scene.getBoundingClientRect();
    target.x = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2));
    target.y = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2));
    pointer = true;
    clearTimeout(idle);
    idle = setTimeout(() => (pointer = false), 1600);
  });
  zone.addEventListener('pointerleave', () => (pointer = false));

  // Solo se anima mientras está en pantalla.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !raf) raf = requestAnimationFrame(tick);
    }).observe(scene);
  }
  raf = requestAnimationFrame(tick);
}

function initYear() {
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
}

// Fecha de alta de la tarjeta VIP: el mes y año en que se visita la web (ej. 10 · 2026).
function initVipDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  document.querySelectorAll('[data-alta]').forEach((el) => {
    el.textContent = `${month} · ${now.getFullYear()}`;
  });
}

applyLinks();
initNav();
initReveal();
initCounters();
initFeatureGlow();
initVipCard();
initYear();
initVipDate();
