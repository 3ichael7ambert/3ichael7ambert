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

  // Calculate the right offset for the button
  const rightOffset = window.innerWidth - header.offsetWidth + 5;

  // Show the button if scroll position is below the header
  if (window.scrollY > headerBottom) {
    backToTopBtn.style.right = rightOffset + "px"; // Slide in from right
    backToTopBtn.style.display = "block"; // Show the button
  } else {
    backToTopBtn.style.right = "-20px"; // Slide out to right
    backToTopBtn.style.display = "none"; // Hide the button
  }
}

// Add scroll event listener to toggle button visibility and slide-in/out effect
window.addEventListener("scroll", toggleBackToTopButton);

document.onload;
// TOGGLE SOFTWARE PROJECTS

window.addEventListener("beforeunload", function () {
  // Hide all project lists
  const projectLists = document.querySelectorAll(".projects-list");
  projectLists.forEach(function (projectList) {
    // projectList.style.display = "none";
  });
});

// Drop Down Menus
function toggleProjects(category) {
  const projectList = document.getElementById(category);
  const projectListHeader = document.getElementById(`${category}Header`);
  const arrow = document.getElementById(`${category}Arrow`);

  if (
    projectList.style.maxHeight === "0px" ||
    projectList.style.maxHeight === ""
  ) {
    projectList.style.maxHeight = projectList.scrollHeight + "px"; // Expand
    projectListHeader.classList.add("active");
    arrow.classList.add("rotate"); // Add rotate class
  } else {
    projectList.style.maxHeight = "0px"; // Collapse
    projectListHeader.classList.remove("active");
    arrow.classList.remove("rotate"); // Remove rotate class
  }
}

// Music Video Carousel Menu

const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");

let counter = 0;
const slideWidth = slides[0].offsetWidth;

nextBtn.addEventListener("click", () => {
  counter++;
  if (counter === slides.length) {
    counter = 0;
  }
  carousel.style.transform = `translateX(${-slideWidth * counter}px)`;
});

prevBtn.addEventListener("click", () => {
  counter--;
  if (counter < 0) {
    counter = slides.length - 1;
  }
  carousel.style.transform = `translateX(${-slideWidth * counter}px)`;
});

// Swipe Carusel
document.addEventListener("DOMContentLoaded", function () {
  const carousel = document.querySelector(".carousel");
  let isDragging = false;
  let startPosition = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

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
    carousel.style.transform = `translateX(${currentTranslate}px)`;
  }
});
