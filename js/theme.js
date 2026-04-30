/* ═══════════════════════════════════════════
   THEME — Auto-detect system + manual toggle
   ═══════════════════════════════════════════ */

(function() {
  const html = document.documentElement;

  // Detect initial theme: saved preference > system preference > dark fallback
  function getInitialTheme() {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;

    // Auto-detect system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  }

  // Apply theme
  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
  }

  // Set initial
  applyTheme(getInitialTheme());

  // Listen for system theme changes (only if user hasn't manually chosen)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // Toggle button
  document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    toggle.addEventListener('click', () => {
      const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      localStorage.setItem('theme', next);
    });
  });
})();
