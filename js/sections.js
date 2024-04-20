document.addEventListener("DOMContentLoaded", function () {
  clearAndHideSections();
});

function clearAndHideSections() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryValue = urlParams.toString(); // Get all parameters as a single string
  if (queryValue.includes("developer")) {
    const header = document.getElementById("header-about");

    clearAndHide(
      "music",
      "design",
      "book",
      "clothing",
      "management_resume",
      "art_resume",
      "nav_des",
      "nav_mus",
      "nav_sto",
      "nav_boo",
      "icon-db",
      "icon-insta",
      "icon-deviant",
      "icon-be",
      "icon-artstation",
      "icon-yt",
      "icon-fb",
      "icon-tik"
    );
    if (header) {
      header.innerHTML =
        "<p>Dynamic Software Engineer adept at planning, problem-solving, and coding across diverse platforms and areas. </p><p>Experienced in crafting projects from static web pages to modern web apps. </p><p> Seeking new opportunities to apply expertise in software engineering.</p><br/>";
    }
  } else if (queryValue.includes("art")) {
    clearAndHide(
      "music",
      "software",
      "management_resume",
      "se_resume",
      "nav_sof",
      "nav_gam",
      "nav_boo",
      "nav_mus"
    );
  } else if (queryValue.includes("music")) {
    const header = document.getElementById("header-about");
    const bookDesc = document.getElementById("book-desc");
    clearAndHide(
      "art",
      "software",
      "resume",
      "education",
      "certificates",
      "games",
      "design",
      "management_resume",
      "art_resume",
      "se_resume",
      "nav_sof",
      "nav_gam",
      "nav_des",
      "icon-deviant",
      "icon-be",
      "icon-artstation",
      "icon-git",
      "icon-in",
      "resume",
      "nav_res",
      "nav_edu",
      "nav_cer"
    );
    if (header) {
      header.innerHTML =
        "<p>With over two decades of musical exploration, my journey began with the strings of a guitar and flourished into a digital odyssey with FL Studio. From live bass performances to mastering the ukulele, banjo, mandolin, and piano, I've immersed myself in diverse instruments. Composing across genres from rock to electronica, folk to easy listening, my music tells stories and evokes emotions, reflecting my passion for creativity and the universal language of music.</p><br/>";
    }
    if (bookDesc) {
      bookDesc.innerHTML =
        "'Memorandum in a Cruet' began as lyrical verses destined for music but found its true resonance as standalone poetry. Evoking vivid imagery and heartfelt emotion, its verses captivated readers with their depth and symbolism. Yet, in a surprising twist, the poetry was later reintegrated into music, creating a harmonious fusion of words and melodies that continues to speak to the soul.";
    }
    makeMusicBG();
  } else if (queryValue.includes("author")) {
    clearAndHide(
      "music",
      "software",
      "management_resume",
      "art_resume",
      "se_resume",
      "se_resume",
      "nav_sof",
      "nav_gam",
      "nav_des",
      "nav_mus"
    );
  }
  if (queryValue.includes("dark")) {
    // Add code for dark mode
  }

  if (queryValue.includes("snow")) {
    createSnow();
  }

  if (queryValue.includes("rain")) {
    createRain();
  }
}

// Function to clear the contents and hide sections
function clearAndHide(...sectionIds) {
  sectionIds.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.innerHTML = ""; // Clear the contents
      section.classList.add("hide");
      section.style.display = "none";
      section.classList.remove("section"); // Hide the section
    }
  });
}

// Call the function when the page loads
// window.onload = clearAndHideSections;
