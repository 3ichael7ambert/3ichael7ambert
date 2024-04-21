function managementResume() {
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
    header.innerHTML = "<p>A Manager with over 10 years of experience</p><br/>";
  }
}


