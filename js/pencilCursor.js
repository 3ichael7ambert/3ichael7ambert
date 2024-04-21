function mousePencil() {
  var links = document.querySelectorAll("a");
  links.forEach(function (link) {
    link.style.cursor = "none";
  });

  document.addEventListener("mousemove", function (e) {
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
    var angle =
      Math.atan2(docCenterY - e.pageY, docCenterX - e.pageX) * (180 / Math.PI); // Calculate the angle between the mouse position and the center of the document
    cursor.style.left = e.pageX + "px"; // Set the cursor position
    cursor.style.top = e.pageY + "px"; // Set the cursor position
    cursor.style.transform = "rotate(" + angle + "deg)"; // Rotate the cursor to point towards the center of the document
  });

  document.addEventListener("mouseout", function () {
    var cursor = document.querySelector(".cursor");
    // cursor.style.display = "none";
  });

  document.body.style.cursor = "none";
  // document.a.style.cursor = "none"; // Not sure what this line was intended for
}
