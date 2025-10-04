document.addEventListener("DOMContentLoaded", function () {

  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach(initializeCarousel);

  function initializeCarousel(carousel) {
  const slides = carousel.querySelector(".carousel");
  let slideWidth = carousel.offsetWidth || carousel.getBoundingClientRect().width;
  let totalSlides = slides.children.length;
  let currentIndex = 1; // Start from the first slide index

    // Clone first and last slides for endless loop
  const firstSlideClone = slides.children[0].cloneNode(true);
  const lastSlideClone = slides.children[totalSlides - 1].cloneNode(true);
    slides.appendChild(firstSlideClone);
    slides.insertBefore(lastSlideClone, slides.children[0]);

    // Mouse/touch events
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = -slideWidth; // Start at the first cloned slide (will update after measuring)
    let prevTranslate = 0;

    // Prev/Next buttons
    const btnPrev = carousel.querySelector(".prev");
    const btnNext = carousel.querySelector(".next");
    if (btnPrev) btnPrev.addEventListener("click", () => navigateCarousel("prev"));
    if (btnNext) btnNext.addEventListener("click", () => navigateCarousel("next"));

    // Lazy-play overlay buttons
    slides.querySelectorAll('.play-overlay').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const wrapper = e.currentTarget.closest('.video-wrapper');
        const iframe = wrapper.querySelector('iframe');
        const src = iframe.getAttribute('data-src');
        // Add autoplay param
        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
        // hide overlay
        e.currentTarget.style.display = 'none';
      });
    });

    carousel.addEventListener("mousedown", startDrag);
    carousel.addEventListener("touchstart", startDrag, { passive: true });
    carousel.addEventListener("mousemove", drag);
    carousel.addEventListener("touchmove", drag, { passive: true });
    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("touchend", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    // Recalculate widths on resize
    window.addEventListener('resize', () => {
      slideWidth = carousel.offsetWidth;
      totalSlides = slides.children.length;
      currentTranslate = -currentIndex * slideWidth;
      updateCarouselPosition(true);
    });

    function startDrag(event) {
      // don't prevent default to allow vertical scrolling when needed
      if (event.type === "touchstart") {
        startPosition = event.touches[0].clientX;
      } else {
        startPosition = event.clientX;
      }
      isDragging = true;
      prevTranslate = currentTranslate;
    }

    function drag(event) {
      if (isDragging) {
        let currentPosition;
        if (event.type === "touchmove") {
          currentPosition = event.touches[0].clientX;
        } else {
          currentPosition = event.clientX;
        }
        currentTranslate = prevTranslate + currentPosition - startPosition;
        updateCarouselPosition();
      }
    }

    function endDrag() {
      isDragging = false;
      // Check if we need to snap to the next/previous slide
      const movedBy = currentTranslate - prevTranslate;
      if (Math.abs(movedBy) > slideWidth / 4) {
        if (movedBy < 0) {
          navigateCarousel("next");
        } else {
          navigateCarousel("prev");
        }
      } else {
        // Snap back to the current slide
        currentTranslate = currentIndex * -slideWidth;
        updateCarouselPosition();
      }
    }

    function updateCarouselPosition(skipTransition) {
      if (skipTransition) {
        slides.style.transition = 'none';
      } else {
        slides.style.transition = "transform 0.5s ease";
      }
      slides.style.transform = `translateX(${currentTranslate}px)`;

      // Update current index based on the translated position
      currentIndex = Math.round(-currentTranslate / slideWidth);
      // Handle clones: if we're on cloned slide, jump without transition
      const realTotal = totalSlides - 2; // accounting for clones
      if (currentIndex === 0) {
        // Jump to last real
        currentIndex = realTotal;
        currentTranslate = -currentIndex * slideWidth;
        setTimeout(() => updateCarouselPosition(true), 510);
      } else if (currentIndex === realTotal + 1) {
        // Jump to first real
        currentIndex = 1;
        currentTranslate = -currentIndex * slideWidth;
        setTimeout(() => updateCarouselPosition(true), 510);
      }
    }

    // Initialize Hammer.js instance only if available
    if (typeof Hammer !== 'undefined') {
      try {
        const hammer = new Hammer(carousel);
        hammer.on("swipeleft", function () { navigateCarousel("next"); });
        hammer.on("swiperight", function () { navigateCarousel("prev"); });
      } catch (err) {
        // Hammer available but failed to initialize - ignore
        console.warn('Hammer initialization failed for carousel:', err);
      }
    } else {
      // Fallback: add simple touch-based swipe detection
      let startX = 0;
      carousel.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
      carousel.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const dist = startX - endX;
        if (dist > 40) navigateCarousel('next');
        else if (dist < -40) navigateCarousel('prev');
      }, { passive: true });
    }

    function navigateCarousel(direction) {
      if (direction === "next") {
        currentIndex++;
      } else {
        currentIndex--;
      }

      currentTranslate = -currentIndex * slideWidth;
      updateCarouselPosition();
    }
  }
});
