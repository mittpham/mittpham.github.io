// Character in grid demo

const CELL_SIZE = 80;
const OPEN_TILE = 0;
const IMPASSABLE = 1;
const PLAYER = 9;
let rows;
let cols;
let grid;
let thePlayer = {
  x: 0,
  y: 0,
};

let ground;
let wall;
let cow;

function preload() {
  ground = loadImage("ground.png");
  wall = loadImage("wall.png");
  cow = loadImage("cow.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);
  grid = generateRandomGrid(cols, rows);

  // Add character to grid
  grid[thePlayer.y][thePlayer.x] = PLAYER;
}

function draw() {
  background(220);
  displayGrid();
}

function generateRandomGrid() {
  let newGrid = [];

  for (let y = 0; y < rows; y ++) {
    newGrid.push([]);
    for (let x  = 0; x < cols; x ++) {
      if (random(100) < 50) {
        newGrid[y].push(OPEN_TILE);
      }
      else {
        newGrid[y].push(IMPASSABLE);
      }
    }
  }
  return newGrid;
}

function displayGrid() {
  for (let y = 0; y < rows; y ++) {
    for (let x = 0; x < cols; x ++) {
      if (grid[y][x] === IMPASSABLE) {
        image(wall, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === OPEN_TILE) {
        image(ground, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
      else if (grid[y][x] === PLAYER) {
        image(cow, x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      }
    }
  }
}

function mousePressed() {
  let x = Math.floor(mouseX / CELL_SIZE);
  let y = Math.floor(mouseY / CELL_SIZE);

  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows) {
    if (grid[y][x] === IMPASSABLE) {
      grid[y][x] = OPEN_TILE;
    }
    else if (grid[y][x] === OPEN_TILE) {
      grid[y][x] = IMPASSABLE;
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols,rows);
    grid[thePlayer.y][thePlayer.y] = PLAYER;
  }
  else if (key === "e") {
    grid = generateWhiteGrid(cols, rows);
    grid[thePlayer.y][thePlayer.y] = PLAYER;
  }
  else if (key === "s") {
    movePlayer(thePlayer.x, thePlayer.y + 1);
  }
  else if (key === "w") {
    movePlayer(thePlayer.x, thePlayer.y - 1);
  }
  else if (key === "a") {
    movePlayer(thePlayer.x - 1, thePlayer.y);
  }
  else if (key === "d") {
    movePlayer(thePlayer.x + 1, thePlayer.y);
  }
}

function movePlayer(x, y) {
  if (x >= 0 && x < cols && y >= 0 && y < rows && grid[y][x] === OPEN_TILE) {
    grid[thePlayer.y][thePlayer.x] = OPEN_TILE;
    thePlayer.x = x;
    thePlayer.y = y;

    grid[thePlayer.y][thePlayer.x] = PLAYER;
  }
}

function generateWhiteGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y ++) {
    newGrid.push([]);
    for (let x  = 0; x < cols; x ++) {
      newGrid[y].push(OPEN_TILE);
    }
  }
  return newGrid;
} 