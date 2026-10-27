'use strict';
const catalogURL = new URL('../catalog.json', document.currentScript.src);
(async () => {
  try {
    const response = await fetch(catalogURL);
    if (!response.ok) throw new Error('Catalog unavailable');
    const entries = await response.json();
    if (!Array.isArray(entries) || !entries.length) throw new Error('Empty catalog');
    const ids = new Set();
    const fragment = document.createDocumentFragment();
    for (const entry of entries) {
      const url = new URL(entry.destination);
      if (ids.has(entry.id) || !entry.title || !entry.alt || !/^assets\/[a-z0-9-]+\.webp$/.test(entry.image) || url.protocol !== 'https:' || url.hostname !== 'jaychtw.github.io' || url.username || url.password) throw new Error('Invalid catalog');
      ids.add(entry.id);
      const item = document.createElement('li');
      item.className = 'work';
      item.dataset.id = entry.id;
      const link = document.createElement('a');
      link.className = 'work-link';
      link.href = url.href;
      link.rel = 'external';
      const image = document.createElement('img');
      image.src = new URL(entry.image, catalogURL).href;
      image.alt = entry.alt;
      image.width = 640;
      image.height = 640;
      image.decoding = 'async';
      image.loading = fragment.childElementCount < 2 ? 'eager' : 'lazy';
      const title = document.createElement(document.querySelector('.gallery').dataset.headingLevel === '3' ? 'h3' : 'h2');
      title.className = 'work-title';
      title.textContent = entry.title;
      link.append(image, title);
      item.append(link);
      fragment.append(item);
    }
    const gallery = document.querySelector('.gallery');
    gallery.append(fragment);
    gallery.classList.toggle('many', entries.length > 4);
    gallery.dataset.ready = 'true';
  } catch {
    document.querySelector('#catalog-error').hidden = false;
  }
})();
