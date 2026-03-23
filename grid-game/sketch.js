// 2D Array Grid Game
// Mitt Pham
// March 20 2026
// 
// Extra for Experts:
// who knows
// https://p5js.org/examples/imported-media-image-transparency/ - image opacity

// Grid variables
const CELL_SIZE = 80;
const ROWS = 8;
const COLUMNS = 8;
let grid;

// Gems
let blueGem;
let greenGem;
let orangeGem;
let purpleGem;
let redGem;

// Track which gem the player is clicking
let currentGem = null;

// Load gem images
function preload() {
  blueGem = loadImage("bluegem.png");
  greenGem = loadImage("greengem.png");
  orangeGem = loadImage("orangegem.png");
  purpleGem = loadImage("purplegem.png");
  redGem = loadImage("redgem.png");
}

// Set up grid
function setup() {
  background("black");
  createCanvas(ROWS * CELL_SIZE, COLUMNS * CELL_SIZE);
  grid = generateGrid(ROWS, COLUMNS);
}

// Show grid
function draw() {
  displayGrid();
}

// Generate a random grid array
function generateGrid(ROWS, COLUMNS) {
  let grid = [];

  for (let y = 0; y < ROWS; y ++) {
    grid.push([]);
    for (let x = 0; x < COLUMNS; x ++) {
      grid[y].push(Math.floor(random(5)));
    }
  }
  return grid;
}

// Display the generated array
function displayGrid() {
  for (let y = 0; y < ROWS; y ++) {
    for (let x = 0; x < COLUMNS; x ++) {

      // Highlight current gem
      let currentX = Math.floor(mouseX / CELL_SIZE);
      let currentY = Math.floor(mouseY / CELL_SIZE);
      if (currentX === x && currentY === y) {
        strokeWeight(4);
        stroke("white");
      }
      else {
        strokeWeight(1);
        stroke("black");
      }
      fill(200);
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Reduce opacity of current gem if clicked
      if (currentGem !== null && currentGem.x === x && currentGem.y === y) {
        tint(255, 127);
      }
      else {
        noTint();
      }

      // Load image for each respective number
      if (grid[y][x] === 0) {
        image(blueGem, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === 1) {
        image(greenGem, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === 2) {
        image(orangeGem, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === 3) {
        image(purpleGem, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === 4) {
        image(redGem, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

// Click two adjacent gems to switch them
function mousePressed() {
  let gemX = Math.floor(mouseX / CELL_SIZE);
  let gemY = Math.floor(mouseY / CELL_SIZE);

  if (gemX >= 0 && gemX < COLUMNS && gemY >= 0 && gemY < ROWS) {
    currentGem = {
      x: gemX,
      y: gemY
    };


  }
}