document.addEventListener("DOMContentLoaded", function () {
  clearAndHideSections();
});

function clearAndHideSections() {
  const urlParams = new URLSearchParams(window.location.search);
  const queryValue = urlParams.get("");
  if (queryValue === "developer") {
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
      "nav_boo"
    );
  } else if (queryValue === "art") {
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
  } else if (queryValue === "music") {
    clearAndHide(
      "art",
      "software",
      "management_resume",
      "art_resume",
      "se_resume",
      "nav_sof",
      "nav_gam",
      "nav_boo",
      "nav_des"
    );
  } else if (queryValue === "author") {
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
  if (queryValue === "dark") {
  }

  if (queryValue === "snow") {
    createSnow();
  }
}

// Function to clear the contents and hide sections
function clearAndHide(...sectionIds) {
  sectionIds.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.innerHTML = ""; // Clear the contents
      section.classList.add("hide"); // Hide the section
    }
  });
}

// Call the function when the page loads
// window.onload = clearAndHideSections;
