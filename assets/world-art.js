const sheets = document.querySelectorAll('[data-comic-sheet]');
const reader = new URL('https://www.drunkyetistudio.com/comics/reader/');
let pageIndex;

async function showSheet(sheet) {
  const image = sheet.querySelector('img');
  try {
    pageIndex ||= fetch(new URL('page-index.json', reader)).then(response => {
      if (!response.ok) throw new Error('Comic index unavailable');
      return response.json();
    });
    const [archive, offset, length] = (await pageIndex)[sheet.dataset.comicSheet];
    const response = await fetch(new URL('packs/' + archive, reader), {
      headers: {Range: 'bytes=' + offset + '-' + (offset + length - 1)},
    });
    if (!response.ok) return;
    const body = await response.arrayBuffer();
    const start = response.status === 206 ? 0 : offset;
    if (body.byteLength < start + length) return;
    const page = new Blob([body.slice(start, start + length)], {type:'image/webp'});
    const source = URL.createObjectURL(page);
    image.addEventListener('load', () => { sheet.dataset.ready = ''; }, {once:true});
    image.addEventListener('error', () => URL.revokeObjectURL(source), {once:true});
    image.src = source;
  } catch {
    // The linked reader remains available if its original image cannot be embedded.
  }
}

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      observer.unobserve(entry.target);
      showSheet(entry.target);
    }
  }, {rootMargin:'220px'});
  sheets.forEach(sheet => observer.observe(sheet));
} else {
  sheets.forEach(showSheet);
}
