'use strict';

const byId = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const id = params.get('book');
const pageSelect = byId('page');
const sheet = byId('sheet');
const surface = byId('surface');
const status = byId('status');
const previous = byId('previous');
const next = byId('next');
const navigation = document.querySelector('nav');
navigation.hidden = true;
byId('library').href = location.pathname.includes('/comics/') ? '../' : '../#book';

async function openBook() {
  const response = await fetch('editions.json');
  if (!response.ok) throw new Error('The library is temporarily unavailable.');
  const editions = await response.json();
  const book = editions.find(edition => edition.id === id);
  if (!book) throw new Error('Choose an edition from the library.');
  const { title, pages, game } = book;
  byId('title').textContent = title;
  document.title = title + ' | Reader';
  if (game) {
    const link = byId('game');
    link.href = game;
    link.hidden = false;
  }
  for (let number = 1; number <= pages; number++) {
    pageSelect.append(new Option(String(number), String(number)));
  }
  byId('total').textContent = 'of ' + pages;
  let page = 1;
  function show(number) {
    page = Math.max(1, Math.min(pages, number));
    sheet.hidden = false;
    surface.classList.remove('zoom');
    status.textContent = 'Loading page ' + page + '…';
    sheet.alt = title + ', page ' + page;
    sheet.src = `pages/${id}/${page}.webp`;
    pageSelect.value = String(page);
    previous.disabled = page === 1;
    next.disabled = page === pages;
    params.set('page', String(page));
    history.replaceState(null, '', '?' + params);
  }
  sheet.addEventListener('load', () => { status.textContent = ''; });
  sheet.addEventListener('error', () => { status.textContent = 'This page could not load. Choose a page or reload to retry.'; });
  previous.addEventListener('click', () => show(page - 1));
  next.addEventListener('click', () => show(page + 1));
  pageSelect.addEventListener('change', () => show(Number(pageSelect.value)));
  document.addEventListener('keydown', event => {
    if (event.target.matches('select, input') || event.altKey || event.metaKey || event.ctrlKey) return;
    if (event.key === 'ArrowLeft') show(page - 1);
    if (event.key === 'ArrowRight') show(page + 1);
  });
  let start;
  let lastSwipe = 0;
  surface.addEventListener('touchstart', event => {
    start = event.touches.length === 1 ? event.touches[0] : null;
  }, { passive: true });
  surface.addEventListener('touchcancel', () => { start = null; });
  surface.addEventListener('touchend', event => {
    if (!start || event.touches.length) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - start.clientX;
    const dy = end.clientY - start.clientY;
    start = null;
    if (Math.abs(dx) < 45 || Math.abs(dx) < 1.5 * Math.abs(dy)) return;
    lastSwipe = performance.now();
    show(page + (dx < 0 ? 1 : -1));
  }, { passive: true });
  sheet.addEventListener('click', () => {
    if (performance.now() - lastSwipe > 400) surface.classList.toggle('zoom');
  });
  navigation.hidden = false;
  show(Number.parseInt(params.get('page'), 10) || 1);
}

openBook().catch(error => { status.textContent = error.message; });
