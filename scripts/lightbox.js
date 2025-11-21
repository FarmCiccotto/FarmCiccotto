// Lightweight gallery lightbox
(function () {
  function select(sel) { return document.querySelector(sel); }
  function createEl(tag, props) {
    const el = document.createElement(tag);
    if (props) Object.keys(props).forEach(k => el[k] = props[k]);
    return el;
  }

  const grid = document.getElementById('gallery-grid');
  if (!grid) return;

  // Build overlay
  const overlay = createEl('div'); overlay.className = 'lb-overlay';
  const img = createEl('img'); img.className = 'lb-image';
  overlay.appendChild(img);

  const controls = createEl('div'); controls.className = 'lb-controls';
  const prevBtn = createEl('button'); prevBtn.className = 'lb-btn lb-prev'; prevBtn.textContent = '←';
  const nextBtn = createEl('button'); nextBtn.className = 'lb-btn lb-next'; nextBtn.textContent = '→';
  const closeBtn = createEl('button'); closeBtn.className = 'lb-btn lb-close'; closeBtn.textContent = '✕';
  controls.appendChild(prevBtn); controls.appendChild(closeBtn); controls.appendChild(nextBtn);

  const caption = createEl('div'); caption.className = 'lb-caption';

  document.body.appendChild(overlay);
  document.body.appendChild(controls);
  document.body.appendChild(caption);

  let items = [];
  function refreshItems() {
    items = Array.from(grid.querySelectorAll('.gallery-item')).map(node => {
      return {
        node,
        src: node.dataset.full || (node.querySelector('img') && node.querySelector('img').src),
        alt: node.dataset.alt || (node.querySelector('img') && node.querySelector('img').alt || '')
      };
    });
  }
  refreshItems();

  let current = -1;

  function show(index) {
    if (!items[index]) return;
    current = index;
    img.src = items[index].src;
    img.alt = items[index].alt || '';
    caption.textContent = items[index].alt || '';
    overlay.classList.add('visible');
    controls.classList.add('visible');
    overlay.style.display = 'flex';
    controls.style.display = 'flex';
  }
  function hide() {
    overlay.classList.remove('visible');
    controls.classList.remove('visible');
    overlay.style.display = 'none';
    controls.style.display = 'none';
  }
  function prev() { show((current - 1 + items.length) % items.length); }
  function next() { show((current + 1) % items.length); }

  // click handlers
  grid.addEventListener('click', e => {
    const item = e.target.closest('.gallery-item');
    if (!item) return;
    refreshItems();
    const index = items.findIndex(it => it.node === item);
    if (index >= 0) show(index);
  });

  overlay.addEventListener('click', hide);
  closeBtn.addEventListener('click', hide);
  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); prev(); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); next(); });

  // keyboard
  document.addEventListener('keydown', (e) => {
    if (overlay.style.display === 'none' || overlay.style.display === '') return;
    if (e.key === 'Escape') hide();
    if (e.key === 'ArrowLeft') prev();
    if (e.key === 'ArrowRight') next();
  });

  // hide controls initially
  hide();

  // observe grid for changes (e.g., lazy-loaded images) to refresh items
  if (window.MutationObserver) {
    const mo = new MutationObserver(refreshItems);
    mo.observe(grid, { childList: true, subtree: true, attributes: true });
  }
})();
