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

function loadImageSequence(containerId, basePath, name, startNum) {
  const container = document.getElementById(containerId);

  for (let num = startNum; ; num++) {
    const imgElement = document.createElement("img");
    imgElement.src = `${basePath}/${name}${num}.jpg`;

    // Check if the image exists
    imgElement.onload = function () {
      container.appendChild(imgElement);
    };

    // If the image doesn't exist, stop the loop
    imgElement.onerror = function () {
      if (num === startNum) {
        console.log(`No images found for ${name}.`);
        return;
      }
      return;
    };
  }
}

document.addEventListener("DOMContentLoaded", function () {
  //   loadImageSequence(
  //     ".portrait-gallery",
  //     "/imgs/design/portraits",
  //     "portrait",
  //     1
  //   );
});
