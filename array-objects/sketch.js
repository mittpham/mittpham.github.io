// Arrays and Objects
// Mitt Pham
// March 9
//
// Extra for Experts:
// idk

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
let colors = [];

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

  // Spawn blocks
  for (let i = 0; i < 200; i++) {
    let block = {
      x: random(width),
      y: random(-height, 0),
      w: random(20, 40),
      h: 20,
    };
    blocks.push(block);
  }
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
  for (let i = 0; i < blocks.length; i ++) {
    let currentBlock = blocks[i];

    // Add gravity
    currentBlock.y += 4;

    // Reset block to top of the screen
    if (currentBlock.y > height) {
      currentBlock.x = random(width);
      currentBlock.y = random(-100,0);
    }

    // Display blocks
    fill(170);
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
  }
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