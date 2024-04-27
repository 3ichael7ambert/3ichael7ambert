const baseUrl = "https://photo-sphere-viewer-data.netlify.app/assets/";

const viewer = new Viewer({
  container: "viewer",
  panorama: baseUrl + "sphere.jpg",
  caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
  loadingImg: baseUrl + "loader.gif",
  touchmoveTwoFingers: true,
  mousewheelCtrlKey: true,
});

// const baseUrl = "/designs/photography/360/";

// const viewer = new Viewer({
//   container: "viewer",
//   panorama: baseUrl + "360_1.jpg",
//   caption: "Parc national du Mercantour <b>&copy; Damien Sorel</b>",
//   loadingImg: baseUrl + "loader.gif",
//   touchmoveTwoFingers: true,
//   mousewheelCtrlKey: true,
// });

// https://photo-sphere-viewer.js.org/guide/#your-first-viewer
