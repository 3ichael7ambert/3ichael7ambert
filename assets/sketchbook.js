(() => {
  'use strict';
  const controls = document.querySelector('.book-controls');
  if (!controls) return;
  const main = document.querySelector('#main');
  const pages = [...main.querySelectorAll(':scope > .sketchbook-page, :scope > #sketch-run')].filter(page => !page.hidden);
  if (pages.length === 0) return;
  const selector = document.querySelector('#book-chapter');
  const layout = document.querySelector('#book-layout');
  const previous = controls.querySelector('[data-leaf-step="-1"]');
  const next = controls.querySelector('[data-leaf-step="1"]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const aliases = {art:'design',stores:'clothing',additional_books:'book',reviews:'book'};
  const names = {introduction:'Cover',design:'Art & photography',games:'Games',music:'Music',book:'Books',clothing:'Store',background:'About & skills',contact:'Contact'};
  let current = 0;
  let continuous = false;
  let flip;
  let swipe;

  for (const [index, page] of pages.entries()) {
    selector.add(new Option(names[page.id] || page.querySelector('h2').textContent, String(index)));
  }
  function chapterFor(hash) {
    let id;
    try { id = decodeURIComponent(hash.slice(1)); } catch { return -1; }
    const target = document.getElementById(aliases[id] || id);
    return pages.findIndex(page => page.contains(target));
  }
  function show(index, {animate = false, focus = false, scroll = false} = {}) {
    if (index < 0 || index >= pages.length) return;
    const direction = index < current ? -1 : 1;
    current = index;
    const page = pages[current];
    for (const section of pages) section.hidden = !continuous && section !== page;
    selector.value = String(current);
    previous.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    document.dispatchEvent(new CustomEvent('sketchbook:page', {detail:page.id}));
    if (scroll) page.scrollIntoView({block:'start',behavior:'instant'});
    if (focus) {
      const heading = page.querySelector('h1, h2');
      heading.tabIndex = -1;
      heading.focus({preventScroll:true});
    }
    flip?.cancel();
    if (animate && !continuous && !reduced.matches && window.portfolioAppearance?.motion && !navigator.connection?.saveData) {
      flip = page.animate([
        {transformOrigin:direction > 0 ? 'left top' : 'right top', transform:`perspective(1100px) rotateY(${direction * -62}deg)`, opacity:.5},
        {transformOrigin:direction > 0 ? 'left top' : 'right top', transform:'perspective(1100px) rotateY(0)', opacity:1}
      ], {duration:520,easing:'cubic-bezier(.2,.75,.25,1)'});
    }
  }
  function turn(index, hash, focus = false) {
    if (!pages[index] || document.querySelector('dialog[open]')) return;
    const address = hash || '#' + pages[index].id;
    if (location.hash !== address) history.pushState(null,'',address);
    show(index,{animate:index !== current,scroll:true,focus});
    const target = document.getElementById(address.slice(1));
    if (target && target !== pages[index]) target.scrollIntoView({block:'start'});
  }
  function restore() {
    const index = chapterFor(location.hash);
    show(index >= 0 ? index : 0, {scroll:Boolean(location.hash)});
    const target = document.getElementById(location.hash.slice(1));
    if (target && target !== pages[current]) target.scrollIntoView({block:'start'});
  }
  previous.addEventListener('click', () => turn(current - 1));
  next.addEventListener('click', () => turn(current + 1));
  selector.addEventListener('change', () => turn(Number(selector.value)));
  layout.addEventListener('click', () => {
    continuous = !continuous;
    layout.setAttribute('aria-pressed', String(continuous));
    layout.textContent = continuous ? 'Book view' : 'Scroll view';
    show(current,{scroll:true});
  });
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey ||
        event.shiftKey || event.altKey || link.pathname !== location.pathname || link.origin !== location.origin || !link.hash) return;
    const index = chapterFor(link.hash);
    if (index < 0) return;
    event.preventDefault();
    turn(index,link.hash,true);
  });
  window.addEventListener('hashchange',restore);
  window.addEventListener('popstate',restore);
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey ||
        event.target.closest('button,input,select,textarea,canvas,[contenteditable],#drawing-desk,dialog') ||
        document.querySelector('#drawing-desk')?.dataset.tool !== 'browse') return;
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    turn(current + (event.key === 'ArrowRight' ? 1 : -1));
  });
  main.addEventListener('touchstart', event => {
    const touch = event.changedTouches[0];
    const bounds = main.getBoundingClientRect();
    swipe = event.touches.length === 1 && !continuous && !event.target.closest('a,button,input,canvas,select,[role=dialog]') &&
      (touch.clientX - bounds.left < 42 || bounds.right - touch.clientX < 42) ? touch : null;
  },{passive:true});
  main.addEventListener('touchend', event => {
    if (!swipe) return;
    const touch = [...event.changedTouches].find(item => item.identifier === swipe.identifier);
    const dx = touch ? touch.clientX - swipe.clientX : 0;
    const dy = touch ? touch.clientY - swipe.clientY : 0;
    swipe = null;
    if (Math.abs(dx) > 68 && Math.abs(dx) > Math.abs(dy) * 1.5) turn(current + (dx < 0 ? 1 : -1));
  },{passive:true});
  main.addEventListener('touchcancel', () => { swipe = null; },{passive:true});
  let bumper = 0;
  let startPressed = false;
  let gamepadFrame;
  function pollController() {
    gamepadFrame = undefined;
    if (document.hidden) return;
    const pad = Array.from(navigator.getGamepads?.() || []).find(item => item?.mapping === 'standard');
    if (!pad) return;
    const shoulder = pad.buttons[4]?.pressed ? -1 : pad.buttons[5]?.pressed ? 1 : 0;
    if (shoulder && !bumper && document.querySelector('#drawing-desk')?.dataset.tool === 'browse') turn(current + shoulder);
    bumper = shoulder;
    const start = !!pad.buttons[9]?.pressed;
    if (start && !startPressed && pages[current].id === 'sketch-run' && !document.querySelector('dialog[open]')) {
      pages[current].querySelector('[data-play]').click();
    }
    startPressed = start;
    gamepadFrame = requestAnimationFrame(pollController);
  }
  function startController() {
    if (gamepadFrame === undefined) gamepadFrame = requestAnimationFrame(pollController);
  }
  window.addEventListener('gamepadconnected',startController);
  document.addEventListener('visibilitychange',startController);
  function sizeBookControls() {
    main.style.setProperty('--book-controls-height', controls.offsetHeight + 'px');
  }
  controls.hidden = false;
  sizeBookControls();
  if ('ResizeObserver' in window) new ResizeObserver(sizeBookControls).observe(controls);
  restore();
  startController();
})();
