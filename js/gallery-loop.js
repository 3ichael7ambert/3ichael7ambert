// function loadImages() {
//   const imageContainer = document.getElementById("imageContainer");
//   let num = 1; // Start with img1.jpg

//   while (true) {
//     const imgElement = document.createElement("img");
//     imgElement.src = `/imgs/img${num}.jpg`;

//     // Check if the image exists
//     imgElement.onload = function () {
//       imageContainer.appendChild(imgElement);
//     };

//     // If the image doesn't exist, stop the loop
//     imgElement.onerror = function () {
//       if (num === 1) {
//         console.log("No images found.");
//       }
//       return;
//     };

//     num++;
//   }
// }

// document.addEventListener("DOMContentLoaded", loadImages);
/////////!
/////////////////////
///
// async function loadImageSequence(containerId, basePath, name, startNum) {
//   const container = document.getElementById(containerId);
//   console.log("CONTAINER");
//   console.log(container);

//   for (let num = startNum; ; num++) {
//     const imgElement = document.createElement("img");
//     const imgSrc = `${basePath}/${name}${num}.jpg`;

//     try {
//       const response = await fetch(imgSrc);
//       if (!response.ok) {
//         console.log(`No images found for ${name}.`);
//         break; // Exit the loop if the image is not found
//       }
//       console.log(`Image found: ${imgSrc}`); // Log the image URL
//       imgElement.src = imgSrc;
//       container.appendChild(imgElement);
//     } catch (error) {
//       console.error(error);
//     }

//     // Terminate the loop if the image element couldn't be loaded
//     if (num >= startNum + 10) {
//       console.log(`Stopped loading images for ${name}: limit reached.`);
//       break;
//     }
//   }
// }

// document.addEventListener("DOMContentLoaded", function () {

//     //   loadImageSequence(
//   //     "portrait-gallery",
//   //     "/imgs/design/portraits",
//   //     "portrait",
//   //     1
//   //   );

//   loadImageSequence(
//     "gallery-portraits",
//     "imgs/design/portraits",
//     "portrait",
//     1
//   );

// });
///
///
///
///
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

function openModal(imgSrc, index) {
  const modal = document.getElementById("modal");
  const modalImg = document.getElementById("modal-img");
  modal.style.display = "block"; // Display the modal
  modalImg.src = imgSrc; // Set the source of the modal image to the clicked image
  currentImageIndex = index; // Update the current image index

  // Close the modal when clicking outside of the image
  modal.addEventListener("click", closeModal);
  modalImg.addEventListener("click", (e) => e.stopPropagation()); // Prevent modal close when clicking on the image

  // Show/hide navigation arrows based on current image index
  updateNavArrows();
}

function closeModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none"; // Hide the modal
  modal.removeEventListener("click", closeModal);
}

function updateNavArrows() {
  const prevArrow = document.getElementById("prev-arrow");
  const nextArrow = document.getElementById("next-arrow");
  const gallery = document.getElementById("gallery-portraits");
  const images = gallery.querySelectorAll("img");

  prevArrow.style.display = currentImageIndex > 0 ? "block" : "none"; // Show previous arrow if not on the first image
  nextArrow.style.display =
    currentImageIndex < images.length - 1 ? "block" : "none"; // Show next arrow if not on the last image
}

function navigateGallery(direction) {
  const gallery = document.getElementById("gallery-portraits");
  const images = gallery.querySelectorAll("img");
  const newIndex = currentImageIndex + direction;

  if (newIndex >= 0 && newIndex < images.length) {
    const imgSrc = images[newIndex].src;
    const modalImg = document.getElementById("modal-img");
    modalImg.src = imgSrc;
    currentImageIndex = newIndex;
    updateNavArrows();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  loadImageSequence(
    "gallery-portraits",
    "imgs/design/portraits/portraits",
    "portrait",
    1
  );
 

  loadImageSequence(
    "gallery-portraits-ink",
    "imgs/design/portraits/ink",
    "ink",
    1
  );

  loadImageSequence(
    "gallery-portraits-graphite",
    "imgs/design/portraits/graphite",
    "graphite",
    1
  );

  // Event listeners for navigation arrows
  document
    .getElementById("prev-arrow")
    .addEventListener("click", () => navigateGallery(-1));
  document
    .getElementById("next-arrow")
    .addEventListener("click", () => navigateGallery(1));

  // Event listener for keyboard arrow keys
  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") {
      navigateGallery(-1);
    } else if (event.key === "ArrowRight") {
      navigateGallery(1);
    }
  });

  // Event listeners for swipe gestures
  let touchStartX = 0;
  let touchEndX = 0;

  modal.addEventListener("touchstart", function (event) {
    touchStartX = event.touches[0].clientX;
  });

  modal.addEventListener("touchend", function (event) {
    touchEndX = event.changedTouches[0].clientX;
    const swipeThreshold = 50; // Adjust as needed
    const swipeDistance = touchStartX - touchEndX;

    if (swipeDistance > swipeThreshold) {
      navigateGallery(1); // Swipe left
    } else if (swipeDistance < -swipeThreshold) {
      navigateGallery(-1); // Swipe right
    }
  });
});
