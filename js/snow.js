// Function to generate a random number within a range
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}

// Function to create a snowflake// Function to create a snowflake
function createSnowflake() {
  const snowflake = document.createElement("div");
  snowflake.id = "snowflakes-container";
  snowflake.className = "snowflake";
  snowflake.style.zIndex = 10000;
  snowflake.style.left = randomInRange(0, window.innerWidth) + "px";
  snowflake.style.animationDuration = randomInRange(5, 20) + "s";
  snowflake.style.backgroundColor = "red"; // Set background color to red for debugging
  document.getElementById("snowflakes-container").appendChild(snowflake);

  // Remove the snowflake after animation completes
  snowflake.addEventListener("animationend", () => {
    snowflake.remove();
  });
}

// Function to create multiple snowflakes
function createSnowfall() {
  setInterval(createSnowflake, 500); // Adjust the interval to control snowflake generation rate
}
