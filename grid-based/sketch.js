// 2D Array Grid Game
// Mitt Pham
// March 20 2026
// 
// Extra for Experts:
// who knows
// https://p5js.org/examples/imported-media-image-transparency/ - image opacity
// https://editor.p5js.org/MarcoGaLo/sketches/2WSdSF7nx - candy crush reference

// Grid variables
const CELL_SIZE = 80;
const ROWS = 8;
const COLUMNS = 8;
const HALF_OPACITY = 127;
const EMPTY_CELL = -1;
const UNHIGHLIGHTED_CELL = 1;
const HIGHLIGHTED_CELL = 4;

let grid;

// Gems variables and constants
const BLUE_GEM = 0;
const GREEN_GEM = 1;
const ORANGE_GEM = 2;
const PURPLE_GEM = 3;
const RED_GEM = 4;
let gems = [BLUE_GEM, GREEN_GEM, ORANGE_GEM, PURPLE_GEM, RED_GEM];

let blueGemImage;
let greenGemImage;
let orangeGemImage;
let purpleGemImage;
let redGemImage;

// Track the player clicks
let currentGem = null;

// Load gem images
function preload() {
  blueGemImage = loadImage("bluegem.png");
  greenGemImage = loadImage("greengem.png");
  orangeGemImage = loadImage("orangegem.png");
  purpleGemImage = loadImage("purplegem.png");
  redGemImage = loadImage("redgem.png");
}

// Set up grid
function setup() {
  background("black");
  createCanvas(ROWS * CELL_SIZE, COLUMNS * CELL_SIZE);
  grid = generateGrid(ROWS, COLUMNS);
  matchGems();
  refillGems();
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
      grid[y].push(random(gems));
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
        strokeWeight(HIGHLIGHTED_CELL);
        stroke("white");
      }
      else {
        strokeWeight(UNHIGHLIGHTED_CELL);
        stroke("black");
      }
      fill(50);
      rect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);

      // Reduce opacity of current gem if clicked
      if (currentGem !== null && currentGem.x === x && currentGem.y === y) {
        tint(255, HALF_OPACITY);
      }
      else {
        noTint();
      }

      // Load image for each respective number
      if (grid[y][x] !== EMPTY_CELL) {
        if (grid[y][x] === BLUE_GEM) {
          image(blueGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (grid[y][x] === GREEN_GEM) {
          image(greenGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (grid[y][x] === ORANGE_GEM) {
          image(orangeGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (grid[y][x] === PURPLE_GEM) {
          image(purpleGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (grid[y][x] === RED_GEM) {
          image(redGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (grid[y][x] === EMPTY_CELL) {
          square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
        }
      }
    }
  }
}

// Check if there are three matching gems and remove them
function matchGems() {

  // Create a new empty array
  let matchGrid = [];

  for (let y = 0; y < ROWS; y ++) {
    matchGrid.push([]);
    for (let x = 0; x < COLUMNS; x ++) {
      matchGrid[y].push(false);
    }
  }

  // Check every cell
  for (let y = 0; y < ROWS; y ++) {
    for (let x = 0; x < COLUMNS; x ++) {

      let gemType = grid[y][x];

      // Check for horizontal matches
      if (x - 1 >= 0 && x + 1 < COLUMNS) {
        if (grid[y][x - 1] === gemType && grid[y][x + 1] === gemType) {
          matchGrid[y][x] = true;
          matchGrid[y][x - 1] = true;
          matchGrid[y][x + 1] = true;
        }
      }

      // Check for vertical matches
      if (y - 1 >= 0 && y + 1 < ROWS) {
        if (grid[y - 1][x] === gemType && grid[y + 1][x] === gemType) {
          matchGrid[y][x] = true;
          matchGrid[y - 1][x] = true;
          matchGrid[y + 1][x] = true;
        }
      }
    }
  }

  // Remove any matches
  for (let y = 0; y < ROWS; y ++) {
    for (let x = 0; x < COLUMNS; x ++) {
      if (matchGrid[y][x] === true) {
        grid[y][x] = EMPTY_CELL;
      }
    }
  }

  return matchGrid;
}

// Replace any empty spots with new gems
function refillGems() {
  for (let y = 0; y < ROWS; y ++) {
    for (let x = 0; x < COLUMNS; x ++) {
      if (grid[y][x] === EMPTY_CELL) {
        grid[y][x] = random(gems);
      }
    }
  }
}

// Click two adjacent gems to switch them
function mousePressed() {
  let gemX = Math.floor(mouseX / CELL_SIZE);
  let gemY = Math.floor(mouseY / CELL_SIZE);

  // Make sure that the click is within the grid
  if (gemX >= 0 && gemX < COLUMNS && gemY >= 0 && gemY < ROWS) {

    // Select the first gem if nothing has been clicked
    if (currentGem === null) {
      currentGem = {
        x: gemX,
        y: gemY
      };
    }
    else {
      // Swap the two gems
      if (Math.abs(currentGem.x - gemX) + Math.abs(currentGem.y - gemY) === 1) {
        let temporaryGem = grid[currentGem.y][currentGem.x];
        grid[currentGem.y][currentGem.x] = grid[gemY][gemX];
        grid[gemY][gemX] = temporaryGem;
        matchGems();
        refillGems();
      }

      // Reset player click
      currentGem = null;
    }
  }
}