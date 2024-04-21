// JavaScript
gsap.registerPlugin(ScrollTrigger);

// Animate the header elements
gsap.from(".portrait-image", {
  opacity: 0,
  y: -50,
  duration: 1,
  scrollTrigger: {
    trigger: "#introduction",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});

gsap.from(".header-content", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: "#introduction",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});

gsap.from(".logo-image", {
  opacity: 0,
  x: -50,
  duration: 1,
  scrollTrigger: {
    trigger: "#introduction",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});
