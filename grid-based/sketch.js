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
const SHUFFLE_GRID_TIME = 10;

let gameStateTimer = 0;

// Grid variables
const CELL_SIZE = 80;
const ROWS = 8;
const COLUMNS = 8;
const HALF_OPACITY = 127;
const EMPTY_CELL = -1;
const UNHIGHLIGHTED_CELL = 1;
const HIGHLIGHTED_CELL = 4;

let gemGrid;

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

// Shuffle prompt constants and variables
const SHUFFLE_PROMPT_X = 700;
const SHUFFLE_PROMPT_Y = 200;
const SHUFFLE_PROMPT_TEXT_SIZE = 30;

let promptShowing = false;
let promptShown = false;

// Point system variables
let points = 0;

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
  gemGrid = generateGrid(ROWS, COLUMNS);

  // Generate boards until there are no matches
  let initialMatches = checkMatches();
  while (initialMatches) {
    gemGrid = generateGrid(ROWS, COLUMNS);
    initialMatches = checkMatches();
  }

  // Clear states and reset matches
  dropping = false;
  matching = false;
  waiting = true;
  matchingGems = [];
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
  else if (waiting) {
    shuffleGrid();
  }
}

// Remove matches after they are highlighted
function removeMatches() {
  if (millis() > MATCHING_GEMS_DELAY + gameStateTimer) {
    for (let y = 0; y < ROWS; y ++) {
      for (let x = 0; x < COLUMNS; x ++) {
        if (matchingGems[y][x] === true) {
          gemGrid[y][x] = EMPTY_CELL;
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
      if (gemGrid[y][x] === EMPTY_CELL && gemGrid[y - 1][x] !== EMPTY_CELL) {
        gemGrid[y][x] = gemGrid[y - 1][x];
        gemGrid[y - 1][x] = EMPTY_CELL;
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
    return true;
  }
  // swap back
  else {
    return false;
  }
}

// Generate a random grid array
function generateGrid(ROWS, COLUMNS) {
  let gemGrid = [];

  for (let y = 0; y < ROWS; y ++) {
    gemGrid.push([]);
    for (let x = 0; x < COLUMNS; x ++) {
      gemGrid[y].push(random(gems));
    }
  }
  return gemGrid;
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
      if (gemGrid[y][x] !== EMPTY_CELL) {
        if (gemGrid[y][x] === BLUE_GEM) {
          image(blueGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x] === GREEN_GEM) {
          image(greenGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x] === ORANGE_GEM) {
          image(orangeGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x] === PURPLE_GEM) {
          image(purpleGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x] === RED_GEM) {
          image(redGemImage, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
        else if (gemGrid[y][x] === EMPTY_CELL) {
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

      let gemType = gemGrid[y][x];

      // Check for horizontal matches
      if (x - 1 >= 0 && x + 1 < COLUMNS) {
        if (gemGrid[y][x - 1] === gemType && gemGrid[y][x + 1] === gemType) {
          matchGrid[y][x] = true;
          matchGrid[y][x - 1] = true;
          matchGrid[y][x + 1] = true;
          gemMatches = true;
          points += 100;
        }
      }

      // Check for vertical matches
      if (y - 1 >= 0 && y + 1 < ROWS) {
        if (gemGrid[y - 1][x] === gemType && gemGrid[y + 1][x] === gemType) {
          matchGrid[y][x] = true;
          matchGrid[y - 1][x] = true;
          matchGrid[y + 1][x] = true;
          gemMatches = true;
          points += 100;
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
      if (gemGrid[y][x] === EMPTY_CELL) {
        gemGrid[y][x] = random(gems);
      }
    }
  }
}

// show the shuffle grid prompt if idle for too long
function shuffleGrid() {
  if (millis() > SHUFFLE_GRID_TIME + gameStateTimer && !promptShown) {
    promptShowing = true;
    fill("white");
    rectMode(CENTER);
    rect(width / 2, height / 2, SHUFFLE_PROMPT_X, SHUFFLE_PROMPT_Y);
    rectMode(CORNER);
    textAlign(CENTER, CENTER);
    fill("black");
    textSize(SHUFFLE_PROMPT_TEXT_SIZE);
    strokeWeight(1);
    noStroke();
    text(`Press R to shuffle the board for -1000 points
      Press C to ignore`, width / 2, height / 2);
  }
}

// Click two adjacent gems to switch them
function mousePressed() {

  // Make sure that the game currently isn't moving or matching gems
  if (waiting && !promptShowing) {
    // Reset idle time for shuffle prompt
    gameStateTimer = millis();

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
          let temporaryGem = gemGrid[currentGem.y][currentGem.x];
          gemGrid[currentGem.y][currentGem.x] = gemGrid[gemY][gemX];
          gemGrid[gemY][gemX] = temporaryGem;

          // Test for matches and swap back if none
          let validMatch = checkMatches();
          if (!validMatch) {
            let temporaryGem = gemGrid[currentGem.y][currentGem.x];
            gemGrid[currentGem.y][currentGem.x] = gemGrid[gemY][gemX];
            gemGrid[gemY][gemX] = temporaryGem;
          }
        }

        // Reset player click
        currentGem = null;
      }
    }
  }
}

// Control the prompt screen / Shuffle the grid
function keyPressed() {
  if (waiting) {

    // Shuffle grid for -1000 points
    if (key === "r") {
      gemGrid = generateGrid(ROWS, COLUMNS);

      // Generate boards until there are no matches
      let initialMatches = checkMatches();
      while (initialMatches) {
        gemGrid = generateGrid(ROWS, COLUMNS);
        initialMatches = checkMatches();
      }

      // Clear states and reset matches
      dropping = false;
      matching = false;
      waiting = true;
      matchingGems = [];
      gameStateTimer = millis();
      promptShowing = false;
      promptShown = true;
    }

    // Ignore the prompt screen
    else if (key === "c") {
      promptShowing = false;
      promptShown = true;
    }
  }

}