// 2D Array Grid Game
// Mitt Pham
// March 20 2026
// 
// Extra for Experts:
// who knows
// https://p5js.org/examples/imported-media-image-transparency/ - image opacity
// https://editor.p5js.org/MarcoGaLo/sketches/2WSdSF7nx - candy crush reference

// Game state variables
waiting = true; 
dropping = false;
matching = false;

// Timer variables and constants
const MATCHING_GEMS_DELAY = 500;
const DROPPING_GEMS_DELAY = 200;

let gameStateTimer = 0;

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
let matchingGems = [];
let blueGemImage;
let greenGemImage;
let orangeGemImage;
let purpleGemImage;
let redGemImage;

// Track the player clicks and any matches
let currentGem = null;
let gemMatches = false;

// Load gem images
function preload() {
  blueGemImage = loadImage("bluegem.png");
  greenGemImage = loadImage("greengem.png");
  orangeGemImage = loadImage("orangegem.png");
  purpleGemImage = loadImage("purplegem.png");
  redGemImage = loadImage("redgem.png");
}

// Set up grid and remove any initial matches
function setup() {
  background("black");
  createCanvas(ROWS * CELL_SIZE, COLUMNS * CELL_SIZE);
  grid = generateGrid(ROWS, COLUMNS);
  checkMatches();
}

// Show grid
function draw() {
  displayGrid();

  // Control game states
  if (matching) {
    removeMatches();
  }
  else if (dropping) {
    dropGems();
  }
}

// Remove matches after they are highlighted
function removeMatches() {
  if (millis() > MATCHING_GEMS_DELAY + gameStateTimer) {
    for (let y = 0; y < ROWS; y ++) {
      for (let x = 0; x < COLUMNS; x ++) {
        if (matchingGems[y][x] === true) {
          grid[y][x] = EMPTY_CELL;
        }
      }
    }

    // Reset timer and matches, trigger the dropping
    matchingGems = [];
    matching = false;
    waiting = false;
    dropping = true;
    gameStateTimer = millis();
  }
}

// Drop all gems until there is only empty cells at the top
function dropGems() {
  if (millis() > DROPPING_GEMS_DELAY + gameStateTimer) {

    // If gems did move then reset the timer
    if (dropOneGem()) {
      gameStateTimer = millis();
    }
    // If they didn't move then refill the gems, check for new matches, and reset states
    else {
      refillGems();
      checkMatches();
      dropping = false;
      waiting = true;
    }
  }
}

// Drop one gem down
function dropOneGem() {
  let movingGems = false;

  // Check all cells and find an empty cell, look above the empty cell for a gem and swap them
  for (let x = 0; x < COLUMNS; x ++) {
    for (let y = ROWS - 1; y > 0; y --) {
      if (grid[y][x] === EMPTY_CELL && grid[y - 1][x] !== EMPTY_CELL) {
        grid[y][x] = grid[y - 1][x];
        grid[y - 1][x] = EMPTY_CELL;
        movingGems = true;
      }
    }
  }

  return movingGems;  
}

// Check for matches and activate highlighting and removing process if matches
function checkMatches() {
  let newGemGrid = matchGems();

  // begin highlighting the matches
  if (gemMatches) {
    matchingGems = newGemGrid;
    matching = true;
    dropping = false;
    waiting = false;
    gameStateTimer = millis();
  }
  // swap back
  else {
    return false;
  }
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

      // Highlight current gem or matching gems
      let currentX = Math.floor(mouseX / CELL_SIZE);
      let currentY = Math.floor(mouseY / CELL_SIZE);
      if (currentX === x && currentY === y || matchingGems.length > 0 && matchingGems[y][x]) {
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

// Check if there are three matching gems
function matchGems() {

  // Create a new empty array
  let matchGrid = [];
  gemMatches = false;

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
          gemMatches = true;
        }
      }

      // Check for vertical matches
      if (y - 1 >= 0 && y + 1 < ROWS) {
        if (grid[y - 1][x] === gemType && grid[y + 1][x] === gemType) {
          matchGrid[y][x] = true;
          matchGrid[y - 1][x] = true;
          matchGrid[y + 1][x] = true;
          gemMatches = true;
        }
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

  // Make sure that the game currently isn't moving or matching gems
  if (waiting) {
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

          // Test for matches and swap back if none
          let validMatch = checkMatches();
          if (!validMatch) {
            let temporaryGem = grid[currentGem.y][currentGem.x];
            grid[currentGem.y][currentGem.x] = grid[gemY][gemX];
            grid[gemY][gemX] = temporaryGem;
          }
        }

        // Reset player click
        currentGem = null;
      }
    }
  }
}