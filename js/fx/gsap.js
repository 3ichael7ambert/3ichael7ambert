// JavaScript
gsap.registerPlugin(
  ScrollTrigger,
  Flip,
  Observer,
  ScrollToPlugin,
  Draggable,
  MotionPathPlugin,
  EaselPlugin,
  PixiPlugin,
  TextPlugin,
  EasePack,
  CustomEase
);

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

// Additional animations
gsap.from(".social-media-icons", {
  opacity: 0,
  y: 50,
  duration: 1,
  scrollTrigger: {
    trigger: "#header-about",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});

gsap.from(".container", {
  opacity: 0,
  x: -50,
  duration: 1,
  scrollTrigger: {
    trigger: ".mobile-only",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});

// Using .to for continuous animation
gsap.to(".element", {
  opacity: 0.5,
  y: 100,
  duration: 2,
  scrollTrigger: {
    trigger: ".trigger",
    start: "top center",
    end: "bottom center",
    toggleActions: "play none none none",
  },
});

// Using .fromTo for animation with a starting and ending state
gsap.fromTo(
  ".element",
  {
    opacity: 0,
    x: -100,
  },
  {
    opacity: 1,
    x: 0,
    duration: 1,
    scrollTrigger: {
      trigger: ".trigger",
      start: "top center",
      end: "bottom center",
      toggleActions: "play none none none",
    },
  }
);

gsap.to(".section", { rotation: 360, x: 100, duration: 1 });
