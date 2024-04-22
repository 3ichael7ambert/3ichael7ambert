// Function to check if the user's system prefers dark mode
function isDarkModePreferred() {
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// Function to apply dark mode styles
function applyDarkModeStyles(s) {
  // Check if dark mode is preferred
  if (isDarkModePreferred() || s === true) {
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
    const nav = document.querySelector("nav");
    if (nav) {
      nav.style.backgroundColor = "rgba(20, 20, 20, 0.1)";
      nav.style.color = "rgba(60, 60, 60, .1)";
      nav.style.boxShadow = "10px 2px 5px rgba(0, 0, 0, 0.1)";
    }

    // Apply dark mode styles to navigation
    const fixedNav = document.querySelector(".fixed-nav");
    if (fixedNav) {
      fixedNav.style.backgroundColor = "rgba(20, 20, 20, 0.1)";
      fixedNav.style.color = "rgba(60, 60, 60, .1)";
      fixedNav.style.boxShadow = "10px 2px 5px rgba(0, 0, 0, 0.1)";

      // Apply styles to <ul> inside .fixed-nav
      const ulInsideFixedNav = fixedNav.querySelector("ul");
      if (ulInsideFixedNav) {
        ulInsideFixedNav.style.backgroundColor = "rgba(20, 20, 20, 0.1)";
        ulInsideFixedNav.style.color = "rgba(60, 60, 60, .1)";
        ulInsideFixedNav.style.boxShadow = "10px 2px 5px rgba(0, 0, 0, 0.1)";
      }
    }

    const active = document.querySelector(".active");
    if (active) {
      active.style.backgroundColor = "rgba(20, 20, 20, 0.5)";
      active.style.color = "rgba(60, 60, 60, .5)";
      active.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0.5)";
    }

    // Adjust links color
    // Adjust links color and hover effect
    const links = document.querySelectorAll("a");
    links.forEach((link) => {
      link.style.color = "#fff"; // Light text color for links
      link.style.transition = "color 0.3s"; // Smooth transition for color change
      link.addEventListener("mouseenter", () => {
        link.style.color = "#ccc"; // Darker color on hover
      });
      link.addEventListener("mouseleave", () => {
        link.style.color = "#fff"; // Restore original color on hover out
      });
    });

    // Change background color on inputs
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input) => {
      input.style.backgroundColor = "#444"; // Darker background color for inputs
      input.style.color = "#fff"; // Light text color for inputs
    });

    const textarea = document.querySelectorAll("textarea");
    textarea.forEach((textarea) => {
      textarea.style.backgroundColor = "#444"; // Darker background color for inputs
      textarea.style.color = "#fff"; // Light text color for inputs
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

  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    const toggleBackgroundAlpha = "rgba(20, 20, 20, ";
    const activeBackgroundAlpha = "0)";
    const inactiveBackgroundAlpha = ".5)";

    menuToggle.style.backgroundColor =
      toggleBackgroundAlpha + activeBackgroundAlpha;
    menuToggle.style.color = "rgba(0, 0, 0, 1)";
    menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0.5)";
    menuToggle.classList.add("active");

    const spansInsideMenuToggle = menuToggle.querySelectorAll("span");
    spansInsideMenuToggle.forEach((span) => {
      span.style.backgroundColor = "rgba(0, 0, 0, 1)";
    });

    menuToggle.addEventListener("click", function () {
      if (menuToggle.classList.contains("active")) {
        menuToggle.style.backgroundColor =
          toggleBackgroundAlpha + inactiveBackgroundAlpha;
        menuToggle.classList.remove("active");
        menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0.5)"; // Add this line
      } else {
        menuToggle.style.backgroundColor =
          toggleBackgroundAlpha + activeBackgroundAlpha;
        menuToggle.classList.add("active");
        menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0)"; // Change this line
      }
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
