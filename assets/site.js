(() => {
  'use strict';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const preferences = window.portfolioAppearance;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = navigator.connection?.saveData === true;
  const q = new URLSearchParams(location.search);
  const has = key => q.has(key) || [...q.values()].some(v => v.split(/[ ,+]/).includes(key));
  const cursor = $('#pencil-cursor');
  function savePreferences() {
    try { localStorage.setItem('portfolio-appearance', JSON.stringify(preferences)); } catch {}
  }
  function applyAppearance() {
    document.documentElement.dataset.theme = preferences.theme;
    $('#theme').value = preferences.theme;
    $('#weather').value = preferences.weather;
    $('#pencil-setting').checked = preferences.pencil;
    $('#motion-setting').checked = preferences.motion;
    const animated = preferences.motion && !reduced.matches && !saveData;
    const pencil = preferences.pencil && fine.matches;
    document.body.classList.toggle('has-pencil', pencil);
    cursor.hidden = true;
    const sky = $('#atmosphere'); sky.replaceChildren();
    if (animated) {
      const type = preferences.weather !== 'none' ? preferences.weather : preferences.theme === 'music' || has('musicBG') ? 'music' : 'none';
      if (type !== 'none') for (let i = 0; i < 16; i++) {
        const particle = document.createElement('span');
        particle.textContent = type === 'snow' ? '•' : type === 'rain' ? '│' : ['♪', '♬', '♩'][i % 3];
        particle.style.cssText = `left:${(i * 7) % 100}%;font-size:${type === 'rain' ? 24 : 18}px;animation-duration:${8 + i % 7}s;animation-delay:-${i}s`;
        sky.append(particle);
      }
    }
  }
  $('#settings-toggle').addEventListener('click', () => {
    const settings = $('#effects-settings'); settings.hidden = !settings.hidden;
    $('#settings-toggle').setAttribute('aria-expanded', String(!settings.hidden));
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !$('#effects-settings').hidden) {
      $('#effects-settings').hidden = true;
      $('#settings-toggle').setAttribute('aria-expanded', 'false');
      $('#settings-toggle').focus();
    }
  });
  for (const [id, key] of [['theme', 'theme'], ['weather', 'weather'], ['pencil-setting', 'pencil'], ['motion-setting', 'motion']]) {
    $('#' + id).addEventListener('change', event => {
      preferences[key] = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      applyAppearance(); savePreferences();
    });
  }
  reduced.addEventListener('change', applyAppearance); fine.addEventListener('change', applyAppearance);
  document.addEventListener('visibilitychange', () => {
    document.body.classList.toggle('effects-paused', document.hidden);
    if (document.hidden) cursor.hidden = true;
  });
  applyAppearance();

  // Static content and direct image links remain useful if JavaScript is unavailable.
  function filter(scope, value) {
    const selector = scope === 'art' ? '.art-card' : '.book-card';
    let shown = 0;
    $$(selector).forEach(card => { card.hidden = value !== 'All' && card.dataset.category !== value; if (!card.hidden) shown++; });
    $$(`[data-scope="${scope}"]`).forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === value)));
    $('#' + (scope === 'art' ? 'art' : 'books') + '-status').textContent = `${shown} ${scope === 'art' ? 'artworks' : 'books'} shown`;
  }
  $$('[data-filter]').forEach(button => button.addEventListener('click', () => filter(button.dataset.scope, button.dataset.filter)));
  $('[data-apparel-filter]').addEventListener('click', () => filter('art', 'Apparel'));
  $('#catalog-search').addEventListener('input', event => {
    const term = event.target.value.toLocaleLowerCase(); let shown = 0;
    $$('.catalog-list li').forEach(item => { item.hidden = !item.textContent.toLocaleLowerCase().includes(term); if (!item.hidden) shown++; });
    $('#catalog-status').textContent = `${shown} matching projects`;
  });

  const artworks = JSON.parse($('#gallery-data').textContent);
  const dialog = $('#lightbox'); const scroller = $('#lightbox-scroll');
  let active = 0, viewing = [], opener = null, scrollFrame = 0, modalHistory = false;
  function hydrate(index) {
    active = Math.max(0, Math.min(viewing.length - 1, index));
    [...scroller.children].forEach((slide, i) => {
      const existing = slide.querySelector('img');
      if (Math.abs(i - active) <= 1 && !existing) {
        const item = artworks[viewing[i]]; const im = document.createElement('img');
        im.alt = item.alt; im.decoding = 'async'; im.src = item.large;
        im.addEventListener('error', () => { im.alt = item.alt + ' — image unavailable'; }, { once: true });
        slide.prepend(im);
      } else if (Math.abs(i - active) > 1 && existing) existing.remove();
    });
    $('#lightbox-count').textContent = `${active + 1} / ${viewing.length}`;
    $('#previous-art').disabled = active === 0;
    $('#next-art').disabled = active === viewing.length - 1;
  }
  function jump(index, smooth = true) {
    index = Math.max(0, Math.min(viewing.length - 1, index));
    hydrate(index);
    scroller.scrollTo({ top: index * scroller.clientHeight, behavior: smooth && !reduced.matches ? 'smooth' : 'instant' });
  }
  function cleanup() {
    dialog.close(); scroller.replaceChildren();
    document.body.classList.remove('lightbox-open');
    opener?.focus({ preventScroll: true }); modalHistory = false;
  }
  function close() {
    if (modalHistory && history.state?.portfolioLightbox) history.back();
    else cleanup();
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('[data-gallery]');
    if (!anchor || event.ctrlKey || event.metaKey || event.shiftKey || !dialog.showModal) return;
    event.preventDefault(); opener = anchor; cursor.hidden = true;
    viewing = $$('.art-card:not([hidden]) [data-gallery]').map(x => Number(x.dataset.gallery));
    const chosen = viewing.indexOf(Number(anchor.dataset.gallery));
    scroller.replaceChildren();
    viewing.forEach(id => {
      const item = artworks[id]; const slide = document.createElement('figure'); slide.className = 'lightbox-slide';
      const caption = document.createElement('figcaption'); caption.textContent = item.title;
      const category = document.createElement('small'); category.textContent = item.category;
      caption.append(category); slide.append(caption); scroller.append(slide);
    });
    dialog.showModal(); document.body.classList.add('lightbox-open');
    jump(chosen, false); $('#close-lightbox').focus();
    history.pushState({ ...history.state, portfolioLightbox: true }, '', location.href); modalHistory = true;
  });
  scroller.addEventListener('scroll', () => {
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      if (dialog.open) hydrate(Math.round(scroller.scrollTop / scroller.clientHeight));
      scrollFrame = 0;
    });
  }, { passive: true });
  $('#close-lightbox').addEventListener('click', close);
  dialog.addEventListener('cancel', event => { event.preventDefault(); close(); });
  window.addEventListener('popstate', () => { if (dialog.open) cleanup(); });
  $('#previous-art').addEventListener('click', () => jump(active - 1));
  $('#next-art').addEventListener('click', () => jump(active + 1));
  dialog.addEventListener('keydown', event => {
    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      jump(event.key === 'Home' ? 0 : event.key === 'End' ? viewing.length - 1 : active + (['ArrowDown','ArrowRight'].includes(event.key) ? 1 : -1));
    }
  });
  let lastHeight = 0;
  const resizeObserver = new ResizeObserver(() => {
    if (dialog.open && scroller.clientHeight !== lastHeight) { lastHeight = scroller.clientHeight; jump(active, false); }
  });
  resizeObserver.observe(scroller);

  // No third-party frame exists until the visitor explicitly requests it.
  $$('.video-load').forEach(button => button.addEventListener('click', () => {
    const player = $('#video-player'); player.replaceChildren();
    const frame = document.createElement('iframe');
    frame.title = button.textContent.trim(); frame.src = `https://www.youtube-nocookie.com/embed/${button.dataset.video}`;
    frame.allow = 'fullscreen; picture-in-picture'; frame.allowFullscreen = true;
    const stop = document.createElement('button'); stop.textContent = 'Close video';
    stop.addEventListener('click', () => { player.replaceChildren(); button.focus(); });
    player.append(frame, stop);
  }));
  $('#music details').addEventListener('toggle', event => { if (!event.target.open) $('#video-player').replaceChildren(); });

  // Keep existing inbound section URLs and profile/hide query options working.
  const aliases = { art: 'design', stores: 'clothing', additional_books: 'book', reviews: 'book' };
  function revealHash() {
    const raw = location.hash.slice(1); const id = aliases[raw] || raw;
    const target = document.getElementById(id);
    if (!target) return;
    if (target.tagName === 'DETAILS') target.open = true;
    if (aliases[raw] || target.tagName === 'DETAILS') target.scrollIntoView();
  }
  const hides = { noArt:['design'], noMusic:['music'], noSE:['software'], noGame:['games'], noGames:['games'], noCert:['certificates'], noEdu:['education'], noResumes:['resume'], noResume:['resume'], noBook:['book'], noShop:['clothing'], noContact:['contact'] };
  const profile = has('developer') || has('games') ? ['music','design','book','clothing'] : has('art') ? ['music','games','software'] : has('music') ? ['design','games','background'] : has('author') ? ['music','games','software'] : [];
  for (const [key, ids] of Object.entries(hides)) if (has(key)) profile.push(...ids);
  for (const id of new Set(profile)) {
    const target = document.getElementById(id); if (target) target.hidden = true;
    $$(`.section-nav a[href="#${id}"]`).forEach(a => { a.hidden = true; });
  }
  if (has('noNav')) $('.section-nav').hidden = true;
  if (has('trucker') || has('management')) $('#resume').open = true;
  window.addEventListener('hashchange', revealHash); revealHash();
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        $$('.section-nav a').forEach(a => a.setAttribute('aria-current', String(a.hash === '#' + entry.target.id)));
      }
    }, { rootMargin: '-15% 0px -65% 0px' });
    $$('.chapter').forEach(el => observer.observe(el));
  }
})();
