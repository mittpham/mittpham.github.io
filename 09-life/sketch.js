// Game of Life

const CELL_SIZE = 20;
const RENDER_ON_FRAME_MULTIPLE = 5;
const LIVE_CELL = 1;
const DEAD_CELL = 0;
let rows;
let cols;
let grid;
let autoPlayIsOn = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  rows = Math.floor(height / CELL_SIZE);
  cols = Math.floor(width / CELL_SIZE);
  grid = generateRandomGrid(cols, rows);
}

function draw() {
  background(220);
  displayGrid();
  if (autoPlayIsOn && frameCount % RENDER_ON_FRAME_MULTIPLE === 0) {
    grid = takeTurn();
  }
}

function generateRandomGrid() {
  let newGrid = [];

  for (let y = 0; y < rows; y ++) {
    newGrid.push([]);
    for (let x  = 0; x < cols; x ++) {
      if (random(100) < 50) {
        newGrid[y].push(DEAD_CELL);
      }
      else {
        newGrid[y].push(LIVE_CELL);
      }
    }
  }
  return newGrid;
}

function displayGrid() {
  for (let y = 0; y < rows; y ++) {
    for (let x = 0; x < cols; x ++) {
      if (grid[y][x] === LIVE_CELL) {
        fill("black");
      }
      else if (grid[y][x] === DEAD_CELL) {
        fill("white");
      }
      square(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE);
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
    if (grid[y][x] === LIVE_CELL) {
      grid[y][x] = DEAD_CELL;
    }
    else if (grid[y][x] === DEAD_CELL) {
      grid[y][x] = LIVE_CELL;
    }
  }
}

function keyPressed() {
  if (key === "r") {
    grid = generateRandomGrid(cols,rows);
  }
  else if (key === "e") {
    grid = generateWhiteGrid(cols, rows);
  }
  else if (key === " ") {
    grid = takeTurn();
  }
  else if (key === "a") {
    autoPlayIsOn = !autoPlayIsOn;
  }
}

function generateWhiteGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y ++) {
    newGrid.push([]);
    for (let x  = 0; x < cols; x ++) {
      newGrid[y].push(0);
    }
  }
  return newGrid;
} 

function takeTurn() {
  let nextTurn = generateWhiteGrid(cols, rows);

  // look at every cell
  for (let x = 0; x < cols; x ++) {
    for (let y = 0; y < rows; y ++) {
      let neighbors = 0;

      for (let i = -1; i <= 1; i ++) {
        for (let j = -1; j <= 1; j ++) {
          // Dont fall off the edge
          if (x + i >= 0 && x + i < cols && y + j >= 0 && y + j < rows) {
            neighbors += grid[y + j][x + i];
          }
        }
      }

      // dont count self
      neighbors -= grid[y][x];

      // apply the rules
      if (grid[y][x] === LIVE_CELL) {
        // currently alive
        if (neighbors === 2 || neighbors === 3) {
          nextTurn[y][x] = LIVE_CELL;
        }
        else {
          nextTurn[y][x] = DEAD_CELL;
        }
      }

      if (grid[y][x] === DEAD_CELL) {
        // currently dead
        if (neighbors === 3) {
          nextTurn[y][x] = LIVE_CELL;
        }
        else {
          nextTurn[y][x] = DEAD_CELL;
        }
      }
    }
  }
  return nextTurn;
}