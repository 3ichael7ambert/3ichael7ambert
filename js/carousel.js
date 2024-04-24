document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach(initializeCarousel);

  function initializeCarousel(carousel) {
    const slides = carousel.querySelector(".carousel");
    const slideWidth = slides.offsetWidth;
    const totalSlides = slides.children.length;
    let currentIndex = 1; // Start from the first slide index

    // Clone first and last slides for endless loop
    const firstSlideClone = slides.children[0].cloneNode(true);
    const lastSlideClone = slides.children[totalSlides - 1].cloneNode(true);
    slides.appendChild(firstSlideClone);
    slides.insertBefore(lastSlideClone, slides.children[0]);

    // Mouse/touch events
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = -slideWidth; // Start at the first cloned slide
    let prevTranslate = 0;

    carousel.addEventListener("mousedown", startDrag);
    carousel.addEventListener("touchstart", startDrag);
    carousel.addEventListener("mousemove", drag);
    carousel.addEventListener("touchmove", drag);
    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("touchend", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    function startDrag(event) {
      event.preventDefault(); // Prevent default touch behavior
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

    function updateCarouselPosition() {
      slides.style.transition = "transform 0.5s ease";
      slides.style.transform = `translateX(${currentTranslate}px)`;

      // Update current index based on the translated position
      currentIndex = Math.round(-currentTranslate / slideWidth);
    }

    // Initialize Hammer.js instance
    const hammer = new Hammer(carousel);

    // Listen for swipe events
    hammer.on("swipeleft", function () {
      navigateCarousel("next");
    });

    hammer.on("swiperight", function () {
      navigateCarousel("prev");
    });

    function navigateCarousel(direction) {
      if (direction === "next") {
        currentIndex++;
      } else {
        currentIndex--;
      }

      // Check if we've reached the end or beginning
      if (currentIndex === totalSlides + 1) {
        currentIndex = 2; // Move to the first cloned slide
        currentTranslate = -slideWidth;
      } else if (currentIndex === 0) {
        currentIndex = totalSlides - 1; // Move to the last real slide
        currentTranslate = -currentIndex * slideWidth;
      } else {
        currentTranslate = -currentIndex * slideWidth;
      }

      updateCarouselPosition();
    }
  }
});
