// Function to fetch images from the directory and display them as thumbnails
async function displayThumbnails() {
  const directory = "../imgs/design/portraits/";
  const response = await fetch(directory);
  const html = await response.text();

  // Create a temporary div to parse the HTML content
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Extract image URLs and create thumbnail elements
  const thumbnails = [];
  tempDiv.querySelectorAll("a").forEach((link) => {
    const imageUrl = link.href;
    const thumbnail = document.createElement("div");
    thumbnail.classList.add("thumbnail");
    thumbnail.innerHTML = `<img src="${imageUrl}" alt="Portrait">`;
    thumbnails.push(thumbnail);
  });

  // Add thumbnails to the gallery
  const gallery = document.getElementById("gallery-portraits");
  thumbnails.forEach((thumbnail) => {
    gallery.appendChild(thumbnail);
  });
}

// Call the function to display thumbnails when the page loads
window.addEventListener("load", displayThumbnails);
