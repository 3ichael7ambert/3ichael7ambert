function mousePencil() {
  var links = document.querySelectorAll("a");
  links.forEach(function (link) {
    link.style.cursor = "none";
  });

  var cursor = document.querySelector(".cursor");
  var docWidth = Math.max(
    document.body.scrollWidth,
    document.documentElement.scrollWidth,
    document.body.offsetWidth,
    document.documentElement.offsetWidth,
    document.body.clientWidth,
    document.documentElement.clientWidth
  ); // Get the width of the document
  var docHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  ); // Get the height of the document
  var docCenterX = docWidth / 2; // Calculate the horizontal center of the document
  var docCenterY = docHeight / 2; // Calculate the vertical center of the document
  var winWidth = window.innerWidth; // Get the initial width of the window
  var winHeight = window.innerHeight; // Get the initial height of the window
  var winCenterX = winWidth / 2; // Calculate the initial horizontal center of the window
  var winCenterY = winHeight / 2; // Calculate the initial vertical center of the window

  function updateCenter() {
    winWidth = window.innerWidth; // Get the updated width of the window
    winHeight = window.innerHeight; // Get the updated height of the window
    winCenterX = winWidth / 2; // Calculate the updated horizontal center of the window
    winCenterY = winHeight / 2; // Calculate the updated vertical center of the window
  }

  document.addEventListener("mousemove", function (e) {
    var angle =
      Math.atan2(winCenterY - e.pageY, winCenterX - e.pageX) * (180 / Math.PI) +
      120;

    cursor.style.left = e.pageX + "px"; // Set the cursor position
    cursor.style.top = e.pageY + "px"; // Set the cursor position
    cursor.style.transform = "rotate(" + angle + "deg)"; // Rotate the cursor to point towards the center of the window
  });

  window.addEventListener("scroll", updateCenter);

  document.addEventListener("mouseout", function () {
    var cursor = document.querySelector(".cursor");
    // cursor.style.display = "none";
  });

  document.body.style.cursor = "none";
  // document.a.style.cursor = "none"; // Not sure what this line was intended for
}
