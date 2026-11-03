(() => {
  const header = document.querySelector('.hd');
  if (!header) return;
  let lastY = Math.max(0, window.scrollY);
  let travel = 0;
  let direction = 0;
  function show() {
    header.classList.remove('is-hidden');
  }
  window.addEventListener('scroll', () => {
    const maxY = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const y = Math.min(maxY, Math.max(0, window.scrollY));
    const delta = y - lastY;
    lastY = y;
    if (y < 20) { travel = 0; show(); return; }
    if (!delta) return;
    const nextDirection = delta > 0 ? 1 : -1;
    if (nextDirection !== direction) travel = 0;
    direction = nextDirection;
    travel += Math.abs(delta);
    if (travel >= 14) {
      header.classList.toggle('is-hidden', direction > 0 && !header.contains(document.activeElement));
      travel = 0;
    }
  }, { passive: true });
  header.addEventListener('focusin', show);
})();
