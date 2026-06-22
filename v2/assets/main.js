/* ============================================
   CHOKAS PMD GROUP — Shared JS
   Navigation, animations, counters
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Sticky nav ---
  const nav = document.querySelector('.nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    });
  }

  // --- Mobile toggle ---
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      const spans = toggle.querySelectorAll('span');
      if (links.classList.contains('open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
      } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
      }
    });
  }

  // --- Scroll fade-up ---
  const faders = document.querySelectorAll('.fade-up');
  if (faders.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    faders.forEach(el => io.observe(el));
  }

  // --- Counter animation ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          animateCounter(e.target);
          cio.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 2000;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(ease * target);
      el.textContent = prefix + current.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // --- Active nav link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // --- Form submission (placeholder) ---
  const forms = document.querySelectorAll('form[data-form]');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.form-submit');
      const original = btn.innerHTML;
      btn.innerHTML = 'SENT SUCCESSFULLY &check;';
      btn.style.background = '#2a7d5c';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        form.reset();
      }, 3000);
    });
  });

});

/* ============================================================
   WEBSITE2 — CanTex-style motion: reveals, parallax, autoplay
   (additive; respects prefers-reduced-motion)
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Ensure background videos actually play (some browsers need a nudge)
  document.querySelectorAll('.hero-video, .video-band video').forEach(v => {
    v.muted = true;
    const p = v.play();
    if (p && p.catch) p.catch(() => {});
  });

  // Directional scroll reveals + hero headline line reveal
  const reveals = document.querySelectorAll('[data-reveal], .reveal-lines');
  if (reveals.length) {
    if (reduce) {
      reveals.forEach(el => el.classList.add('in'));
    } else {
      const ro = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
        });
      }, { threshold: 0.18 });
      reveals.forEach(el => ro.observe(el));
    }
  }
  // Trigger the hero headline immediately (it's above the fold)
  const heroLines = document.querySelector('.hero .reveal-lines');
  if (heroLines) requestAnimationFrame(() => heroLines.classList.add('in'));

  // Parallax on the hero + band videos (skip if reduced motion)
  if (!reduce) {
    const heroVid = document.querySelector('.hero-video');
    const bands = document.querySelectorAll('.video-band video');
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      if (heroVid && y < window.innerHeight) {
        heroVid.style.transform = `translateY(${y * 0.22}px) scale(1.08)`;
      }
      bands.forEach(v => {
        const r = v.parentElement.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const off = (window.innerHeight - r.top) * 0.06;
          v.style.transform = `translateY(${-off}px) scale(1.12)`;
        }
      });
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }
});
