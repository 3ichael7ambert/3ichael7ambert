(() => {
  const gallery = document.querySelector('[data-portfolio]');
  if (!gallery) return;
  const grid = gallery.querySelector('.portfolio-grid');
  const controls = gallery.querySelector('.portfolio-tools');
  const query = controls.querySelector('input');
  const category = controls.querySelector('select');
  const pages = gallery.querySelector('.portfolio-pages');
  const previousPage = pages.querySelector('[data-prev-page]');
  const nextPage = pages.querySelector('[data-next-page]');
  const status = gallery.querySelector('[role="status"]');
  const template = gallery.querySelector('template');
  const viewer = document.querySelector('.portfolio-viewer');
  const viewerImage = viewer.querySelector('img');
  const viewerTitle = viewer.querySelector('h2');
  const viewerCount = viewer.querySelector('[data-viewer-count]');
  const pageSize = 36;
  const format = new Intl.NumberFormat();
  let media = [];
  let filtered = [];
  let index = 0;
  let page = 0;
  let trigger;

  function render() {
    const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
    page = Math.min(page, pageCount - 1);
    const figures = document.createDocumentFragment();
    filtered.slice(page * pageSize, (page + 1) * pageSize).forEach((work, i) => {
      const figure = template.content.cloneNode(true);
      const link = figure.querySelector('a');
      const image = figure.querySelector('img');
      link.href = work.large;
      link.dataset.index = String(page * pageSize + i);
      link.setAttribute('aria-label', `Open ${work.title || work.alt}`);
      image.alt = work.alt;
      image.src = work.thumb;
      if (work.width && work.height) {
        image.width = work.width;
        image.height = work.height;
      }
      figure.querySelector('span').textContent = work.title;
      figure.querySelector('small').textContent = work.category;
      figures.append(figure);
    });
    grid.replaceChildren(figures);
    status.textContent = filtered.length
      ? `${format.format(filtered.length)} works · Page ${page + 1} of ${pageCount}`
      : 'No works match your search.';
    previousPage.disabled = page === 0;
    nextPage.disabled = page + 1 >= pageCount;
    pages.hidden = pageCount === 1;
  }

  function filter() {
    const terms = query.value.toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
    filtered = media.filter(work =>
      (!category.value || work.category === category.value) && terms.every(term => work.search.includes(term)));
    page = 0;
    render();
  }

  function stepPage(change) {
    page += change;
    render();
    grid.focus({ preventScroll: true });
    grid.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  function showWork(newIndex) {
    index = newIndex;
    const work = filtered[index];
    viewerImage.src = work.large;
    viewerImage.alt = work.alt;
    viewerTitle.textContent = work.title || work.alt;
    viewerCount.textContent = `${format.format(index + 1)} / ${format.format(filtered.length)}`;
    viewer.querySelector('[data-prev-work]').disabled = index === 0;
    viewer.querySelector('[data-next-work]').disabled = index + 1 === filtered.length;
  }

  grid.addEventListener('click', event => {
    const link = event.target.closest('a[data-index]');
    if (!link || !viewer.showModal || event.button || event.ctrlKey || event.shiftKey || event.metaKey || event.altKey) return;
    event.preventDefault();
    trigger = link;
    showWork(Number(link.dataset.index));
    viewer.showModal();
  });
  viewer.addEventListener('close', () => trigger?.focus());
  viewer.addEventListener('click', event => {
    if (event.target === viewer.querySelector('[data-close-work]')) viewer.close();
    if (event.target === viewer.querySelector('[data-prev-work]') && index > 0) showWork(index - 1);
    if (event.target === viewer.querySelector('[data-next-work]') && index + 1 < filtered.length) showWork(index + 1);
  });
  viewer.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft' && index > 0) showWork(index - 1);
    if (event.key === 'ArrowRight' && index + 1 < filtered.length) showWork(index + 1);
  });
  controls.addEventListener('submit', event => event.preventDefault());
  query.addEventListener('input', filter);
  category.addEventListener('change', filter);
  previousPage.addEventListener('click', () => stepPage(-1));
  nextPage.addEventListener('click', () => stepPage(1));

  fetch(gallery.dataset.portfolio)
    .then(response => {
      if (!response.ok) throw new Error('Archive request failed');
      return response.json();
    })
    .then(items => {
      media = items.map(work => ({
        ...work, search: [work.title, work.alt, work.category, work.collection].filter(Boolean).join(' ').toLocaleLowerCase(),
      }));
      controls.hidden = false;
      const requestedCategory = new URLSearchParams(location.search).get('medium');
      if ([...category.options].some(option => option.value === requestedCategory)) category.value = requestedCategory;
      filter();
    })
    .catch(() => {
      status.textContent = 'The full archive could not load. The featured works below are available.';
    });
})();
