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

async function loadImageSequence(containerId, basePath, name, startNum) {
  const container = document.getElementById(containerId);
  console.log("CONTAINER");
  console.log(container);

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
      imgElement.src = imgSrc;
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

document.addEventListener("DOMContentLoaded", function () {
  loadImageSequence(
    "portrait-gallery",
    "/imgs/design/portraits",
    "portrait",
    1
  );
  loadImageSequence(
    "gallery-portraits",
    "imgs/design/portraits",
    "portrait",
    1
  );
});
