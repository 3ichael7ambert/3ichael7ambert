function mousePencil() {
  document.addEventListener("mousemove", function (e) {
    var cursor = document.querySelector(".cursor");
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
  });

  document.addEventListener("mouseout", function () {
    var cursor = document.querySelector(".cursor");
    //   cursor.style.display = "none";
  });

  // document.body.style.pointerEvents = "none";
  document.body.style.cursor = "none";
  document.a.style.cursor = "none";
}
