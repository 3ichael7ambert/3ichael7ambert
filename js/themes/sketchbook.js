function themeSketchbook() {
  document.body.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
  document.body.style.color = "#000";
  document.body.style.fontFamily = "'Bitterslide-Evelwhite', sans-serif";

  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.style.backgroundColor = "rgba(40, 40, 20, .0)";
    section.style.fontFamily = "'Bitterslide Evelwhite', sans-serif";
  });

  // Fix the header
  const header = document.querySelector("header");
  if (header) {
    header.style.backgroundColor = "rgba(60  , 60, 60, 0.0)";
    header.style.fontFamily = "'Bitterslide Evelwhite', sans-serif";
  }

  //CONTACT FORM
  // Change background color on inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.backgroundColor = "rgba(0,0,0,0)";
  });

  const textarea = document.querySelectorAll("textarea");
  textarea.forEach((textarea) => {
    textarea.style.backgroundColor = "rgba(0,0,0,0)";
  });

  //
  // NAV
  //
  // Apply dark mode styles to navigation
  const nav = document.querySelector("nav");
  if (nav) {
    // nav.style.backgroundColor = "rgba(20, 20, 20, 0.1)";
    nav.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    nav.style.color = "rgba(60, 60, 60, .1)";
    nav.style.boxShadow = "0px -10px 10px rgba(0, 0, 0, 0.9)";
  }

  // Apply dark mode styles to navigation
  const fixedNav = document.querySelector(".fixed-nav");
  if (fixedNav) {
    fixedNav.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    fixedNav.style.backgroundColor = "rgba(20, 20, 20, 0)";
    fixedNav.style.color = "rgba(60, 60, 60, .1)";
    fixedNav.style.boxShadow = "0px 20px 15px rgba(0, 0, 0, .9)";

    // Apply styles to <ul> inside .fixed-nav
    const ulInsideFixedNav = fixedNav.querySelector("ul");
    if (ulInsideFixedNav) {
      ulInsideFixedNav.style.backgroundImage =
        "url(imgs/sketchbook/lined-paper.png)";
      ulInsideFixedNav.style.backgroundColor = "rgba(20, 20, 20, 0)";
      ulInsideFixedNav.style.color = "rgba(60, 60, 60, .1)";
      ulInsideFixedNav.style.boxShadow = "0px 2px 15px rgba(0, 0, 0, .9)";
      ulInsideFixedNav.style.webkitBackdropFilter = "blur(0px)"; // Override -webkit-backdrop-filter
    }
  }

  // Apply dark mode styles to navigation
  const menuToggle = document.querySelector(".menu-toggle");
  if (menuToggle) {
    menuToggle.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    menuToggle.style.backgroundColor = "rgba(20, 20, 20, 0)";
    menuToggle.style.color = "rgba(0, 0, 0, 1)";
    menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0.5)";

    // Apply styles to each <span> inside .menu-toggle
    const spansInsideMenuToggle = menuToggle.querySelectorAll("span");
    spansInsideMenuToggle.forEach((span) => {
      span.style.backgroundColor = "rgba(0, 0, 0, 1)";
    });
  }
}
