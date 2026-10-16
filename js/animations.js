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

  // Contact card copy action (e.g. Discord username)
  document.querySelectorAll('.contact-card-copy').forEach(btn => {
    btn.addEventListener('click', async () => {
      const text = btn.getAttribute('data-copy');
      if (!text) return;

      let success = false;
      if (navigator.clipboard && window.isSecureContext) {
        try {
          await navigator.clipboard.writeText(text);
          success = true;
        } catch (err) {
          success = false;
        }
      }

      if (!success) {
        const tempInput = document.createElement('textarea');
        tempInput.value = text;
        tempInput.style.position = 'fixed';
        tempInput.style.left = '-9999px';
        document.body.appendChild(tempInput);
        tempInput.select();
        try {
          success = document.execCommand('copy');
        } catch (err) {
          success = false;
        }
        document.body.removeChild(tempInput);
      }

      const badge = btn.querySelector('.contact-action-badge');
      const icon = btn.querySelector('.contact-action-icon');
      const originalBadgeText = badge ? badge.textContent : 'Copy';
      const originalIconSvg = icon ? icon.innerHTML : '';

      btn.classList.add('copied');
      if (badge) badge.textContent = 'Copied!';
      if (icon) {
        icon.innerHTML = '<polyline points="20 6 9 17 4 12"></polyline>';
      }

      setTimeout(() => {
        btn.classList.remove('copied');
        if (badge) badge.textContent = originalBadgeText;
        if (icon) icon.innerHTML = originalIconSvg;
      }, 2000);
    });
  });
});
