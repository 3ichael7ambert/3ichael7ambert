document.addEventListener("DOMContentLoaded", function () {
  clearAndHideSections();
});

function clearAndHideSections() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryValue = urlParams.toString(); // Get all parameters as a single string

  let darkModePreferred = false;
  if (queryValue.includes("dark")) {
    applyDarkModeStyles(true);
    darkModePreferred = true;
  }

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
  } else if (queryValue.includes("games")) {
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
    const header = document.getElementById("header-about");
    const certificate = document.getElementById("certificate-container");

    clearAndHide(
      "music",
      "software",
      "management_resume",
      "se_resume",
      "nav_sof",
      "nav_gam",
      "nav_boo",
      "nav_mus",
      "icon-git"
    );
    // GRID ART
    initialize();
    noActivityCheck();
    draw();
    // MOUSE PENCIL
    mousePencil();
    if (header) {
      header.innerHTML =
        "<p>I've embraced art as my way of life. I blend digital and traditional mediums to express my boundless creativity. From brushstrokes to pixels, I traverse diverse landscapes with tools like Photoshop, Procreate, and Dreamweaver. I craft pixel art, vector illustrations, and custom brushes. My projects span game design, music visualization, graphic design, and more. Come along on this artistic journey where imagination has no limits.</p><br/>";
      header.style.backgroundColor = "rgba(120,120,120,0.2)";
    }
    if (certificate) {
      certificate.innerHTML =
        '<div data-iframe-width="150" data-iframe-height="270" data-share-badge-id="7ec284ac-097a-4370-aa3b-c37f313f7854" data-share-badge-host="https://www.credly.com"></div><script type="text/javascript" async src="//cdn.credly.com/assets/utilities/embed.js"></script>';
    }
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
    makeMusicBG(darkModePreferred);
  } else if (queryValue.includes("author")) {
    const header = document.getElementById("header-about");
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
    if (header) {
      header.innerHTML =
        "<p>Renowned Author and Creative Visionary, showcasing the beauty of life through diverse mediums. Internationally acclaimed for the captivating poetic narratives of the 'Memorandum in a Cruet' spiritual series. Pioneering new horizons in photography with the groundbreaking 'Plastic Photography' collection, and capturing the essence of humanity with the evocative 'Portraitography' series. Explore the profound depths of creativity and spirituality through my captivating works.</p><br/>";
    }
  }

  if (queryValue.includes("snow")) {
    createSnow();
  }

  if (queryValue.includes("rain")) {
    createRain();
  }

  if (queryValue.includes("musicBG")) {
    makeMusicBG(darkModePreferred);
  }

  if (queryValue.includes("pencil")) {
    mousePencil();
  }

  if (queryValue.includes("trucker")) {
    truckerResume();
  }

  if (queryValue.includes("management")) {
    managementResume();
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
