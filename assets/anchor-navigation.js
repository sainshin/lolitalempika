/* Reveal anchor destinations without changing analytics or native link history. */
(() => {
  function destination(hash) {
    if (!hash || hash === '#') return null;
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch (_) { return null; }
  }

  function reveal(target) {
    const ancestors = [];
    for (let node = target; node; node = node.parentElement) ancestors.unshift(node);
    ancestors.forEach(node => {
      if (node.matches('details')) node.open = true;
      if (!node.matches('[role="tabpanel"][id]')) return;
      const tab = Array.from(document.querySelectorAll('[role="tab"][aria-controls]'))
        .find(item => item.getAttribute('aria-controls').split(/\s+/).includes(node.id));
      const list = tab && tab.closest('[role="tablist"]');
      if (!list) return;
      list.querySelectorAll('[role="tab"]').forEach(item => {
        const active = item === tab;
        item.setAttribute('aria-selected', String(active));
        item.tabIndex = active ? 0 : -1;
        (item.getAttribute('aria-controls') || '').split(/\s+/).forEach(id => {
          const panel = document.getElementById(id);
          if (panel && panel.matches('[role="tabpanel"]')) {
            panel.hidden = !active;
            panel.setAttribute('aria-hidden', String(!active));
          }
        });
      });
    });
  }

  let pending = 0;
  function follow(hash, event) {
    const target = destination(hash);
    if (!target) return;
    reveal(target);
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(() => {
      if (event && event.defaultPrevented) return;
      // Use the existing CSS header offset, also for descendants without .anchor.
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const offset = margin || parseFloat(getComputedStyle(document.body).getPropertyValue('--anchor-offset')) || 16;
      window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset),
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
    });
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
    follow(url.hash, event);
  });
  window.addEventListener('hashchange', () => follow(location.hash));
  window.addEventListener('pageshow', () => follow(location.hash));
  follow(location.hash);
})();
