let currentImageIndex = 0; // Track the index of the currently displayed image

async function loadImageSequence(containerId, basePath, name, startNum) {
  const container = document.getElementById(containerId);

  for (let num = startNum; ; num++) {
    const imgElement = document.createElement("img");
    const imgSrc = `${basePath}/${name}${num}.jpg`;

    try {
      const response = await fetch(imgSrc);
      if (!response.ok) {
        console.log(`No images found for ${name}.`);
        break; // Exit the loop if the image is not found
      }
      console.log(`Image found: ${imgSrc}`); // Log the image URL

      // Set the CSS class based on image orientation
      const isPortrait = response.headers
        .get("content-type")
        .startsWith("image/jpeg"); // Assuming portrait images are JPEG
      imgElement.classList.add(isPortrait ? "portrait" : "landscape");

      imgElement.src = imgSrc;
      imgElement.addEventListener("click", () =>
        openModal(imgSrc, num - startNum)
      ); // Add click event listener to open modal
      container.appendChild(imgElement);
    } catch (error) {
      console.error(error);
    }

    // Terminate the loop if the image element couldn't be loaded
    if (num >= startNum + 10) {
      console.log(`Stopped loading images for ${name}: limit reached.`);
      break;
    }
  }
}

async function loadLightSliderGalleries(galleries) {
  galleries.forEach(async (gallery) => {
    const { containerId, basePath, name, startNum } = gallery;
    const container = document.getElementById(containerId);
    const ulElement = document.createElement("ul");
    ulElement.id = "lightSlider";

    for (let num = startNum; ; num++) {
      const liElement = document.createElement("li");
      const imgSrc = `${basePath}/${name}${num}.jpg`;

      try {
        const response = await fetch(imgSrc);
        if (!response.ok) {
          console.log(`No images found for ${name}.`);
          break; // Exit the loop if the image is not found
        }
        console.log(`Image found: ${imgSrc}`); // Log the image URL

        // Create the elements for the slide
        // const h3Element = document.createElement("h3");
        // h3Element.textContent = `Slide ${num - startNum + 1}`; // Adjust the slide title as needed

        const pElement = document.createElement("p");
        pElement.textContent = ""; // Add description for the slide as needed

        const imgElement = document.createElement("img");
        imgElement.src = imgSrc;

        // Add some basic styling to the img element
        imgElement.style.width = "auto"; // Example styling, adjust as needed
        imgElement.style.height = "100%"; // Example styling, adjust as needed

        // Append elements to the li element
        // liElement.appendChild(h3Element);s
        liElement.appendChild(pElement);
        liElement.appendChild(imgElement);

        // Append the li element to the ul element
        ulElement.appendChild(liElement);
      } catch (error) {
        console.error(error);
      }

      // Terminate the loop if the image element couldn't be loaded
      if (num >= startNum + 10) {
        console.log(`Stopped loading images for ${name}: limit reached.`);
        break;
      }
    }

    // Append the ul element to the container
    container.appendChild(ulElement);

    // Initialize LightSlider after all images are loaded
    lightSliderInit(containerId);

    // Add event listener to each image inside the li elements
    ulElement.querySelectorAll("#lightSlider li img").forEach((img, index) => {
      img.addEventListener("dblclick", () => {
        const imgSrc = img.getAttribute("src");
        openModal(imgSrc, index); // Call the openModal function with the image source and its index
      });
    });
  });
}

function lightSliderInit(containerId) {
  const lightSliderOptions = {
    item: 3,
    autoWidth: true,
    slideMove: 1,
    slideMargin: 10,
    mode: "slide",
    useCSS: true,
    cssEasing: "ease",
    easing: "linear",
    speed: 400,
    auto: true,
    loop: true,
    slideEndAnimation: true,
    pause: 2000,
    keyPress: true,
    controls: true,
    rtl: false,
    adaptiveHeight: false,
    vertical: false,
    verticalHeight: 500,
    vThumbWidth: 100,
    thumbItem: 10,
    pager: true,
    gallery: false,
    galleryMargin: 5,
    thumbMargin: 5,
    currentPagerPosition: "middle",
    enableTouch: true,
    enableDrag: true,
    freeMove: true,
    swipeThreshold: 40,
  };

  const lightSlider = document.getElementById(containerId).querySelector("ul");
  $(lightSlider).lightSlider(lightSliderOptions);
}

// document.addEventListener("DOMContentLoaded", function () {
const galleries = [
  // Portraits
  {
    containerId: "gallery-portraits-ink-light",
    basePath: "imgs/design/portraits/ink",
    name: "ink",
    startNum: 1,
  },
  {
    containerId: "gallery-portraits-graphite-light",
    basePath: "imgs/design/portraits/graphite",
    name: "graphite",
    startNum: 1,
  },
  {
    containerId: "gallery-portraits-paint-light",
    basePath: "imgs/design/portraits/paint",
    name: "portrait-paint",
    startNum: 1,
  },
  {
    containerId: "gallery-portraits-pencil-light",
    basePath: "imgs/design/portraits/pencil",
    name: "portrait-cp",
    startNum: 1,
  },
  {
    containerId: "gallery-portraits-urban-light",
    basePath: "imgs/design/portraits/urban",
    name: "urban",
    startNum: 1,
  },
  {
    containerId: "gallery-portraits-portraits-light",
    basePath: "imgs/design/portraits/portraits",
    name: "portraits",
    startNum: 1,
  },
  // finearts

  {
    containerId: "gallery-finearts-paint-light",
    basePath: "imgs/design/finearts/paint",
    name: "paint",
    startNum: 1,
  },

  {
    containerId: "gallery-finearts-sculpture-light",
    basePath: "imgs/design/finearts/sculpture",
    name: "sculpt",
    startNum: 1,
  },
  {
    containerId: "gallery-finearts-draw-light",
    basePath: "imgs/design/finearts/draw",
    name: "draw",
    startNum: 1,
  },
  {
    containerId: "gallery-finearts-graphics-light",
    basePath: "imgs/design/finearts/graphics",
    name: "graphics",
    startNum: 1,
  },
  // photography

  {
    containerId: "gallery-photography-macro-light",
    basePath: "imgs/design/photography/macro",
    name: "macro",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-animals-light",
    basePath: "imgs/design/photography/animals",
    name: "photo-animals",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-flowers-light",
    basePath: "imgs/design/photography/flowers",
    name: "photo-flowers",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-landscape-light",
    basePath: "imgs/design/photography/landscape",
    name: "landscape",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-planets-light",
    basePath: "imgs/design/photography/planets",
    name: "planets",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-abstract-light",
    basePath: "imgs/design/photography/abstract",
    name: "photo-abstract",
    startNum: 1,
  },
  {
    containerId: "gallery-photography-manip-light",
    basePath: "imgs/design/photography/manip",
    name: "photo-manip",
    startNum: 1,
  },
  // OTHER

  {
    containerId: "gallery-character-light",
    basePath: "imgs/design/character",
    name: "character",
    startNum: 1,
  },

  {
    containerId: "gallery-pixel-light",
    basePath: "imgs/design/game/pixel",
    name: "pixel",
    startNum: 1,
  },

  {
    containerId: "gallery-sprites-light",
    basePath: "imgs/design/game/sprites",
    name: "sprites",
    startNum: 1,
  },
  // MODEL

  {
    containerId: "gallery-model-art-light",
    basePath: "imgs/design/model/art",
    name: "model-art",
    startNum: 1,
  },
  {
    containerId: "gallery-model-self-light",
    basePath: "imgs/design/model/self",
    name: "model-self",
    startNum: 1,
  },
  // SHOP

  {
    containerId: "gallery-shop-light",
    basePath: "imgs/shop",
    name: "shop",
    startNum: 1,
  },

  // FURTHER

  {
    containerId: "gallery-inktober-light",
    basePath: "imgs/design/inktober",
    name: "inktober",
    startNum: 1,
  },
  // ADD MORE
];

// loadLightSliderGalleries(galleries);
// });

function loadGallery(containerId) {
  // Find the gallery object from the galleries array based on the provided containerId
  const gallery = galleries.find(
    (gallery) => gallery.containerId === containerId
  );

  // Check if the gallery object is found
  if (gallery) {
    // Pass the gallery object to loadLightSliderGalleries function
    loadLightSliderGalleries([gallery]);
  } else {
    console.error(`Gallery not found for containerId: ${containerId}`);
  }
}

// Define modal outside the openModal function
const modal = document.getElementById("modal");
/*
// MODAL LIGHTBOX
function openModal(imgSrc, index) {
  const modalImg = document.getElementById("modal-img");
  modal.style.display = "block"; // Display the modal
  modalImg.src = imgSrc; // Set the source of the modal image to the clicked image
  currentImageIndex = index; // Update the current image index

  // Show/hide navigation arrows based on current image index
  updateNavArrows();
}

function closeModal() {
  modal.style.display = "none"; // Hide the modal

  // Remove event listeners
  document
    .getElementById("prev-arrow")
    .removeEventListener("click", navigatePrev);
  document
    .getElementById("next-arrow")
    .removeEventListener("click", navigateNext);
  document.removeEventListener("keydown", handleKeyDown);
  modal.removeEventListener("touchstart", handleTouchStart);
  modal.removeEventListener("touchend", handleTouchEnd);
  modal.removeEventListener("click", closeModal);

  // Also remove the click event listener on the modal image
  modalImg.removeEventListener("click", stopPropagation);
}

// Function to navigate to the previous image
function navigatePrev() {
  navigateGallery(-1);
}

// Function to navigate to the next image
function navigateNext() {
  navigateGallery(1);
}

// Function to handle keyboard arrow keys
function handleKeyDown(event) {
  if (event.key === "ArrowLeft") {
    navigatePrev();
  } else if (event.key === "ArrowRight") {
    navigateNext();
  }
}

// Function to handle touch start event
function handleTouchStart(event) {
  touchStartX = event.touches[0].clientX;
}

// Function to handle touch end event
function handleTouchEnd(event) {
  touchEndX = event.changedTouches[0].clientX;
  const swipeThreshold = 50; // Adjust as needed
  const swipeDistance = touchStartX - touchEndX;

  if (swipeDistance > swipeThreshold) {
    navigateNext(); // Swipe left
  } else if (swipeDistance < -swipeThreshold) {
    navigatePrev(); // Swipe right
  }
}

// Function to stop event propagation
function stopPropagation(event) {
  event.stopPropagation();
}

// Event listeners for navigation arrows
document.getElementById("prev-arrow").addEventListener("click", navigatePrev);
document.getElementById("next-arrow").addEventListener("click", navigateNext);

// Event listener for keyboard arrow keys
document.addEventListener("keydown", handleKeyDown);

// Event listeners for swipe gestures
let touchStartX = 0;
let touchEndX = 0;

modal.addEventListener("touchstart", handleTouchStart);
modal.addEventListener("touchend", handleTouchEnd);

// Close the modal when clicking outside of the image
modal.addEventListener("click", closeModal);
modalImg.addEventListener("click", stopPropagation);
