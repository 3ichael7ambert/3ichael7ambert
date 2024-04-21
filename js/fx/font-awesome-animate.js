// Function to add animation class to an element
function addAnimation(elementId, animationClass) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.add(animationClass);
  }
}

// Function to remove animation class from an element
function removeAnimation(elementId, animationClass) {
  const element = document.getElementById(elementId);
  if (element) {
    element.classList.remove(animationClass);
  }
}

// Trigger animation on scroll
window.addEventListener("scroll", function () {
  // Example: Add 'fa-spin' animation to the social media icons when scrolled
  const socialMediaIcons = document.querySelectorAll(".social-media-icons i");
  socialMediaIcons.forEach((icon) => {
    icon.classList.add("fa-spin");
  });
});

// Trigger animation on click
document.getElementById("some-button").addEventListener("click", function () {
  // Example: Add 'fa-flip' animation to the logo image when a button is clicked
  const logoImage = document.getElementById("logo-image");
  if (logoImage) {
    logoImage.classList.add("fa-flip");

    // Remove animation after 1 second
    setTimeout(function () {
      logoImage.classList.remove("fa-flip");
    }, 1000);
  }
});

// Add beat animation on hover
const socialMediaIcons = document.querySelectorAll(".social-media-icons i");
// socialMediaIcons.forEach((icon) => {
icon.addEventListener("mouseenter", function () {
  icon.classList.add("fa-beat"); // Add fa-beat class to the icon
});

icon.addEventListener("mouseleave", function () {
  icon.classList.remove("fa-beat"); // Remove fa-beat class from the icon
});
// });

// Trigger animation on element hover
const headerContent = document.querySelector(".header-content");
headerContent.addEventListener("mouseenter", function () {
  // Example: Add 'fade-in' animation to header content on hover
  headerContent.classList.add("fade-in");
});

headerContent.addEventListener("mouseleave", function () {
  // Example: Remove 'fade-in' animation from header content on mouse leave
  headerContent.classList.remove("fade-in");
});

// Trigger animation on element focus
const inputField = document.getElementById("input-field");
inputField.addEventListener("focus", function () {
  // Example: Add 'shake' animation to input field on focus
  inputField.classList.add("shake");
});

inputField.addEventListener("blur", function () {
  // Example: Remove 'shake' animation from input field on blur
  inputField.classList.remove("shake");
});

// Trigger animation on element resize
window.addEventListener("resize", function () {
  // Example: Add 'bounce' animation to logo image on window resize
  const logoImage = document.getElementById("logo-image");
  if (logoImage) {
    logoImage.classList.add("bounce");

    // Remove animation after 1 second
    setTimeout(function () {
      logoImage.classList.remove("bounce");
    }, 1000);
  }
});

// Trigger animation on element load
// window.addEventListener("load", function () {
//   // Example: Add 'rotate' animation to header container on page load
//   const headerContainer = document.querySelector(".header-container");
//   if (headerContainer) {
//     headerContainer.classList.add("rotate");
//   }
// });
