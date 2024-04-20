// Function to generate a random number within a range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create snow elements
function createSnow() {
  const totalSnowflakes = 200; // Total number of snowflakes
  const container = document.getElementById("weather-container"); 

  for (let i = 0; i < totalSnowflakes; i++) {
    const snowflake = document.createElement("div");
    snowflake.classList.add("snow");
    snowflake.style.width = "10px";
    snowflake.style.height = "10px";
    snowflake.style.position = "absolute";
    snowflake.style.background = "white";
    snowflake.style.borderRadius = "50%";
    snowflake.style.zIndex = "11000";
    container.style.background = "rgba(50, 50, 50, .3)";

    // Calculate random positions and animation properties
    const randomX = randomInRange(0, window.innerWidth);
    const randomOffset = randomInRange(-100, 100);
    const randomXEnd = randomX + randomOffset;
    const randomYoyoTime = randomInRange(0.3, 0.8) * 100;
    const randomScale = randomInRange(0.1, 1);
    const fallDuration = randomInRange(10, 30);
    const fallDelay = randomInRange(-10, 0);

    // Set initial position and animation
    snowflake.style.left = randomX + "px";
    snowflake.style.transform = `translateY(-10px) scale(${randomScale})`;
    snowflake.style.animation = `fall-${i} ${fallDuration}s ${fallDelay}s linear infinite`;

    // Create keyframes for animation
    const keyframes = `
            @keyframes fall-${i} {
              ${randomYoyoTime}% {
                transform: translate(${randomXEnd}px, 100vh) scale(${randomScale});
              }
              to {
                transform: translate(${randomXEnd}px, 100vh) scale(${randomScale});
              }
            }
          `;

    // Add keyframes to style tag
    const style = document.createElement("style");
    style.innerHTML = keyframes;
    document.head.appendChild(style);

    // Append snowflake to container
    container.appendChild(snowflake);
  }
}

// Call function to create snowflakes
// createSnow();
