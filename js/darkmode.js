// Function to check if the user's system prefers dark mode
function isDarkModePreferred() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// Function to apply dark mode styles
function applyDarkModeStyles() {
  // Check if dark mode is preferred
  if (isDarkModePreferred() || queryValue === "dark") {
    //   if (true) {
    // Apply dark mode styles to body
    document.body.style.backgroundColor = "#333";
    document.body.style.color = "#fff";

    // Apply dark mode styles to specific sections
    const sections = document.querySelectorAll(".section");
    sections.forEach((section) => {
      section.style.backgroundColor = "rgba(40, 40, 20, .5)"; // Dark background color
      section.style.color = "#fff"; // Light text color
    });

    // Apply dark mode styles to navigation
    const fixedNav = document.querySelector(".fixed-nav");
    if (fixedNav) {
      fixedNav.style.backgroundColor = "rgba(20, 20, 20, 0.7)";
      fixedNav.style.color = "rgba(60, 60, 60, .7)";
      fixedNav.style.boxShadow = "10px 2px 5px rgba(0, 0, 0, 0.5)";
    }

    // Adjust links color
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.style.color = "#fff"; // Light text color for links
    });

    // Change background color on inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.backgroundColor = "#444"; // Darker background color for inputs
      input.style.color = "#fff"; // Light text color for inputs
    });

    // Fix the header
    const header = document.querySelector("header");
    if (header) {
      header.style.backgroundColor = "rgba(60  , 60, 60, 0.5)"; // Dark background color for header
      header.style.color = "#fff"; // Light text color for header
    }

    // Adjust dropdown menus
    const dropdownMenus = document.querySelectorAll(".project-category");
    dropdownMenus.forEach((menu) => {
      menu.style.backgroundColor = "rgba(30, 30, 30, 0.5)"; // Darker background color for dropdown menus
      menu.style.color = "#fff"; // Light text color for dropdown menus
    });
  }
}

// Call the function to apply dark mode styles when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  applyDarkModeStyles();
});

// Call the function to apply dark mode styles when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function () {
  applyDarkModeStyles();
});
