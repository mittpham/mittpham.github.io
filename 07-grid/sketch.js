// 2D Grid Demo
// learning 2d arrays

// use this if hard coding the grid
// let theGrid = [[1, 0, 0, 0], 
//                [1, 0, 1, 0],
//                [0, 1, 0, 0],
//                [0, 0, 1, 1]];

// const SQUARE_DIMENSION = theGrid.length;

// Randomized grid
const SQUARE_DIMENSION = 10;
let theGrid;
let cellSize;

function setup() {
  createCanvas(windowWidth, windowHeight);
  if (width > height) {
    cellSize = height / SQUARE_DIMENSION;
  }
  else {
    cellSize = width / SQUARE_DIMENSION;
  }
}

function draw() {
  background(220);
  showGrid();
}

function mousePressed() {
  let x = Math.floor(mouseX / cellSize);
  let y = Math.floor(mouseY / cellSize);
  
  toggleCell(x, y);
}

function toggleCell(x, y) {
  if (theGrid[y][x] === 1) {
    theGrid[y][x] = 0;

  }
  else if (theGrid[y][x] === 0) {
    theGrid[y][x] = 1;
  }
}

function showGrid() {
  for (let y = 0; y < SQUARE_DIMENSION; y ++) {
    for (let x = 0; x < SQUARE_DIMENSION; x ++) {
      if (theGrid[y][x] === 1) {
        fill("black");
      }
      else if (theGrid[y][x] === 0) {
        fill("white");
      }
      square(x * cellSize, y * cellSize, cellSize);
    }
  }
}

function randomizedGrid(cols, rows) {
  let newGrid = [];
  for (let y = 0; y < rows; y ++) {
    newGrid.push([]);
    for (let x = 0; x < cols; x ++) {
      if (random(100) < 50) {
        newGrid[y].push(0);
      }
      else {
        newGrid[x].push(1);
      }
    }
  }
  return newGrid;
}