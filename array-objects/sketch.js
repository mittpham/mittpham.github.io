// Arrays and Objects
// Mitt Pham
// March 9
//
// Extra for Experts:
// Adding sound

// Character variables
let characterX;
let characterY;
let characterD = 25;
let characterDy = 0;
let characterDx = 5;
let characterColor = "white";
let gravity = 0.75;
let jumpStrength = -10;

// Blocks
let blocks = [];
let blockSpeed = 2;
let speedIncrease = 0.0005;

// Colors
let colors = ["red", "blue", "white", "purple"];

// State variables
let canJump = false;
let starting = true;
let playing = false;
let pickingColor = false;

// Sounds
let breakBlockSound;
let deathSound;

// Set up sounds
function preload() {
  breakBlockSound = loadSound("pop.mp3");
  deathSound = loadSound("vineboom.mp3");
}

// Setting up screen
function setup() {
  createCanvas(windowWidth, windowHeight);
  noStroke();

  // Initialize character position
  characterX = width / 2;
  characterY = height / 2;

  // Spawn blocks
  for (let i = 0; i < 125; i++) {
    let block = {
      x: random(width),
      y: random(-height, 0),
      w: 40,
      h: 20,
      color: random(colors),
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
    characterSize();
    displayCharacter();
    dropBlocks();
    checkCollision();
    changeColor();
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
    characterDy = 0;
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

// Increase the size of the character while in bullet time to prevent stalling
function characterSize() {
  if (pickingColor) {
    characterD += 0.1;
  }
  else {
    characterD = 25;
  }
}

// Show character on screen
function displayCharacter() {
  fill(characterColor);
  circle(characterX, characterY, characterD);
}

// add falling blocks
function dropBlocks() {
  for (let i = 0; i < blocks.length; i ++) {
    let currentBlock = blocks[i];

    // Add gravity
    if (pickingColor) {
      currentBlock.y += blockSpeed * 0.1;
    }
    else {
      currentBlock.y += blockSpeed;
    }

    // Reset block to top of the screen
    if (currentBlock.y > height) {
      currentBlock.x = random(width);
      currentBlock.y = random(-100,0);
      currentBlock.color = random(colors);
    }

    // Display blocks
    fill(currentBlock.color);
    rect(currentBlock.x, currentBlock.y, currentBlock.w, currentBlock.h);
  }
  // Speed up blocks
  blockSpeed += speedIncrease;
}

// Checks if the ball is touching any blocks and if they are the same color
function checkCollision() {
  for (let i = 0; i < blocks.length; i ++) {
    let currentBlock = blocks[i];

    // Determine which corner of the block is the closest to the character
    let nearestBlockX = constrain(characterX, currentBlock.x, currentBlock.x + currentBlock.w);
    let nearestBlockY = constrain(characterY, currentBlock.y, currentBlock.y + currentBlock.h);

    // Find the distance from the closest corner to the character
    let distance = sqrt(pow(characterX - nearestBlockX, 2) + pow(characterY - nearestBlockY, 2));
    
    // Trigger reset if wrong color and colliding
    if (distance < characterD / 2) {
      if (currentBlock.color !== characterColor) {
        reset();
      }
    }
    // Play break sound and break block if matching colors
    else {
      breakBlockSound.play();
      blocks.splice(i, 1);
    }
  }
}

function reset() {
  // Reset states
  canJump = false;
  starting = true;
  playing = false;
  pickingColor = false;

  // Reset positions
  characterX = width / 2;
  characterY = height / 2;
  characterDy = 0;
  characterD = 25;
  characterColor = "white"; 

  // Reset blocks
  blockSpeed = 2;
  blocks = [];
  for (let i = 0; i < 125; i++) {
    let block = {
      x: random(width),
      y: random(-height, 0),
      w: 40,
      h: 20,
      color: random(colors),
    };
    blocks.push(block);
  }
}

// Begin choosing color and trigger bullet time as well as ball size increase
function changeColor() {
  // Triggers with d
  if (keyIsDown(83)) {
    pickingColor = true;
  }
  else {
    pickingColor = false;
  }
}

// Pick color based off of which key is pressed using u, i, o, and p
function keyPressed() {
  if (pickingColor) {
    if (key === "u") {
      characterColor = "blue";
    }
    else if (key === "i") {
      characterColor = "red";
    }
    else if (key === "o") {
      characterColor = "purple";
    }
    else if (key === "p") {
      characterColor = "white";
    }
  }
}

// Start playing when button pressed
function mousePressed() {
  if (mouseButton === LEFT && mouseX > width / 2 - 150 && mouseX < width / 2 + 150 && mouseY > height / 2 - 100 && mouseY < height / 2 + 100) {
    starting = false;
    playing = true;
  }
}