var c = document.getElementById("myArtCanvas");
var ctx = c.getContext("2d");

var noActivityTimer = 0;
var noActivity = true;
var colsInRow = 0;
var squareSize = 25;
var squareSpacing = 5;
var squareLineWidth = 1;
var redrawRate = 100;
var maxSquares = 10000;

var canvasItems = {
  squares: [],
  colorIndex: [
    { rgba: "rgba(192, 84, 206, 0.3)" },
    { rgba: "rgba(238, 175, 106, 1)" },
    { rgba: "rgba(85, 5, 39, 1)" },
    { rgba: "rgba(104, 142, 38, 1)" },
    { rgba: "rgba(232, 174, 104, 1)" },
    { rgba: "rgba(231, 29, 54, 1)" },
    { rgba: "rgba(255, 203, 5, 1)" },
    { rgba: "rgba(0, 114, 188, 1)" },
    { rgba: "rgba(57, 181, 74, 1)" },
    { rgba: "rgba(242, 101, 34, 1)" },
    { rgba: "rgba(146, 39, 143, 1)" },
  ],
};

var generateSquares = function () {
  // Track & Increment
  var squarePos = {
    x: squareSpacing,
    y: squareSpacing,
  };

  // Generate
  var i = 0;
  canvasItems.squares = []; // clear
  colsInRow = 0; // reset
  while (i < maxSquares) {
    var square = {
      x: squarePos.x,
      y: squarePos.y,
      width: squareSize,
      height: squareSize,
      colorIndex: 0,
      clicked: false,
    };

    // Pop
    if (squarePos.y == squareSpacing) {
      colsInRow++;
    }
    canvasItems.squares.push(square);

    // Increment X
    squarePos.x += squareSize + squareSpacing;
    // Increment Y
    if (squarePos.x > c.width) {
      squarePos.x = squareSpacing;
      squarePos.y += squareSize + squareSpacing;
    }

    // break
    if (squarePos.y > c.height) {
      i = maxSquares;
    }

    i++;
  }
};

var draw = function () {
  // width 100%;
  ctx.canvas.width = window.innerWidth;
  ctx.canvas.height = window.innerHeight;
  // determine cols in row

  if (noActivity) {
    randomActivity();
  }
  drawBg();

  // wait 2 seconds, repeate same process
  setTimeout(function () {
    draw();
  }, redrawRate);
};

var drawBg = function () {
  canvasItems.squares.forEach(function (square, index) {
    ctx.beginPath();
    ctx.rect(square.x, square.y, square.width, square.height);
    ctx.fillStyle = canvasItems.colorIndex[square.colorIndex].rgba;
    ctx.fill();
    ctx.lineWidth = squareLineWidth;
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    ctx.stroke();

    if (square.colorIndex > 0 && square.clicked == false) {
      canvasItems.squares[index].colorIndex--;
    }
  });
};

var randomActivity = function () {
  var numSquares = canvasItems.squares.length;
  var targetSquare = getRandomInt(0, numSquares);
  canvasItems.squares[targetSquare].colorIndex = 10;
};

// Returns a random integer between min (included) and max (excluded)
// Using Math.round() will give you a non-uniform distribution!
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

var findHitSquareIndex = function (pos) {
  var mouseX = pos.x;
  var mouseY = pos.y;

  var col = Math.floor(pos.x / (squareSize + squareSpacing));
  var row = Math.floor(pos.y / (squareSize + squareSpacing));
  var roughIndex = col + colsInRow * row;

  return Math.floor(roughIndex);
};

function handleMouseDown(e) {
  var pos = getMousePos(e);
  var squareHitIndex = findHitSquareIndex(pos);
  canvasItems.squares[squareHitIndex].clicked = true;
}

function handleMouseUp(e) {}

function handleMouseOut(e) {
  handleMouseUp(e);
}

function handleMouseMove(e) {
  var pos = getMousePos(e);
  var squareHitIndex = findHitSquareIndex(pos);
  var square = canvasItems.squares[squareHitIndex];

  if (square != undefined && square.colorIndex < 10 && !square.clicked) {
    canvasItems.squares[squareHitIndex].colorIndex = 10;
    noActivity = false;
    noActivityTimer = 6;
  }
}

var getMousePos = function (evt) {
  var rect = c.getBoundingClientRect(), // abs. size of element
    scaleX = c.width / rect.width, // relationship bitmap vs. element for X
    scaleY = c.height / rect.height; // relationship bitmap vs. element for Y

  return {
    x: (evt.clientX - rect.left) * scaleX, // scale mouse coordinates after they have
    y: (evt.clientY - rect.top) * scaleY, // been adjusted to be relative to element
  };
};

var noActivityCheck = function () {
  setTimeout(function () {
    noActivityCheck();
  }, 500);
  if (noActivityTimer > 0) {
    noActivityTimer--;
  } else {
    noActivity = true;
  }
};

c.addEventListener("mousedown", handleMouseDown, false);
c.addEventListener("mousemove", handleMouseMove, false);
c.addEventListener("mouseup", handleMouseUp, false);
c.addEventListener("mouseout", handleMouseOut, false);

function initialize() {
  // Register an event listener to
  // call the resizeCanvas() function each time
  // the window is resized.
  window.addEventListener("resize", resizeCanvas, false);

  // Draw canvas border for the first time.
  resizeCanvas();
}

function resizeCanvas() {
  c.width = window.innerWidth;
  c.height = window.innerHeight;
  generateSquares();
}

// initialize();
// noActivityCheck();
// draw();
