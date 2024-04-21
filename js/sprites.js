var isScrolling = false; // Flag to track scrolling status

window.addEventListener("scroll", function () {
  isScrolling = true; // Set scrolling flag to true
  requestAnimationFrame(updateSpaceship); // Request animation frame
});

function updateSpaceship() {
  var scrollPosition = window.scrollY; // Get current scroll position
  var spaceship = document.getElementById("spaceship");

  // Calculate X position based on scroll position
  var posX = (scrollPosition / (window.innerHeight * 0.2)) * 100; // Adjust X position based on scroll position
  spaceship.style.left = posX + "px";

  // Calculate Y position based on scroll position
  var posY = scrollPosition; // Adjust as needed based on your layout
  spaceship.style.top = posY + "px";

  // Calculate frame index based on scroll position
  var frameIndex = Math.floor(scrollPosition / 100) % 8; // Assuming 8 frames in the sprite sheet

  // Set background position to display the correct frame
  spaceship.style.backgroundPositionX = -frameIndex * 73 + "px"; // Assuming each frame is 73px wide

  if (!isScrolling) {
    return; // Stop animation if not scrolling
  }

  // Reset scrolling flag
  isScrolling = false;

  // Request next animation frame
  requestAnimationFrame(updateSpaceship);
}

// Initial call to start the spaceship at the top of the page
updateSpaceship();
