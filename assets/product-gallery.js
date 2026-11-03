(() => {
  const mainImage = document.getElementById('product-main-image');
  const buttons = document.querySelectorAll('[data-product-image]');
  if (!mainImage) return;
  if (!buttons.length) return;
  const frame = mainImage.closest('.product-main-frame');
  let index = 0;
  function select(next) {
      index = (next + buttons.length) % buttons.length;
      const button = buttons[index];
      mainImage.src = button.dataset.productImage;
      mainImage.alt = button.dataset.productAlt;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      frame.querySelector('.gallery-counter').textContent = `${index + 1} / ${buttons.length}`;
  }
  buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
  frame.querySelector('.gallery-prev').addEventListener('click', () => select(index - 1));
  frame.querySelector('.gallery-next').addEventListener('click', () => select(index + 1));
  frame.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      select(index + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
})();
