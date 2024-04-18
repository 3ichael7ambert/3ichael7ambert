document.addEventListener("DOMContentLoaded", function () {
  const carousels = document.querySelectorAll(".carousel-container");

  carousels.forEach(initializeCarousel);

  function initializeCarousel(carousel) {
    let isDragging = false;
    let startPosition = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const slides = carousel.querySelector(".carousel");

    // Mouse/touch events
    carousel.addEventListener("mousedown", startDrag);
    carousel.addEventListener("touchstart", startDrag);
    carousel.addEventListener("mousemove", drag);
    carousel.addEventListener("touchmove", drag);
    carousel.addEventListener("mouseup", endDrag);
    carousel.addEventListener("touchend", endDrag);
    carousel.addEventListener("mouseleave", endDrag);

    function startDrag(event) {
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
    }

    function updateCarouselPosition() {
      slides.style.transform = `translateX(${currentTranslate}px)`;
    }
  }
});
