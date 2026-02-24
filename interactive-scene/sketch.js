// Interactive Scene
// Mitt Pham
// Feb 24
//
// Extra for Experts:
// - use of the mouse scroll wheel

// Character variables
let x;
let y;
let d = 25;
let dy = 0;
let dx = 5;
let gravity = 0.75;
let jumpStrength = -10;

// State variables
let canJump = false;
let starting = true;
let playing = false;

// Blocks
let blocks = [];

// Setting up screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();
  x = width / 2;
  y = height / 2;
}

// Start game and add in gravity, movement, and jump
function draw() {
  background("black");

  if (starting) {
    startScreen();
  } 
  else if (playing) {
    moveCharacter();
    addGravity();
    checkJump();
    jump();
    displayCharacter();
    dropBlocks();
  }
}

// Create start screen
function startScreen() {
  fill("white");
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Left click to start", width / 2, height / 2);
}

// Move character with A and D
function moveCharacter() {
  // Move left
  if (keyIsDown(65)) {
    x -= dx;
    if (x < 0 + d / 2) {
      x = 0 + d / 2;
    }
  }
  // Move right
  if (keyIsDown(68)) {
    x += dx;
    if (x > width - d / 2) {
      x = width - d / 2;
    }
  }
}

// Add gravity to push player to the floor
function addGravity() {
  dy += gravity;
  y += dy;
  if (y >= height - d / 2) {
    y = height - d / 2;
  }
}

// Check if player is touching the floor to approve jump
function checkJump() {
  if (y >= height - d / 2) {
    canJump = true;
  } 
  else {
    canJump = false;
  }
}

// Make character jump with space or W
function jump() {
  if ((keyIsDown(32) || keyIsDown(87)) && canJump) {
    dy = jumpStrength;
  }
}

// Show character on screen
function displayCharacter() {
  fill("white");
  circle(x, y, d);
}

// add falling blocks
function dropBlocks() {
  for(let i=0; i<500; i=i+1) {
    blocks.push(new Block());
    blocks[i].display();
    blocks[i].gravity();
  }
}

// Change size of character with mouse scroll
function mouseWheel(event) {
  // Decrease size
  if (event.delta > 0) {
    d = 25;
  }
  // Increase size
  else if (event.delta < 0) {
    d = 75;
  }
}

// Change state from starting to playing
function mouseClicked() {
  if (mouseButton === LEFT) {
    starting = false;
    playing = true;
  }
}

// Create blocks and add gravity
class Block {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = random(1, width);
    this.h = 10;
  }

  // Display blocks
  display() {
    fill(170);
    rect(this.x, this.y, this.w, this.h);
  }

  // Add gravity
  gravity() {
    this.y += 1;
  }
}