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

// Ball variables
let ballX;
let ballY;
let radius = 20;
let ballDx;
let ballDy;
let speedIncrease = 1.2;
let maxSpeed = 30;

// State variables
let canJump = false;
let starting = true;
let playing = false;

// Setting up screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize character position
  x = width / 2;
  y = height / 2;

  // Initialize ball position and direction
  ballX = width / 2;
  ballY = 30;
  ballDx = random(-10, 10);
  ballDy = random(-10, 10);
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
    moveBall();
    displayBall();
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

// Move ball
function moveBall() {
  ballX += ballDx;
  ballY += ballDy;
  
  if (ballX > width - radius / 2 || ballX < radius / 2 ) {
    ballDx *= -1;
    if (abs(ballDx) < maxSpeed) {
      ballDx *= speedIncrease;
    }
  } 
  else if (ballY > height - radius / 2 || ballY < radius / 2) {
    ballDy *= -1;
    if (abs(ballDy) < maxSpeed) {
      ballDy *= speedIncrease;
    }
  }
}

// Display ball on screen
function displayBall() {
  fill(255, 0, 0);
  circle(ballX, ballY, radius);
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
function mousePressed() {
  if (mouseButton === LEFT && mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 100 && mouseY < height / 2 + 100) {
    starting = false;
    playing = true;
  }
}