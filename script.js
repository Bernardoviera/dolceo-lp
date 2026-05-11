/* ==============================
   DOLCEO — script.js
   Meta Pixel · CTA · Animações · FAQ · Contadores
============================== */

const CHECKOUT_URL = 'https://pay.kiwify.com.br/smJ8YgZ';

/* ==============================
   CTA BUTTONS — InitiateCheckout + Redirect
============================== */
function initCTAButtons() {
  const ctaButtons = document.querySelectorAll('.cta-btn');

  ctaButtons.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();

      // Meta Pixel
      if (typeof fbq === 'function') {
        fbq('track', 'InitiateCheckout');
      }

      // Delay para garantir envio do pixel
      setTimeout(function() {
        window.location.href = CHECKOUT_URL;
      }, 300);
    });
  });
}

/* ==============================
   SCROLL REVEAL — fade-up
============================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.fade-up');

  if (!elements.length) return;

  const observer = new IntersectionObserver(
    function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  elements.forEach(function(el) {
    observer.observe(el);
  });
}

/* ==============================
   ANIMATED COUNTERS
============================== */
function animateCounter(el, target, duration) {
  let startTime = null;
  const isSmall = target < 20;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;

    const progress = Math.min((timestamp - startTime) / duration, 1);

    // ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3);

    const current = ease * target;

    if (isSmall) {
      el.textContent = Math.floor(current);
    } else {
      el.textContent = Math.floor(current).toLocaleString('pt-BR');
    }

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = isSmall
        ? target
        : target.toLocaleString('pt-BR');
    }
  }

  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');

  if (!counters.length) return;

  let hasAnimated = false;

  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;

        counters.forEach(function(counter) {
          const target = parseInt(
            counter.getAttribute('data-target'),
            10
          );

          animateCounter(counter, target, 1800);
        });

        observer.disconnect();
      }
    });
  }, {
    threshold: 0.4
  });

  const heroStats = document.querySelector('.hero__stats');

  if (heroStats) {
    observer.observe(heroStats);
  }
}

/* ==============================
   FAQ ACCORDION
============================== */
function initFAQ() {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(function(item) {
    const btn = item.querySelector('.faq__question');
    const answer = item.querySelector('.faq__answer');

    btn.addEventListener('click', function() {
      const isOpen = item.classList.contains('active');

      // Fecha todos
      items.forEach(function(i) {
        i.classList.remove('active');

        const a = i.querySelector('.faq__answer');

        a.style.maxHeight = '0';

        i.querySelector('.faq__question')
          .setAttribute('aria-expanded', 'false');
      });

      // Abre clicado
      if (!isOpen) {
        item.classList.add('active');

        answer.style.maxHeight =
          answer.scrollHeight + 'px';

        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==============================
   CTA GLOW EFFECT
============================== */
function initCTAGlow() {
  const ctaButtons = document.querySelectorAll('.btn--cta');

  ctaButtons.forEach(function(btn) {
    btn.addEventListener('mousemove', function(e) {
      const rect = btn.getBoundingClientRect();

      const x =
        ((e.clientX - rect.left) / rect.width) * 100;

      const y =
        ((e.clientY - rect.top) / rect.height) * 100;

      btn.style.setProperty('--glow-x', x + '%');
      btn.style.setProperty('--glow-y', y + '%');
    });
  });
}

/* ==============================
   HERO FLOAT EFFECT
============================== */
function initHeroFloat() {
  const placeholder =
    document.querySelector('.hero__img-placeholder');

  if (!placeholder) return;

  let start = null;

  function float(timestamp) {
    if (!start) start = timestamp;

    const elapsed = timestamp - start;

    const y = Math.sin(elapsed / 2800) * 8;

    placeholder.style.transform =
      'translateY(' + y + 'px)';

    requestAnimationFrame(float);
  }

  requestAnimationFrame(float);
}

/* ==============================
   INIT ALL
============================== */
document.addEventListener('DOMContentLoaded', function() {
  initCTAButtons();
  initScrollReveal();
  initCounters();
  initFAQ();
  initCTAGlow();
  initHeroFloat();
});