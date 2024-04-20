// Function to generate a random number within a range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create raindrop elements
function createRain() {
  const totalRaindrops = 150; // Total number of raindrops
  const container = document.getElementById("weather-container");

  for (let i = 0; i < totalRaindrops; i++) {
    const raindrop = document.createElement("div");
    raindrop.classList.add("raindrop");

    container.style.background = "rgba(50, 50, 50, .3)";

    // Calculate random positions and animation properties
    const randomX = randomInRange(0, window.innerWidth);
    const randomDelay = randomInRange(0, 1);
    const fallDuration = randomInRange(0.5, 1);

    // Set initial position and animation
    raindrop.style.left = randomX + "px";
    raindrop.style.animation = `fall ${fallDuration}s ${randomDelay}s linear infinite`;

    // Append raindrop to container
    container.appendChild(raindrop);
  }
}

// Call function to create raindrops when the window is loaded
window.onload = function () {
  // createRain();
};
