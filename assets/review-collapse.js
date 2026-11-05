(function () {
  const segmenter = typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter('ko', { granularity: 'grapheme' }) : null;
  document.querySelectorAll('#reviews .rcard').forEach(function (card, index) {
    const paragraphs = Array.from(card.querySelectorAll('.review-copy'));
    if (!paragraphs.length) return;
    const text = paragraphs.map(function (p) {
      const copy = p.cloneNode(true);
      copy.querySelectorAll('br').forEach(br => br.replaceWith('\n'));
      return copy.textContent;
    }).join('\n\n');
    const characters = segmenter
      ? Array.from(segmenter.segment(text), part => part.segment) : Array.from(text);
    if (characters.length <= 30) return;

    const full = document.createElement('div');
    full.className = 'review-full';
    full.id = 'review-full-' + index;
    full.hidden = true;
    paragraphs[0].before(full);
    paragraphs.forEach(p => full.append(p));

    const summary = document.createElement('p');
    summary.className = 'review-copy review-summary';
    const preview = document.createElement('span');
    preview.textContent = characters.slice(0, 30).join('');
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'review-toggle';
    toggle.textContent = '…더보기';
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', full.id);
    toggle.addEventListener('click', function () {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      full.hidden = !expanded;
      preview.hidden = expanded;
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? '접기' : '…더보기';
    });
    summary.append(preview, toggle);
    full.after(summary);
  });
})();
