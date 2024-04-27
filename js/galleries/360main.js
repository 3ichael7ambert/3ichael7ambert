import { Viewer } from "@photo-sphere-viewer/core";

function isDesktop() {
  return window.innerWidth >= 768;
}

if (isDesktop()) {
  const images = [];
  for (let i = 1; i <= 17; i++) {
    images.push(`imgs/design/photography/360/360_${i}.jpg`);
  }

  let currentImageIndex = 0;
  let viewer;

  function createViewer(imageIndex) {
    if (viewer) {
      viewer.destroy();
    }
    viewer = new Viewer({
      container: document.querySelector("#viewer-360"),
      panorama: images[imageIndex],
    });
    console.log("Current Image Panorama:", images[imageIndex]);
  }

  createViewer(currentImageIndex);

  document.querySelector("#prev-btn-360").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    createViewer(currentImageIndex);
  });

  document.querySelector("#next-btn-360").addEventListener("click", () => {
    currentImageIndex = (currentImageIndex + 1) % images.length;
    createViewer(currentImageIndex);
  });
} else {
  const gallery360 = document.getElementById("gallery-360-photography");
  gallery360.innerHTML = "";
}
