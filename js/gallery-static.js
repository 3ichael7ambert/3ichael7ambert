// Delegated gallery handler for static thumbnails
// - Adds loading="lazy" to existing .gallery-thumb images
// - Delegates click events from .gallery containers to open the modal
// - Provides previous/next navigation and keyboard support

(function () {
  // Cache thumbs list and add lazy/loading/decoding attributes
  function enhanceThumb(img) {
    if (!img.getAttribute('loading')) img.setAttribute('loading', 'lazy');
    if (!img.getAttribute('decoding')) img.setAttribute('decoding', 'async');
    if (!img.alt) img.alt = img.dataset.alt || 'Gallery image';
    if (!img.dataset.large) img.dataset.large = img.src;
  }

  let thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
  thumbs.forEach(enhanceThumb);

  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-img');
  const prevArrow = document.getElementById('prev-arrow');
  const nextArrow = document.getElementById('next-arrow');

  // Accessor for up-to-date list of thumbs
  function getAllThumbs() {
    thumbs = Array.from(document.querySelectorAll('.gallery-thumb'));
    thumbs.forEach(enhanceThumb);
    return thumbs;
  }

  function openModalWithSrc(src, index) {
    if (!modal || !modalImg) return;
    modal.style.display = 'block';
    modalImg.src = src;
    modalImg.dataset.index = index;
    // set focus for accessibility
    modal.setAttribute('aria-hidden', 'false');
    modalImg.setAttribute('tabindex', '-1');
    modalImg.focus?.();
    updateNavVisibility(index);
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    if (modalImg) modalImg.src = '';
    if (modalImg) delete modalImg.dataset.index;
    modal.setAttribute('aria-hidden', 'true');
  }

  function updateNavVisibility(index) {
    const thumbs = getAllThumbs();
    if (!prevArrow || !nextArrow) return;
    prevArrow.style.display = (index > 0) ? 'flex' : 'none';
    nextArrow.style.display = (index < thumbs.length - 1) ? 'flex' : 'none';
  }

  function navigateGallery(offset) {
    const thumbs = getAllThumbs();
    let idx = parseInt(modalImg.dataset.index || '0', 10);
    idx = Math.max(0, Math.min(thumbs.length -1, idx + offset));
    modalImg.dataset.index = idx;
    modalImg.src = thumbs[idx].dataset.large || thumbs[idx].src;
    updateNavVisibility(idx);
  }

  // Delegate clicks from gallery containers (single global listener)
  document.addEventListener('click', function (e) {
    const thumb = e.target.closest && e.target.closest('.gallery-thumb');
    if (!thumb) return;
    e.preventDefault();
    const thumbsNow = getAllThumbs();
    const index = thumbsNow.indexOf(thumb);
    const src = thumb.dataset.large || thumb.src;
    openModalWithSrc(src, index);
  });

  // Modal close when clicking outside image
  if (modal) modal.addEventListener('click', function (e) {
    if (e.target === modal) closeModal();
  });

  // Prevent modal image clicks from closing modal
  if (modalImg) modalImg.addEventListener('click', function (e) { e.stopPropagation(); });

  // Prev/Next arrow handlers
  if (prevArrow) prevArrow.addEventListener('click', function (e) { e.stopPropagation(); navigateGallery(-1); });
  if (nextArrow) nextArrow.addEventListener('click', function (e) { e.stopPropagation(); navigateGallery(1); });

  // Keyboard navigation
  document.addEventListener('keydown', function (e) {
    if (!modal || modal.style.display !== 'block') return;
    if (e.key === 'ArrowLeft') navigateGallery(-1);
    if (e.key === 'ArrowRight') navigateGallery(1);
    if (e.key === 'Escape') closeModal();
  });

  // Basic touch swipe on modal for mobile
  let touchStartX = 0;
  let touchEndX = 0;
  if (modal) {
    modal.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    modal.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const dist = touchStartX - touchEndX;
      const threshold = 40;
      if (dist > threshold) navigateGallery(1);
      else if (dist < -threshold) navigateGallery(-1);
    }, { passive: true });
  }
})();
