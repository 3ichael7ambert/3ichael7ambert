function themeSketchbook() {
  document.body.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
  document.body.style.color = "#000";
  document.body.style.fontFamily = "'Bitterslide-Evelwhite', sans-serif";
  document.body.style.paddingLeft = "70px";

  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => {
    section.style.backgroundColor = "rgba(40, 40, 20, .0)";
    section.style.fontFamily = "'Bitterslide Evelwhite', sans-serif";
    section.style.color = "#000";
  });

  // Fix the header
  const header = document.querySelector("header");
  if (header) {
    header.style.backgroundColor = "rgba(60, 60, 60, 0.0)";
    header.style.color = "#000";
    header.style.fontFamily = "'Bitterslide Evelwhite', sans-serif";
  }

  //CONTACT FORM
  // Change background color on inputs
  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.style.backgroundColor = "rgba(0,0,0,0)";
    input.style.color = "#000"; // Change text color to black
  });

  const textarea = document.querySelectorAll("textarea");
  textarea.forEach((textarea) => {
    textarea.style.backgroundColor = "rgba(0,0,0,0)";
    textarea.style.color = "#000"; // Change text color to black
  });

  // Apply sketch mode styles to navigation
  const links = document.querySelectorAll("a");
  links.forEach((link) => {
    link.style.color = "#333"; // Change text color to black

    // Add hover color change effect
    link.addEventListener("mouseenter", function () {
      link.style.color = "#666"; // Change text color on hover
    });

    link.addEventListener("mouseleave", function () {
      link.style.color = "#333"; // Revert text color on mouse leave
    });
  });

  //
  // NAV
  //
  // Apply sketch mode styles to navigation
  const nav = document.querySelector("nav");
  if (nav) {
    nav.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    nav.style.color = "#000"; // Change text color to black
    nav.style.boxShadow = "0px -10px 10px rgba(0, 0, 0, 0.9)";
  }

  //
  //
  //
  // Define a function to handle the second image styles based on screen size
  // Apply sketch mode styles to navigation
  const fixedNav = document.querySelector(".fixed-nav");
  if (fixedNav) {
    fixedNav.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    fixedNav.style.backgroundColor = "rgba(20, 20, 20, 0)";
    fixedNav.style.color = "#000"; // Change text color to black
    fixedNav.style.boxShadow = "0px 20px 15px rgba(0, 0, 0, .9)";

    const ulInsideFixedNav = fixedNav.querySelector("ul");
    if (ulInsideFixedNav) {
      ulInsideFixedNav.style.backgroundImage =
        "url(imgs/sketchbook/lined-paper.png)";
      ulInsideFixedNav.style.backgroundColor = "rgba(20, 20, 20, 0)";
      ulInsideFixedNav.style.color = "#000"; // Change text color to black
      ulInsideFixedNav.style.boxShadow = "0px 2px 15px rgba(0, 0, 0, .9)";
      ulInsideFixedNav.style.webkitBackdropFilter = "blur(0px)"; // Override -webkit-backdrop-filter

      // Create a new image element for the second image
      const secondImage = document.createElement("img");
      secondImage.src = "imgs/sketchbook/PaperTear.png";
      secondImage.style.position = "absolute";
      secondImage.style.top = "-10px";
      secondImage.style.left = "50%";
      secondImage.style.width = "100%";
      secondImage.style.height = "30px";
      secondImage.style.transform = "translate(-50%, -50%) rotate(180deg)";

      // Append the second image to the ulInsideFixedNav
      ulInsideFixedNav.appendChild(secondImage);

      // Adjust second image styles based on screen size
      function adjustSecondImageStyle() {
        if (window.innerWidth >= 320 && window.innerWidth <= 767) {
          // Apply styles for mobile view (viewport width between 320px and 767px)
          secondImage.style.position = "absolute";
          // Check for different browsers
          if (navigator.userAgent.includes("Firefox")) {
            // Firefox specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-380px) translateY(-220px)";
          } else if (
            navigator.userAgent.includes("Chrome") &&
            !navigator.userAgent.includes("Android")
          ) {
            // Chrome specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-460px) translateY(-310px)";
          } else if (
            navigator.userAgent.includes("Chrome") &&
            navigator.userAgent.includes("Android")
          ) {
            // Chrome specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-440px) translateY(-285px)";
          } else if (navigator.userAgent.includes("Edge")) {
            // Edge specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-400px) translateY(-200px)";
          } else if (
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("iPhone")
          ) {
            // Safari specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-490px) translateY(-330px)";
          } else if (
            navigator.userAgent.includes("Safari") &&
            (navigator.userAgent.includes("iPhone") ||
              navigator.userAgent.includes("iPad"))
          ) {
            // Safari specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-360px) translateY(-195px)";
            // -195px Y
          } else if (navigator.userAgent.includes("Opera")) {
            // Opera specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-470px) translateY(-320px)";
          } else if (navigator.userAgent.includes("OPR")) {
            // Opera on Android specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-430px) translateY(-250px)";
          } else if (navigator.userAgent.includes("SamsungBrowser")) {
            // Samsung Internet specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-460px) translateY(-290px)";
          } else if (
            navigator.userAgent.includes("Firefox") &&
            navigator.userAgent.includes("Android")
          ) {
            // Firefox on Android specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-440px) translateY(-270px)";
          } else if (navigator.userAgent.includes("Android")) {
            // Firefox on Android specific transformation
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(270deg) translateX(-440px) translateY(-370px)";
          } else if (
            navigator.userAgent.includes("iPhone") ||
            navigator.userAgent.includes("iPad")
          ) {
            // iOS specific transformation
            secondImage.style.transform =
              "translate(-0, 0) rotate(270deg) translateX(-500px) translateY(-30px)";
            // -30px y
          } else {
            // Default transformation for other browsers
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(180deg)";
          }

          secondImage.style.width = window.innerHeight + 20 + "px";
        } else {
          secondImage.style.position = "absolute";
          // Apply default styles for other viewports
          if (
            navigator.userAgent.includes("Safari") &&
            !navigator.userAgent.includes("iPhone")
          ) {
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(180deg) translateX(0px) translateY(-300px)";
            // "translate(-50%, -50%) rotate(180deg) translateX(-500px) translateY(-300px)";
          } else if (
            navigator.userAgent.includes("Firefox") &&
            !navigator.userAgent.includes("iPhone")
          ) {
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(180deg) translateX(0px) translateY(-5px)";
          } else if (navigator.userAgent.includes("Chrome")) {
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(180deg) translateX(0px) translateY(-5px)";
          } else {
            secondImage.style.transform =
              "translate(-50%, -50%) rotate(180deg) translateX(0px) translateY(-5px)";
          }
        }
      }

      // Call the adjustSecondImageStyle function initially to apply styles on page load
      adjustSecondImageStyle();

      // Add event listener for window resize to adjust styles dynamically
      window.addEventListener("resize", adjustSecondImageStyle);
    }
  }

  // Apply sketch mode styles to navigation
  const menuToggle = document.querySelector(".menu-toggle");
  menuToggle.classList.add("active");
  if (menuToggle) {
    // menuToggle.style.backgroundImage = "url(imgs/sketchbook/lined-paper.png)";
    menuToggle.style.backgroundColor = "rgba(20, 20, 20, 0)";
    menuToggle.style.color = "#000";
    menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0)";

    menuToggle.style.webkitBackdropFilter = "blur(0px)";

    // Apply styles to each <span> inside .menu-toggle
    const spansInsideMenuToggle = menuToggle.querySelectorAll("span");
    spansInsideMenuToggle.forEach((span) => {
      span.style.backgroundColor = "rgba(0, 0, 0, 1)";
    });

    menuToggle.addEventListener("click", function () {
      if (menuToggle.classList.contains("active")) {
        menuToggle.style.backgroundColor = "rgba(20, 20, 20, 0)"; // Set background alpha to 0
        // menuToggle.classList.remove("active");
        // menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0)"; // Remove shadow
        menuToggle.style.webkitBackdropFilter = "blur(0px)"; // Remove blur
      } else {
        menuToggle.style.backgroundColor = "rgba(20, 20, 20, 0)";
        menuToggle.classList.add("active");
        menuToggle.style.boxShadow = "1px 2px 5px rgba(0, 0, 0, 0)"; // Add shadow
        menuToggle.style.webkitBackdropFilter = "blur(0px)"; // Add blur
      }
    });
  }
}
