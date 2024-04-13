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
  }
});
