document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".fixed-nav a");
  const menuToggle = document.querySelector(".menu-toggle");
  const navList = document.querySelector(".fixed-nav ul");

  // Function to scroll to a section
  function scrollToSection(section) {
    window.scrollTo({
      top: section.offsetTop,
      behavior: "smooth",
    });
  }

  // Add click event listener to navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      scrollToSection(targetSection);
      deactivateNav(); // Deactivate navigation menu after clicking on a link
    });
  });

  // Toggle active class on menu toggle click
  menuToggle.addEventListener("click", function () {
    navList.classList.toggle("active");
    menuToggle.classList.toggle("active");
  });

  // Function to update navigation based on scroll position
  function updateNav() {
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();
      if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
        navLinks.forEach((link) => link.classList.remove("active-nav"));
        navLinks[index].classList.add("active-nav");
      }
    });
  }

  // Add scroll event listener to update navigation
  window.addEventListener("scroll", updateNav);
  updateNav(); // Update initially

  // Function to deactivate navigation menu
  function deactivateNav() {
    navList.classList.remove("active");
    menuToggle.classList.remove("active");
  }
});

// Function to scroll to the top of the page smoothly
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Function to toggle back-to-top button visibility and slide-in/out effect
function toggleBackToTopButton() {
  const header = document.querySelector("header");
  const backToTopBtn = document.getElementById("backToTopBtn");

  // Calculate the distance between the top of the viewport and the bottom of the header
  const headerBottom = header.offsetHeight;

  // Show the button if scroll position is below the header
  if (window.scrollY > headerBottom) {
    backToTopBtn.style.bottom = "20px"; // Slide in from bottom
  } else {
    backToTopBtn.style.bottom = "-60px"; // Slide out to bottom
  }
}

// Add scroll event listener to toggle button visibility and slide-in/out effect
window.addEventListener("scroll", toggleBackToTopButton);
