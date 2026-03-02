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

// Ball variables
let ballX;
let ballY;
let ballD = 100;
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
  characterX = width / 2;
  characterY = height / 2;

  // Initialize ball position and direction
  ballX = width / 2;
  ballY = 60;
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

// Add movement to the ball
function moveBall() {

  // Add speed to the ball
  ballX += ballDx;
  ballY += ballDy;
  
  // bounce the ball off of the walls
  if (ballX > width - ballD / 2 || ballX < ballD / 2 ) {
    ballDx *= -1;
    if (abs(ballDx) < maxSpeed) {
      ballDx *= speedIncrease;
    }
  } 
  else if (ballY > height - ballD / 2 || ballY < ballD / 2) {
    ballDy *= -1;
    if (abs(ballDy) < maxSpeed) {
      ballDy *= speedIncrease;
    }
  }
}

// Display ball on screen
function displayBall() {
  fill(255, 0, 0);
  circle(ballX, ballY, ballD);
}

// Check if the red ball and character are touching
function checkCollision() {

  // Reset game if ball and character touch
  if (dist(characterX, characterY, ballX, ballY) < characterD / 2 + ballD / 2) {
    starting = true;
    playing = false;
    
    // Reset positions and speed
    characterX = width / 2;
    characterY = height / 2;
    ballX = width / 2;
    ballY = 60;
    ballDx = random(-10, 10);
    ballDy = random(-10, 10);
  }
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