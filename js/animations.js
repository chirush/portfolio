/* ═══════════════════════════════════════════
   ANIMATIONS — Reveals, Counters, Parallax
   ═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // Reveal on scroll
  const reveals = document.querySelectorAll('.reveal-up');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.count));
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el, target) {
    const duration = 1500;
    const start = performance.now();
    const easeOut = t => 1 - Math.pow(1 - t, 3);

    function update(now) {
      const progress = Math.min((now - start) / duration, 1);
      const value = Math.floor(easeOut(progress) * target);
      el.textContent = value >= 1000 ? (value / 1000).toFixed(0) + 'k' : value;
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target >= 1000 ? (target / 1000).toFixed(0) + 'k' : target;
    }
    requestAnimationFrame(update);
  }

  // Parallax shapes
  const shapes = document.querySelectorAll('.shape');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        shapes.forEach((shape, i) => {
          shape.style.transform = `translateY(${scrollY * (i + 1) * 0.03}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Project card expand toggle
  document.querySelectorAll('.project-expand').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      card.classList.toggle('expanded');
      const text = btn.querySelector('.expand-text');
      text.textContent = card.classList.contains('expanded') ? 'Show Less' : 'Read More';
    });
  });
});
