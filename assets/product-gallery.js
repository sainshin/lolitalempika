(() => {
  const mainImage = document.getElementById('product-main-image');
  const buttons = document.querySelectorAll('[data-product-image]');
  if (!mainImage) return;
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      mainImage.src = button.dataset.productImage;
      mainImage.alt = button.dataset.productAlt;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    });
  });
})();
