function truckerResume() {
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
    header.innerHTML = "<p>A Trucker with over 10 years of experience</p><br/>";
  }
}

// Function to clear the contents and hide sections
// function clearAndHide(...sectionIds) {
//   sectionIds.forEach((sectionId) => {
//     const section = document.getElementById(sectionId);
//     if (section) {
//       section.innerHTML = ""; // Clear the contents
//       section.classList.add("hide");
//       section.style.display = "none";
//       section.classList.remove("section"); // Hide the section
//     }
//   });
// }
