// Interactive Scene
// Mitt Pham
// Feb 24
//
// Extra for Experts:
// - use of the mouse scroll wheel

// Character variables
let characterX;
let characterY;
let characterD = 25;
let characterDy = 0;
let characterDx = 5;
let gravity = 0.75;
let jumpStrength = -10;

// Blocks
let blocks = [];

// State variables
let canJump = false;
let starting = true;
let playing = false;

// Setting up screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize character position
  characterX = width / 2;
  characterY = height / 2;
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
    checkCollision();
  }
}

// Create start screen
function startScreen() {
  fill("white");
  rect(width / 2 - 150, height / 2 - 100, 300, 200);
  fill("black");
  textSize(32);
  textAlign(CENTER, CENTER);
  text("Left click to start", width / 2, height / 2);
}

// Move character with A and D
function moveCharacter() {
  // Move left
  if (keyIsDown(65)) {
    characterX -= characterDx;
    if (characterX < 0 + characterD / 2) {
      characterX = 0 + characterD / 2;
    }
  }
  // Move right
  if (keyIsDown(68)) {
    characterX += characterDx;
    if (characterX > width - characterD / 2) {
      characterX = width - characterD / 2;
    }
  }
}

// Add gravity to push player to the floor
function addGravity() {
  characterDy += gravity;
  characterY += characterDy;
  if (characterY >= height - characterD / 2) {
    characterY = height - characterD / 2;
  }
}

// Check if player is touching the floor to approve jump
function checkJump() {
  if (characterY >= height - characterD / 2) {
    canJump = true;
  } 
  else {
    canJump = false;
  }
}

// Make character jump with space or W
function jump() {
  if ((keyIsDown(32) || keyIsDown(87)) && canJump) {
    characterDy = jumpStrength;
  }
}

// Show character on screen
function displayCharacter() {
  fill("white");
  circle(characterX, characterY, characterD);
}

// add falling blocks
function dropBlocks() {

  // Generate block variables
  let block = {
    x: random(width),
    y: random(-5000, 0),
    w: random(20, 40),
    h: 20,
  };

  // Creating falling blocks
  for (let i = 0; i < 500; i++) {
    blocks.push(block);
  }

  // Display blocks
  fill(170);
  rect(block.x, block.y, bLocks.w, block.h);

  // Add gravity
  block.y += 4;
}

function checkCollision() {
}

// Change size of character with mouse scroll
function mouseWheel(event) {
  // Decrease size
  if (event.delta > 0) {
    characterD = 25;
  }
  // Increase size
  else if (event.delta < 0) {
    characterD = 75;
  }
}

// Start playing when button pressed
function mousePressed() {
  if (mouseButton === LEFT && mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 100 && mouseY < height / 2 + 100) {
    starting = false;
    playing = true;
  }
}